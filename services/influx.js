require("dotenv").config();
const { InfluxDB } = require("@influxdata/influxdb-client");

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

console.log("🔍 INFLUX CONFIG:", { url, org, bucket });

let queryApi = null;

if (url && token && org) {
    const client = new InfluxDB({ url, token });
    queryApi = client.getQueryApi(org);
} else {
    console.error("❌ ENV tidak lengkap!");
}

// =====================
// GET LATEST DATA
// =====================
async function getLatestData() {

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
        const rows = await queryApi.collectRows(fluxQuery);

        console.log("📦 RAW ROWS:", rows.length);

        if (!rows.length) throw new Error("No data from Influx");

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
            const field = r._field;
            const value = r._value;

            if (field === "suhu") data.suhu = value;
            if (field === "detak") data.detak = value;
            if (field === "CH4") data.CH4 = value;
            if (field === "CO") data.CO = value;
            if (field === "H2S") data.H2S = value;
            if (field === "lat") data.lat = value;
            if (field === "lon") data.lon = value;
        });

        return data;

    } catch (err) {
        console.error("❌ INFLUX ERROR:", err.message);
        return fallback();
    }
}

// =====================
function fallback() {
    console.log("⚠ USING FALLBACK DATA");

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