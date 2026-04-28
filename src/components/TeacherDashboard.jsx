import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, CheckCircle, Calendar, Edit, Trash2, Plus } from 'lucide-react';
import ChartCard from './ChartCard';
import StudentTable from './StudentTable';
import EditStudent from './EditStudent';
import { getAllStudents, getAnalyticsOverview, deleteStudent, getCourses } from '../services/api';

const TeacherDashboard = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsData, coursesData, analyticsData] = await Promise.all([
        getAllStudents(token),
        getCourses(token),
        getAnalyticsOverview(token)
      ]);
      setStudents(studentsData);
      setCourses(coursesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (studentId) => {
    setEditingStudent(studentId);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const success = await deleteStudent(credentials.username, credentials.password, studentId);
      if (success) {
        setStudents(students.filter(s => s.id !== studentId));
      } else {
        alert('Failed to delete student');
      }
    }
  };

  const handleBack = () => {
    setEditingStudent(null);
    fetchData();
  };

  // Calculate summary data from backend data
  const summaryData = [
    {
      title: 'Total Students',
      value: students.length || '0',
      icon: Users,
      color: 'bg-blue-500',
      description: 'Enrolled this semester'
    },
    {
      title: 'Average Class Score',
      value: analytics?.averageScore ? `${Math.round(analytics.averageScore)}%` : 'N/A',
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'Across all subjects'
    },
    {
      title: 'Pass Percentage',
      value: analytics?.passRate ? `${Math.round(analytics.passRate)}%` : 'N/A',
      icon: CheckCircle,
      color: 'bg-purple-500',
      description: 'Students passing'
    },
    {
      title: 'Total Courses',
      value: courses.length || '0',
      icon: Calendar,
      color: 'bg-orange-500',
      description: 'Active courses'
    }
  ];

  // Calculate subject-wise data from courses
  const subjectData = courses.map(course => ({
    subject: course.courseName,
    average: analytics?.averageScore || 0
  }));

  // Calculate performance trend based on admission years
  const admissionYears = [...new Set(students.map(s => s.admissionYear))].sort();
  const performanceData = admissionYears.map(year => ({
    year: year.toString(),
    score: analytics?.averageScore || 0
  }));

  // Recent activity based on actual students
  const recentActivity = students.slice(0, 5).map(student => ({
    studentName: `${student.firstName} ${student.lastName}`,
    activity: `Enrolled in ${student.department}`,
    time: `${student.admissionYear}`,
    type: 'student'
  }));

  const activityColumns = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'activity', label: 'Activity' },
    { key: 'time', label: 'Time' }
  ];

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

  if (editingStudent) {
    return <EditStudent credentials={credentials} studentId={editingStudent} onBack={handleBack} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your class performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map((card, index) => {
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
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Subject-wise Average Marks */}
        <ChartCard title="Subject-wise Average Marks">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Class Performance Trend */}
        <ChartCard title="Class Performance by Admission Year">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <StudentTable data={recentActivity} columns={activityColumns} />
      </div>

      {/* Student List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Student List</h3>
          <button
            onClick={() => window.location.href = '#add-student'}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </button>
        </div>
        
        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No students enrolled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.studentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(student.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
