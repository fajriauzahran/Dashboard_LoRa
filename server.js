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
// GET LATEST DATA (USING LAST)
// =====================
async function getLatestData() {

    const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensor_pekerja")
  |> last()
`;

    try {
        const rows = await queryApi.collectRows(fluxQuery);

        if (!rows || rows.length === 0) {
            throw new Error("No data found");
        }

        // hasil last() biasanya 1 field per row → kita gabungkan manual
        const data = {
            suhu: null,
            detak: null,
            CH4: null,
            CO: null,
            H2S: null,
            lat: null,
            lon: null
        };

        rows.forEach(r => {
            data[r._field] = r._value;
        });

        return data;

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
// API
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