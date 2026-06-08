require("dotenv").config();
const { InfluxDB } = require("@influxdata/influxdb-client");

const client = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
});

const queryApi = client.getQueryApi(process.env.INFLUX_ORG);

const flux = `
buckets()
`;

queryApi.collectRows(flux)
    .then(res => {
        console.log("✅ CONNECTION OK");
        console.log(res);
    })
    .catch(err => {
        console.error("❌ FAILED:");
        console.error(err.message);
    });