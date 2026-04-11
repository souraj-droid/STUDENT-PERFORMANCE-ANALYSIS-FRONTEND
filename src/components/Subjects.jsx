import React, { useState, useEffect } from 'react';
import { BookOpen, MapPin, Calendar, Clock } from 'lucide-react';
import { getCourses } from '../services/api';

const Subjects = ({ credentials }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [credentials]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses(credentials.username, credentials.password);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
        <p className="text-gray-600 mt-2">View all available courses and subjects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{course.courseName}</h3>
                <p className="text-sm text-gray-600 font-mono">{course.courseCode}</p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span>Room: {course.room || 'N/A'}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>Section: {course.section || 'N/A'}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>Semester: {course.semester}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                <span>Credits: {course.credits}</span>
              </div>

              {course.academicYear && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Year: {course.academicYear}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {course.department}
              </span>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No subjects available</p>
        </div>
      )}
    </div>
  );
};

export default Subjects;
