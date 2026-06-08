async function fetchData() {
    try {
        // --- UNCOMMENT KODE DI BAWAH JIKA MENGGUNAKAN API ASLI ---
        /*
        const res = await fetch("/api/latest");
        const data = await res.json();
        */

        // --- SIMULASI DATA (Hapus ini saat menggunakan API asli) ---
        const data = {
            heart_rate: Math.floor(Math.random() * (110 - 70) + 70),
            body_temp: (Math.random() * (38 - 36) + 36).toFixed(1),
            co: Math.floor(Math.random() * 60),
            h2s: Math.floor(Math.random() * 15),
            ch4: Math.floor(Math.random() * 5)
        };
        // -----------------------------------------------------------

        document.getElementById("hr").innerText = data.heart_rate + " bpm";
        document.getElementById("temp").innerText = data.body_temp + " °C";
        document.getElementById("co").innerText = data.co + " ppm";
        document.getElementById("h2s").innerText = data.h2s + " ppm";
        document.getElementById("ch4").innerText = data.ch4 + " ppm";

        // STATUS LOGIC
        let status = "SAFE";
        let color = "#2ECC71"; // Hijau
        let shadow = "rgba(46, 204, 113, 0.2)";

        if (data.co > 50 || data.h2s > 10) {
            status = "DANGER";
            color = "#E74C3C"; // Merah
            shadow = "rgba(231, 76, 60, 0.2)";
        } else if (data.co > 25 || data.h2s > 5) {
            status = "WARNING";
            color = "#F1C40F"; // Kuning
            shadow = "rgba(241, 196, 15, 0.2)";
        }

        const statusBox = document.getElementById("status-box");
        const statusText = document.getElementById("status-text");
        
        statusText.innerText = status;
        statusBox.style.background = color;
        statusBox.style.boxShadow = `0 10px 20px ${shadow}`;

    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

// Jalankan fetch pertama kali, lalu ulangi setiap 2 detik
fetchData();
setInterval(fetchData, 2000);