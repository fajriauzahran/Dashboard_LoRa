const { getLatestData } = require("../services/influx");

// fallback dummy kalau influx belum siap
async function getData(req, res) {
    try {
        const data = await getLatestData();
        res.json(data);
    } catch (err) {
        console.log("Influx error, using dummy data");

        res.json({
            worker_id: "W001",
            heart_rate: 80,
            body_temp: 36.5,
            co: 10,
            h2s: 2,
            ch4: 120
        });
    }
}

module.exports = {
    getLatestData: getData
};