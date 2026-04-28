import React, { useState, useEffect } from 'react';
import { User, Download, Printer, CheckCircle, XCircle, TrendingUp, Calendar, Plus, Save } from 'lucide-react';
import StudentTable from './StudentTable';
import { getAllStudents, createReport, getMyReport } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Report = ({ token, userRole, studentId }) => {
  const [view, setView] = useState('list'); // 'list', 'add', 'view'
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Teacher: Form state for adding report
  const [reportForm, setReportForm] = useState({
    studentId: '',
    name: '',
    rollNo: '',
    class: '',
    academicYear: '2024-2025',
    overallPercentage: '',
    grade: '',
    subjects: []
  });

  // Error state
  const [errorMessage, setErrorMessage] = useState('');

  // Student: Report data
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (userRole === 'teacher') {
      fetchStudents();
    } else {
      fetchStudentReport();
    }
  }, [userRole, token, studentId]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudents(token);
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentReport = async () => {
    setLoading(true);
    try {
      if (!studentId) {
        console.error('No studentId available');
        return;
      }
      const data = await getMyReport(token, studentId);
      if (data) {
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching student report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = () => {
    setReportForm({
      ...reportForm,
      subjects: [
        ...reportForm.subjects,
        { subject: '', midterm: '', final: '', assignment: '', practical: '', total: '', grade: '' }
      ]
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...reportForm.subjects];
    updatedSubjects[index][field] = value;
    
    // Calculate total
    if (field !== 'total') {
      const midterm = parseFloat(updatedSubjects[index].midterm) || 0;
      const final = parseFloat(updatedSubjects[index].final) || 0;
      const assignment = parseFloat(updatedSubjects[index].assignment) || 0;
      const practical = parseFloat(updatedSubjects[index].practical) || 0;
      updatedSubjects[index].total = ((midterm + final + assignment + practical) / 4).toFixed(2);
    }
    
    setReportForm({ ...reportForm, subjects: updatedSubjects });
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = reportForm.subjects.filter((_, i) => i !== index);
    setReportForm({ ...reportForm, subjects: updatedSubjects });
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    // Generate 6 random subjects
    const randomSubjects = [
      { subject: 'Mathematics', midterm: '', final: '', assignment: '', practical: '', total: '', grade: '' },
      { subject: 'Physics', midterm: '', final: '', assignment: '', practical: '', total: '', grade: '' },
      { subject: 'Chemistry', midterm: '', final: '', assignment: '', practical: '', total: '', grade: '' },
      { subject: 'Computer Science', midterm: '', final: '', assignment: '', practical: '', total: '', grade: '' },
      { subject: 'English', midterm: '', final: '', assignment: '', practical: '', total: '', grade: '' },
      { subject: 'Economics', midterm: '', final: '', assignment: '', practical: '', total: '', grade: '' }
    ];
    setReportForm({
      ...reportForm,
      studentId: student.id,
      name: `${student.firstName} ${student.lastName}`,
      rollNo: student.studentId,
      class: student.department,
      academicYear: student.admissionYear + '-' + (student.admissionYear + 1),
      subjects: randomSubjects
    });
  };

  const handleSubmitReport = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Map form data to backend DTO format
      const reportData = {
        studentId: reportForm.studentId,
        name: reportForm.name,
        rollNo: reportForm.rollNo,
        classSection: reportForm.class,
        academicYear: reportForm.academicYear,
        overallPercentage: reportForm.overallPercentage,
        grade: reportForm.grade,
        subjects: reportForm.subjects.map(subject => ({
          subject: subject.subject,
          midterm: parseFloat(subject.midterm) || 0,
          finalExam: parseFloat(subject.final) || 0,
          assignment: parseFloat(subject.assignment) || 0,
          practical: parseFloat(subject.practical) || 0,
          total: parseFloat(subject.total) || 0,
          grade: subject.grade
        }))
      };

      console.log('Sending report data:', reportData);
      const result = await createReport(token, reportData);
      if (result) {
        alert('Report saved successfully!');
        setView('list');
        setReportForm({
          studentId: '',
          name: '',
          rollNo: '',
          class: '',
          academicYear: '2024-2025',
          overallPercentage: '',
          grade: '',
          subjects: []
        });
      } else {
        setErrorMessage('Failed to save report. Please check the browser console for details.');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      setErrorMessage('Error saving report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Teacher view: List students to create report for
  if (userRole === 'teacher' && view === 'list') {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Reports</h1>
          <p className="text-gray-600 mt-2">Select a student to create or view their report</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No students available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.semester}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => {
                              handleStudentSelect(student);
                              setView('add');
                            }}
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            Create Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Teacher view: Add report form
  if (userRole === 'teacher' && view === 'add') {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <button
            onClick={() => setView('list')}
            className="text-indigo-600 hover:text-indigo-800 mb-4"
          >
            ← Back to Students
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Create Report</h1>
          <p className="text-gray-600 mt-2">Add performance report for {reportForm.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={reportForm.name}
                onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
              <input
                type="text"
                value={reportForm.rollNo}
                onChange={(e) => setReportForm({ ...reportForm, rollNo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <input
                type="text"
                value={reportForm.class}
                onChange={(e) => setReportForm({ ...reportForm, class: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <input
                type="text"
                value={reportForm.academicYear}
                onChange={(e) => setReportForm({ ...reportForm, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Percentage</label>
              <input
                type="text"
                value={reportForm.overallPercentage}
                onChange={(e) => setReportForm({ ...reportForm, overallPercentage: e.target.value })}
                placeholder="e.g., 82.8%"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                value={reportForm.grade}
                onChange={(e) => setReportForm({ ...reportForm, grade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Grade</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Subject Marks</h3>
              <button
                onClick={handleAddSubject}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </button>
            </div>

            {reportForm.subjects.map((subject, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject.subject}
                      onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Midterm</label>
                    <input
                      type="number"
                      value={subject.midterm}
                      onChange={(e) => handleSubjectChange(index, 'midterm', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final</label>
                    <input
                      type="number"
                      value={subject.final}
                      onChange={(e) => handleSubjectChange(index, 'final', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignment</label>
                    <input
                      type="number"
                      value={subject.assignment}
                      onChange={(e) => handleSubjectChange(index, 'assignment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Practical</label>
                    <input
                      type="number"
                      value={subject.practical}
                      onChange={(e) => handleSubjectChange(index, 'practical', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                    <input
                      type="text"
                      value={subject.total}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <select
                      value={subject.grade}
                      onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select</option>
                      <option value="A">A</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="F">F</option>
                    </select>
                  </div>
                </div>
                {reportForm.subjects.length > 1 && (
                  <button
                    onClick={() => handleRemoveSubject(index)}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Subject
                  </button>
                )}
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">Error:</p>
              <p>{errorMessage}</p>
              <p className="text-sm mt-1">Check browser console (F12 → Console) for more details.</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setView('list')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReport}
              disabled={loading}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Report'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student view: Display their report
  if (userRole === 'student') {
    if (!reportData) {
      return (
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="text-center py-12">
            <p className="text-gray-500">No report available yet. Please contact your teacher.</p>
          </div>
        </div>
      );
    }

    const marksColumns = [
      { key: 'subject', label: 'Subject' },
      { key: 'midterm', label: 'Midterm' },
      { key: 'final', label: 'Final' },
      { key: 'assignment', label: 'Assignment' },
      { key: 'practical', label: 'Practical' },
      { key: 'total', label: 'Total' },
      { 
        key: 'grade', 
        label: 'Grade',
        render: (value) => (
          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
            value === 'A' ? 'bg-green-100 text-green-700' :
            value === 'B+' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {value}
          </span>
        )
      }
    ];

    const handlePrint = () => {
      window.print();
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Academic Report</h1>
            <p className="text-gray-600 mt-2">Your performance report</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-indigo-600 p-4 rounded-full mr-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{reportData.name}</h2>
                <p className="text-gray-600">
                  Roll No: {reportData.rollNo} | Class: {reportData.class} | 
                  Academic Year: {reportData.academicYear}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg">
                <p className="text-sm">Overall Performance</p>
                <p className="text-2xl font-bold">{reportData.overallPercentage}</p>
                <p className="text-lg">Grade: {reportData.grade}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Marks Breakdown</h3>
          <StudentTable data={reportData.subjects} columns={marksColumns} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Visualization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.subjects}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="midterm" fill="#3b82f6" name="Midterm" />
              <Bar dataKey="final" fill="#10b981" name="Final" />
              <Bar dataKey="assignment" fill="#f59e0b" name="Assignment" />
              <Bar dataKey="practical" fill="#8b5cf6" name="Practical" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <p>Loading...</p>
    </div>
  );
};

export default Report;
