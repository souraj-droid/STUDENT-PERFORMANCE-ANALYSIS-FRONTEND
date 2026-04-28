import React, { useState, useEffect } from 'react';
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Target, BookOpen } from 'lucide-react';
import ChartCard from './ChartCard';
import { getAllStudents, getAtRiskStudents, getAnalyticsOverview, getCourses } from '../services/api';

const Analytics = ({ token, userRole }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (userRole === 'teacher') {
        const [studentsData, coursesData, atRiskData, analyticsData] = await Promise.all([
          getAllStudents(token),
          getCourses(token),
          getAtRiskStudents(token),
          getAnalyticsOverview(token)
        ]);
        setStudents(studentsData);
        setCourses(coursesData);
        setAtRiskStudents(atRiskData);
        setAnalytics(analyticsData);
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0].name || studentsData[0].studentId);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marks progression based on admission years
  const admissionYears = [...new Set(students.map(s => s.admissionYear))].sort();
  const marksProgression = admissionYears.map(year => ({
    year: year.toString(),
    average: analytics?.averageScore || 0
  }));

  // Subject comparison based on courses
  const subjectComparison = courses.slice(0, 6).map(course => ({
    subject: course.courseName,
    score: analytics?.averageScore || 0,
    fullMark: 100
  }));

  // Recommendations based on at-risk students
  const recommendations = atRiskStudents.length > 0 ? [
    {
      icon: AlertTriangle,
      title: `${atRiskStudents.length} at-risk students need attention`,
      description: 'These students require immediate intervention to improve their performance',
      priority: 'high'
    }
  ] : [
    {
      icon: TrendingUp,
      title: 'Overall performance is good',
      description: analytics?.averageScore ? `Current average score is ${Math.round(analytics.averageScore)}%` : 'No performance data available',
      priority: 'low'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Performance Analytics</h1>
        <p className="text-gray-600 mt-2">Detailed analysis of student academic performance</p>
      </div>

      {/* Student Selection Panel - Only for teachers */}
      {userRole === 'teacher' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {students.map(student => (
                  <option key={student.studentId} value={student.name || student.studentId}>
                    {student.name} ({student.studentId})
                  </option>
                ))}
              </select>
            </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Filter
            </label>
            <div className="flex space-x-2">
              {['monthly', 'semester', 'yearly'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    timeFilter === filter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <div className="bg-indigo-50 p-4 rounded-lg w-full">
              <p className="text-sm text-gray-600">Current Student</p>
              <p className="text-lg font-semibold text-indigo-700">{selectedStudent}</p>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Weak Subject Detection - Show at-risk students */}
      {userRole === 'teacher' && atRiskStudents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
            <p className="font-semibold text-red-800">At-Risk Students Detected ({atRiskStudents.length})</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {atRiskStudents.map((student, index) => (
              <div key={index} className="bg-white p-2 rounded border border-red-200">
                <p className="text-sm font-medium text-gray-800">{student.name}</p>
                <p className="text-xs text-gray-600">GPA: {student.gpa?.toFixed(2) || 'N/A'} | Failed: {student.failedCourses || 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Marks Progression Chart */}
        <ChartCard title="Average Score by Admission Year">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marksProgression}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Subject Comparison Radar Chart */}
        <ChartCard title="Subject Comparison">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={subjectComparison}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full mr-4 ${
                  rec.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    rec.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{rec.description}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    rec.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {rec.priority} priority
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Average Score</p>
          <p className="text-2xl font-bold text-gray-800">{analytics?.averageScore ? `${Math.round(analytics.averageScore)}%` : 'N/A'}</p>
          <p className="text-xs text-green-600">Overall average</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Pass Rate</p>
          <p className="text-2xl font-bold text-gray-800">{analytics?.passRate ? `${Math.round(analytics.passRate)}%` : 'N/A'}</p>
          <p className="text-xs text-gray-500">Students passing</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-gray-800">{students.length || '0'}</p>
          <p className="text-xs text-gray-500">Enrolled students</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">At-Risk Students</p>
          <p className="text-2xl font-bold text-red-600">{atRiskStudents.length || '0'}</p>
          <p className="text-xs text-gray-500">Need attention</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
