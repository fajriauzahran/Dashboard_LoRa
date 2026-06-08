let map;
let marker;
let mapReady = false;

// =====================
// OPEN MAP
// =====================
function openMap() {
    document.getElementById("mapModal").style.display = "flex";

    if (!mapReady) {
        map = L.map('map').setView([-7.13, 111.59], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        marker = L.marker([-7.13, 111.59]).addTo(map);

        mapReady = true;
    }

    setTimeout(() => {
        map.invalidateSize();
    }, 200);
}

// =====================
// CLOSE MAP
// =====================
function closeMap() {
    document.getElementById("mapModal").style.display = "none";
}

// =====================
// FETCH DATA
// =====================
async function fetchData() {
    try {
        const res = await fetch("/api/latest");
        const data = await res.json();

        document.getElementById("hr").innerText = data.detak + " bpm";
        document.getElementById("temp").innerText = data.suhu + " °C";
        document.getElementById("co").innerText = data.CO;
        document.getElementById("h2s").innerText = data.H2S;
        document.getElementById("ch4").innerText = data.CH4;

        // STATUS
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

        // =====================
        // UPDATE MAP
        // =====================
        if (mapReady && data.lat && data.lon) {
            const lat = parseFloat(data.lat);
            const lon = parseFloat(data.lon);

            marker.setLatLng([lat, lon]);
            map.setView([lat, lon], 16);
        }

    } catch (err) {
        console.error(err);
    }
}

// START
fetchData();
setInterval(fetchData, 2000);