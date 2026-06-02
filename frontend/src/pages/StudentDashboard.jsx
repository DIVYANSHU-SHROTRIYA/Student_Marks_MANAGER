import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function StudentDashboard({ user, onLogout }) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchResult = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/student/result', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResult(res.data);
    } catch (err) {
      setError('Failed to load your result. Please try again.');
    }
    setLoading(false);
  };
  fetchResult();
}, []);

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text('Student Report Card', 105, 20, { align: 'center' });

    // Student info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name       : ${result.name}`,       20, 40);
    doc.text(`Roll Number: ${result.rollNumber}`,  20, 50);
    doc.text(`Class      : ${result.class}`,       20, 60);
    doc.text(`Percentage : ${result.percentage}%`, 20, 70);
    doc.text(`Grade      : ${result.grade}`,       20, 80);

    // Marks table
    doc.autoTable({
      startY: 95,
      head: [['Subject', 'Marks Obtained', 'Total Marks']],
      body: result.subjects.map(s => [s.name, s.marks, s.total]),
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 12 }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save(`${result.name}_Result.pdf`);
  };

  const gradeInfo = (grade) => {
    const map = {
      'A+': { color: '#276749', bg: '#f0fff4', label: 'Outstanding' },
      'A':  { color: '#2f855a', bg: '#f0fff4', label: 'Excellent' },
      'B':  { color: '#2b6cb0', bg: '#ebf8ff', label: 'Good' },
      'C':  { color: '#d69e2e', bg: '#fffff0', label: 'Average' },
      'D':  { color: '#dd6b20', bg: '#fffaf0', label: 'Below Average' },
      'F':  { color: '#c53030', bg: '#fff5f5', label: 'Fail' },
    };
    return map[grade] || { color: '#4a5568', bg: '#f7fafc', label: '' };
  };

  if (loading) return <div style={styles.center}>Loading your result...</div>;
  if (error)   return <div style={styles.center}><p style={{ color: '#e53e3e' }}>{error}</p></div>;

  const gi = result ? gradeInfo(result.grade) : {};
  const totalObtained = result?.subjects?.reduce((s, sub) => s + sub.marks, 0) || 0;
  const totalMax      = result?.subjects?.reduce((s, sub) => s + sub.total, 0) || 0;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>🎓 My Result</h2>
          <p style={styles.headerSub}>Welcome, {user.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={styles.btnDownload} onClick={downloadPDF}>⬇️ Download PDF</button>
          <button style={styles.btnLogout}   onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Info Cards */}
        <div style={styles.cardRow}>
          {[
            { label: 'Name',        value: result.name },
            { label: 'Roll Number', value: result.rollNumber },
            { label: 'Class',       value: result.class },
          ].map(c => (
            <div key={c.label} style={styles.infoCard}>
              <p style={styles.infoLabel}>{c.label}</p>
              <p style={styles.infoValue}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Grade Banner */}
        <div style={{ ...styles.gradeBanner, background: gi.bg, borderColor: gi.color }}>
          <div>
            <p style={styles.gradeLabel}>Overall Grade</p>
            <p style={{ ...styles.gradeValue, color: gi.color }}>{result.grade}</p>
            <p style={{ ...styles.gradeDesc, color: gi.color }}>{gi.label}</p>
          </div>
          <div style={styles.pctBlock}>
            <p style={styles.gradeLabel}>Total Score</p>
            <p style={{ ...styles.gradeValue, color: gi.color }}>{result.percentage}%</p>
            <p style={{ color: gi.color, fontSize: '14px' }}>{totalObtained} / {totalMax}</p>
          </div>
        </div>

        {/* Subjects Table */}
        {result.subjects && result.subjects.length > 0 ? (
          <div style={styles.tableWrap}>
            <h3 style={styles.sectionTitle}>Subject-wise Marks</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Marks Obtained</th>
                  <th style={styles.th}>Total Marks</th>
                  <th style={styles.th}>Percentage</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects.map((s, i) => {
                  const pct  = ((s.marks / s.total) * 100).toFixed(1);
                  const pass = s.marks >= s.total * 0.33;
                  return (
                    <tr key={i} style={styles.tableRow}>
                      <td style={styles.td}>{i + 1}</td>
                      <td style={styles.td}><strong>{s.name}</strong></td>
                      <td style={styles.td}>{s.marks}</td>
                      <td style={styles.td}>{s.total}</td>
                      <td style={styles.td}>
                        <div style={styles.barWrap}>
                          <div style={{ ...styles.bar, width: `${pct}%`, background: pass ? '#48bb78' : '#fc8181' }}/>
                          <span style={styles.barLabel}>{pct}%</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: pass ? '#276749' : '#c53030', fontWeight: '700' }}>
                          {pass ? '✅ Pass' : '❌ Fail'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.empty}>No marks have been entered yet. Please check back later.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:        { minHeight: '100vh', background: '#f7fafc', fontFamily: 'sans-serif' },
  center:      { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  header:      { background: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  headerTitle: { margin: 0, fontSize: '20px', color: '#1a202c' },
  headerSub:   { margin: 0, color: '#718096', fontSize: '14px' },
  content:     { padding: '24px 32px' },
  cardRow:     { display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  infoCard:    { background: '#fff', padding: '16px 24px', borderRadius: '10px', flex: 1, minWidth: '150px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  infoLabel:   { margin: 0, fontSize: '12px', color: '#a0aec0', fontWeight: '600', textTransform: 'uppercase' },
  infoValue:   { margin: '4px 0 0', fontSize: '18px', fontWeight: '700', color: '#2d3748' },
  gradeBanner: { padding: '24px 32px', borderRadius: '12px', border: '2px solid', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  gradeLabel:  { margin: 0, fontSize: '13px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' },
  gradeValue:  { margin: '4px 0', fontSize: '48px', fontWeight: '900', lineHeight: 1 },
  gradeDesc:   { margin: 0, fontSize: '16px', fontWeight: '600' },
  pctBlock:    { textAlign: 'right' },
  sectionTitle:{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' },
  tableWrap:   { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  tableHead:   { background: '#f7fafc' },
  th:          { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568', borderBottom: '1px solid #e2e8f0' },
  tableRow:    { borderBottom: '1px solid #f7fafc' },
  td:          { padding: '12px 16px', fontSize: '14px', color: '#2d3748' },
  barWrap:     { display: 'flex', alignItems: 'center', gap: '8px' },
  bar:         { height: '8px', borderRadius: '4px', minWidth: '4px', maxWidth: '100px', transition: 'width 0.3s' },
  barLabel:    { fontSize: '13px', color: '#4a5568', whiteSpace: 'nowrap' },
  empty:       { textAlign: 'center', padding: '48px', color: '#a0aec0', background: '#fff', borderRadius: '12px' },
  btnDownload: { padding: '10px 20px', background: '#48bb78', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  btnLogout:   { padding: '10px 20px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
};