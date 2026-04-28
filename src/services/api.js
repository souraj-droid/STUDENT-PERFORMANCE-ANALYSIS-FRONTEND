const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to create headers with JWT token
const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to create headers with Basic Auth (for login only)
const getBasicAuthHeaders = (username, password) => {
  const auth = btoa(`${username}:${password}`);
  return {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`
  };
};

// Authentication with JWT
export const authenticate = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const data = result.data;
        // Map backend role to frontend role
        const role = data.role === 'ADMIN' ? 'teacher' : 'student';
        
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        return { 
          success: true, 
          user: data, 
          role,
          token: data.token,
          studentId: data.studentId
        };
      }
    }
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Connection failed' };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get stored user
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Admin endpoints
export const getAllStudents = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const createStudent = async (token, studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(studentData)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
    return null;
  } catch (error) {
    console.error('Error creating student:', error);
    return null;
  }
};

export const updateStudent = async (token, studentId, studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(studentData)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
    return null;
  } catch (error) {
    console.error('Error updating student:', error);
    return null;
  }
};

export const deleteStudent = async (token, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting student:', error);
    return false;
  }
};

export const getAnalyticsOverview = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/overview`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

export const getAtRiskStudents = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/at-risk`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching at-risk students:', error);
    return [];
  }
};

// Student endpoints
export const getStudentProfile = async (token, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/profile/${studentId}`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return null;
  }
};

export const getStudentPerformances = async (token, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/performances/${studentId}`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching performances:', error);
    return [];
  }
};

export const getStudentGPA = async (token, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/gpa/${studentId}`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching GPA:', error);
    return null;
  }
};

export const getStudentAnalyticsSummary = async (token, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/summary/${studentId}`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return null;
  }
};

export const getCourses = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/courses`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const getTimetable = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/timetable`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return [];
  }
};

export const createReport = async (token, reportData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(reportData)
    });
    
    // Log response status and headers
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // Get raw text first to see what we're getting
    const rawText = await response.text();
    console.log('Raw response length:', rawText.length);
    console.log('Raw response (first 500 chars):', rawText.substring(0, 500));
    console.log('Raw response (last 500 chars):', rawText.substring(Math.max(0, rawText.length - 500)));
    
    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Full raw response:', rawText);
      return null;
    }
    
    console.log('Parsed response:', result);
    if (response.ok && result.success) {
      return result.data;
    }
    // Log error details
    if (result.errors) {
      console.error('Validation errors:', result.errors);
    }
    if (result.message) {
      console.error('Error message:', result.message);
    }
    return null;
  } catch (error) {
    console.error('Error creating report:', error);
    return null;
  }
};

export const getStudentReports = async (token, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${studentId}`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching student reports:', error);
    return null;
  }
};

export const getMyReport = async (token, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/reports?studentId=${studentId}`, {
      headers: getAuthHeaders(token)
    });
    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching my report:', error);
    return null;
  }
};
