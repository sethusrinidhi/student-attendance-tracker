import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Search, 
  Filter, 
  UserPlus, 
  CheckCheck, 
  XCircle, 
  FileDown, 
  History, 
  Trash2, 
  MessageSquare,
  HelpCircle,
  MoreVertical
} from 'lucide-react';

export default function AttendanceTable({
  records,
  selectedDate,
  loading,
  userRole,
  onMarkAttendance,
  onBatchMark,
  onOpenAddModal,
  onViewHistory,
  onDeleteStudent
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PRESENT, ABSENT, UNMARKED
  const [editingRemarks, setEditingRemarks] = useState({});
  const [savingRowId, setSavingRowId] = useState(null);

  // Filter records based on search and status
  const filteredRecords = records.filter(row => {
    const matchesSearch = 
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'PRESENT') return row.status === 'PRESENT';
    if (statusFilter === 'ABSENT') return row.status === 'ABSENT';
    if (statusFilter === 'UNMARKED') return !row.status;

    return true;
  });

  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const unmarkedCount = records.filter(r => !r.status).length;

  const handleMark = async (studentId, status) => {
    setSavingRowId(studentId);
    const remark = editingRemarks[studentId] !== undefined 
      ? editingRemarks[studentId] 
      : (records.find(r => r.studentId === studentId)?.remarks || '');
    
    await onMarkAttendance(studentId, status, remark);
    setSavingRowId(null);
  };

  const handleRemarkChange = (studentId, val) => {
    setEditingRemarks(prev => ({ ...prev, [studentId]: val }));
  };

  const handleRemarkBlur = async (studentId, currentStatus) => {
    const newRemark = editingRemarks[studentId];
    const currentRow = records.find(r => r.studentId === studentId);
    if (newRemark !== undefined && newRemark !== currentRow?.remarks && currentStatus) {
      await onMarkAttendance(studentId, currentStatus, newRemark);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Roll Number', 'Student Name', 'Date', 'Status', 'Remarks', 'Marked By'];
    const rows = records.map(r => [
      `"${r.rollNumber}"`,
      `"${r.name}"`,
      `"${selectedDate}"`,
      `"${r.status || 'UNMARKED'}"`,
      `"${r.remarks || ''}"`,
      `"${r.markedBy || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      {/* Table Toolbar */}
      <div style={{
        padding: '18px 22px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Left: Search Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--surface-muted)',
          borderRadius: '10px',
          padding: '8px 14px',
          width: '280px',
          maxWidth: '100%',
          border: '1px solid var(--border-subtle)'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by name or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.88rem',
              color: 'var(--text-main)'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: 0 }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Middle: Filter Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-muted)',
          padding: '4px',
          borderRadius: '10px',
          gap: '4px'
        }}>
          <button
            onClick={() => setStatusFilter('ALL')}
            style={{
              background: statusFilter === 'ALL' ? 'var(--surface-solid)' : 'transparent',
              color: statusFilter === 'ALL' ? 'var(--text-main)' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '7px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: statusFilter === 'ALL' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setStatusFilter('PRESENT')}
            style={{
              background: statusFilter === 'PRESENT' ? 'var(--present)' : 'transparent',
              color: statusFilter === 'PRESENT' ? '#ffffff' : '#10b981',
              border: 'none',
              borderRadius: '7px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: statusFilter === 'PRESENT' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Present ({presentCount})
          </button>
          <button
            onClick={() => setStatusFilter('ABSENT')}
            style={{
              background: statusFilter === 'ABSENT' ? 'var(--absent)' : 'transparent',
              color: statusFilter === 'ABSENT' ? '#ffffff' : '#f43f5e',
              border: 'none',
              borderRadius: '7px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: statusFilter === 'ABSENT' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Absent ({absentCount})
          </button>
          {unmarkedCount > 0 && (
            <button
              onClick={() => setStatusFilter('UNMARKED')}
              style={{
                background: statusFilter === 'UNMARKED' ? '#f59e0b' : 'transparent',
                color: statusFilter === 'UNMARKED' ? '#ffffff' : '#f59e0b',
                border: 'none',
                borderRadius: '7px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                boxShadow: statusFilter === 'UNMARKED' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Pending ({unmarkedCount})
            </button>
          )}
        </div>

        {/* Right: Quick Batch Actions & Student Management */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {userRole !== 'ROLE_STUDENT' && (
            <>
              <button
                onClick={() => onBatchMark('PRESENT')}
                disabled={loading || records.length === 0}
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '9px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Mark all students Present for this date"
              >
                <CheckCheck size={15} />
                <span>Mark All Present</span>
              </button>

              <button
                onClick={() => onBatchMark('ABSENT')}
                disabled={loading || records.length === 0}
                style={{
                  background: 'rgba(244, 63, 94, 0.12)',
                  color: '#f43f5e',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: '9px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Mark all students Absent for this date"
              >
                <XCircle size={15} />
                <span>Mark All Absent</span>
              </button>

              <button
                onClick={onOpenAddModal}
                style={{
                  background: 'var(--primary-gradient)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9px',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <UserPlus size={15} />
                <span>Add Student</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportCSV}
            disabled={records.length === 0}
            style={{
              background: 'var(--surface-muted)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Download CSV attendance report"
          >
            <FileDown size={15} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{
              background: 'var(--surface-muted)',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 700
            }}>
              <th style={{ padding: '14px 20px', width: '130px' }}>Roll Number</th>
              <th style={{ padding: '14px 20px' }}>Student Name</th>
              <th style={{ padding: '14px 20px', width: '130px' }}>Status</th>
              <th style={{ padding: '14px 20px', width: '230px' }}>Attendance Action</th>
              <th style={{ padding: '14px 20px' }}>Remarks / Note</th>
              <th style={{ padding: '14px 20px', textAlign: 'right', width: '110px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <HelpCircle size={36} color="var(--text-dim)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>No students found</div>
                  <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>
                    {searchTerm ? 'Try adjusting your search criteria' : 'Click "Add Student" to enroll students into the system.'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((row) => {
                const isSaving = savingRowId === row.studentId;
                const isPresent = row.status === 'PRESENT';
                const isAbsent = row.status === 'ABSENT';
                const isUnmarked = !row.status;

                return (
                  <tr
                    key={row.studentId}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.2s',
                      background: isSaving ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                    }}
                  >
                    {/* Roll Number */}
                    <td style={{ padding: '14px 20px' }}>
                      <span className="font-mono" style={{
                        display: 'inline-block',
                        background: 'var(--surface-muted)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {row.rollNumber}
                      </span>
                    </td>

                    {/* Student Name & Email */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: isPresent ? 'var(--present-bg)' : isAbsent ? 'var(--absent-bg)' : 'var(--surface-muted)',
                          color: isPresent ? '#10b981' : isAbsent ? '#f43f5e' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {row.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                            {row.name}
                          </div>
                          {row.email && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {row.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 20px' }}>
                      {isPresent && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: 'var(--present-bg)',
                          color: '#10b981',
                          border: '1px solid var(--present-border)',
                          borderRadius: '9999px',
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}>
                          <Check size={13} strokeWidth={3} /> Present
                        </span>
                      )}
                      {isAbsent && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: 'var(--absent-bg)',
                          color: '#f43f5e',
                          border: '1px solid var(--absent-border)',
                          borderRadius: '9999px',
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}>
                          <X size={13} strokeWidth={3} /> Absent
                        </span>
                      )}
                      {isUnmarked && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: 'var(--unmarked-bg)',
                          color: '#f59e0b',
                          borderRadius: '9999px',
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}>
                          Unmarked
                        </span>
                      )}
                    </td>

                    {/* Mark Buttons */}
                    <td style={{ padding: '14px 20px' }}>
                      {userRole !== 'ROLE_STUDENT' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleMark(row.studentId, 'PRESENT')}
                            disabled={isSaving}
                            style={{
                              flex: 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '7px 12px',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              background: isPresent ? 'var(--present)' : 'var(--surface-muted)',
                              color: isPresent ? '#ffffff' : 'var(--text-muted)',
                              border: isPresent ? 'none' : '1px solid var(--border-subtle)',
                              boxShadow: isPresent ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Check size={14} /> Present
                          </button>

                          <button
                            onClick={() => handleMark(row.studentId, 'ABSENT')}
                            disabled={isSaving}
                            style={{
                              flex: 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '7px 12px',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              background: isAbsent ? 'var(--absent)' : 'var(--surface-muted)',
                              color: isAbsent ? '#ffffff' : 'var(--text-muted)',
                              border: isAbsent ? 'none' : '1px solid var(--border-subtle)',
                              boxShadow: isAbsent ? '0 2px 8px rgba(244, 63, 94, 0.3)' : 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={14} /> Absent
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Read-only view</span>
                      )}
                    </td>

                    {/* Remarks Input */}
                    <td style={{ padding: '14px 20px' }}>
                      {userRole !== 'ROLE_STUDENT' ? (
                        <input
                          type="text"
                          placeholder="Add note (e.g. sick leave, late)..."
                          value={editingRemarks[row.studentId] !== undefined ? editingRemarks[row.studentId] : (row.remarks || '')}
                          onChange={(e) => handleRemarkChange(row.studentId, e.target.value)}
                          onBlur={() => handleRemarkBlur(row.studentId, row.status)}
                          style={{
                            width: '100%',
                            background: 'var(--surface-solid)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '0.82rem',
                            color: 'var(--text-main)',
                            outline: 'none'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {row.remarks || '-'}
                        </span>
                      )}
                    </td>

                    {/* Actions: View Student History & Delete */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => onViewHistory(row)}
                          style={{
                            background: 'var(--surface-muted)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-main)',
                            borderRadius: '7px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="View Attendance History"
                        >
                          <History size={15} />
                        </button>
                        {userRole !== 'ROLE_STUDENT' && (
                          <button
                            onClick={() => onDeleteStudent(row.studentId, row.name)}
                            style={{
                              background: 'rgba(244, 63, 94, 0.1)',
                              border: '1px solid rgba(244, 63, 94, 0.2)',
                              color: '#f43f5e',
                              borderRadius: '7px',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Delete Student from Roster"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '14px 22px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> students enrolled
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>🟢 Present: <strong>{presentCount}</strong></span>
          <span>🔴 Absent: <strong>{absentCount}</strong></span>
          <span>🟡 Pending: <strong>{unmarkedCount}</strong></span>
        </div>
      </div>
    </div>
  );
}
