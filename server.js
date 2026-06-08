require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { InfluxDB } = require("@influxdata/influxdb-client");

const app = express();
app.use(cors());
app.use(express.static("public"));

// =====================
// INFLUX CONFIG
// =====================
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

// =====================
// GET LATEST DATA
// =====================
async function getLatestData() {

    const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "sensor_pekerja")
  |> filter(fn: (r) => r._field == "suhu" or
                      r._field == "detak" or
                      r._field == "CH4" or
                      r._field == "CO" or
                      r._field == "H2S" or
                      r._field == "lat" or
                      r._field == "lon")
  |> last()
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
`;

    try {
        const rows = await queryApi.collectRows(fluxQuery);

        if (!rows || rows.length === 0) {
            throw new Error("No data found");
        }

        const row = rows[0];

        return {
            suhu: row.suhu,
            detak: row.detak,
            CH4: row.CH4,
            CO: row.CO,
            H2S: row.H2S,
            lat: row.lat,
            lon: row.lon
        };

    } catch (err) {
        console.log("⚠ Influx error → fallback dummy data");

        return {
            suhu: (36 + Math.random() * 3).toFixed(1),
            detak: Math.floor(70 + Math.random() * 30),
            CH4: Math.floor(Math.random() * 500),
            CO: Math.floor(Math.random() * 50),
            H2S: Math.floor(Math.random() * 30),
            lat: -7.1375 + (Math.random() * 0.001),
            lon: 111.5979 + (Math.random() * 0.001)
        };
    }
}

// =====================
// API ENDPOINT
// =====================
app.get("/api/latest", async (req, res) => {
    const data = await getLatestData();
    res.json(data);
});

// =====================
// START SERVER
// =====================
app.listen(3000, () => {
    console.log("Dashboard running: http://localhost:3000");
});