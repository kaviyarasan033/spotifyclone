import React, { useEffect, useState } from 'react';
import API from '../api';
import SongCard from './SongCard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [player, setPlayer] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  // ✅ Load Spotify Web Playback SDK
  useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://sdk.scdn.co/spotify-player.js';
  script.async = true;
  script.crossOrigin = 'anonymous'; // ✅ Add this line
  document.body.appendChild(script);


    window.onSpotifyWebPlaybackSDKReady = () => {
      const token =
        'BQB1XrJQfrNVB-jJhfW6kj2vxF7MYfJd6Smi_dxl5NUDjw7DuY2bC0xPkZ5xZjAZVRbI91QccSKqI1WvbQqyMdbdA396Ntg4aIaeJChKGZJDyv5ml1SgxZ01Lvd3WIz7xtEIpLuhkTjqnMtjv6xXMyNrnTJrBbI2hvYaCxUBP2jntK5LZCjHrGGN-ZhSULMwwHohrNztMnK16ahVzXCw1IDBU1a6kSCP3JkHIP4N1wByGvWVWm6KRrPhITC-3qq48F0oqIKp7bHzLIg0xGX3nE5T87f3istWeHFhhIibDXRGJI1A10Dui1jrcVeDg4XMQCUy94dQ'; // Replace with your actual token (with streaming scope)

      const playerInstance = new window.Spotify.Player({
        name: 'My React Spotify Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      // Listeners
      playerInstance.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        alert('Spotify Player Ready! Device ID: ' + device_id);
        setDeviceId(device_id);
      });

      playerInstance.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      playerInstance.addListener('initialization_error', ({ message }) =>
        console.error(message)
      );
      playerInstance.addListener('authentication_error', ({ message }) =>
        console.error(message)
      );
      playerInstance.addListener('account_error', ({ message }) =>
        console.error(message)
      );
      playerInstance.addListener('playback_error', ({ message }) =>
        console.error(message)
      );

      playerInstance.connect();
      setPlayer(playerInstance);
    };
  }, []);

  // ✅ Verify user on load
  useEffect(() => {
    async function fetchMe() {
      try {
        await API.get('/auth/me');
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
    fetchMe();
  }, [navigate]);

  // ✅ Search Spotify
  async function doSearch(e) {
    e && e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const resp = await API.get('/spotify/search', { params: { q: query } });
      setTracks(resp.data.tracks?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Logout
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  // ✅ Play a track on connected player
  async function playTrack(trackUri) {
    if (!deviceId) {
      alert('Spotify player not ready yet!');
      return;
    }

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_SPOTIFY_ACCESS_TOKEN_HERE`,
        },
      });
    } catch (err) {
      console.error('Error playing track:', err);
    }
  }

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="logo">S</div>
          <div>
            <div style={{ fontWeight: 700 }}>Welcome, {user?.name || 'User'}</div>
            <small style={{ color: 'var(--spotify-muted)' }}>Explore tracks</small>
          </div>
        </div>
        <div>
          <button className="btn btn-spotify-outline me-2" onClick={() => {}}>
            Profile
          </button>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="app-card mb-4">
        <form className="row g-2" onSubmit={doSearch}>
          <div className="col-sm-9">
            <input
              className="form-control"
              placeholder="Search tracks or artists (e.g. Coldplay)"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="col-sm-3 d-grid">
            <button className="btn btn-spotify" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      <div className="row g-3">
        {tracks.length === 0 && (
          <div className="col-12">
            <div className="app-card text-center">
              <div style={{ color: 'var(--spotify-muted)' }}>
                Try searching for artists, tracks or albums above.
              </div>
            </div>
          </div>
        )}

        {tracks.map(track => (
          <div key={track.id} className="col-12 col-md-6 col-lg-4">
            <SongCard item={track} onPlay={() => playTrack(track.uri)} />
          </div>
        ))}
      </div>
    </div>
  );
}
