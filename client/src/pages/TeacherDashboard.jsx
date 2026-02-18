import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, BookOpen, Award, TrendingUp, Clock, 
  MapPin, Mail, Phone, Calendar, ChevronRight, AlertTriangle,
  CheckCircle, XCircle, Download, Search, RefreshCw,
  Activity, Target, Shield, GraduationCap, UserPlus, 
  FileText, Settings, LogOut, Menu, X, Bell, Home, 
  BarChart3, PieChart as PieIcon, Star, TrendingDown, 
  ThumbsUp, Eye, EyeOff, Flame, CloudRain, Wind,
  Edit, Trash2, Save, Check, ChevronLeft, ChevronDown, 
  MoreVertical, MessageCircle, UserCheck, UserX, School
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api";

// Color palette for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  
  // ========== STATE MANAGEMENT ==========
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [myClass, setMyClass] = useState([]);
  const [classStats, setClassStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageScore: 0,
    completionRate: 0,
    presentToday: 0,
    drillsCompleted: 0
  });
  const [upcomingDrills, setUpcomingDrills] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [attendanceMarking, setAttendanceMarking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);
const [recommendedDrills, setRecommendedDrills] = useState([]);
const [cityRiskProfiles, setCityRiskProfiles] = useState({});
const [riskSummary, setRiskSummary] = useState({});
const [studentCities, setStudentCities] = useState([]);
  
  // ========== DEBUG LOGS ==========
  console.log('🔍 [TeacherDashboard] Component mounted');
  console.log('🔍 [TeacherDashboard] API_URL:', API_URL);
  console.log('🔍 [TeacherDashboard] localStorage token:', localStorage.getItem('token'));
  console.log('🔍 [TeacherDashboard] localStorage role:', localStorage.getItem('role'));

  // ========== AUTH & NAVIGATION ==========
  const handleLogout = () => {
    console.log('🔍 [TeacherDashboard] Logging out');
    localStorage.clear();
    navigate("/auth");
  };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== 'teacher') {
      console.log('🔍 [TeacherDashboard] ❌ Not authenticated as teacher');
      navigate("/auth");
      return;
    }
    
    console.log('🔍 [TeacherDashboard] ✅ Authentication OK, fetching data...');
    fetchTeacherData();
    fetchMyClass();
    fetchUpcomingDrills();
    fetchRecentActivities();
    fetchRecommendedDrills();

  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  // ========== API CALLS ==========
  const fetchTeacherData = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get(`${API_URL}/teacher/dashboard`, { headers });
      console.log('🔍 [TeacherDashboard] Teacher data:', response.data);

      if (response.data?.success) {
        setTeacher(response.data.data.teacher);
      }
    } catch (error) {
      console.error("🔍 [TeacherDashboard] Error fetching teacher data:", error);
    }
  };

  const fetchMyClass = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get(`${API_URL}/teacher/my-class`, { headers });
      console.log('🔍 [TeacherDashboard] Class data:', response.data);

      if (response.data?.success) {
        setMyClass(response.data.data.students || []);
        setClassStats(response.data.data.stats || {
          totalStudents: response.data.data.students?.length || 0,
          activeStudents: response.data.data.students?.filter(s => s.isActive).length || 0,
          averageScore: response.data.data.stats?.averageScore || 0,
          completionRate: response.data.data.stats?.completionRate || 0,
          presentToday: response.data.data.students?.filter(s => s.present).length || 0,
          drillsCompleted: response.data.data.stats?.drillsCompleted || 0
        });
      }
    } catch (error) {
      console.error("🔍 [TeacherDashboard] Error fetching class:", error);
      setError("Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingDrills = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get(`${API_URL}/teacher/drills/upcoming`, { headers });
      console.log('🔍 [TeacherDashboard] Upcoming drills:', response.data);

      if (response.data?.success) {
        setUpcomingDrills(response.data.data || []);
      }
    } catch (error) {
      console.error("🔍 [TeacherDashboard] Error fetching drills:", error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get(`${API_URL}/teacher/recent-activities`, { headers });
      console.log('🔍 [TeacherDashboard] Recent activities:', response.data);

      if (response.data?.success) {
        setRecentActivities(response.data.data || []);
      }
    } catch (error) {
      console.error("🔍 [TeacherDashboard] Error fetching activities:", error);
      // Set mock data if API fails
      setRecentActivities([
        { id: 1, type: 'quiz', description: '5 students completed the Earthquake Quiz', time: '2 hours ago' },
        { id: 2, type: 'drill', description: 'Fire drill completed with 95% participation', time: '1 day ago' },
        { id: 3, type: 'achievement', description: '3 students earned new badges', time: '2 days ago' }
      ]);
    }
  };
// Add this with your other API calls (around line 150-180)
const fetchRecommendedDrills = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.get(`${API_URL}/teacher/recommended-drills`, { headers });
    
    if (response.data?.success) {
      setRecommendedDrills(response.data.data.recommendedDrills || []);
      setCityRiskProfiles(response.data.data.cityRiskProfiles || {});
      setRiskSummary(response.data.data.riskSummary || {});
      setStudentCities(response.data.data.studentCities || []);
    }
  } catch (error) {
    console.error('Error fetching recommended drills:', error);
  }
};

