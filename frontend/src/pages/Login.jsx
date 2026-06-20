console.log('Login.jsx loaded');
import React,{useState} from "react";
import axios from 'axios';
export default  function Login({ onLogin}){
    const [form,setForm]=useState({username:'',password:''});
    const [error,setError]=useState('');
    const [loading,setLoading]=useState(false);
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    const res = await axios.post('https://student-marks-manager.onrender.com/api/auth/login', form);
    
    // Save to storage first
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    // Then update App state — this triggers redirect immediately
    onLogin(res.data.user);

  } catch (err) {
  console.log('Full error object:', err);
  console.log('Error message:', err.message);
  console.log('Error code:', err.code);
  console.log('Error response:', err.response);
  setError(err.message || 'Login failed');
  }
  setLoading(false);
};
    return (
 <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📚 Student Marks Manager</h1>
        <p style={styles.subtitle}>Login to continue</p>
 
        {error && <div style={styles.error}>{error}</div>}
 
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
 
       
      </div>
    </div>
  );
}
 
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #312e81 60%, #7c3aed 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },

  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '45px',
    borderRadius: '28px',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: '1px solid rgba(255,255,255,0.18)',
    boxShadow:
      '0 25px 60px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.15)',
    position: 'relative'
  },

  title: {
    margin: 0,
    fontSize: '34px',
    fontWeight: '800',
    textAlign: 'center',
    color: '#ffffff',
    letterSpacing: '-1px'
  },

  subtitle: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.75)',
    marginTop: '10px',
    marginBottom: '35px',
    fontSize: '15px'
  },

  field: {
    marginBottom: '20px'
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px'
  },

  input: {
    width: '100%',
    padding: '15px 18px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },

  btn: {
    width: '100%',
    padding: '16px',
    marginTop: '12px',
    border: 'none',
    borderRadius: '14px',
    background:
      'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow:
      '0 10px 25px rgba(99,102,241,0.45)',
    transition: 'all 0.3s ease'
  },

  error: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.4)',
    color: '#fecaca',
    padding: '14px',
    borderRadius: '14px',
    marginBottom: '18px',
    fontSize: '14px',
    backdropFilter: 'blur(10px)'
  },

  hint: {
    marginTop: '28px',
    padding: '16px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#cbd5e1',
    fontSize: '13px',
    lineHeight: '1.8'
  }
};       
    