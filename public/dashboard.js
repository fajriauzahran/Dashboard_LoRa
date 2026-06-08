async function fetchData() {
    try {
        const res = await fetch("/api/latest");
        const data = await res.json();

        console.log("DATA:", data);

        document.getElementById("suhu").innerText = data.suhu ?? "--";
        document.getElementById("detak").innerText = data.detak ?? "--";
        document.getElementById("ch4").innerText = data.CH4 ?? "--";
        document.getElementById("co").innerText = data.CO ?? "--";
        document.getElementById("h2s").innerText = data.H2S ?? "--";

        document.getElementById("lat").innerText = data.lat ?? "--";
        document.getElementById("lon").innerText = data.lon ?? "--";

    } catch (err) {
        console.error("Dashboard error:", err);
    }
}

setInterval(fetchData, 2000);
fetchData();