const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname)));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/api/locations", (req, res) => {
  const filePath = path.join(__dirname, "locations.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading locations.json:", err);
      return res.status(500).json({ error: "Could not read location data" });
    }
    try {
      const locations = JSON.parse(data);
      res.json(locations);
    } catch (parseError) {
      console.error("Invalid JSON format:", parseError);
      res.status(500).json({ error: "Invalid JSON format in locations file" });
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
