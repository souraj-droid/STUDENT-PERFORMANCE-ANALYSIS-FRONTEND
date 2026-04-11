const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to create headers with Basic Auth
const getAuthHeaders = (username, password) => {
  const auth = btoa(`${username}:${password}`);
  return {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`
  };
};

// Authentication
export const authenticate = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(username, password)
    });
    
    if (response.ok) {
      const data = await response.json();
      // Determine role based on username
      let role = 'student';
      if (username === 'admin') {
        role = 'teacher'; // Admin maps to teacher role in frontend
      }
      return { success: true, user: data, role };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Connection failed' };
  }
};

// Admin endpoints
export const getAllStudents = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const createStudent = async (username, password, studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students`, {
      method: 'POST',
      headers: getAuthHeaders(username, password),
      body: JSON.stringify(studentData)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error creating student:', error);
    return null;
  }
};

export const updateStudent = async (username, password, studentId, studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(username, password),
      body: JSON.stringify(studentData)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error updating student:', error);
    return null;
  }
};

export const deleteStudent = async (username, password, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(username, password)
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting student:', error);
    return false;
  }
};

export const getAnalyticsOverview = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/overview`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

export const getAtRiskStudents = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/at-risk`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error fetching at-risk students:', error);
    return [];
  }
};

// Student endpoints
export const getStudentProfile = async (username, password, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/profile/${studentId}`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return null;
  }
};

export const getStudentPerformances = async (username, password, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/performances/${studentId}`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error fetching performances:', error);
    return [];
  }
};

export const getStudentGPA = async (username, password, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/gpa/${studentId}`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching GPA:', error);
    return null;
  }
};

export const getStudentAnalyticsSummary = async (username, password, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/analytics/summary/${studentId}`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return null;
  }
};

export const getCourses = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/courses`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const getTimetable = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/timetable`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return [];
  }
};

export const createReport = async (username, password, reportData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports`, {
      method: 'POST',
      headers: getAuthHeaders(username, password),
      body: JSON.stringify(reportData)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error creating report:', error);
    return null;
  }
};

export const getStudentReports = async (username, password, studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/reports/${studentId}`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching student reports:', error);
    return null;
  }
};

export const getMyReport = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/reports`, {
      headers: getAuthHeaders(username, password)
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching my report:', error);
    return null;
  }
};
