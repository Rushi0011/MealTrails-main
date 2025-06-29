// server.js (or index.js)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS globally
app.use(cors());

// Proxy route: localhost:5000/swiggy?url=https://www.swiggy.com/...
app.get("/swiggy", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Proxy Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to fetch data from Swiggy" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Swiggy proxy running at http://localhost:${PORT}`);
});
