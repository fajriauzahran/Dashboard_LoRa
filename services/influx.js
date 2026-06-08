require("dotenv").config();
const { InfluxDB } = require("@influxdata/influxdb-client");

// =====================
// ENV
// =====================
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

// =====================
// DEBUG CONFIG (WAJIB)
// =====================
console.log("🔍 INFLUX CONFIG CHECK:");
console.log({ url, org, bucket });

// =====================
// VALIDATION (BIAR LANGSUNG KETAHU SALAH)
// =====================
if (!url || !token || !org || !bucket) {
    console.error("❌ ENV INCOMPLETE - CHECK .env FILE");
}

// =====================
// INFLUX CLIENT
// =====================
let queryApi = null;

if (url && token && org) {
    const client = new InfluxDB({ url, token });
    queryApi = client.getQueryApi(org);
} else {
    console.warn("⚠️ Influx client NOT initialized (using fallback mode)");
}

// =====================
// GET DATA
// =====================
async function getLatestData() {

    // fallback kalau tidak connect
    if (!queryApi) {
        return fallback();
    }

    const fluxQuery = `
from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensor_pekerja")
  |> last()
`;

    try {
        const result = await queryApi.collectRows(fluxQuery);

        console.log("📦 RAW RESULT LENGTH:", result.length);

        if (!result.length) throw new Error("No data from InfluxDB");

        const data = {
            suhu: null,
            detak: null,
            CH4: null,
            CO: null,
            H2S: null,
            lat: null,
            lon: null
        };

        result.forEach(r => {
            console.log(`📌 ${r._field} = ${r._value}`);

            if (r._field === "suhu") data.suhu = r._value;
            if (r._field === "detak") data.detak = r._value;
            if (r._field === "CH4") data.CH4 = r._value;
            if (r._field === "CO") data.CO = r._value;
            if (r._field === "H2S") data.H2S = r._value;
            if (r._field === "lat") data.lat = r._value;
            if (r._field === "lon") data.lon = r._value;
        });

        return data;

    } catch (err) {
        console.error("❌ INFLUX QUERY ERROR:");
        console.error(err.message);

        return fallback();
    }
}

// =====================
// FALLBACK DATA
// =====================
function fallback() {
    console.log("⚠️ USING FALLBACK DATA");

    return {
        suhu: 36.5,
        detak: 80,
        CH4: 120,
        CO: 10,
        H2S: 2,
        lat: -7.1375,
        lon: 111.5979
    };
}

module.exports = { getLatestData };