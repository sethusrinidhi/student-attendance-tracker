import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck2, 
  Lock, 
  User, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  BookOpenCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  CheckCircle2,
  Trash2,
  Phone,
  Hash
} from 'lucide-react';
import { savedAccountsStorage } from '../services/api';

export default function AuthView({ onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('ROLE_TRAINER');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState(() => savedAccountsStorage.getAccounts());

  const refreshSavedAccounts = () => {
    setSavedAccounts(savedAccountsStorage.getAccounts());
  };

  const handleTabChange = (registerMode) => {
    setIsRegister(registerMode);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Pre-validation checks
    if (isRegister) {
      if (username.trim().length < 3) {
        setError('Username must be at least 3 characters long.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        const payload = {
          username: username.trim(),
          password,
          email: email.trim(),
          fullName: fullName.trim(),
          role,
          rollNumber: rollNumber.trim() || null,
          phone: phone.trim() || null
        };
        await onRegister(payload);
        refreshSavedAccounts();
      } else {
        await onLogin(username.trim(), password);
        refreshSavedAccounts();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await onLogin(u, p);
      refreshSavedAccounts();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSavedAccount = (acc) => {
    setUsername(acc.username);
    if (acc.password) {
      setPassword(acc.password);
      handleQuickLogin(acc.username, acc.password);
    } else {
      setIsRegister(false);
      setPassword('');
      setError('');
      setSuccessMsg(`Selected @${acc.username}. Please enter your password to sign in.`);
    }
  };

  const handleDeleteSavedAccount = (e, u) => {
    e.stopPropagation();
    const updated = savedAccountsStorage.removeAccount(u);
    setSavedAccounts(updated);
  };

  const getRoleLabel = (r) => {
    switch (r) {
      case 'ROLE_ADMIN': return 'Administrator';
      case 'ROLE_STUDENT': return 'Student';
      default: return 'Trainer';
    }
  };

  const getRoleIcon = (r) => {
    switch (r) {
      case 'ROLE_ADMIN': return <ShieldCheck size={16} color="#7c3aed" />;
      case 'ROLE_STUDENT': return <GraduationCap size={16} color="#10b981" />;
      default: return <BookOpenCheck size={16} color="#4f46e5" />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: Welcome, Demo Accounts & Saved Accounts */}
        <div className="glass-panel" style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'var(--surface-card)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'var(--primary-gradient)',
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 8px 20px -3px var(--primary-glow)'
              }}>
                <CalendarCheck2 size={26} />
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                AttendFlow
              </h1>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '10px' }}>
              Student Attendance Management System
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '22px' }}>
              Track daily classroom turnout, maintain date-wise attendance records, and review student performance metrics with role-based security.
            </p>

            {/* Custom Saved Accounts Section */}
            {savedAccounts.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--accent, #06b6d4)',
                  letterSpacing: '0.06em',
                  marginBottom: '10px'
                }}>
                  <User size={14} /> Your Created Accounts ({savedAccounts.length})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {savedAccounts.map(acc => (
                    <div
                      key={acc.username}
                      onClick={() => handleSelectSavedAccount(acc)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'var(--surface-muted)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      title="Click to sign in with this account"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'var(--surface-solid)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          {getRoleIcon(acc.role)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                            {acc.fullName || acc.username}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            @{acc.username} • {getRoleLabel(acc.role)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          background: 'rgba(79, 70, 229, 0.12)',
                          color: 'var(--primary)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: 700
                        }}>
                          Sign In
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSavedAccount(e, acc.username)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-dim)',
                            padding: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Remove from saved list"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Default Demo Profiles */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--primary)',
              letterSpacing: '0.06em',
              marginBottom: '10px'
            }}>
              <Sparkles size={14} /> Demo Profiles (1-Click Login)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Trainer Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin('trainer', 'trainer123')}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(79, 70, 229, 0.08)',
                  border: '1px solid rgba(79, 70, 229, 0.25)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpenCheck size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                      Trainer (Prof. Sarah)
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      trainer / trainer123 • Mark attendance & view totals
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} color="var(--primary)" />
              </button>

              {/* Administrator Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(124, 58, 237, 0.08)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#7c3aed',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                      Administrator Portal
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      admin / admin123 • Full roster & system control
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} color="#7c3aed" />
              </button>

              {/* Student Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin('student', 'student123')}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                      Student (Aarav Sharma)
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      student / student123 • View personal turnout & history
                    </div>
                  </div>
                </div>
                <ArrowRight size={15} color="#10b981" />
              </button>
            </div>
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            ⚡ Java Spring Boot REST API & React 19 Frontend
          </div>
        </div>

        {/* Right Column: Sign In & Create Account Forms */}
        <div className="glass-panel" style={{ padding: '36px', background: 'var(--surface-solid)' }}>
          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--surface-muted)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => handleTabChange(false)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: !isRegister ? 'var(--surface-solid)' : 'transparent',
                color: !isRegister ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: !isRegister ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(true)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: isRegister ? 'var(--surface-solid)' : 'transparent',
                color: isRegister ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isRegister ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <UserPlus size={16} /> Create Account
            </button>
          </div>

          {/* Form Header */}
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0' }}>
              {isRegister ? 'Register New Account' : 'Sign In to Your Account'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              {isRegister 
                ? 'Create a persistent profile as a Trainer, Student, or Admin' 
                : 'Enter your username and password or select from saved accounts'}
            </p>
          </div>

          {/* Error Message Banner */}
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Success / Info Message Banner */}
          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                {/* Account Role Cards */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Select Your Role
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {/* Trainer */}
                    <div
                      onClick={() => setRole('ROLE_TRAINER')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        border: `2px solid ${role === 'ROLE_TRAINER' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        background: role === 'ROLE_TRAINER' ? 'rgba(79, 70, 229, 0.08)' : 'var(--surface-muted)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <BookOpenCheck size={18} color={role === 'ROLE_TRAINER' ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: role === 'ROLE_TRAINER' ? 'var(--primary)' : 'var(--text-main)' }}>
                        Trainer
                      </div>
                    </div>

                    {/* Student */}
                    <div
                      onClick={() => setRole('ROLE_STUDENT')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        border: `2px solid ${role === 'ROLE_STUDENT' ? '#10b981' : 'var(--border-subtle)'}`,
                        background: role === 'ROLE_STUDENT' ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface-muted)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <GraduationCap size={18} color={role === 'ROLE_STUDENT' ? '#10b981' : 'var(--text-muted)'} style={{ margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: role === 'ROLE_STUDENT' ? '#10b981' : 'var(--text-main)' }}>
                        Student
                      </div>
                    </div>

                    {/* Admin */}
                    <div
                      onClick={() => setRole('ROLE_ADMIN')}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        border: `2px solid ${role === 'ROLE_ADMIN' ? '#7c3aed' : 'var(--border-subtle)'}`,
                        background: role === 'ROLE_ADMIN' ? 'rgba(124, 58, 237, 0.08)' : 'var(--surface-muted)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <ShieldCheck size={18} color={role === 'ROLE_ADMIN' ? '#7c3aed' : 'var(--text-muted)'} style={{ margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: role === 'ROLE_ADMIN' ? '#7c3aed' : 'var(--text-main)' }}>
                        Admin
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Full Name <span style={{ color: 'var(--absent)' }}>*</span>
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--surface-muted)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '9px 12px'
                  }}>
                    <User size={18} color="var(--text-muted)" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sethu Srinidhi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Email Address <span style={{ color: 'var(--absent)' }}>*</span>
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--surface-muted)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '9px 12px'
                  }}>
                    <Mail size={18} color="var(--text-muted)" />
                    <input
                      type="email"
                      required
                      placeholder="name@academy.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Conditional Student Fields: Roll Number & Phone */}
                {role === 'ROLE_STUDENT' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '14px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px dashed rgba(16, 185, 129, 0.3)'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
                        Roll Number (Optional)
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--surface-solid)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '7px 10px'
                      }}>
                        <Hash size={14} color="var(--text-muted)" />
                        <input
                          type="text"
                          placeholder="Auto-assigned"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
                        Phone (Optional)
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--surface-solid)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '7px 10px'
                      }}>
                        <Phone size={14} color="var(--text-muted)" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Username */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  Username <span style={{ color: 'var(--absent)' }}>*</span>
                </label>
                {isRegister && (
                  <span style={{ fontSize: '0.74rem', color: username.trim().length >= 3 ? '#10b981' : 'var(--text-muted)' }}>
                    {username.trim().length}/3 min chars
                  </span>
                )}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--surface-muted)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '9px 12px'
              }}>
                <User size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  required
                  placeholder="e.g. sethu"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  Password <span style={{ color: 'var(--absent)' }}>*</span>
                </label>
                {isRegister && (
                  <span style={{ fontSize: '0.74rem', color: password.length >= 6 ? '#10b981' : 'var(--text-muted)' }}>
                    {password.length}/6 min chars
                  </span>
                )}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--surface-muted)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '9px 12px'
              }}>
                <Lock size={18} color="var(--text-muted)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              <span>
                {loading 
                  ? 'Processing...' 
                  : (isRegister ? 'Create Account & Enter' : 'Sign In to Portal')}
              </span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Toggle Link */}
          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Sign In here
                </button>
              </span>
            ) : (
              <span>
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
