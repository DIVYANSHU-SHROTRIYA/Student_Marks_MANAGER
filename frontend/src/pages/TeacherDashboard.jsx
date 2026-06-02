// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API = (path) => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//   ...path
// });

// const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'];

// export default function TeacherDashboard({ user, onLogout }) {
//   const [students, setStudents]       = useState([]);
//   const [view, setView]               = useState('list'); // list | add | marks
//   const [selected, setSelected]       = useState(null);
//   const [loading, setLoading]         = useState(false);
//   const [message, setMessage]         = useState('');

//   // Add student form
//   const [form, setForm] = useState({
//     name: '', username: '', password: '', rollNumber: '', className: ''
//   });

//   // Marks form
//   const [marksForm, setMarksForm] = useState(
//     SUBJECTS.map(s => ({ name: s, marks: '', total: 100 }))
//   );

//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('http://localhost:5000/api/teacher/students', { headers });
//       setStudents(res.data);
//     } catch (err) {
//       setMessage('Failed to load students');
//     }
//     setLoading(false);
//   };

//   useEffect(() => { fetchStudents(); }, []);

//   const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

//   // Add student
//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/teacher/students', form, { headers });
//       showMsg('✅ Student added successfully!');
//       setForm({ name: '', username: '', password: '', rollNumber: '', className: '' });
//       setView('list');
//       fetchStudents();
//     } catch (err) {
//       showMsg('❌ ' + (err.response?.data?.message || 'Failed to add student'));
//     }
//   };

//   // Open marks editor
//   const openMarks = (student) => {
//     setSelected(student);
//     if (student.subjects && student.subjects.length > 0) {
//       setMarksForm(SUBJECTS.map(s => {
//         const existing = student.subjects.find(sub => sub.name === s);
//         return { name: s, marks: existing ? existing.marks : '', total: 100 };
//       }));
//     } else {
//       setMarksForm(SUBJECTS.map(s => ({ name: s, marks: '', total: 100 })));
//     }
//     setView('marks');
//   };

//   // Save marks
//   const handleSaveMarks = async (e) => {
//     e.preventDefault();
//     const subjects = marksForm.map(s => ({
//       name: s.name, marks: Number(s.marks), total: s.total
//     }));
//     try {
//       await axios.put(`http://localhost:5000/api/teacher/students/${id}/marks`, { subjects }, { headers });
//       showMsg('✅ Marks saved successfully!');
//       setView('list');
//       fetchStudents();
//     } catch (err) {
//       showMsg('❌ Failed to save marks');
//     }
//   };

//   // Delete student
//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this student?')) return;
//     try {
//       awaitaxios.delete(`http://localhost:5000/api/teacher/students/${id}`, { headers });
//       showMsg('✅ Student deleted');
//       fetchStudents();
//     } catch (err) {
//       showMsg('❌ Failed to delete student');
//     }
//   };

//   const gradeColor = (grade) => {
//     const colors = { 'A+': '#276749', A: '#2f855a', B: '#2b6cb0', C: '#d69e2e', D: '#dd6b20', F: '#c53030' };
//     return colors[grade] || '#4a5568';
//   };

//   return (
//     <div style={styles.page}>
//       {/* Header */}
//       <div style={styles.header}>
//         <div>
//           <h2 style={styles.headerTitle}>👨‍🏫 Teacher Dashboard</h2>
//           <p style={styles.headerSub}>Welcome, {user.name}</p>
//         </div>
//         <div style={{ display: 'flex', gap: '10px' }}>
//           {view !== 'list' && (
//             <button style={styles.btnSecondary} onClick={() => setView('list')}>← Back</button>
//           )}
//           {view === 'list' && (
//             <button style={styles.btnPrimary} onClick={() => setView('add')}>+ Add Student</button>
//           )}
//           <button style={styles.btnDanger} onClick={onLogout}>Logout</button>
//         </div>
//       </div>

//       {message && <div style={styles.message}>{message}</div>}

