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
 
        <div style={styles.hint}>
          <strong>Teacher:</strong> username: <code>teacher</code> | password: <code>teacher123</code><br/>
          <small>(Run /api/auth/setup-teacher once to create teacher account)</small>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f0f4f8'
  },
  card: {
    background: '#fff', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
  },
  title:    { margin: 0, fontSize: '24px', color: '#1a202c', textAlign: 'center' },
  subtitle: { color: '#718096', textAlign: 'center', marginBottom: '24px' },
  field:    { marginBottom: '16px' },
  label:    { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568' },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box',
    outline: 'none'
  },
  btn: {
    width: '100%', padding: '12px', background: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px'
  },
  error: {
    background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030',
    padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
  },
  hint: {
    marginTop: '24px', padding: '12px', background: '#ebf8ff',
    borderRadius: '8px', fontSize: '13px', color: '#2b6cb0', lineHeight: '1.6'
  }
};        
    