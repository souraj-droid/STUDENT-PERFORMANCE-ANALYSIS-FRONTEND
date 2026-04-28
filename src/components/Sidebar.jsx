import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  BarChart3, 
  FileText, 
  Users,
  BookOpen,
  Calendar
} from 'lucide-react';

const Sidebar = ({ activeItem, onItemClick, userRole }) => {
  const teacherMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-student', label: 'Add Student', icon: UserPlus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'students', label: 'All Students', icon: Users },
  ];

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'My Analytics', icon: BarChart3 },
    { id: 'reports', label: 'My Reports', icon: FileText },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const menuItems = userRole === 'teacher' ? teacherMenuItems : studentMenuItems;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen hidden md:block">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-300 mb-6">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeItem === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
