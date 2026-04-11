import React, { useState } from 'react';
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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (loginData) => {
    setIsAuthenticated(true);
    setUserRole(loginData.role);
    setCredentials({ username: loginData.username, password: loginData.password });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setActiveMenuItem('dashboard');
  };

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  const renderMainContent = () => {
    if (userRole === 'teacher') {
      switch (activeMenuItem) {
        case 'dashboard':
          return <TeacherDashboard credentials={credentials} />;
        case 'add-student':
          return <AddStudent credentials={credentials} />;
        case 'analytics':
          return <Analytics credentials={credentials} userRole={userRole} />;
        case 'reports':
          return <Report credentials={credentials} userRole={userRole} />;
        case 'students':
          return <AllStudents credentials={credentials} />;
        default:
          return <TeacherDashboard credentials={credentials} />;
      }
    } else if (userRole === 'student') {
      switch (activeMenuItem) {
        case 'dashboard':
          return <StudentDashboard credentials={credentials} />;
        case 'analytics':
          return <Analytics credentials={credentials} userRole={userRole} />;
        case 'reports':
          return <Report credentials={credentials} userRole={userRole} />;
        case 'subjects':
          return <Subjects credentials={credentials} />;
        case 'calendar':
          return <Timetable credentials={credentials} />;
        default:
          return <StudentDashboard credentials={credentials} />;
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
          onLogout={handleLogout}
        />
        <div className="flex">
          <Sidebar 
            activeItem={activeMenuItem}
            onItemClick={handleMenuItemClick}
            userRole={userRole}
          />
          <main className="flex-1">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
