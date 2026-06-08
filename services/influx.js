const { InfluxDB } = require("@influxdata/influxdb-client");

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });

const queryApi = client.getQueryApi(org);

async function getLatestData() {
    const query = `
    from(bucket: "${bucket}")
    |> range(start: -1m)
    |> last()
    `;

    let result = {};

    return new Promise((resolve, reject) => {
        queryApi.queryRows(query, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);

                result[o._field] = o._value;
            },
            error(error) {
                reject(error);
            },
            complete() {
                resolve({
                    worker_id: "W001",
                    heart_rate: result.heart_rate || 80,
                    body_temp: result.body_temp || 36.5,
                    co: result.co || 10,
                    h2s: result.h2s || 2,
                    ch4: result.ch4 || 120,
                });
            }
        });
    });
}

module.exports = { getLatestData };