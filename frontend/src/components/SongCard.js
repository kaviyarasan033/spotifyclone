import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa'; // Font Awesome icons

export default function SongCard({ item }) {
  const img = item.album?.images?.[0]?.url || '';
  const [isPlaying, setIsPlaying] = useState(false);

  // Toggle button handler
  const handleToggle = () => {
    setIsPlaying(!isPlaying);
    // 👉 Optionally: trigger playback here (Spotify Web Playback API)
    // Example: spotifyPlayer.togglePlay();
  };

  return (
    <div
      className="song-card d-flex align-items-center justify-content-between p-2 border rounded mb-2"
      style={{
        background: 'var(--spotify-bg, #181818)',
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      {/* Album artwork */}
      <img
        src={img}
        alt="art"
        className="song-art me-3"
        style={{
          width: 60,
          height: 60,
          borderRadius: 8,
          objectFit: 'cover',
        }}
      />

      {/* Track details */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{item.name}</div>
        <div style={{ color: 'var(--spotify-muted, #b3b3b3)' }}>
          {item.artists?.map((a) => a.name).join(', ')}
        </div>
        <small style={{ color: 'var(--spotify-muted, #b3b3b3)' }}>
          {item.album?.name}
        </small>
      </div>

      {/* Duration */}
      <div style={{ minWidth: 60, textAlign: 'right' }}>
        <small style={{ color: 'var(--spotify-muted, #b3b3b3)' }}>
          {millisToMinutes(item.duration_ms)}
        </small>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="btn btn-sm btn-outline-light ms-3"
        style={{
          borderRadius: '50%',
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
}

// Converts track duration from milliseconds → minutes:seconds
function millisToMinutes(ms = 0) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
