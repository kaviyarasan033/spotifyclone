import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
dotenv.config();

let cachedToken = null;
let tokenExpiresAt = 0;

async function getSpotifyToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) return cachedToken;

  const tokenUrl = "https://accounts.spotify.com/api/token";
  const body = qs.stringify({ grant_type: "client_credentials" });
  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const resp = await axios.post(tokenUrl, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`
    }
  });

  cachedToken = resp.data.access_token;
  tokenExpiresAt = now + (resp.data.expires_in - 30) * 1000;
  return cachedToken;
}

export async function search(req, res) {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ message: "Query `q` required" });

    const token = await getSpotifyToken();
    const url = `https://api.spotify.com/v1/search`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q, type: "track,artist", limit: 12 }
    });
    return res.json(response.data);
  } catch (err) {
    console.error("Spotify search error", err.response?.data || err.message);
    return res.status(500).json({ message: "Spotify API error" });
  }
}
