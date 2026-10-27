import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck2, 
  Sun, 
  Moon, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  GraduationCap, 
  BookOpenCheck,
  UserCheck
} from 'lucide-react';
import { savedAccountsStorage } from '../services/api';

export default function Navbar({ user, onLogout, onQuickLogin, theme, onToggleTheme }) {
  const [savedAccounts, setSavedAccounts] = useState([]);

  useEffect(() => {
    setSavedAccounts(savedAccountsStorage.getAccounts());
  }, [user]);

  const customAccounts = savedAccounts.filter(
    a => !['trainer', 'admin', 'student'].includes(a.username?.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(124, 58, 237, 0.15)',
            color: '#8b5cf6',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '600'
          }}>
            <ShieldCheck size={14} /> Admin
          </span>
        );
      case 'ROLE_STUDENT':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '600'
          }}>
            <GraduationCap size={14} /> Student
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(79, 70, 229, 0.15)',
            color: '#6366f1',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: '600'
          }}>
            <BookOpenCheck size={14} /> Trainer
          </span>
        );
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'var(--primary-gradient)',
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 8px 16px -2px var(--primary-glow)'
        }}>
          <CalendarCheck2 size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AttendFlow
            </span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'var(--surface-muted)',
              color: 'var(--text-muted)',
              padding: '2px 6px',
              borderRadius: '6px'
            }}>
              v2.0
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Student Attendance Management System
          </p>
        </div>
      </div>

      {/* Center Quick Switchers (if logged in) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Custom accounts created by user */}
        {customAccounts.map(acc => {
          const isActive = user?.username?.toLowerCase() === acc.username?.toLowerCase();
          return (
            <button
              key={acc.username}
              onClick={() => acc.password ? onQuickLogin(acc.username, acc.password) : null}
              style={{
                background: isActive ? 'var(--primary)' : 'rgba(6, 182, 212, 0.1)',
                color: isActive ? '#ffffff' : 'var(--text-main)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'rgba(6, 182, 212, 0.35)'}`,
                borderRadius: '9999px',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
              title={`Switch to @${acc.username} (${acc.role})`}
            >
              <UserCheck size={13} color={isActive ? '#ffffff' : 'var(--accent, #06b6d4)'} />
              <span>{acc.fullName?.split(' ')[0] || acc.username}</span>
            </button>
          );
        })}

        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>
          Demos:
        </span>
        <button
          onClick={() => onQuickLogin('trainer', 'trainer123')}
          style={{
            background: user?.username === 'trainer' ? 'var(--primary)' : 'var(--surface-muted)',
            color: user?.username === 'trainer' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9999px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
          title="Login as Trainer (Prof. Sarah)"
        >
          <BookOpenCheck size={13} /> Trainer
        </button>
        <button
          onClick={() => onQuickLogin('admin', 'admin123')}
          style={{
            background: user?.username === 'admin' ? '#7c3aed' : 'var(--surface-muted)',
            color: user?.username === 'admin' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9999px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
          title="Login as Administrator"
        >
          <ShieldCheck size={13} /> Admin
        </button>
        <button
          onClick={() => onQuickLogin('student', 'student123')}
          style={{
            background: user?.username === 'student' ? '#10b981' : 'var(--surface-muted)',
            color: user?.username === 'student' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '9999px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
          title="Login as Student (Aarav Sharma)"
        >
          <GraduationCap size={13} /> Student
        </button>
      </div>

      {/* User Info & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          style={{
            background: 'var(--surface-muted)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* User Card */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {user.fullName || user.username}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>@{user.username}</span>
                {getRoleBadge(user.role)}
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                color: '#f43f5e',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Logout"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
