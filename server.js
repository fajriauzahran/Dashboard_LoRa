const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));

function generateDummyData() {
    return {
        worker_id: "W001",
        heart_rate: Math.floor(Math.random() * 30) + 70,
        body_temp: (36 + Math.random() * 1.5).toFixed(1),
        co: Math.floor(Math.random() * 80),
        h2s: Math.floor(Math.random() * 15),
        ch4: Math.floor(Math.random() * 300)
    };
}

app.get("/api/latest", (req, res) => {
    res.json(generateDummyData());
});

app.listen(3000, () => {
    console.log("Dashboard running: http://localhost:3000");
});