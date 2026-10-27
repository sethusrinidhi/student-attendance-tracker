import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import DateSelector from './components/DateSelector';
import AttendanceTable from './components/AttendanceTable';
import AddStudentModal from './components/AddStudentModal';
import StudentHistoryModal from './components/StudentHistoryModal';
import AuthView from './components/AuthView';
import StudentPortal from './components/StudentPortal';
import { api, authStorage } from './services/api';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [theme, setTheme] = useState(() => localStorage.getItem('attend_theme') || 'light');
  
  // Date State: Defaults to Today in YYYY-MM-DD
  const getTodayDateStr = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());

  // Attendance & Roster State
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [historyStudent, setHistoryStudent] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync theme attribute to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('attend_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Listen for auth-logout custom events
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      addToast('Session ended. Please log in again.', 'info');
    };
    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  // Fetch Attendance Records & Summary whenever selectedDate or user changes
  const loadAttendance = useCallback(async (date) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getAttendanceForDate(date);
      if (data) {
        setRecords(data.records || []);
        setSummary(data.summary || null);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch attendance data', 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role !== 'ROLE_STUDENT') {
      loadAttendance(selectedDate);
    }
  }, [selectedDate, user, loadAttendance]);

  // Handle Date Change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Auth Handlers
  const handleLogin = async (username, password) => {
    const res = await api.login(username, password);
    const loggedInUser = {
      id: res.id,
      username: res.username,
      email: res.email,
      fullName: res.fullName,
      role: res.role
    };
    setUser(loggedInUser);
    addToast(`Welcome back, ${loggedInUser.fullName || loggedInUser.username}!`, 'success');
  };

  const handleRegister = async (userData) => {
    const res = await api.register(userData);
    const registeredUser = {
      id: res.id,
      username: res.username,
      email: res.email,
      fullName: res.fullName,
      role: res.role
    };
    setUser(registeredUser);
    addToast(`Account created successfully! Welcome, ${registeredUser.fullName}!`, 'success');
  };

  const handleLogout = () => {
    authStorage.clear();
    setUser(null);
    setRecords([]);
    setSummary(null);
    addToast('Logged out successfully', 'info');
  };

  const handleQuickLogin = async (u, p) => {
    try {
      await handleLogin(u, p);
    } catch (e) {
      addToast(e.message || 'Quick login failed', 'error');
    }
  };

  // Mark Single Attendance
  const handleMarkAttendance = async (studentId, status, remarks = '') => {
    try {
      const updatedRow = await api.markAttendance(studentId, selectedDate, status, remarks);
      
      // Update local state smoothly
      setRecords(prev => prev.map(r => r.studentId === studentId ? {
        ...r,
        status: updatedRow.status,
        remarks: updatedRow.remarks,
        markedBy: updatedRow.markedBy,
        updatedAt: updatedRow.updatedAt
      } : r));

      // Refresh summary
      const updatedSummary = await api.getAttendanceSummary(selectedDate);
      setSummary(updatedSummary);

      addToast(`Marked ${updatedRow.name} as ${status} for ${selectedDate}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update attendance', 'error');
    }
  };

  // Batch Mark (All Present or All Absent)
  const handleBatchMark = async (status) => {
    if (records.length === 0) return;
    try {
      const items = records.map(r => ({
        studentId: r.studentId,
        status: status,
        remarks: r.remarks || (status === 'PRESENT' ? 'Session attended' : 'Absent')
      }));

      const response = await api.batchMarkAttendance(selectedDate, items);
      if (response) {
        setRecords(response.records || []);
        setSummary(response.summary || null);
      }
      addToast(`Marked all students as ${status} for ${selectedDate}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to batch update attendance', 'error');
    }
  };

  // Add Student Handler
  const handleAddStudent = async (studentData) => {
    const created = await api.addStudent(studentData);
    addToast(`Student ${created.name} (${created.rollNumber}) added to roster!`, 'success');
    // Reload attendance list to include new student
    loadAttendance(selectedDate);
  };

  // Delete Student Handler
  const handleDeleteStudent = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to remove "${studentName}" from the roster? This will also remove their attendance records.`)) {
      try {
        await api.deleteStudent(studentId);
        addToast(`Removed ${studentName} from roster`, 'info');
        loadAttendance(selectedDate);
      } catch (err) {
        addToast(err.message || 'Failed to remove student', 'error');
      }
    }
  };

  // If not logged in, render the sleek Auth View
  if (!user) {
    return (
      <div className="animate-fade-in">
        <AuthView onLogin={handleLogin} onRegister={handleRegister} />
        {/* Floating Toast Container */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <AlertTriangle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', color: '#ffffff', marginLeft: 'auto', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const existingRollNumbers = records.map(r => r.rollNumber);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1360px', width: '100%', margin: '0 auto' }}>
        {user.role === 'ROLE_STUDENT' ? (
          /* Student Portal View */
          <StudentPortal user={user} />
        ) : (
          /* Trainer & Admin Attendance Management View */
          <div className="animate-fade-in">
            {/* Date Selector Header */}
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              loading={loading}
            />

            {/* Attendance Metrics & Totals */}
            <StatsCards
              summary={summary}
              selectedDate={selectedDate}
            />

            {/* Attendance Roster Table */}
            <AttendanceTable
              records={records}
              selectedDate={selectedDate}
              loading={loading}
              userRole={user.role}
              onMarkAttendance={handleMarkAttendance}
              onBatchMark={handleBatchMark}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onViewHistory={(student) => setHistoryStudent(student)}
              onDeleteStudent={handleDeleteStudent}
            />
          </div>
        )}
      </main>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStudent={handleAddStudent}
        existingRollNumbers={existingRollNumbers}
      />

      {/* Student History Modal */}
      <StudentHistoryModal
        isOpen={!!historyStudent}
        onClose={() => setHistoryStudent(null)}
        student={historyStudent}
      />

      {/* Floating Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <AlertTriangle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: '#ffffff', marginLeft: 'auto', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
