require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { InfluxDB } = require("@influxdata/influxdb-client");

const app = express();
app.use(cors());
app.use(express.static("public"));

// CONFIG INFLUX
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

// QUERY DATA TERBARU
async function getLatestData() {

    const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -5m)
      |> filter(fn: (r) => r._measurement == "sensor_pekerja")
      |> last()
    `;

    try {
        const rows = await queryApi.collectRows(fluxQuery);

        if (!rows.length) {
            throw new Error("No data found");
        }

        const data = {};

        rows.forEach(r => {
            data[r._field] = r._value;
        });

        return {
            suhu: data.suhu,
            detak: data.detak,
            CH4: data.CH4,
            CO: data.CO,
            H2S: data.H2S,
            lat: data.lat,
            lon: data.lon
        };

    } catch (err) {
        console.log("Influx error → fallback dummy");

        return {
            suhu: (36 + Math.random() * 3).toFixed(1),
            detak: Math.floor(70 + Math.random() * 30),
            CH4: Math.floor(Math.random() * 500),
            CO: Math.floor(Math.random() * 50),
            H2S: Math.floor(Math.random() * 30),
            lat: -7.1375,
            lon: 111.5979
        };
    }
}

// API
app.get("/api/latest", async (req, res) => {
    const data = await getLatestData();
    res.json(data);
});

// START SERVER
app.listen(3000, () => {
    console.log("Dashboard running: http://localhost:3000");
});