//       {/* Student List */}
//       {view === 'list' && (
//         <div style={styles.content}>
//           <h3 style={styles.sectionTitle}>All Students ({students.length})</h3>
//           {loading ? <p>Loading...</p> : students.length === 0 ? (
//             <div style={styles.empty}>No students yet. Click "+ Add Student" to add one.</div>
//           ) : (
//             <div style={styles.tableWrap}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr style={styles.tableHead}>
//                     <th style={styles.th}>Roll No</th>
//                     <th style={styles.th}>Name</th>
//                     <th style={styles.th}>Class</th>
//                     <th style={styles.th}>Subjects</th>
//                     <th style={styles.th}>Percentage</th>
//                     <th style={styles.th}>Grade</th>
//                     <th style={styles.th}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map(s => (
//                     <tr key={s._id} style={styles.tableRow}>
//                       <td style={styles.td}>{s.rollNumber}</td>
//                       <td style={styles.td}><strong>{s.name}</strong></td>
//                       <td style={styles.td}>{s.class}</td>
//                       <td style={styles.td}>{s.subjects?.length || 0} subjects</td>
//                       <td style={styles.td}>{s.percentage}%</td>
//                       <td style={styles.td}>
//                         <span style={{ ...styles.badge, color: gradeColor(s.grade), borderColor: gradeColor(s.grade) }}>
//                           {s.grade || 'N/A'}
//                         </span>
//                       </td>
//                       <td style={styles.td}>
//                         <button style={styles.btnSmall} onClick={() => openMarks(s)}>✏️ Marks</button>
//                         <button style={{ ...styles.btnSmall, ...styles.btnSmallDanger }} onClick={() => handleDelete(s._id)}>🗑️</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Add Student Form */}
//       {view === 'add' && (
//         <div style={styles.content}>
//           <h3 style={styles.sectionTitle}>Add New Student</h3>
//           <form onSubmit={handleAddStudent} style={styles.form}>
//             {[
//               { label: 'Full Name',    key: 'name',       type: 'text',     ph: 'e.g. Rahul Sharma' },
//               { label: 'Username',     key: 'username',   type: 'text',     ph: 'e.g. rahul123' },
//               { label: 'Password',     key: 'password',   type: 'password', ph: 'Student login password' },
//               { label: 'Roll Number',  key: 'rollNumber', type: 'text',     ph: 'e.g. 2024001' },
//               { label: 'Class',        key: 'className',  type: 'text',     ph: 'e.g. 10-A' },
//             ].map(f => (
//               <div key={f.key} style={styles.field}>
//                 <label style={styles.label}>{f.label}</label>
//                 <input
//                   style={styles.input} type={f.type} placeholder={f.ph}
//                   value={form[f.key]}
//                   onChange={e => setForm({ ...form, [f.key]: e.target.value })}
//                   required
//                 />
//               </div>
//             ))}
//             <button type="submit" style={styles.btnPrimary}>Add Student</button>
//           </form>
//         </div>
//       )}

//       {/* Edit Marks Form */}
//       {view === 'marks' && selected && (
//         <div style={styles.content}>
//           <h3 style={styles.sectionTitle}>Edit Marks — {selected.name} ({selected.rollNumber})</h3>
//           <form onSubmit={handleSaveMarks} style={styles.form}>
//             {marksForm.map((s, i) => (
//               <div key={s.name} style={styles.marksRow}>
//                 <span style={styles.subjectName}>{s.name}</span>
//                 <input
//                   style={{ ...styles.input, width: '120px' }}
//                   type="number" min="0" max="100"
//                   placeholder="Marks /100"
//                   value={s.marks}
//                   onChange={e => {
//                     const updated = [...marksForm];
//                     updated[i].marks = e.target.value;
//                     setMarksForm(updated);
//                   }}
//                   required
//                 />
//               </div>
//             ))}
//             <button type="submit" style={styles.btnPrimary}>💾 Save Marks</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   page:        { minHeight: '100vh', background: '#f7fafc', fontFamily: 'sans-serif' },
//   header:      { background: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
//   headerTitle: { margin: 0, fontSize: '20px', color: '#1a202c' },
//   headerSub:   { margin: 0, color: '#718096', fontSize: '14px' },
//   content:     { padding: '24px 32px' },
//   sectionTitle:{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' },
//   message:     { margin: '12px 32px', padding: '12px 16px', background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: '8px', color: '#276749' },
//   empty:       { textAlign: 'center', padding: '48px', color: '#a0aec0', background: '#fff', borderRadius: '12px' },
//   tableWrap:   { overflowX: 'auto', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
//   table:       { width: '100%', borderCollapse: 'collapse' },
//   tableHead:   { background: '#f7fafc' },
//   th:          { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568', borderBottom: '1px solid #e2e8f0' },
//   tableRow:    { borderBottom: '1px solid #f0f0f0' },
//   td:          { padding: '12px 16px', fontSize: '14px', color: '#2d3748' },
//   badge:       { padding: '2px 10px', borderRadius: '999px', border: '1px solid', fontWeight: '700', fontSize: '13px' },
//   form:        { background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '480px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
//   field:       { marginBottom: '16px' },
//   label:       { display: 'block', fontWeight: '600', color: '#4a5568', marginBottom: '6px', fontSize: '14px' },
//   input:       { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' },
//   marksRow:    { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' },
//   subjectName: { width: '160px', fontWeight: '600', color: '#4a5568', fontSize: '14px' },
//   btnPrimary:  { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
//   btnSecondary:{ padding: '10px 20px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
//   btnDanger:   { padding: '10px 20px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
//   btnSmall:    { padding: '6px 12px', background: '#ebf4ff', color: '#3182ce', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontSize: '13px' },
//   btnSmallDanger: { background: '#fff5f5', color: '#e53e3e' },
// };
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE = 'http://localhost:5000';
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science'];

