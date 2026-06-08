require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const { getLatestData } = require("./services/influx");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// =====================
// API
// =====================
app.get("/api/latest", async (req, res) => {
    try {
        const data = await getLatestData();
        res.json(data);
    } catch (err) {
        res.json({
            error: err.message
        });
    }
});

// =====================
// START SERVER
// =====================
app.listen(3000, () => {
    console.log("🚀 Dashboard running: http://localhost:3000");
});