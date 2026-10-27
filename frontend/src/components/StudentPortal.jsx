import React, { useEffect, useState } from 'react';
import { Award, Calendar, Check, X, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function StudentPortal({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      // Find matching student in student roster
      const students = await api.getStudents();
      const match = students.find(
        s => (s.email && user.email && s.email.toLowerCase() === user.email.toLowerCase()) ||
             (s.name && user.fullName && s.name.toLowerCase() === user.fullName.toLowerCase())
      ) || (user.username === 'student' ? students[0] : null);

      setStudentInfo(match);

      if (match?.id) {
        const records = await api.getStudentHistory(match.id);
        setHistory(records || []);
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const total = history.length;
  const present = history.filter(h => h.status === 'PRESENT').length;
  const absent = history.filter(h => h.status === 'ABSENT').length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Welcome Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        marginBottom: '24px',
        background: 'var(--primary-gradient)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Student Dashboard
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0 4px 0', color: '#ffffff' }}>
              Welcome back, {user.fullName || user.username}!
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.9rem', margin: 0 }}>
              Roll Number: <strong className="font-mono">{studentInfo?.rollNumber || 'CS-2026-001'}</strong> • Academic Year 2026
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px 24px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9 }}>
              Overall Attendance
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1 }}>
              {rate}%
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '2px' }}>
              {rate >= 80 ? '🌟 Excellent Turnout' : '⚠️ Attendance Warning'}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Sessions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>{total}</div>
        </div>
        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid var(--present)' }}>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Sessions Attended</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{present}</div>
        </div>
        <div className="glass-panel" style={{ padding: '18px 20px', borderLeft: '4px solid var(--absent)' }}>
          <div style={{ fontSize: '0.8rem', color: '#f43f5e', fontWeight: 600 }}>Sessions Missed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f43f5e', marginTop: '4px' }}>{absent}</div>
        </div>
      </div>

      {/* Session History Log */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            Session Attendance Log
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Recorded by class trainer
          </span>
        </div>

        <div style={{ padding: '16px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Loading attendance history...
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No attendance records recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map(row => {
                const isPresent = row.status === 'PRESENT';
                return (
                  <div
                    key={row.attendanceId || row.date}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: 'var(--surface-muted)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: isPresent ? 'var(--present-bg)' : 'var(--absent-bg)',
                        color: isPresent ? '#10b981' : '#f43f5e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isPresent ? <Check size={18} strokeWidth={2.5} /> : <X size={18} strokeWidth={2.5} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {row.date}
                        </div>
                        {row.remarks && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Trainer Remark: {row.remarks}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        background: isPresent ? 'var(--present-bg)' : 'var(--absent-bg)',
                        color: isPresent ? '#10b981' : '#f43f5e',
                        border: `1px solid ${isPresent ? 'var(--present-border)' : 'var(--absent-border)'}`,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}>
                        {row.status}
                      </span>
                      {row.markedBy && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                          by {row.markedBy}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
