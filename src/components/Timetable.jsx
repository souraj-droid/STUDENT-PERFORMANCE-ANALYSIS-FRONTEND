import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { getTimetable } from '../services/api';

const Timetable = ({ token }) => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);

  useEffect(() => {
    fetchTimetable();
  }, [token]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const data = await getTimetable(token);
      setTimetable(data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimetableEntry = (day, hour) => {
    return timetable.find(entry => entry.day === day && entry.hour === hour);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Academic Timetable</h1>
        <p className="text-gray-600 mt-2">View your weekly class schedule</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Day
                </th>
                {hours.map(hour => (
                  <th key={hour} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {hour}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {days.map(day => (
                <tr key={day} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                    {day}
                  </td>
                  {hours.map(hour => {
                    const entry = getTimetableEntry(day, hour);
                    return (
                      <td key={`${day}-${hour}`} className="px-2 py-2 whitespace-nowrap text-center">
                        {entry ? (
                          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-xs">
                            <div className="font-semibold text-indigo-900">{entry.courseCode}</div>
                            <div className="text-indigo-700 mt-1">{entry.section}</div>
                            <div className="text-indigo-600 mt-1 flex items-center justify-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {entry.roomNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Legend
        </h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-indigo-50 border border-indigo-200 rounded mr-2"></div>
            <span className="text-gray-600">Scheduled Class</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border border-gray-200 rounded mr-2"></div>
            <span className="text-gray-600">Free Period</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
