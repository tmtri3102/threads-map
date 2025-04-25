const map = L.map("map").setView([21.0285, 105.8542], 15); // lat, lng, zoom

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  minZoom: 15,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

L.marker([21.0307, 105.8544]).addTo(map).bindPopup("Marker 1: Hoàn Kiếm Lake");
L.marker([21.0356, 105.8499]).addTo(map).bindPopup("Marker 2: Old Quarter");
