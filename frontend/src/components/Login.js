import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true); setError(null);
    try{
      const resp = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', resp.data.token);
      localStorage.setItem('user', JSON.stringify(resp.data.user));
      navigate('/dashboard');
    }catch(err){
      setError(err.response?.data?.message || 'Login failed');
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
                <h5 style={{margin:0}}>Welcome back</h5>
                <small style={{color:'var(--spotify-muted)'}}>Login to continue</small>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="form-control" required />
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-spotify" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <hr style={{borderColor:'rgba(255,255,255,0.06)'}} />
          <div className="text-center">
            <small className="text-muted">Don't have an account? <Link to="/signup">Sign up</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}