// Add schedule drill function
const scheduleRecommendedDrill = async (drillData) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.post(`${API_URL}/teacher/schedule-drill`, drillData, { headers });
    
    if (response.data?.success) {
      showNotification('Drill scheduled successfully!', 'success');
      fetchRecommendedDrills(); // Refresh recommendations
      fetchUpcomingDrills(); // Refresh upcoming drills
    }
  } catch (error) {
    console.error('Error scheduling drill:', error);
    showNotification('Failed to schedule drill', 'error');
  }
};
  const markAttendance = async (studentId, present) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      await axios.post(`${API_URL}/teacher/attendance`, {
        studentId,
        present,
        date: new Date().toISOString()
      }, { headers });

      // Update local state
      setMyClass(prev => prev.map(s => 
        s._id === studentId ? { ...s, present } : s
      ));
      
      showNotification(`Attendance marked for student`, 'success');
    } catch (error) {
      console.error("🔍 [TeacherDashboard] Error marking attendance:", error);
      showNotification('Failed to mark attendance', 'error');
    }
  };

  const markAllAttendance = async (present) => {
    try {
      setAttendanceMarking(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      await axios.post(`${API_URL}/teacher/attendance/bulk`, {
        present,
        date: new Date().toISOString()
      }, { headers });

      // Update all students
      setMyClass(prev => prev.map(s => ({ ...s, present })));
      showNotification(`All students marked as ${present ? 'present' : 'absent'}`, 'success');
    } catch (error) {
      console.error("🔍 [TeacherDashboard] Error marking bulk attendance:", error);
      showNotification('Failed to mark attendance', 'error');
    } finally {
      setAttendanceMarking(false);
    }
  };

  const startDrill = (drillId, type) => {
    navigate(`/teacher/drill/${drillId}`, { state: { type } });
  };

  const viewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const sendMessageToParent = async (studentId, message) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      await axios.post(`${API_URL}/teacher/message-parent`, {
        studentId,
        message
      }, { headers });

      showNotification('Message sent to parent', 'success');
    } catch (error) {
      console.error("🔍 [TeacherDashboard] Error sending message:", error);
      showNotification('Failed to send message', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, time: 'Just now' }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // ========== FILTER STUDENTS ==========
  const filteredStudents = useMemo(() => {
    if (!myClass.length) return [];
    
    return myClass.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [myClass, searchTerm]);

  // ========== CHART DATA ==========
  const performanceData = myClass.slice(0, 10).map(student => ({
    name: student.name?.split(' ')[0] || 'Student',
    score: student.progress?.totalScore || 0,
    attendance: student.present ? 100 : 0
  }));

  const classDistribution = [
    { name: 'Above 90%', value: myClass.filter(s => (s.progress?.totalScore || 0) >= 90).length },
    { name: '80-90%', value: myClass.filter(s => {
      const score = s.progress?.totalScore || 0;
      return score >= 80 && score < 90;
    }).length },
    { name: '70-80%', value: myClass.filter(s => {
      const score = s.progress?.totalScore || 0;
      return score >= 70 && score < 80;
    }).length },
    { name: 'Below 70%', value: myClass.filter(s => (s.progress?.totalScore || 0) < 70).length }
  ].filter(item => item.value > 0);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={fetchMyClass} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        teacherName={teacher?.name}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <Header 
          teacher={teacher}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          onRefresh={fetchMyClass}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
        />

        {/* Main Content Area */}
        <div className="px-6 py-8">
          {activeTab === 'overview' && (
            <OverviewTab 
              stats={classStats}
              teacher={teacher}
              upcomingDrills={upcomingDrills}
              recentActivities={recentActivities}
              performanceData={performanceData}
              classDistribution={classDistribution}
              onStartDrill={startDrill}
            />
          )}

          {activeTab === 'students' && (
            <StudentsTab 
              students={filteredStudents}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onViewStudent={viewStudent}
              onMarkAttendance={markAttendance}
              onMarkAllAttendance={markAllAttendance}
              attendanceMarking={attendanceMarking}
            />
          )}

          {activeTab === 'drills' && (
            <DrillsTab 
              drills={upcomingDrills}
              onStartDrill={startDrill}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab 
              students={myClass}
              stats={classStats}
              performanceData={performanceData}
              classDistribution={classDistribution}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesTab 
              students={myClass}
              onSendMessage={sendMessageToParent}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              teacher={teacher}
              onUpdate={fetchTeacherData}
            />
          )}
          {activeTab === 'drill-recommendations' && (
            <DrillRecommendationsTab
              recommendedDrills={recommendedDrills}
              cityRiskProfiles={cityRiskProfiles}
              riskSummary={riskSummary}
              studentCities={studentCities}
              onScheduleDrill={scheduleRecommendedDrill}
            />
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {showStudentModal && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setShowStudentModal(false)}
          onMarkAttendance={markAttendance}
          onSendMessage={sendMessageToParent}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

/* ======================= SIDEBAR COMPONENT ======================= */
const Sidebar = ({ isOpen, onClose, activeTab, onTabChange, onLogout, teacherName }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'drills', label: 'Drills', icon: Shield },
     { id: 'drill-recommendations', label: 'Drill Recommendations', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-white/10 z-50
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Teacher Panel</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Teacher Info */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-400">Welcome,</p>
            <p className="text-white font-semibold">{teacherName || 'Teacher'}</p>
          </div>

          {/* Menu items */}
          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${activeTab === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

/* ======================= HEADER COMPONENT ======================= */
const Header = ({ 
  teacher, 
  onMenuClick, 
  onLogout, 
  notifications, 
  showNotifications, 
  setShowNotifications,
  onRefresh,
  onSearch,
  searchTerm
}) => (
  <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {teacher?.name || 'Teacher Dashboard'}
              </h2>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <School className="w-3 h-3" />
                Class {teacher?.classTeacher?.grade}{teacher?.classTeacher?.section} • {teacher?.subject}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors relative"
            >
              <Bell className="w-5 h-5 text-white" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
                <div className="p-4 border-b border-white/10">
                  <h4 className="text-white font-semibold">Notifications</h4>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-4 hover:bg-white/5 border-b border-white/10">
                        <p className="text-sm text-white">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-red-400 hover:text-red-300"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
);

/* ======================= LOADING & ERROR SCREENS ======================= */
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <GraduationCap className="w-8 h-8 text-green-500" />
      </div>
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-xl font-semibold text-white">Loading Dashboard</h3>
      <p className="text-gray-400 mt-2">Fetching your class data...</p>
    </div>
  </div>
);

const ErrorScreen = ({ error, onRetry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="bg-red-500/10 rounded-full p-4 mb-6">
      <AlertTriangle className="w-12 h-12 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-white">Oops! Something went wrong</h3>
    <p className="text-gray-400 mt-2 max-w-md text-center">{error}</p>
    <button
      onClick={onRetry}
      className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 transition-all"
    >
      <RefreshCw className="w-5 h-5" />
      Try Again
    </button>
  </div>
);

/* ======================= OVERVIEW TAB ======================= */
const OverviewTab = ({ stats, teacher, upcomingDrills, recentActivities, performanceData, classDistribution, onStartDrill }) => {
  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:bg-gray-800 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 bg-gradient-to-br ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {teacher?.name}! 👋
            </h2>
            <p className="text-green-100">
              Class {teacher?.classTeacher?.grade}{teacher?.classTeacher?.section} • {teacher?.subject}
            </p>
          </div>
          <GraduationCap className="w-16 h-16 text-white opacity-50" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="from-blue-600 to-blue-400"
          change={5}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          color="from-green-600 to-green-400"
          change={stats.presentToday > 0 ? 8 : 0}
        />
        <StatCard
          title="Avg. Score"
          value={`${Math.round(stats.averageScore)}%`}
          icon={Target}
          color="from-purple-600 to-purple-400"
          change={3}
        />
        <StatCard
          title="Drills Completed"
          value={stats.drillsCompleted}
          icon={Shield}
          color="from-orange-600 to-orange-400"
          change={12}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Performance Chart */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Student Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="score" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Distribution */}
        {classDistribution.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-400" />
              Performance Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: 'white'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Drill Alert */}
      {upcomingDrills.length > 0 && (
        <div className="bg-yellow-600/20 border border-yellow-500 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-white font-semibold">Upcoming Drill!</h3>
                <p className="text-sm text-gray-300">
                  {upcomingDrills[0].type} Drill at {upcomingDrills[0].time}
                </p>
              </div>
            </div>
            <button
              onClick={() => onStartDrill(upcomingDrills[0]._id, upcomingDrills[0].type)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
            >
              Start Now
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.description}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ======================= STUDENTS TAB ======================= */
const StudentsTab = ({ 
  students, 
  searchTerm, 
  setSearchTerm, 
  onViewStudent, 
  onMarkAttendance,
  onMarkAllAttendance,
  attendanceMarking 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Students</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onMarkAllAttendance(true)}
            disabled={attendanceMarking}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Mark All Present
          </button>
          <button
            onClick={() => onMarkAllAttendance(false)}
            disabled={attendanceMarking}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-sm flex items-center gap-2"
          >
            <UserX className="w-4 h-4" />
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Students Grid */}
      {students.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Students Found</h3>
          <p className="text-gray-400">No students match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onView={() => onViewStudent(student)}
              onMarkAttendance={(present) => onMarkAttendance(student._id, present)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StudentCard = ({ student, onView, onMarkAttendance }) => {
  const score = student.progress?.totalScore || 0;
  const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {student.name?.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold">{student.name}</h4>
            <p className="text-sm text-gray-400">Roll No: {student.rollNumber}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${scoreColor} bg-opacity-20`}>
          {score}%
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{student.email}</span>
        </div>
        {student.parentPhone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{student.parentPhone}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onMarkAttendance(true)}
          className="flex-1 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm font-medium"
        >
          Present
        </button>
        <button
          onClick={() => onMarkAttendance(false)}
          className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium"
        >
          Absent
        </button>
        <button
          onClick={onView}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ======================= DRILLS TAB ======================= */
const DrillsTab = ({ drills, onStartDrill }) => {
  const getDrillIcon = (type) => {
    switch(type) {
      case 'Earthquake': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Fire': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Flood': return <CloudRain className="w-5 h-5 text-blue-400" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Upcoming Drills</h2>

      {drills.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-12 text-center">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Drills</h3>
          <p className="text-gray-400">Check back later for scheduled drills.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {drills.map((drill) => (
            <div
              key={drill._id}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-700 rounded-xl">
                    {getDrillIcon(drill.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{drill.type} Drill</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(drill.scheduledDate).toLocaleDateString()} at {drill.time}
                    </p>
                    {drill.location && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {drill.location}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onStartDrill(drill._id, drill.type)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                >
                  Start Drill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ======================= ANALYTICS TAB ======================= */
const AnalyticsTab = ({ students, stats, performanceData, classDistribution }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Class Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Class Average</p>
          <h3 className="text-3xl font-bold text-white">{Math.round(stats.averageScore)}%</h3>
          <span className="text-xs text-green-400">↑ 3% vs last month</span>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Completion Rate</p>
          <h3 className="text-3xl font-bold text-white">{Math.round(stats.completionRate)}%</h3>
          <span className="text-xs text-green-400">↑ 5% vs last month</span>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Attendance Rate</p>
          <h3 className="text-3xl font-bold text-white">
            {students.length ? Math.round((stats.presentToday / students.length) * 100) : 0}%
          </h3>
          <span className="text-xs text-yellow-400">Today's attendance</span>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Student Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Bar dataKey="score" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Chart */}
      {classDistribution.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Performance Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {classDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

/* ======================= MESSAGES TAB ======================= */
const MessagesTab = ({ students, onSendMessage }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!selectedStudent || !message.trim()) return;
    onSendMessage(selectedStudent._id, message);
    setMessage('');
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Message Parents</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 md:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Students</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {students.map((student) => (
              <button
                key={student._id}
                onClick={() => setSelectedStudent(student)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedStudent?._id === student._id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700/30 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <p className="font-medium">{student.name}</p>
                <p className="text-sm opacity-75">{student.parentPhone || 'No phone'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Message Compose */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 md:col-span-2">
          {selectedStudent ? (
            <>
              <h3 className="text-lg font-semibold text-white mb-4">
                Message to {selectedStudent.name}'s Parent
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="6"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 mb-4"
                placeholder="Type your message here..."
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50"
                >
                  Send Message
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a student to send a message to their parent.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ======================= SETTINGS TAB ======================= */
const SettingsTab = ({ teacher, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Settings saved!' });
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <div className="flex gap-2 border-b border-gray-700 pb-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Name</label>
                <input
                  type="text"
                  defaultValue={teacher?.name}
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={teacher?.email}
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Phone</label>
                <input
                  type="text"
                  defaultValue={teacher?.phone}
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Subject</label>
                <input
                  type="text"
                  defaultValue={teacher?.subject}
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ======================= STUDENT DETAIL MODAL ======================= */
const StudentDetailModal = ({ student, onClose, onMarkAttendance, onSendMessage, formatDate }) => {
  const [message, setMessage] = useState('');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Student Profile</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {student.name?.charAt(0)}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white">{student.name}</h4>
              <p className="text-gray-400">Roll No: {student.rollNumber}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-2xl text-white">{student.progress?.totalScore || 0}%</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Badges</p>
              <p className="text-2xl text-white">{student.progress?.badges?.length || 0}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Contact Information</h4>
            <p className="text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4" /> {student.email}
            </p>
            {student.parentPhone && (
              <p className="text-gray-300 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Parent: {student.parentPhone}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={() => onMarkAttendance(student._id, true)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Mark Present
            </button>
            <button
              onClick={() => onMarkAttendance(student._id, false)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Mark Absent
            </button>
          </div>

          {/* Quick Message */}
          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-white font-semibold mb-3">Send Message to Parent</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white mb-3"
              placeholder="Type your message..."
            />
            <button
              onClick={() => {
                onSendMessage(student._id, message);
                setMessage('');
              }}
              disabled={!message.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
const formatDate = (dateString) => {
  if (!dateString) return "Not provided";
  const parsed = new Date(dateString);
  if (isNaN(parsed.getTime())) return "Not provided";
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
/* ======================= DRILL RECOMMENDATIONS TAB ======================= */
const DrillRecommendationsTab = ({ 
  recommendedDrills, 
  cityRiskProfiles, 
  riskSummary,
  onScheduleDrill,
  studentCities 
}) => {
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [duration, setDuration] = useState(15);

  const handleSchedule = () => {
    if (selectedDrill && scheduleDate && scheduleTime) {
      onScheduleDrill({
        drillType: selectedDrill.type,
        scheduledDate: scheduleDate,
        time: scheduleTime,
        duration: duration,
        notes: `Recommended drill for ${selectedDrill.affectedCities?.join(', ')}`
      });
      setShowScheduleModal(false);
      setSelectedDrill(null);
      setScheduleDate('');
      setScheduleTime('');
    }
  };

  const getRiskBadge = (riskLevel) => {
    switch(riskLevel) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'moderate': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Total Students</p>
          <h3 className="text-3xl font-bold text-white">{riskSummary?.totalStudents || 0}</h3>
          <p className="text-xs text-gray-400 mt-1">Across {riskSummary?.cities || 0} cities</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">High Risk Students</p>
          <h3 className="text-3xl font-bold text-red-400">{riskSummary?.highRiskStudents || 0}</h3>
          <p className="text-xs text-gray-400 mt-1">Need priority attention</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Cities Represented</p>
          <h3 className="text-3xl font-bold text-blue-400">{studentCities?.length || 0}</h3>
          <p className="text-xs text-gray-400 mt-1">Different risk profiles</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Recommended Drills</p>
          <h3 className="text-3xl font-bold text-green-400">{recommendedDrills?.length || 0}</h3>
          <p className="text-xs text-gray-400 mt-1">Based on city risks</p>
        </div>
      </div>

      {/* Risk Distribution */}
      {riskSummary?.riskDistribution && Object.keys(riskSummary.riskDistribution).length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution in Your Class</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(riskSummary.riskDistribution).map(([disaster, data]) => (
              <div key={disaster} className="p-4 bg-gray-700/30 rounded-lg">
                <p className="text-gray-400 text-sm">{disaster}</p>
                <p className="text-2xl font-bold text-white">{data.count}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getRiskBadge(data.riskLevel)}`}>
                  {data.riskLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Drills */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recommended Drills for Your Class</h3>
        
        {!recommendedDrills || recommendedDrills.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No drill recommendations available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendedDrills.map((drill, index) => (
              <div key={index} className="p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-semibold text-white">{drill.type} Drill</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBadge(drill.riskLevel)}`}>
                        {drill.riskLevel?.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      Affected cities: {drill.affectedCities?.join(', ') || 'All cities'}
                    </p>
                    <p className="text-gray-400 text-sm mb-2">
                      Students affected: {drill.studentCount || 0} students
                    </p>
                    <p className="text-gray-400 text-sm">
                      Recommended frequency: {drill.frequency || 'Monthly'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDrill(drill);
                      setShowScheduleModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Schedule Drill
                  </button>
                </div>

                {/* Objectives */}
                {drill.objectives && drill.objectives.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white text-sm font-medium mb-2">Drill Objectives:</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {drill.objectives.map((obj, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success Criteria */}
                {drill.successCriteria && Object.keys(drill.successCriteria).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-white text-sm font-medium mb-2">Success Criteria:</p>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(drill.successCriteria).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-sm text-green-400">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && selectedDrill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Schedule {selectedDrill.type} Drill
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  min="5"
                  max="60"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                />
              </div>

              <div className="bg-blue-600/20 p-4 rounded-xl">
                <p className="text-sm text-blue-400">
                  This drill is recommended for students from: {selectedDrill.affectedCities?.join(', ') || 'your class'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Based on {selectedDrill.riskLevel} risk level in their cities
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!scheduleDate || !scheduleTime}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeacherDashboard;