mapboxgl.accessToken =
  "pk.eyJ1IjoidG9tdHJhbjMxMDI1MSIsImEiOiJjbG9yMHV1OGEwcDQ4MmtwNWJoajRjcXpkIn0.PHh2-htUMRaNpOzOxcx92w";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-74.5, 40], // longitude, latitude
  zoom: 9,
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());
