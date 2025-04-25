const map = L.map("map").setView([21.0285, 105.8542], 15); // lat, lng, zoom

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  minZoom: 15,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// L.marker([21.0307, 105.8544]).addTo(map).bindPopup("Marker 1: Hoàn Kiếm Lake");
// L.marker([21.0356, 105.8499]).addTo(map).bindPopup("Marker 2: Old Quarter");

fetch("/api/locations")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((loc) => {
      let marker = L.marker([loc.lat, loc.lng]).addTo(map);
      //   marker.addTo(map).bindPopup(
      //     `
      //         <strong>${loc.title}</strong>
      //         <br/>
      //         ${loc.desc}
      //         `
      //   );
      marker.on("click", function () {
        console.log("Marker clicked:", loc.title);
        const card = document.getElementById("card");
        card.style.display = "block"; // Show the card
        card.style.position = "absolute";
        card.style.bottom = "0";
        card.style.left = "0";
        card.style.width = "100%";
        card.style.backgroundColor = "white";
        card.style.padding = "20px";
        card.style.boxShadow = "0 -2px 10px rgba(0, 0, 0, 0.2)";
        card.style.zIndex = "1000";
        card.innerHTML = `
    <h2 style="margin: 0; color: black;">${loc.title}</h2>
    <p id="description" style="margin: 5px 0; color: gray;">${loc.desc}</p>
    <button id="play-audio" style="margin-top: 10px; padding: 10px; background-color: blue; color: white; border: none; cursor: pointer;">Play Audio</button>
    <button id="close-card" style="margin-top: 10px; padding: 10px; background-color: red; color: white; border: none; cursor: pointer;">Close</button>
  `;

        // Add event listener to play audio
        document.getElementById("play-audio").addEventListener("click", () => {
          const description =
            document.getElementById("description").textContent;
          const utterance = new SpeechSynthesisUtterance(description);
          speechSynthesis.speak(utterance);
        });
        // Add event listener to close the card
        document.getElementById("close-card").addEventListener("click", () => {
          card.style.display = "none"; // Hide the card
        });
      });
    });
  });
