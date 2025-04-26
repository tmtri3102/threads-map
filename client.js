const map = L.map("map").setView([21.0285, 105.8542], 15); // lat, lng, zoom

// Tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  minZoom: 15,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Locate user
locateMe();
map.on("locationfound", (e) => {
  L.circleMarker(e.latlng, {
    radius: 8, // Radius in pixels
    color: "blue",
    fillColor: "#30f",
    fillOpacity: 0.8,
  }).addTo(map);
});
function locateMe() {
  map.locate({ setView: true, maxZoom: 18 });
}

// Custom marker
const customIcon = L.icon({
  iconUrl: "icon.png",
  iconSize: [32, 32], // width, height in pixels
  iconAnchor: [16, 32], // point of the icon which corresponds to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to iconAnchor
  className: "custom-marker",
});

// Show card
fetch("/api/locations")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((loc) => {
      let marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(
        map
      );
      marker.on("click", function () {
        const card = document.getElementById("card");
        card.style.display = "block"; // Show the card
        card.innerHTML = `
            <h2>${loc.title}</h2>
            <p id="description">${loc.desc}</p>
            <button id="close-card" style="background-color: red">Close</button>
        `;
        map.setView([loc.lat, loc.lng], map.getZoom());

        // Play audio
        // document.getElementById("play-audio").addEventListener("click", () => {
        //   const description =
        //     document.getElementById("description").textContent;
        //   const utterance = new SpeechSynthesisUtterance(description);
        //   speechSynthesis.speak(utterance);
        // });
        document.getElementById("close-card").addEventListener("click", () => {
          card.style.display = "none";
        });
      });
    });
  });