export default function TeacherDashboard({ user, onLogout }) {
  const [students, setStudents]       = useState([]);
  const [view, setView]               = useState('list');
  const [selected, setSelected]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [message, setMessage]         = useState('');

  const [form, setForm] = useState({
    name: '', username: '', password: '', rollNumber: '', className: ''
  });

  const [marksForm, setMarksForm] = useState(
    SUBJECTS.map(s => ({ name: s, marks: '', total: 100 }))
  );

  // Always get fresh token from localStorage
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token); // debug
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/teacher/students`, getHeaders());
      setStudents(res.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data);
      showMsg('❌ ' + (err.response?.data?.message || 'Failed to load students'));
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE}/api/teacher/students`, form, getHeaders());
      showMsg('✅ Student added successfully!');
      setForm({ name: '', username: '', password: '', rollNumber: '', className: '' });
      setView('list');
      fetchStudents();
    } catch (err) {
      console.error('Add error:', err.response?.data);
      showMsg('❌ ' + (err.response?.data?.message || 'Failed to add student'));
    }
  };

  const openMarks = (student) => {
    setSelected(student);
    if (student.subjects && student.subjects.length > 0) {
      setMarksForm(SUBJECTS.map(s => {
        const existing = student.subjects.find(sub => sub.name === s);
        return { name: s, marks: existing ? existing.marks : '', total: 100 };
      }));
    } else {
      setMarksForm(SUBJECTS.map(s => ({ name: s, marks: '', total: 100 })));
    }
    setView('marks');
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    const subjects = marksForm.map(s => ({
      name: s.name, marks: Number(s.marks), total: s.total
    }));
    try {
      await axios.put(`${BASE}/api/teacher/students/${selected._id}/marks`, { subjects }, getHeaders());
      showMsg('✅ Marks saved successfully!');
      setView('list');
      fetchStudents();
    } catch (err) {
      console.error('Marks error:', err.response?.data);
      showMsg('❌ Failed to save marks');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await axios.delete(`${BASE}/api/teacher/students/${id}`, getHeaders());
      showMsg('✅ Student deleted');
      fetchStudents();
    } catch (err) {
      showMsg('❌ Failed to delete student');
    }
  };

  const gradeColor = (grade) => {
    const colors = { 'A+': '#276749', A: '#2f855a', B: '#2b6cb0', C: '#d69e2e', D: '#dd6b20', F: '#c53030' };
    return colors[grade] || '#4a5568';
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>👨‍🏫 Teacher Dashboard</h2>
          <p style={styles.headerSub}>Welcome, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {view !== 'list' && (
            <button style={styles.btnSecondary} onClick={() => setView('list')}>← Back</button>
          )}
          {view === 'list' && (
            <button style={styles.btnPrimary} onClick={() => setView('add')}>+ Add Student</button>
          )}
          <button style={styles.btnDanger} onClick={onLogout}>Logout</button>
        </div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {view === 'list' && (
        <div style={styles.content}>
          <h3 style={styles.sectionTitle}>All Students ({students.length})</h3>
          {loading ? <p>Loading...</p> : students.length === 0 ? (
            <div style={styles.empty}>No students yet. Click "+ Add Student" to add one.</div>
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
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id} style={styles.tableRow}>
                      <td style={styles.td}>{s.rollNumber}</td>
                      <td style={styles.td}><strong>{s.name}</strong></td>
                      <td style={styles.td}>{s.class}</td>
                      <td style={styles.td}>{s.subjects?.length || 0} subjects</td>
                      <td style={styles.td}>{s.percentage}%</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, color: gradeColor(s.grade), borderColor: gradeColor(s.grade) }}>
                          {s.grade || 'N/A'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button style={styles.btnSmall} onClick={() => openMarks(s)}>✏️ Marks</button>
                        <button style={{ ...styles.btnSmall, ...styles.btnSmallDanger }} onClick={() => handleDelete(s._id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {view === 'add' && (
        <div style={styles.content}>
          <h3 style={styles.sectionTitle}>Add New Student</h3>
          <form onSubmit={handleAddStudent} style={styles.form}>
            {[
              { label: 'Full Name',   key: 'name',       type: 'text',     ph: 'e.g. Rahul Sharma' },
              { label: 'Username',    key: 'username',   type: 'text',     ph: 'e.g. rahul123' },
              { label: 'Password',    key: 'password',   type: 'password', ph: 'Student login password' },
              { label: 'Roll Number', key: 'rollNumber', type: 'text',     ph: 'e.g. 2024001' },
              { label: 'Class',       key: 'className',  type: 'text',     ph: 'e.g. 10-A' },
            ].map(f => (
              <div key={f.key} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input
                  style={styles.input} type={f.type} placeholder={f.ph}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  required
                />
              </div>
            ))}
            <button type="submit" style={styles.btnPrimary}>Add Student</button>
          </form>
        </div>
      )}

      {view === 'marks' && selected && (
        <div style={styles.content}>
          <h3 style={styles.sectionTitle}>Edit Marks — {selected.name} ({selected.rollNumber})</h3>
          <form onSubmit={handleSaveMarks} style={styles.form}>
            {marksForm.map((s, i) => (
              <div key={s.name} style={styles.marksRow}>
                <span style={styles.subjectName}>{s.name}</span>
                <input
                  style={{ ...styles.input, width: '120px' }}
                  type="number" min="0" max="100"
                  placeholder="Marks /100"
                  value={s.marks}
                  onChange={e => {
                    const updated = [...marksForm];
                    updated[i].marks = e.target.value;
                    setMarksForm(updated);
                  }}
                  required
                />
              </div>
            ))}
            <button type="submit" style={styles.btnPrimary}>💾 Save Marks</button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  page:        { minHeight: '100vh', background: '#f7fafc', fontFamily: 'sans-serif' },
  header:      { background: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  headerTitle: { margin: 0, fontSize: '20px', color: '#1a202c' },
  headerSub:   { margin: 0, color: '#718096', fontSize: '14px' },
  content:     { padding: '24px 32px' },
  sectionTitle:{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' },
  message:     { margin: '12px 32px', padding: '12px 16px', background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: '8px', color: '#276749' },
  empty:       { textAlign: 'center', padding: '48px', color: '#a0aec0', background: '#fff', borderRadius: '12px' },
  tableWrap:   { overflowX: 'auto', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  tableHead:   { background: '#f7fafc' },
  th:          { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568', borderBottom: '1px solid #e2e8f0' },
  tableRow:    { borderBottom: '1px solid #f0f0f0' },
  td:          { padding: '12px 16px', fontSize: '14px', color: '#2d3748' },
  badge:       { padding: '2px 10px', borderRadius: '999px', border: '1px solid', fontWeight: '700', fontSize: '13px' },
  form:        { background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '480px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  field:       { marginBottom: '16px' },
  label:       { display: 'block', fontWeight: '600', color: '#4a5568', marginBottom: '6px', fontSize: '14px' },
  input:       { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' },
  marksRow:    { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' },
  subjectName: { width: '160px', fontWeight: '600', color: '#4a5568', fontSize: '14px' },
  btnPrimary:  { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  btnSecondary:{ padding: '10px 20px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  btnDanger:   { padding: '10px 20px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  btnSmall:    { padding: '6px 12px', background: '#ebf4ff', color: '#3182ce', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontSize: '13px' },
  btnSmallDanger: { background: '#fff5f5', color: '#e53e3e' },
};