const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get("/api/thread/:postId", async (req, res) => {
  const postId = req.params.postId;
  const accessToken = process.env.THREADS_ACCESS_TOKEN;
  if (!accessToken || !postId || !/^\d+$/.test(postId)) {
    return res
      .status(400)
      .json({ error: "Missing config or invalid Post ID." });
  }

  const fields = "text,permalink,media_url,media_type,timestamp";
  const apiUrl = `https://graph.threads.net/v1.0/${postId}?fields=${fields}&access_token=${accessToken}`;
  console.log(`Workspaceing Thread post using built-in fetch: ${postId}`);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch thread:", error.message);
    res.status(500).json({ error: "Could not fetch Thread post data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
