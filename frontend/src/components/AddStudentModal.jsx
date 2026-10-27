import React, { useState } from 'react';
import { X, UserPlus, Hash, User, Mail, Phone, AlertCircle } from 'lucide-react';

export default function AddStudentModal({ isOpen, onClose, onAddStudent, existingRollNumbers = [] }) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedRoll = rollNumber.trim().toUpperCase();

    if (!trimmedName) {
      setError('Student name is required');
      return;
    }

    if (!trimmedRoll) {
      setError('Roll number is required');
      return;
    }

    if (existingRollNumbers.some(r => r.toUpperCase() === trimmedRoll)) {
      setError(`Roll number "${trimmedRoll}" already exists. Please use a unique roll number.`);
      return;
    }

    setLoading(true);
    try {
      await onAddStudent({
        name: trimmedName,
        rollNumber: trimmedRoll,
        email: email.trim() || null,
        phone: phone.trim() || null
      });
      // Reset form
      setName('');
      setRollNumber('');
      setEmail('');
      setPhone('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '480px',
        background: 'var(--surface-solid)',
        borderRadius: '20px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(79, 70, 229, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                Enroll New Student
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Add student to roster with roll number
              </p>
            </div>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Student Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Student Full Name *
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--surface-muted)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '10px 14px'
            }}>
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                required
                placeholder="e.g. John Doe, Maya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Roll Number */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Roll Number / Student ID *
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--surface-muted)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '10px 14px'
            }}>
              <Hash size={18} color="var(--text-muted)" />
              <input
                type="text"
                required
                placeholder="e.g. CS-2026-011"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Must be unique across all students.
            </span>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Email Address (Optional)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--surface-muted)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '10px 14px'
            }}>
              <Mail size={18} color="var(--text-muted)" />
              <input
                type="email"
                placeholder="student@academy.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
              Phone Number (Optional)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--surface-muted)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '10px 14px'
            }}>
              <Phone size={18} color="var(--text-muted)" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                background: 'var(--surface-muted)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 22px',
                fontSize: '0.88rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <UserPlus size={16} />
              <span>{loading ? 'Adding...' : 'Add Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
