import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Signup(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true); setError(null);
    try{
      await API.post('/auth/signup', { name, email, password });
      // after signup redirect to login (user must login then can access dashboard)
      navigate('/login');
    }catch(err){
      setError(err.response?.data?.message || 'Failed');
    }finally{ setLoading(false); }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="app-card">
          <div className="app-header mb-3">
            <div className="brand">
              <div className="logo">S</div>
              <div>
                <h5 style={{margin:0}}>Spotify Clone</h5>
                <small style={{color:'var(--spotify-muted)'}}>Create your account</small>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="form-control" required minLength={6} />
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-spotify" disabled={loading}>
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </div>
          </form>

          <hr style={{borderColor:'rgba(255,255,255,0.06)'}} />
          <div className="text-center">
            <small className="text-muted">Already have an account? <Link to="/login">Login</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}
