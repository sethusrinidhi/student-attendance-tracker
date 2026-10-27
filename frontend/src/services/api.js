const API_BASE = '/api';

export const authStorage = {
  getToken: () => localStorage.getItem('attend_token'),
  setToken: (token) => localStorage.setItem('attend_token', token),
  removeToken: () => localStorage.removeItem('attend_token'),
  getUser: () => {
    try {
      const u = localStorage.getItem('attend_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem('attend_user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('attend_user'),
  clear: () => {
    localStorage.removeItem('attend_token');
    localStorage.removeItem('attend_user');
  }
};

export const savedAccountsStorage = {
  getAccounts: () => {
    try {
      const raw = localStorage.getItem('attend_saved_accounts');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  saveAccount: (account) => {
    try {
      const accs = savedAccountsStorage.getAccounts();
      const filtered = accs.filter(a => a.username.toLowerCase() !== account.username.toLowerCase());
      const updated = [{
        username: account.username,
        password: account.password || '',
        fullName: account.fullName,
        role: account.role,
        email: account.email
      }, ...filtered].slice(0, 8);
      localStorage.setItem('attend_saved_accounts', JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
  removeAccount: (username) => {
    try {
      const accs = savedAccountsStorage.getAccounts();
      const updated = accs.filter(a => a.username.toLowerCase() !== username.toLowerCase());
      localStorage.setItem('attend_saved_accounts', JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  }
};

async function apiRequest(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || (response.status === 401 ? 'Session expired. Please log in again.' : 'Request failed');
    if (response.status === 401) {
      authStorage.clear();
      window.dispatchEvent(new Event('auth-logout'));
    }
    throw new Error(errorMsg);
  }

  return data?.data !== undefined ? data.data : data;
}

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res?.token) {
      authStorage.setToken(res.token);
      const userObj = {
        id: res.id,
        username: res.username,
        email: res.email,
        fullName: res.fullName,
        role: res.role
      };
      authStorage.setUser(userObj);
      savedAccountsStorage.saveAccount({ ...userObj, password });
    }
    return res;
  },

  register: async (userData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res?.token) {
      authStorage.setToken(res.token);
      const userObj = {
        id: res.id,
        username: res.username,
        email: res.email,
        fullName: res.fullName,
        role: res.role
      };
      authStorage.setUser(userObj);
      savedAccountsStorage.saveAccount({ ...userObj, password: userData.password });
    }
    return res;
  },

  getCurrentUser: () => apiRequest('/auth/me'),

  // Students
  getStudents: (search = '') => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/students${q}`);
  },

  addStudent: (studentData) => apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(studentData)
  }),

  deleteStudent: (id) => apiRequest(`/students/${id}`, {
    method: 'DELETE'
  }),

  // Attendance
  getAttendanceForDate: (date) => {
    const q = date ? `?date=${date}` : '';
    return apiRequest(`/attendance${q}`);
  },

  markAttendance: (studentId, date, status, remarks = '') => apiRequest('/attendance', {
    method: 'POST',
    body: JSON.stringify({ studentId, date, status, remarks })
  }),

  batchMarkAttendance: (date, items) => apiRequest('/attendance/batch', {
    method: 'POST',
    body: JSON.stringify({ date, items })
  }),

  getAttendanceSummary: (date) => {
    const q = date ? `?date=${date}` : '';
    return apiRequest(`/attendance/summary${q}`);
  },

  getStudentHistory: (studentId) => apiRequest(`/attendance/student/${studentId}`),
};
