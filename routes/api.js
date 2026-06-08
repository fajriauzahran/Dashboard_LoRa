const { getLatestData } = require("../services/influx");

// =====================
// API CONTROLLER
// =====================
async function getData(req, res) {
    try {
        const data = await getLatestData();

        // normalize biar frontend stabil
        res.json({
            suhu: data.suhu,
            detak: data.detak,
            CH4: data.CH4,
            CO: data.CO,
            H2S: data.H2S,
            lat: data.lat,
            lon: data.lon
        });

    } catch (err) {
        console.log("Influx error → fallback dummy");

        res.json({
            suhu: 36.5,
            detak: 80,
            CH4: 120,
            CO: 10,
            H2S: 2,
            lat: -7.1375,
            lon: 111.5979
        });
    }
}

module.exports = {
    getLatestData: getData
};