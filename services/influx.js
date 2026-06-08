require("dotenv").config();
const { InfluxDB } = require("@influxdata/influxdb-client");

// ambil env dengan fallback (BIAR TIDAK CRASH)
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

// hanya buat client kalau semua tersedia
let queryApi = null;

if (url && token && org) {
    const client = new InfluxDB({ url, token });
    queryApi = client.getQueryApi(org);
}

async function getLatestData() {
    // MODE FALLBACK (kalau influx belum siap)
    if (!queryApi) {
        return {
            heart_rate: Math.floor(Math.random() * 30) + 70,
            body_temp: (36 + Math.random() * 1.5).toFixed(1),
            co: Math.floor(Math.random() * 80),
            h2s: Math.floor(Math.random() * 15),
            ch4: Math.floor(Math.random() * 300)
        };
    }

    // QUERY INFLUXDB (REAL MODE)
    const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1m)
      |> last()
    `;

    try {
        const result = await queryApi.collectRows(fluxQuery);

        if (!result.length) throw new Error("No data");

        const row = result[0];

        return {
            heart_rate: row._value || 0,
            body_temp: row._value || 0,
            co: row._value || 0,
            h2s: row._value || 0,
            ch4: row._value || 0
        };

    } catch (err) {
        console.log("Influx error, fallback dummy");
        return {
            heart_rate: 80,
            body_temp: 36.5,
            co: 10,
            h2s: 2,
            ch4: 120
        };
    }
}

module.exports = { getLatestData };