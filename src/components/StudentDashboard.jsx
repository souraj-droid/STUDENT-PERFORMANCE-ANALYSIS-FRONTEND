import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Award, TrendingUp, TrendingDown, BookOpen, Target } from 'lucide-react';
import StudentTable from './StudentTable';
import { getStudentProfile, getStudentPerformances, getStudentGPA, getStudentAnalyticsSummary } from '../services/api';

const StudentDashboard = ({ credentials }) => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [credentials]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use student ID from credentials (e.g., STU001 -> 1)
      const studentId = parseInt(credentials.username.replace('STU', '')) || 1;
      
      const [profileData, performancesData, gpaData, analyticsData] = await Promise.all([
        getStudentProfile(credentials.username, credentials.password, studentId),
        getStudentPerformances(credentials.username, credentials.password, studentId),
        getStudentGPA(credentials.username, credentials.password, studentId),
        getStudentAnalyticsSummary(credentials.username, credentials.password, studentId)
      ]);
      
      setStudentProfile(profileData);
      setPerformances(performancesData);
      setGpa(gpaData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Academic overview cards data
  const academicOverview = [
    {
      title: 'Total Subjects',
      value: performances.length || '0',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'GPA',
      value: gpa?.gpa ? gpa.gpa.toFixed(2) : 'N/A',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Credits',
      value: gpa?.totalCredits || '0',
      icon: TrendingDown,
      color: 'bg-red-500'
    },
    {
      title: 'Average Score',
      value: analytics?.averageScore ? `${Math.round(analytics.averageScore)}%` : 'N/A',
      icon: Award,
      color: 'bg-purple-500'
    }
  ];

  // Marks data from backend
  const marksData = performances.map(perf => ({
    subject: perf.courseName || 'Unknown',
    marks: perf.score || 0,
    grade: perf.grade || 'N/A',
    attendance: 'N/A',
    status: perf.grade === 'F' ? 'Fail' : 'Pass'
  }));

  // Columns for marks table
  const marksColumns = [
    { key: 'subject', header: 'Subject' },
    { key: 'marks', header: 'Marks' },
    { key: 'grade', header: 'Grade' },
    { key: 'attendance', header: 'Attendance' },
    { key: 'status', header: 'Status' }
  ];

  // Performance trend data from actual performances
  const performanceTrend = performances.map((perf, index) => ({
    subject: perf.courseName || `Subject ${index + 1}`,
    score: perf.score || 0
  }));

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your academic overview.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-indigo-600 p-4 rounded-full mr-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{studentProfile?.name || 'Student'}</h2>
              <p className="text-gray-600">Roll No: {studentProfile?.studentId || 'N/A'} | Department: {studentProfile?.department || 'N/A'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg">
              <p className="text-sm">GPA</p>
              <p className="text-3xl font-bold">{gpa?.gpa ? gpa.gpa.toFixed(2) : 'N/A'}</p>
            </div>
            <p className="text-gray-600 mt-2">Credits: {gpa?.totalCredits || '0'}</p>
          </div>
        </div>
      </div>

      {/* Academic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {academicOverview.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Marks Table and Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Marks Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Performance</h3>
          <StudentTable data={marksData} columns={marksColumns} />
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance by Subject</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
        {performances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Target className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">Passed Subjects</h4>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {performances.filter(p => p.grade !== 'F').length} / {performances.length}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-yellow-800">Highest Score</h4>
              </div>
              <p className="text-2xl font-bold text-yellow-700">
                {Math.max(...performances.map(p => p.score || 0))}%
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800">Average Grade</h4>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {analytics?.averageScore ? `${Math.round(analytics.averageScore)}%` : 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No performance data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
