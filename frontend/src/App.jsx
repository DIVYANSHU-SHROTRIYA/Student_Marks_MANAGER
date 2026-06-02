import React, { useState, useEffect } from 'react';
import Login            from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard   from './pages/AdminDashboard';

export default function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { setUser(JSON.parse(saved)); }
      catch (e) { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser({ ...userData });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontSize:'18px' }}>Loading...</div>;

  if (!user) return <Login onLogin={handleLogin} />;
  if (user.role === 'admin')   return <AdminDashboard   user={user} onLogout={handleLogout} />;
  if (user.role === 'teacher') return <TeacherDashboard user={user} onLogout={handleLogout} />;
  if (user.role === 'student') return <StudentDashboard user={user} onLogout={handleLogout} />;

  return <Login onLogin={handleLogin} />;
}