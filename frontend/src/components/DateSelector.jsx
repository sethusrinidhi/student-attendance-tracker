import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';

export default function DateSelector({ selectedDate, onDateChange, loading }) {
  const getTodayStr = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  const shiftDate = (offsetDays) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offsetDays);
    onDateChange(current.toISOString().split('T')[0]);
  };

  const formatDisplayDate = (dateStr) => {
    try {
      const [year, month, day] = dateStr.split('-');
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const isToday = selectedDate === getTodayStr();
  const isYesterday = selectedDate === getYesterdayStr();

  return (
    <div className="glass-panel" style={{
      padding: '16px 22px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Date Title & Human Readable Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'rgba(79, 70, 229, 0.12)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Calendar size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Attendance Session Date
            </span>
            {isToday && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '2px 8px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Sparkles size={11} /> Today's Session
              </span>
            )}
            {isYesterday && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--primary-light)',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                Yesterday
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '1.28rem', fontWeight: '800', margin: '2px 0 0 0' }}>
            {formatDisplayDate(selectedDate)}
          </h2>
        </div>
      </div>

      {/* Date Navigation & Picker Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Step back 1 day */}
        <button
          onClick={() => shiftDate(-1)}
          disabled={loading}
          style={{
            background: 'var(--surface-muted)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          title="Previous Day"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Date Input */}
        <div style={{ position: 'relative' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            disabled={loading}
            style={{
              background: 'var(--surface-solid)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
        </div>

        {/* Step forward 1 day */}
        <button
          onClick={() => shiftDate(1)}
          disabled={loading}
          style={{
            background: 'var(--surface-muted)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          title="Next Day"
        >
          <ChevronRight size={18} />
        </button>

        {/* Quick Presets */}
        <div style={{ display: 'flex', gap: '6px', marginLeft: '6px' }}>
          <button
            onClick={() => onDateChange(getTodayStr())}
            style={{
              background: isToday ? 'var(--primary)' : 'var(--surface-muted)',
              color: isToday ? '#ffffff' : 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            Today
          </button>
          <button
            onClick={() => onDateChange(getYesterdayStr())}
            style={{
              background: isYesterday ? 'var(--primary)' : 'var(--surface-muted)',
              color: isYesterday ? '#ffffff' : 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            Yesterday
          </button>
        </div>
      </div>
    </div>
  );
}
