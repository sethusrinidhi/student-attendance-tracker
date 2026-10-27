import React, { useEffect, useState } from 'react';
import { X, Calendar, Check, AlertCircle, History, Award } from 'lucide-react';
import { api } from '../services/api';

export default function StudentHistoryModal({ isOpen, onClose, student }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && student?.studentId) {
      loadHistory();
    }
  }, [isOpen, student]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getStudentHistory(student.studentId);
      setHistory(data || []);
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  const totalSessions = history.length;
  const presentCount = history.filter(h => h.status === 'PRESENT').length;
  const absentCount = history.filter(h => h.status === 'ABSENT').length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '85vh',
        background: 'var(--surface-solid)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {student.name}
              </h3>
              <span className="font-mono" style={{
                background: 'var(--surface-muted)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {student.rollNumber}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Individual Attendance History & Performance
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface-muted)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Performance Summary */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--surface-muted)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{totalSessions}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>Present</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>{presentCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#f43f5e', textTransform: 'uppercase', fontWeight: 700 }}>Absent</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f43f5e' }}>{absentCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>Turnout</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{attendanceRate}%</div>
          </div>
        </div>

        {/* History List */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Loading attendance history...
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No historical records found for this student.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((record) => {
                const isPresent = record.status === 'PRESENT';
                return (
                  <div
                    key={record.attendanceId || record.date}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: isPresent ? 'var(--present-bg)' : 'var(--absent-bg)',
                        color: isPresent ? '#10b981' : '#f43f5e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isPresent ? <Check size={16} strokeWidth={2.5} /> : <X size={16} strokeWidth={2.5} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          {record.date}
                        </div>
                        {record.remarks && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Note: {record.remarks}
                          </div>
                        )}
                      </div>
                    </div>

                    <span style={{
                      background: isPresent ? 'var(--present-bg)' : 'var(--absent-bg)',
                      color: isPresent ? '#10b981' : '#f43f5e',
                      border: `1px solid ${isPresent ? 'var(--present-border)' : 'var(--absent-border)'}`,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {record.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'right'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface-muted)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
