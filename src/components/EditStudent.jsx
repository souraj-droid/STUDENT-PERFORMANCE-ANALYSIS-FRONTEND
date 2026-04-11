import React, { useState, useEffect } from 'react';
import { UserPlus, Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { updateStudent, getAllStudents } from '../services/api';

const EditStudent = ({ credentials, studentId, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    department: '',
    email: '',
    admissionYear: new Date().getFullYear(),
    semester: 'Fall'
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, [studentId, credentials]);

  const fetchStudentData = async () => {
    try {
      const students = await getAllStudents(credentials.username, credentials.password);
      const student = students.find(s => s.id === studentId);
      if (student) {
        setFormData({
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          studentId: student.studentId || '',
          department: student.department || '',
          email: student.email || '',
          admissionYear: student.admissionYear || new Date().getFullYear(),
          semester: student.semester || 'Fall'
        });
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.admissionYear) newErrors.admissionYear = 'Admission year is required';
    if (!formData.semester.trim()) newErrors.semester = 'Semester is required';
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      try {
        const result = await updateStudent(credentials.username, credentials.password, studentId, formData);
        if (result) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            onBack();
          }, 2000);
        } else {
          alert('Failed to update student. Please try again.');
        }
      } catch (error) {
        console.error('Error updating student:', error);
        alert('Failed to update student. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleReset = () => {
    fetchStudentData();
    setErrors({});
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Student List
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Student</h1>
        <p className="text-gray-600 mt-2">Update student information and academic details</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">Student updated successfully!</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Details Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">👤</span> Student Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.studentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter student ID (e.g., STU003)"
                  disabled
                />
                {errors.studentId && (
                  <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter department"
                />
                {errors.department && (
                  <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission Year *
                </label>
                <input
                  type="number"
                  name="admissionYear"
                  value={formData.admissionYear}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.admissionYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter admission year"
                />
                {errors.admissionYear && (
                  <p className="text-red-500 text-xs mt-1">{errors.admissionYear}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.semester ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select semester</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
                {errors.semester && (
                  <p className="text-red-500 text-xs mt-1">{errors.semester}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
