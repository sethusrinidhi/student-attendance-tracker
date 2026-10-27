import React from 'react';
import { Users, UserCheck, UserX, Percent, AlertCircle } from 'lucide-react';

export default function StatsCards({ summary, selectedDate }) {
  const total = summary?.totalStudents || 0;
  const present = summary?.presentCount || 0;
  const absent = summary?.absentCount || 0;
  const unmarked = summary?.unmarkedCount || 0;
  const rate = summary?.attendancePercentage !== undefined ? summary.attendancePercentage : 0;

  const presentPercent = total > 0 ? Math.round((present / total) * 100) : 0;
  const absentPercent = total > 0 ? Math.round((absent / total) * 100) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '18px',
      marginBottom: '24px'
    }}>
      {/* Total Students Card */}
      <div className="glass-panel" style={{
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Students
          </span>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.12)',
            color: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1 }}>
            {total}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            enrolled
          </span>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Active batch students in roster
        </div>
      </div>

      {/* Present Students Card */}
      <div className="glass-panel" style={{
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--present)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Present Students
          </span>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--present-bg)',
            color: 'var(--present)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserCheck size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1, color: '#10b981' }}>
            {present}
          </span>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            background: 'var(--present-bg)',
            color: '#10b981',
            padding: '2px 8px',
            borderRadius: '9999px'
          }}>
            {presentPercent}%
          </span>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Recorded attended in session
        </div>
      </div>

      {/* Absent Students Card */}
      <div className="glass-panel" style={{
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--absent)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Absent Students
          </span>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--absent-bg)',
            color: 'var(--absent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserX size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1, color: '#f43f5e' }}>
            {absent}
          </span>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            background: 'var(--absent-bg)',
            color: '#f43f5e',
            padding: '2px 8px',
            borderRadius: '9999px'
          }}>
            {absentPercent}%
          </span>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Marked absent for {selectedDate}
        </div>
      </div>

      {/* Attendance Rate / Percentage Card */}
      <div className="glass-panel" style={{
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Turnout Rate
          </span>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.12)',
            color: '#06b6d4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Percent size={20} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1 }}>
            {rate}%
          </span>
          {unmarked > 0 && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#f59e0b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <AlertCircle size={12} /> {unmarked} pending
            </span>
          )}
        </div>
        {/* Progress Bar */}
        <div style={{
          marginTop: '12px',
          width: '100%',
          height: '7px',
          background: 'var(--surface-muted)',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${rate}%`,
            height: '100%',
            background: rate >= 80 ? 'var(--present)' : rate >= 60 ? '#f59e0b' : 'var(--absent)',
            borderRadius: '9999px',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>
    </div>
  );
}
