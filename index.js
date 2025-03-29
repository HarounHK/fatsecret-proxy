const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

const CLIENT_ID = process.env.FATSECRET_CLIENT_ID;
const CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET;

let accessToken = null;

async function getAccessToken() {
  const response = await fetch("https://oauth.fatsecret.com/connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: "grant_type=client_credentials&scope=basic",
  });

  const data = await response.json();
  accessToken = data.access_token;
}

app.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!accessToken) await getAccessToken();

  const response = await fetch(
    `https://platform.fatsecret.com/rest/server.api?method=foods.search&format=json&search_expression=${query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
