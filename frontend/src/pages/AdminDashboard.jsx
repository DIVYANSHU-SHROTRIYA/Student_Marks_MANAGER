import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE = 'https://student-marks-manager.onrender.com';

export default function AdminDashboard({ user, onLogout }) {
  const [tab, setTab]           = useState('stats');
  const [stats, setStats]       = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);

  const [teacherForm, setTeacherForm] = useState({ name: '', username: '', password: '' });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 4000); };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE}/api/admin/stats`, getHeaders());
      setStats(res.data);
    } catch (err) { showMsg('❌ Failed to load stats'); }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${BASE}/api/admin/teachers`, getHeaders());
      setTeachers(res.data);
    } catch (err) { showMsg('❌ Failed to load teachers'); }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BASE}/api/admin/students`, getHeaders());
      setStudents(res.data);
    } catch (err) { showMsg('❌ Failed to load students'); }
  };

  useEffect(() => {
    fetchStats();
    fetchTeachers();
    fetchStudents();
  }, []);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE}/api/admin/teachers`, teacherForm, getHeaders());
      showMsg('✅ Teacher added successfully!');
      setTeacherForm({ name: '', username: '', password: '' });
      fetchTeachers();
      fetchStats();
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.message || 'Failed to add teacher'));
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      await axios.delete(`${BASE}/api/admin/teachers/${id}`, getHeaders());
      showMsg('✅ Teacher deleted');
      fetchTeachers();
      fetchStats();
    } catch (err) { showMsg('❌ Failed to delete teacher'); }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await axios.delete(`${BASE}/api/admin/students/${id}`, getHeaders());
      showMsg('✅ Student deleted');
      fetchStudents();
      fetchStats();
    } catch (err) { showMsg('❌ Failed to delete student'); }
  };

  const gradeColor = (grade) => {
    const c = { 'A+': '#276749', A: '#2f855a', B: '#2b6cb0', C: '#d69e2e', D: '#dd6b20', F: '#c53030' };
    return c[grade] || '#4a5568';
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>🛡️ Admin Dashboard</h2>
          <p style={styles.headerSub}>Welcome, {user.name}</p>
        </div>
        <button style={styles.btnDanger} onClick={onLogout}>Logout</button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['stats', 'teachers', 'students'].map(t => (
          <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            onClick={() => setTab(t)}>
            {t === 'stats' ? '📊 Overview' : t === 'teachers' ? '👨‍🏫 Teachers' : '🎓 Students'}
          </button>
        ))}
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.content}>

        {/* STATS TAB */}
        {tab === 'stats' && stats && (
          <div>
            <h3 style={styles.sectionTitle}>Overview</h3>
            <div style={styles.statsGrid}>
              {[
                { label: 'Total Teachers', value: stats.totalTeachers, color: '#4f46e5', icon: '👨‍🏫' },
                { label: 'Total Students', value: stats.totalStudents, color: '#0891b2', icon: '🎓' },
                { label: 'Students Passed', value: stats.passed,        color: '#16a34a', icon: '✅' },
                { label: 'Students Failed', value: stats.failed,        color: '#dc2626', icon: '❌' },
              ].map(s => (
                <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
                  <p style={styles.statIcon}>{s.icon}</p>
                  <p style={{ ...styles.statValue, color: s.color }}>{s.value}</p>
                  <p style={styles.statLabel}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Pass rate bar */}
            {stats.totalStudents > 0 && (
              <div style={styles.passRate}>
                <h3 style={styles.sectionTitle}>Pass Rate</h3>
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.barFill,
                    width: `${((stats.passed / stats.totalStudents) * 100).toFixed(0)}%`
                  }}/>
                </div>
                <p style={styles.barText}>
                  {((stats.passed / stats.totalStudents) * 100).toFixed(1)}% students passed
                </p>
              </div>
            )}
          </div>
        )}

        {/* TEACHERS TAB */}
        {tab === 'teachers' && (
          <div>
            {/* Add Teacher Form */}
            <h3 style={styles.sectionTitle}>Add New Teacher</h3>
            <form onSubmit={handleAddTeacher} style={styles.form}>
              <div style={styles.formRow}>
                {[
                  { key: 'name',     ph: 'Full Name',  type: 'text' },
                  { key: 'username', ph: 'Username',   type: 'text' },
                  { key: 'password', ph: 'Password',   type: 'password' },
                ].map(f => (
                  <input key={f.key} style={styles.input} type={f.type}
                    placeholder={f.ph} value={teacherForm[f.key]}
                    onChange={e => setTeacherForm({ ...teacherForm, [f.key]: e.target.value })}
                    required />
                ))}
                <button type="submit" style={styles.btnPrimary}>+ Add Teacher</button>
              </div>
            </form>

            {/* Teachers List */}
            <h3 style={{ ...styles.sectionTitle, marginTop: '24px' }}>
              All Teachers ({teachers.length})
            </h3>
            {teachers.length === 0 ? (
              <div style={styles.empty}>No teachers yet.</div>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Username</th>
                      <th style={styles.th}>Created</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map(t => (
                      <tr key={t._id} style={styles.tableRow}>
                        <td style={styles.td}><strong>{t.name}</strong></td>
                        <td style={styles.td}>{t.username}</td>
                        <td style={styles.td}>{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td style={styles.td}>
                          <button style={styles.btnSmallDanger}
                            onClick={() => handleDeleteTeacher(t._id)}>🗑️ Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab === 'students' && (
          <div>
            <h3 style={styles.sectionTitle}>All Students ({students.length})</h3>
            {students.length === 0 ? (
              <div style={styles.empty}>No students yet.</div>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Roll No</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Class</th>
                      <th style={styles.th}>Subjects</th>
                      <th style={styles.th}>Percentage</th>
                      <th style={styles.th}>Grade</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id} style={styles.tableRow}>
                        <td style={styles.td}>{s.rollNumber}</td>
                        <td style={styles.td}><strong>{s.name}</strong></td>
                        <td style={styles.td}>{s.class}</td>
                        <td style={styles.td}>{s.subjects?.length || 0}</td>
                        <td style={styles.td}>{s.percentage}%</td>
                        <td style={styles.td}>
                          <span style={{ color: gradeColor(s.grade), fontWeight: '700' }}>
                            {s.grade || 'N/A'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button style={styles.btnSmallDanger}
                            onClick={() => handleDeleteStudent(s._id)}>🗑️ Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:        { minHeight: '100vh', background: '#f7fafc', fontFamily: 'sans-serif' },
  header:      { background: '#1e1b4b', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { margin: 0, fontSize: '20px', color: '#fff' },
  headerSub:   { margin: 0, color: '#a5b4fc', fontSize: '14px' },
  tabs:        { background: '#fff', padding: '0 32px', display: 'flex', gap: '4px', borderBottom: '1px solid #e2e8f0' },
  tab:         { padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#718096', borderBottom: '3px solid transparent' },
  tabActive:   { color: '#4f46e5', borderBottom: '3px solid #4f46e5' },
  content:     { padding: '24px 32px' },
  message:     { margin: '12px 32px', padding: '12px 16px', background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: '8px', color: '#276749' },
  sectionTitle:{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' },
  statsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' },
  statCard:    { background: '#fff', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  statIcon:    { fontSize: '32px', margin: '0 0 8px' },
  statValue:   { fontSize: '36px', fontWeight: '900', margin: '0 0 4px' },
  statLabel:   { margin: 0, color: '#718096', fontSize: '14px', fontWeight: '600' },
  passRate:    { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  barBg:       { background: '#e2e8f0', borderRadius: '999px', height: '16px', overflow: 'hidden' },
  barFill:     { background: '#16a34a', height: '100%', borderRadius: '999px', transition: 'width 0.5s' },
  barText:     { margin: '8px 0 0', color: '#4a5568', fontSize: '14px' },
  form:        { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '24px' },
  formRow:     { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
  input:       { padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', minWidth: '160px' },
  empty:       { textAlign: 'center', padding: '48px', color: '#a0aec0', background: '#fff', borderRadius: '12px' },
  tableWrap:   { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  tableHead:   { background: '#f7fafc' },
  th:          { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568', borderBottom: '1px solid #e2e8f0' },
  tableRow:    { borderBottom: '1px solid #f0f0f0' },
  td:          { padding: '12px 16px', fontSize: '14px', color: '#2d3748' },
  btnPrimary:  { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' },
  btnDanger:   { padding: '10px 20px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  btnSmallDanger: { padding: '6px 12px', background: '#fff5f5', color: '#e53e3e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};