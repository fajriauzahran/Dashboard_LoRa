async function fetchData() {
    try {
        const res = await fetch("/api/latest");
        const data = await res.json();

        console.log("DATA FROM API:", data);

        document.getElementById("hr").innerText = data.detak ?? "--";
        document.getElementById("temp").innerText = data.suhu + " °C" ?? "--";
        document.getElementById("co").innerText = data.CO ?? "--";
        document.getElementById("h2s").innerText = data.H2S ?? "--";
        document.getElementById("ch4").innerText = data.CH4 ?? "--";

        // STATUS LOGIC
        let status = "SAFE";
        let color = "#2ECC71";

        if (data.CO > 50 || data.H2S > 10) {
            status = "DANGER";
            color = "#E74C3C";
        } else if (data.CO > 25 || data.H2S > 5) {
            status = "WARNING";
            color = "#F1C40F";
        }

        document.getElementById("status-box").style.background = color;
        document.getElementById("status-text").innerText = status;

    } catch (err) {
        console.error("FETCH ERROR:", err);
    }
}

fetchData();
setInterval(fetchData, 2000);