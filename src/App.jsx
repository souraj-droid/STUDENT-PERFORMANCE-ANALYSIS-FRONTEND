import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AddStudent from './components/AddStudent';
import Analytics from './components/Analytics';
import Report from './components/Report';
import Subjects from './components/Subjects';
import Timetable from './components/Timetable';
import AllStudents from './components/AllStudents';
import { getToken, getStoredUser, logout } from './services/api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [token, setToken] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = getToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUserRole(storedUser.role === 'ADMIN' ? 'teacher' : 'student');
      setStudentId(storedUser.studentId);
      setUserName(storedUser.studentName);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (loginData) => {
    setIsAuthenticated(true);
    setUserRole(loginData.role);
    setToken(loginData.token);
    setStudentId(loginData.studentId || null);
    setUserName(loginData.userName || loginData.username);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUserRole('');
    setToken('');
    setStudentId(null);
    setUserName('');
    setActiveMenuItem('dashboard');
  };

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  const renderMainContent = () => {
    if (userRole === 'teacher') {
      switch (activeMenuItem) {
        case 'dashboard':
          return <TeacherDashboard token={token} />;
        case 'add-student':
          return <AddStudent token={token} />;
        case 'analytics':
          return <Analytics token={token} userRole={userRole} />;
        case 'reports':
          return <Report token={token} userRole={userRole} />;
        case 'students':
          return <AllStudents token={token} />;
        default:
          return <TeacherDashboard token={token} />;
      }
    } else if (userRole === 'student') {
      switch (activeMenuItem) {
        case 'dashboard':
          return <StudentDashboard token={token} studentId={studentId} />;
        case 'analytics':
          return <Analytics token={token} userRole={userRole} />;
        case 'reports':
          return <Report token={token} userRole={userRole} studentId={studentId} />;
        case 'subjects':
          return <Subjects token={token} />;
        case 'calendar':
          return <Timetable token={token} />;
        default:
          return <StudentDashboard token={token} studentId={studentId} />;
      }
    }
    return null;
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          title="Student Performance Analytics System" 
          userRole={userRole}
          userName={userName}
          onLogout={handleLogout}
        />
        <div className="flex">
          <Sidebar 
            activeItem={activeMenuItem}
            onItemClick={handleMenuItemClick}
            userRole={userRole}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
