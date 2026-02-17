import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  Users, School, BookOpen, Award, TrendingUp, Clock, 
  MapPin, Mail, Phone, Calendar, ChevronRight, AlertTriangle,
  CheckCircle, XCircle, Download, Filter, Search, RefreshCw,
  Activity, Target, Shield, Globe, Sun, CloudRain, Wind,
  GraduationCap, UserPlus, FileText, Settings, LogOut,
  Menu, X, Bell, Home, BarChart3, PieChart as PieIcon,
  Star, TrendingDown, ThumbsUp, Eye, EyeOff, Flame,
  DownloadCloud, Printer, Share2, Filter as FilterIcon,
  Edit, Trash2, Plus, Save, AlertCircle,
  Check, ChevronLeft, ChevronDown, MoreVertical
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api";

// Color palette for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  
  // ========== DEBUG LOGS ==========
  console.log('🔍 [OrganizationDashboard] Component mounted');
  console.log('🔍 [OrganizationDashboard] API_URL:', API_URL);
  console.log('🔍 [OrganizationDashboard] localStorage token:', localStorage.getItem('token'));
  console.log('🔍 [OrganizationDashboard] localStorage role:', localStorage.getItem('role'));
  // ================================
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [drills, setDrills] = useState([]);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    totalStudents: 0,
    activeStudents: 0,
    totalClasses: 0,
    totalDrills: 0,
    completedDrills: 0,
    completionRate: 0,
    averageScore: 0,
    totalBadges: 0,
    preparednessScore: 0
  });
  const [organization, setOrganization] = useState({});
  const [studentsByClass, setStudentsByClass] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [upcomingDrills, setUpcomingDrills] = useState([]);
  
  // UI State
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [teacherDetail, setTeacherDetail] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [disasterAlerts, setDisasterAlerts] = useState([]);
  const [showCreateDrillModal, setShowCreateDrillModal] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('red');
  const [sendingAlert, setSendingAlert] = useState(false);

  const [newDrill, setNewDrill] = useState({
    type: 'Earthquake',
    scheduledDate: '',
    time: '',
    duration: 60,
    expectedParticipants: '',
    location: '',
    notes: ''
  });

  // ========== FIXED NAVIGATION ==========
  
  // Handle logout - redirect to auth (role selection)
  const handleLogout = () => {
    console.log('🔍 [OrganizationDashboard] Logging out');
    localStorage.clear();
    navigate("/auth");
  };

  // Check authentication on mount
  useEffect(() => {
    console.log('🔍 [OrganizationDashboard] useEffect running');
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    console.log('🔍 [OrganizationDashboard] Token:', token ? 'Present' : 'Missing');
    console.log('🔍 [OrganizationDashboard] Role:', role);
    console.log('🔍 [OrganizationDashboard] Condition check:', {
      noToken: !token,
      wrongRole: role !== 'organization',
      willRedirect: !token || role !== 'organization'
    });
    
    if (!token || role !== 'organization') {
      console.log('🔍 [OrganizationDashboard] ❌ Redirecting to /auth - authentication failed');
      navigate("/auth");
      return;
    }
    
    console.log('🔍 [OrganizationDashboard] ✅ Authentication OK, fetching data...');
    fetchDashboardData();
    fetchTeachers();
    fetchStudents();
    fetchDrills();
    fetchDisasterAlerts();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log('🔍 [OrganizationDashboard] Getting auth headers, token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('🔍 [OrganizationDashboard] No token in getAuthHeaders, redirecting');
      navigate("/auth");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, time: 'Just now' }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // REAL API CALLS
  const fetchDashboardData = async () => {
    console.log('🔍 [OrganizationDashboard] Fetching dashboard data...');
    try {
      setLoading(true);
      setError(null);

      const headers = getAuthHeaders();
      if (!headers) return;

      const url = `${API_URL}/organizations/dashboard`;
      console.log('🔍 [OrganizationDashboard] Fetching from:', url);
      
      const response = await axios.get(url, { headers });
      
      console.log('🔍 [OrganizationDashboard] Dashboard response:', response.data);

      if (response.data?.success) {
        const data = response.data.data;
        setDashboardData(data);
        setOrganization(data.organization || {});
        setStats({
          ...data.stats,
          preparednessScore: calculatePreparednessScore(data)
        });
        setStudentsByClass(data.studentsByClass || []);
        setRecentActivities(data.recentActivities || []);
        setRecentRegistrations(data.recentRegistrations || []);
        setUpcomingDrills(data.upcomingDrills || []);
        console.log('🔍 [OrganizationDashboard] Dashboard data set successfully');
      }
    } catch (error) {
      console.error("🔍 [OrganizationDashboard] Dashboard error:", error);
      if (error.response?.status === 401) {
        console.log('🔍 [OrganizationDashboard] 401 error, clearing storage and redirecting');
        localStorage.clear();
        navigate("/auth");
      } else {
        setError(error.response?.data?.message || "Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculatePreparednessScore = (data) => {
    const teacherScore = (data.stats?.activeTeachers / (data.stats?.totalTeachers || 1)) * 30 || 0;
    const studentScore = (data.stats?.completionRate / 100) * 40 || 0;
    const drillScore = (data.stats?.completedDrills / Math.max(data.stats?.totalDrills, 1)) * 30 || 0;
    return Math.round(teacherScore + studentScore + drillScore);
  };

  // const fetchTeachers = async () => {
  //   console.log('🔍 [OrganizationDashboard] Fetching teachers...');
  //   try {
  //     const headers = getAuthHeaders();
  //     if (!headers) return;
      
  //     const url = `${API_URL}/organizations/teachers`;
  //     console.log('🔍 [OrganizationDashboard] Fetching teachers from:', url);
      
  //     const response = await axios.get(url, { headers });
  //     console.log('🔍 [OrganizationDashboard] Teachers response:', response.data);
      
  //     if (response.data?.success) {
  //       setTeachers(response.data.data || []);
  //       console.log(`🔍 [OrganizationDashboard] Set ${response.data.data?.length} teachers`);
  //     }
  //   } catch (error) {
  //     console.error("🔍 [OrganizationDashboard] Error fetching teachers:", error);
  //   }
  // };

  // const fetchStudents = async () => {
  //   console.log('🔍 [OrganizationDashboard] Fetching students...');
  //   try {
  //     const headers = getAuthHeaders();
  //     if (!headers) return;
      
  //     const url = `${API_URL}/organizations/students`;
  //     console.log('🔍 [OrganizationDashboard] Fetching students from:', url);
      
  //     const response = await axios.get(url, { headers });
  //     console.log('🔍 [OrganizationDashboard] Students response:', response.data);
      
  //     if (response.data?.success) {
  //       setStudents(response.data.data || []);
  //       console.log(`🔍 [OrganizationDashboard] Set ${response.data.data?.length} students`);
  //     }
  //   } catch (error) {
  //     console.error("🔍 [OrganizationDashboard] Error fetching students:", error);
  //   }
  // };

  const fetchTeachers = async () => {
  console.log('🔍 [OrganizationDashboard] Fetching teachers...');
  try {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    const url = `${API_URL}/organizations/teachers`;
    console.log('🔍 [OrganizationDashboard] Fetching teachers from:', url);
    
    const response = await axios.get(url, { headers });
    console.log('🔍 [OrganizationDashboard] Teachers response:', response.data);
    
    if (response.data?.success) {
      // DEBUG: Log the first teacher to see its structure
      if (response.data.data && response.data.data.length > 0) {
        console.log('🔍 [OrganizationDashboard] First teacher structure:', JSON.stringify(response.data.data[0], null, 2));
      }
      setTeachers(response.data.data || []);
      console.log(`🔍 [OrganizationDashboard] Set ${response.data.data?.length} teachers`);
    }
  } catch (error) {
    console.error("🔍 [OrganizationDashboard] Error fetching teachers:", error);
  }
};

const fetchStudents = async () => {
  console.log('🔍 [OrganizationDashboard] Fetching students...');
  try {
    const headers = getAuthHeaders();
    if (!headers) return;
    
    const url = `${API_URL}/organizations/students`;
    console.log('🔍 [OrganizationDashboard] Fetching students from:', url);
    
    const response = await axios.get(url, { headers });
    console.log('🔍 [OrganizationDashboard] Students response:', response.data);
    
    if (response.data?.success) {
      // DEBUG: Log the first student to see its structure
      if (response.data.data && response.data.data.length > 0) {
        console.log('🔍 [OrganizationDashboard] First student structure:', JSON.stringify(response.data.data[0], null, 2));
      }
      setStudents(response.data.data || []);
      console.log(`🔍 [OrganizationDashboard] Set ${response.data.data?.length} students`);
    }
  } catch (error) {
    console.error("🔍 [OrganizationDashboard] Error fetching students:", error);
  }
};

  const fetchDrills = async () => {
    console.log('🔍 [OrganizationDashboard] Fetching drills...');
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      
      const url = `${API_URL}/organizations/drills`;
      console.log('🔍 [OrganizationDashboard] Fetching drills from:', url);
      
      const response = await axios.get(url, { headers });
      console.log('🔍 [OrganizationDashboard] Drills response:', response.data);
      
      if (response.data?.success) {
        setDrills(response.data.data || []);
        console.log(`🔍 [OrganizationDashboard] Set ${response.data.data?.length} drills`);
      }
    } catch (error) {
      console.error("🔍 [OrganizationDashboard] Error fetching drills:", error);
    }
  };
  

  const fetchDisasterAlerts = async () => {
    console.log('🔍 [OrganizationDashboard] Fetching disaster alerts...');
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      
      const url = `${API_URL}/organizations/alerts`;
      console.log('🔍 [OrganizationDashboard] Fetching alerts from:', url);
      
      const response = await axios.get(url, { headers });
      console.log('🔍 [OrganizationDashboard] Alerts response:', response.data);
      
      if (response.data?.success) {
        setDisasterAlerts(response.data.data || []);
        console.log(`🔍 [OrganizationDashboard] Set ${response.data.data?.length} alerts`);
      }
    } catch (error) {
      console.error("🔍 [OrganizationDashboard] Failed to fetch disaster alerts:", error);
    }
  };

  const fetchTeacherStudents = async (teacherId) => {
    console.log(`🔍 [OrganizationDashboard] Fetching students for teacher: ${teacherId}`);
    try {
      setLoadingStudents(true);
      const headers = getAuthHeaders();
      if (!headers) return;
      
      const url = `${API_URL}/organizations/teacher/${teacherId}/students`;
      console.log('🔍 [OrganizationDashboard] Fetching from:', url);
      
      const response = await axios.get(url, { headers });
      console.log('🔍 [OrganizationDashboard] Teacher students response:', response.data);
      
      if (response.data?.success) {
        setTeacherStudents(response.data.data || []);
        console.log(`🔍 [OrganizationDashboard] Set ${response.data.data?.length} students for teacher`);
      }
    } catch (err) {
      console.error("🔍 [OrganizationDashboard] Teacher students fetch error:", err);
      setTeacherStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Alert Broadcast Function
  const sendAlert = async () => {
    if (!alertMessage.trim()) {
      setFormError("Please enter an alert message");
      return;
    }

    try {
      setSendingAlert(true);
      setFormError('');
      
      const headers = getAuthHeaders();
      if (!headers) return;

      const url = `${API_URL}/organizations/alerts/broadcast`;
      console.log('🔍 [OrganizationDashboard] Sending alert to:', url);
      console.log('🔍 [OrganizationDashboard] Alert data:', { message: alertMessage, severity: alertSeverity });

      await axios.post(
        url,
        {
          message: alertMessage,
          severity: alertSeverity,
          recipients: 'all'
        },
        { headers }
      );

      showNotification('Alert sent successfully!');
      setAlertMessage('');
      setShowNotifications(false);
      setFormError('');
    } catch (error) {
      console.error("🔍 [OrganizationDashboard] Error sending alert:", error);
      setFormError('Failed to send alert');
    } finally {
      setSendingAlert(false);
    }
  };

  // Drill CRUD Operations
  const createDrill = async (drillData) => {
    console.log('🔍 [OrganizationDashboard] Creating drill:', drillData);
    try {
      setFormSubmitting(true);
      setFormError('');
      
      const headers = getAuthHeaders();
      if (!headers) return;

      const url = `${API_URL}/dashboard/organization/drills`;
      console.log('🔍 [OrganizationDashboard] Creating drill at:', url);

      const response = await axios.post(url, drillData, { headers });
      console.log('🔍 [OrganizationDashboard] Create drill response:', response.data);

      if (response.data?.success) {
        await fetchDrills();
        await fetchDashboardData();
        setShowCreateDrillModal(false);
        setNewDrill({
          type: 'Earthquake', scheduledDate: '', time: '', duration: 60,
          expectedParticipants: '', location: '', notes: ''
        });
        showNotification('Drill scheduled successfully!');
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      console.error("🔍 [OrganizationDashboard] Error creating drill:", error);
      const errorMsg = error.response?.data?.message || 'Failed to schedule drill';
      setFormError(errorMsg);
      showNotification(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setFormSubmitting(false);
    }
  };

  const updateDrillStatus = async (drillId, status) => {
    console.log(`🔍 [OrganizationDashboard] Updating drill ${drillId} to ${status}`);
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const url = `${API_URL}/dashboard/organization/drills/${drillId}`;
      console.log('🔍 [OrganizationDashboard] Updating at:', url);

      const response = await axios.patch(url, { status }, { headers });
      console.log('🔍 [OrganizationDashboard] Update response:', response.data);

      if (response.data?.success) {
        await fetchDrills();
        showNotification(`Drill marked as ${status}!`);
      }
    } catch (error) {
      console.error("🔍 [OrganizationDashboard] Error updating drill:", error);
      showNotification('Failed to update drill', 'error');
    }
  };

  const exportData = async (format = 'json') => {
    console.log(`🔍 [OrganizationDashboard] Exporting data as ${format}`);
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const url = `${API_URL}/organizations/export?format=${format}`;
      console.log('🔍 [OrganizationDashboard] Exporting from:', url);

      const response = await axios.get(url, { headers, responseType: 'blob' });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', `dashboard-export-${new Date().toISOString()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showNotification('Data exported successfully!');
    } catch (error) {
      console.error("🔍 [OrganizationDashboard] Export error:", error);
      showNotification('Failed to export data', 'error');
    }
  };

  const handleTeacherClick = (teacher) => {
    console.log('🔍 [OrganizationDashboard] Teacher clicked:', teacher);
    setSelectedTeacher(teacher);
    fetchTeacherStudents(teacher._id);
  };

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

  // Filter teachers based on search
  const filteredTeachers = useMemo(() => {
    if (!teachers.length) return [];
    
    return teachers.filter(teacher => {
      const matchesSearch = searchTerm === '' || 
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'active' && teacher.isActive) ||
        (filterStatus === 'inactive' && !teacher.isActive);
      
      const matchesClass = selectedClass === 'all' ||
        teacher.classTeacher?.grade?.toString() === selectedClass;
      
      return matchesSearch && matchesFilter && matchesClass;
    });
  }, [teachers, searchTerm, filterStatus, selectedClass]);

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!students.length) return [];
    
    return students.filter(student => {
      const matchesSearch = searchTerm === '' ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [students, searchTerm]);

  if (loading) {
    console.log('🔍 [OrganizationDashboard] Rendering loading screen');
    return <LoadingScreen />;
  }

  if (error) {
    console.log('🔍 [OrganizationDashboard] Rendering error screen:', error);
    return <ErrorScreen error={error} onRetry={fetchDashboardData} />;
  }

  console.log('🔍 [OrganizationDashboard] Rendering dashboard with data');

  // Prepare chart data from real data
  const classDistributionData = studentsByClass.map(item => ({
    name: `Class ${item._id?.grade || ''}${item._id?.section || ''}`,
    students: item.count || 0
  }));

  const teacherPerformanceData = teachers.slice(0, 5).map(teacher => ({
    name: teacher.name?.split(' ')[0] || 'Teacher',
    students: teacher.studentCount || 0,
    performance: teacher.performanceScore || 0
  }));

  const drillStatusData = [
    { name: 'Scheduled', value: drills.filter(d => d.status === 'scheduled').length },
    { name: 'Completed', value: drills.filter(d => d.status === 'completed').length },
    { name: 'Cancelled', value: drills.filter(d => d.status === 'cancelled').length }
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <Header 
          organization={organization}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          onExport={() => exportData('json')}
          onRefresh={fetchDashboardData}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
        />

        {/* Disaster Alerts Banner */}
        {disasterAlerts.length > 0 && (
          <DisasterAlertBanner alerts={disasterAlerts} />
        )}

        {/* Main Content Area */}
        <div className="px-6 py-8">
          {activeTab === 'overview' && (
            <OverviewTab 
              stats={stats}
              organization={organization}
              classDistributionData={classDistributionData}
              teacherPerformanceData={teacherPerformanceData}
              drillStatusData={drillStatusData}
              teachers={teachers}
              students={students}
              drills={drills}
              recentActivities={recentActivities}
              recentRegistrations={recentRegistrations}
              upcomingDrills={upcomingDrills}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersTab 
              teachers={filteredTeachers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              classOptions={studentsByClass}
              onTeacherClick={handleTeacherClick}
              onTeacherDetail={setTeacherDetail}
            />
          )}

          {activeTab === 'students' && (
            <StudentsTab 
              students={filteredStudents}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab 
              stats={stats}
              studentsByClass={studentsByClass}
              teachers={teachers}
              students={students}
              drills={drills}
            />
          )}

          {activeTab === 'drills' && (
            <DrillsTab 
              drills={drills}
              upcomingDrills={upcomingDrills}
              showCreateModal={showCreateDrillModal}
              setShowCreateModal={setShowCreateDrillModal}
              newDrill={newDrill}
              setNewDrill={setNewDrill}
              onCreateDrill={createDrill}
              onUpdateStatus={updateDrillStatus}
              formSubmitting={formSubmitting}
              formError={formError}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab 
              stats={stats}
              teachers={teachers}
              students={students}
              drills={drills}
              onExport={exportData}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              organization={organization}
              onUpdate={fetchDashboardData}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedTeacher && (
        <TeacherStudentsModal
          teacher={selectedTeacher}
          students={teacherStudents}
          loading={loadingStudents}
          onClose={() => setSelectedTeacher(null)}
        />
      )}

      {teacherDetail && (
        <TeacherDetailModal
          teacher={teacherDetail}
          onClose={() => setTeacherDetail(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

/* ======================= LOADING & ERROR SCREENS ======================= */

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Shield className="w-8 h-8 text-blue-500" />
      </div>
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-xl font-semibold text-white">Loading Dashboard</h3>
      <p className="text-gray-400 mt-2">Fetching your organization data...</p>
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
      className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-all"
    >
      <RefreshCw className="w-5 h-5" />
      Try Again
    </button>
  </div>
);

/* ======================= HEADER COMPONENT ======================= */

const Header = ({ 
  organization, 
  onMenuClick, 
  onLogout, 
  notifications, 
  showNotifications, 
  setShowNotifications,
  onExport,
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
            <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {organization.name || 'Organization Dashboard'}
              </h2>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {organization.location?.city || 'City'}, {organization.location?.state || 'State'}
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
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Alert Button */}
          <button
            onClick={() => setShowNotifications(true)}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-2 text-white"
            title="Send Emergency Alert"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="hidden md:inline">Alert</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-white/10 overflow-hidden hidden group-hover:block z-50">
              <button
                onClick={() => onExport('json')}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors"
              >
                Export as JSON
              </button>
              <button
                onClick={() => onExport('csv')}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors"
              >
                Export as CSV
              </button>
              <button
                onClick={() => onExport('pdf')}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors"
              >
                Export as PDF
              </button>
            </div>
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

/* ======================= SIDEBAR COMPONENT ======================= */

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'drills', label: 'Drills', icon: Shield },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-white/10 z-50
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DisasterEd</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5 text-white" />
            </button>
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
                      ? 'bg-blue-600 text-white'
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

/* ======================= DISASTER ALERT BANNER ======================= */

const DisasterAlertBanner = ({ alerts }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-500 animate-pulse';
      case 'high': return 'bg-red-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity) => {
    switch(severity) {
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH';
      case 'moderate': return 'MODERATE';
      case 'low': return 'LOW';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="px-6 mt-4">
      <div className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-red-500/30 rounded-2xl p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          
          <div className="flex-1">
            <h4 className="text-white font-semibold">Active Disaster Alerts</h4>
            <div className="flex flex-wrap gap-4 mt-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full">
                  <span className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                  <span className="text-sm font-medium text-white">
                    {getSeverityText(alert.severity)}
                  </span>
                  <span className="text-sm text-white">
                    {alert.type} - {alert.location}
                  </span>
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ======================= OVERVIEW TAB ======================= */

const OverviewTab = ({ 
  stats, 
  organization, 
  classDistributionData, 
  teacherPerformanceData,
  drillStatusData,
  teachers,
  students,
  drills,
  recentActivities,
  recentRegistrations,
  upcomingDrills
}) => {
  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:bg-gray-800 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
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
      {/* Preparedness Score Card */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Institution Preparedness Score</p>
            <h2 className="text-4xl font-bold text-white">{stats.preparednessScore}%</h2>
            <p className="text-blue-100 mt-1">Your school is {stats.preparednessScore >= 80 ? 'well prepared' : stats.preparednessScore >= 60 ? 'moderately prepared' : 'needs improvement'}</p>
          </div>
          <Shield className="w-16 h-16 text-white opacity-50" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon={Users}
          color="from-blue-600 to-blue-400"
          change={stats.totalStudents > 0 ? 12 : 0}
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers || 0}
          icon={GraduationCap}
          color="from-green-600 to-green-400"
          change={stats.totalTeachers > 0 ? 8 : 0}
        />
        <StatCard
          title="Active Classes"
          value={stats.totalClasses || 0}
          icon={School}
          color="from-purple-600 to-purple-400"
        />
        <StatCard
          title="Drills Completed"
          value={stats.completedDrills || 0}
          icon={Target}
          color="from-orange-600 to-orange-400"
          change={stats.completedDrills > 0 ? 15 : 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Distribution */}
        {classDistributionData.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-400" />
              Class Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    dataKey="students"
                  >
                    {classDistributionData.map((entry, index) => (
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

        {/* Teacher Performance */}
        {teacherPerformanceData.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Top Teachers by Students
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teacherPerformanceData}>
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
                  <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Drill Status */}
      {drillStatusData.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Drill Status Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={drillStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {drillStatusData.map((entry, index) => (
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

      {/* Recent Activity & Upcoming Drills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Recent Activity
            </h3>
          </div>
          
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {activity.description?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No recent activities</p>
          )}
        </div>

        {/* Upcoming Drills */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Upcoming Drills
            </h3>
          </div>
          
          {upcomingDrills.length > 0 ? (
            <div className="space-y-4">
              {upcomingDrills.slice(0, 5).map((drill) => (
                <div key={drill._id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      drill.type === 'Earthquake' ? 'bg-red-500/20' :
                      drill.type === 'Fire' ? 'bg-orange-500/20' :
                      drill.type === 'Flood' ? 'bg-blue-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{drill.type} Drill</p>
                      <p className="text-sm text-gray-400">
                        {new Date(drill.scheduledDate).toLocaleDateString()} at {drill.time}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    {drill.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No upcoming drills</p>
          )}
        </div>
      </div>

      {/* Recent Registrations */}
      {recentRegistrations.length > 0 && (
  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
      <UserPlus className="w-5 h-5 text-green-400" />
      Recent Student Registrations
    </h3>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
            <th className="pb-3">Name</th>
            <th className="pb-3">Roll No</th>
            <th className="pb-3">Class</th>
            <th className="pb-3">Registered On</th>
          </tr>
        </thead>
        <tbody>
          {recentRegistrations.map((student) => (
            <tr key={student._id} className="border-b border-gray-700/50">
              <td className="py-3 text-white">{student.name}</td>
              <td className="py-3 text-gray-300">{student.rollNumber}</td>
              <td className="py-3 text-gray-300">{student.class?.section}</td> {/* ← ERROR HERE */}
              <td className="py-3 text-gray-300">
                {new Date(student.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
    </div>
  );
};

/* ======================= TEACHERS TAB ======================= */

/* ======================= TEACHERS TAB ======================= */

const TeachersTab = ({
  teachers,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  selectedClass,
  setSelectedClass,
  classOptions,
  onTeacherClick,
  onTeacherDetail
}) => {
  // Debug: Log what classOptions actually contains
  console.log('🔍 [TeachersTab] classOptions received:', classOptions);

  // Safely process classOptions to ensure we have strings for the select options
  const processedClassOptions = useMemo(() => {
    if (!classOptions || !Array.isArray(classOptions)) return [];
    
    return classOptions.map(option => {
      // If option is an object with _id that has grade/section
      if (option?._id && typeof option._id === 'object') {
        const grade = option._id.grade || '';
        const section = option._id.section || '';
        return {
          value: grade,
          label: `Class ${grade}${section}`
        };
      }
      // If option is an object directly with grade/section
      else if (option && typeof option === 'object') {
        const grade = option.grade || option._id?.grade || '';
        const section = option.section || option._id?.section || '';
        return {
          value: grade,
          label: `Class ${grade}${section}`
        };
      }
      // If option is already a string/number
      else {
        return {
          value: String(option),
          label: `Class ${option}`
        };
      }
    }).filter(opt => opt.value); // Remove empty values
  }, [classOptions]);

  console.log('🔍 [TeachersTab] Processed class options:', processedClassOptions);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Teachers Directory</h2>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search teachers by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Classes</option>
              {processedClassOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      {!teachers || teachers.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Teachers Yet</h3>
          <p className="text-gray-400">Teachers will appear here once they register.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher._id || teacher.id || Math.random()}
              teacher={teacher}
              onViewStudents={() => onTeacherClick(teacher)}
              onViewDetails={() => onTeacherDetail(teacher)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TeacherCard = ({ teacher, onViewStudents, onViewDetails }) => (
  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
          {teacher.name?.charAt(0)}
        </div>
        <div>
          <h4 className="text-white font-semibold">{teacher.name}</h4>
          <p className="text-sm text-gray-400">{teacher.subject || 'General'}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        teacher.isActive 
          ? 'bg-green-500/20 text-green-400'
          : 'bg-red-500/20 text-red-400'
      }`}>
        {teacher.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <Mail className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">{teacher.email}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <School className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300">
          Class {teacher.classTeacher?.grade}{teacher.classTeacher?.section}
        </span>
      </div>
      {teacher.phone && (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{teacher.phone}</span>
        </div>
      )}
    </div>
    
    <div className="flex gap-3">
      <button
        onClick={onViewStudents}
        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
      >
        View Students ({teacher.studentCount || 0})
      </button>
      <button
        onClick={onViewDetails}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors text-sm"
      >
        Details
      </button>
    </div>
  </div>
);

/* ======================= STUDENTS TAB ======================= */

/* ======================= STUDENTS TAB ======================= */

const StudentsTab = ({
  students,
  searchTerm,
  setSearchTerm
}) => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Debug
  console.log('🔍 [StudentsTab] Received students:', students);

  // Get unique class options safely - ensuring they're strings
  const classOptions = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    
    const classes = new Set();
    students.forEach(student => {
      if (student?.class) {
        if (typeof student.class === 'object') {
          // If it's an object like {grade: "10", section: "A"}
          const grade = student.class.grade || '';
          const section = student.class.section || '';
          classes.add(`${grade}${section}`);
        } else {
          // If it's a string like "10A"
          classes.add(String(student.class));
        }
      }
    });
    return Array.from(classes).filter(Boolean).map(cls => ({
      value: cls,
      label: `Class ${cls}`
    }));
  }, [students]);

  // Safely filter students
  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    
    return students.filter(student => {
      if (!student) return false;
      
      const studentName = student?.name || student?.studentName || '';
      const studentRoll = student?.rollNumber || student?.rollNo || '';
      
      const matchesSearch = searchTerm === '' ||
        studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studentRoll.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Get class as string for comparison
      let studentClass = '';
      if (student.class) {
        if (typeof student.class === 'object') {
          studentClass = `${student.class.grade || ''}${student.class.section || ''}`;
        } else {
          studentClass = String(student.class);
        }
      }
      
      const matchesClass = selectedClass === 'all' || studentClass === selectedClass;
      
      const isActive = student?.isActive === true;
      const matchesStatus = selectedStatus === 'all' || 
        (selectedStatus === 'active' && isActive) ||
        (selectedStatus === 'inactive' && !isActive);
      
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [students, searchTerm, selectedClass, selectedStatus]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Students Directory</h2>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Classes</option>
              {classOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        {!students || students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No students enrolled yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Roll No</th>
                  <th className="pb-3">Class</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const studentName = student?.name || student?.studentName || 'Unknown';
                  const studentRoll = student?.rollNumber || student?.rollNo || 'N/A';
                  const studentEmail = student?.email || 'N/A';
                  const isActive = student?.isActive === true;
                  
                  // Format class display safely
                  let classDisplay = 'N/A';
                  if (student.class) {
                    if (typeof student.class === 'object') {
                      const grade = student.class.grade || '';
                      const section = student.class.section || '';
                      classDisplay = `Class ${grade}${section}`;
                    } else {
                      classDisplay = `Class ${student.class}`;
                    }
                  }
                  
                  return (
                    <tr key={student._id || student.id || Math.random()} className="border-b border-gray-700/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white">{studentName}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-300">{studentRoll}</td>
                      <td className="py-3 text-gray-300">{classDisplay}</td>
                      <td className="py-3 text-gray-300">{studentEmail}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isActive 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredStudents.length === 0 && students.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No students match your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ======================= ANALYTICS TAB ======================= */

const AnalyticsTab = ({ stats, studentsByClass, teachers, students, drills }) => {
  const studentGrowthData = [
    { month: 'Jan', count: Math.round((students.length || 0) * 0.7) },
    { month: 'Feb', count: Math.round((students.length || 0) * 0.8) },
    { month: 'Mar', count: Math.round((students.length || 0) * 0.9) },
    { month: 'Apr', count: students.length || 0 },
    { month: 'May', count: Math.round((students.length || 0) * 1.1) },
    { month: 'Jun', count: Math.round((students.length || 0) * 1.2) },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Avg. Student Score</p>
          <h3 className="text-3xl font-bold text-white">{Math.round(stats.averageScore || 0)}%</h3>
          <span className="text-xs text-green-400">↑ 5% vs last month</span>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Total Badges Earned</p>
          <h3 className="text-3xl font-bold text-white">{stats.totalBadges || 0}</h3>
          <span className="text-xs text-green-400">↑ 12% vs last month</span>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Drills Completed</p>
          <h3 className="text-3xl font-bold text-white">{stats.completedDrills || 0}</h3>
          <span className="text-xs text-green-400">↑ 8% vs last month</span>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Active Students</p>
          <h3 className="text-3xl font-bold text-white">{stats.activeStudents || 0}</h3>
          <span className="text-xs text-gray-400">Out of {stats.totalStudents || 0}</span>
        </div>
      </div>

      {/* Student Growth Chart */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Student Growth</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Teacher Performance Table */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Teacher Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                <th className="pb-3">Teacher</th>
                <th className="pb-3">Class</th>
                <th className="pb-3">Students</th>
                <th className="pb-3">Avg. Score</th>
                <th className="pb-3">Performance</th>
              </tr>
            </thead>
            <tbody>
              {teachers.slice(0, 5).map((teacher, index) => (
                <tr key={index} className="border-b border-gray-700/50">
                  <td className="py-3 text-white">{teacher.name}</td>
                  <td className="py-3 text-gray-300">
                    Class {teacher.classTeacher?.grade}{teacher.classTeacher?.section}
                  </td>
                  <td className="py-3 text-gray-300">{teacher.studentCount || 0}</td>
                  <td className="py-3 text-gray-300">{Math.round(teacher.performanceScore || 0)}%</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${teacher.performanceScore || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{Math.round(teacher.performanceScore || 0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ======================= DRILLS TAB ======================= */

const DrillsTab = ({
  drills,
  upcomingDrills,
  showCreateModal,
  setShowCreateModal,
  newDrill,
  setNewDrill,
  onCreateDrill,
  onUpdateStatus,
  formSubmitting,
  formError
}) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400';
      case 'ongoing': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDrillIcon = (type) => {
    switch(type) {
      case 'Earthquake': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Fire': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Flood': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'Cyclone': return <Wind className="w-5 h-5 text-purple-400" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDrillBgColor = (type) => {
    switch(type) {
      case 'Earthquake': return 'bg-red-500/20';
      case 'Fire': return 'bg-orange-500/20';
      case 'Flood': return 'bg-blue-500/20';
      case 'Cyclone': return 'bg-purple-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  // Calculate stats
  const totalDrills = drills.length;
  const completedDrills = drills.filter(d => d.status === 'completed').length;
  const scheduledDrills = drills.filter(d => d.status === 'scheduled').length;
  const totalParticipants = drills.reduce((sum, d) => sum + (d.participants?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Disaster Preparedness Drills</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors"
        >
          <Shield className="w-5 h-5" />
          Schedule New Drill
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">Total Drills</span>
          </div>
          <h4 className="text-2xl font-bold text-white">{totalDrills}</h4>
          <p className="text-xs text-green-400 mt-1">↑ {scheduledDrills} scheduled</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-gray-400 text-sm">Completed</span>
          </div>
          <h4 className="text-2xl font-bold text-white">{completedDrills}</h4>
          <p className="text-xs text-gray-400 mt-1">{totalDrills ? Math.round((completedDrills/totalDrills) * 100) : 0}% success rate</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-gray-400 text-sm">Scheduled</span>
          </div>
          <h4 className="text-2xl font-bold text-white">{scheduledDrills}</h4>
          <p className="text-xs text-gray-400 mt-1">Next: {upcomingDrills[0]?.scheduledDate || 'N/A'}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">Participants</span>
          </div>
          <h4 className="text-2xl font-bold text-white">{totalParticipants}</h4>
          <p className="text-xs text-gray-400 mt-1">Avg. {totalDrills ? Math.round(totalParticipants/totalDrills) : 0} per drill</p>
        </div>
      </div>

      {/* Drills List */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">All Drills</h3>
        
        {drills.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No drills scheduled yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
            >
              Schedule Your First Drill
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {drills.map((drill) => (
              <div
                key={drill._id}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${getDrillBgColor(drill.type)}`}>
                    {getDrillIcon(drill.type)}
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium">{drill.type} Drill</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(drill.scheduledDate).toLocaleDateString()} at {drill.time} • {drill.participants?.length || 0} participants
                    </p>
                    {drill.location && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {drill.location}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(drill.status)}`}>
                    {drill.status}
                  </span>
                  
                  <div className="relative group">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="absolute right-0 mt-1 w-40 bg-gray-800 rounded-lg shadow-xl border border-white/10 overflow-hidden hidden group-hover:block z-10">
                      <button
                        onClick={() => onUpdateStatus(drill._id, 'ongoing')}
                        className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/5"
                      >
                        Mark Ongoing
                      </button>
                      <button
                        onClick={() => onUpdateStatus(drill._id, 'completed')}
                        className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/5"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => onUpdateStatus(drill._id, 'cancelled')}
                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
                      >
                        Cancel Drill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Drill Modal */}
      {showCreateModal && (
        <DrillFormModal
          title="Schedule New Drill"
          drill={newDrill}
          setDrill={setNewDrill}
          onSubmit={onCreateDrill}
          onClose={() => setShowCreateModal(false)}
          formSubmitting={formSubmitting}
          formError={formError}
        />
      )}
    </div>
  );
};

const DrillFormModal = ({ title, drill, setDrill, onSubmit, onClose, formSubmitting, formError }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(drill);
  };

  const drillTypes = ['Earthquake', 'Fire', 'Flood', 'Cyclone', 'Tsunami', 'Landslide', 'Other'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-lg w-full">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
              {formError}
            </div>
          )}
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">Drill Type *</label>
            <select
              value={drill.type}
              onChange={(e) => setDrill({...drill, type: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              required
            >
              {drillTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">Date *</label>
            <input
              type="date"
              value={drill.scheduledDate}
              onChange={(e) => setDrill({...drill, scheduledDate: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">Time *</label>
            <input
              type="time"
              value={drill.time}
              onChange={(e) => setDrill({...drill, time: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">Duration (minutes) *</label>
            <input
              type="number"
              value={drill.duration}
              onChange={(e) => setDrill({...drill, duration: parseInt(e.target.value)})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              min="15"
              step="15"
              required
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">Expected Participants</label>
            <input
              type="number"
              value={drill.expectedParticipants}
              onChange={(e) => setDrill({...drill, expectedParticipants: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., 150"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">Location</label>
            <input
              type="text"
              value={drill.location}
              onChange={(e) => setDrill({...drill, location: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., Main Building, Ground Floor"
            />
          </div>
          
          <div>
            <label className="text-sm text-gray-400 block mb-2">Notes</label>
            <textarea
              value={drill.notes}
              onChange={(e) => setDrill({...drill, notes: e.target.value})}
              rows="3"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              placeholder="Additional instructions or notes..."
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              disabled={formSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {formSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Scheduling...
                </>
              ) : (
                'Schedule Drill'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ======================= REPORTS TAB ======================= */

const ReportsTab = ({ stats, teachers, students, drills, onExport }) => {
  const [reportType, setReportType] = useState('student');
  const [dateRange, setDateRange] = useState('month');
  const [generating, setGenerating] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const generateReport = () => {
    setGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      onExport('pdf');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>

      {/* Report Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`bg-gray-800/50 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all ${
          reportType === 'student' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
        }`} onClick={() => setReportType('student')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Student Report</h3>
              <p className="text-sm text-gray-400">Performance, attendance, progress</p>
            </div>
          </div>
          <div className="text-sm text-gray-300">
            <p>• Student performance metrics</p>
            <p>• Attendance records</p>
            <p>• Progress tracking</p>
          </div>
        </div>

        <div className={`bg-gray-800/50 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all ${
          reportType === 'teacher' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
        }`} onClick={() => setReportType('teacher')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <GraduationCap className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Teacher Report</h3>
              <p className="text-sm text-gray-400">Performance, classes, activities</p>
            </div>
          </div>
          <div className="text-sm text-gray-300">
            <p>• Teacher performance analysis</p>
            <p>• Class management stats</p>
            <p>• Activity logs</p>
          </div>
        </div>

        <div className={`bg-gray-800/50 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all ${
          reportType === 'drill' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
        }`} onClick={() => setReportType('drill')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Drill Report</h3>
              <p className="text-sm text-gray-400">Drill statistics, participation</p>
            </div>
          </div>
          <div className="text-sm text-gray-300">
            <p>• Drill completion rates</p>
            <p>• Participation statistics</p>
            <p>• Response times</p>
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Report Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <label className="text-sm text-gray-400 block mb-2">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm text-gray-400 block mb-2">Format</label>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> PDF
              </button>
              <button className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> CSV
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={generateReport}
            disabled={generating}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Report...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Total Students</p>
            <p className="text-2xl font-bold text-white">{stats.totalStudents || 0}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Teachers</p>
            <p className="text-2xl font-bold text-white">{stats.totalTeachers || 0}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Drills</p>
            <p className="text-2xl font-bold text-white">{drills.length || 0}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Completion Rate</p>
            <p className="text-2xl font-bold text-white">{Math.round(stats.completionRate || 0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ======================= SETTINGS TAB ======================= */

const SettingsTab = ({ organization, onUpdate }) => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const [settings, setSettings] = useState({
    organizationName: organization?.name || '',
    email: organization?.email || '',
    phone: organization?.contactNumber || '',
    city: organization?.location?.city || '',
    state: organization?.location?.state || '',
    country: organization?.location?.country || '',
    website: organization?.website || '',
    establishedYear: organization?.establishedYear || '',
    timezone: 'UTC+5:30',
    language: 'English',
    notificationEmail: true,
    notificationSMS: false,
    autoDrillReminders: true,
    weeklyReports: true,
    darkMode: true
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      onUpdate();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Target }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Organization Settings</h2>

      {/* Settings Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-4 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeSettingsTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        {message && (
          <div className={`mb-4 p-3 rounded-xl ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {activeSettingsTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Organization Name</label>
                <input
                  type="text"
                  value={settings.organizationName}
                  onChange={(e) => setSettings({...settings, organizationName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Phone Number</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Website</label>
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) => setSettings({...settings, website: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">City</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({...settings, city: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">State</label>
                <input
                  type="text"
                  value={settings.state}
                  onChange={(e) => setSettings({...settings, state: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Country</label>
                <input
                  type="text"
                  value={settings.country}
                  onChange={(e) => setSettings({...settings, country: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Established Year</label>
                <input
                  type="number"
                  value={settings.establishedYear}
                  onChange={(e) => setSettings({...settings, establishedYear: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  placeholder="2020"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="UTC+5:30">India (UTC+5:30)</option>
                  <option value="UTC+0">UTC</option>
                  <option value="UTC-5">Eastern Time</option>
                  <option value="UTC-8">Pacific Time</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive updates and alerts via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationEmail}
                  onChange={(e) => setSettings({...settings, notificationEmail: e.target.checked})}
                  className="w-5 h-5"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">SMS Alerts</p>
                  <p className="text-sm text-gray-400">Receive emergency alerts via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationSMS}
                  onChange={(e) => setSettings({...settings, notificationSMS: e.target.checked})}
                  className="w-5 h-5"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">Automatic Drill Reminders</p>
                  <p className="text-sm text-gray-400">Send reminders before scheduled drills</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoDrillReminders}
                  onChange={(e) => setSettings({...settings, autoDrillReminders: e.target.checked})}
                  className="w-5 h-5"
                />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl cursor-pointer">
                <div>
                  <p className="text-white font-medium">Weekly Reports</p>
                  <p className="text-sm text-gray-400">Receive weekly performance reports via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={(e) => setSettings({...settings, weeklyReports: e.target.checked})}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>
        )}

        {activeSettingsTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="pt-4">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  Change Password
                </button>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-3">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSettingsTab === 'preferences' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Dashboard Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Default Dashboard View</label>
                <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500">
                  <option>Overview</option>
                  <option>Teachers</option>
                  <option>Students</option>
                  <option>Analytics</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Items Per Page</label>
                <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Chart Type Preference</label>
                <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500">
                  <option>Bar Charts</option>
                  <option>Line Charts</option>
                  <option>Pie Charts</option>
                  <option>Area Charts</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Theme</label>
                <select 
                  value={settings.darkMode ? 'dark' : 'light'}
                  onChange={(e) => setSettings({...settings, darkMode: e.target.value === 'dark'})}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="dark">Dark (Default)</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                  className="w-5 h-5"
                />
                <div>
                  <p className="text-white font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-400">Use dark theme throughout the application</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ======================= MODALS ======================= */

const TeacherStudentsModal = ({ teacher, students, loading, onClose }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
            {teacher.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{teacher.name}'s Students</h3>
            <p className="text-sm text-gray-400">
              Class {teacher.classTeacher?.grade}{teacher.classTeacher?.section}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No students found in this class.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {student.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{student.name}</h4>
                      <p className="text-sm text-gray-400">Roll No: {student.rollNumber}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.isActive 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">{student.progress?.totalScore || 0} pts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{student.progress?.badges?.length || 0} badges</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const TeacherDetailModal = ({ teacher, onClose, formatDate }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 rounded-2xl max-w-2xl w-full">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Teacher Profile</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
            {teacher.name?.charAt(0)}
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">{teacher.name}</h4>
            <p className="text-gray-400">{teacher.subject || 'General Teacher'}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
              teacher.isActive 
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {teacher.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {teacher.email}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {teacher.phone || 'Not provided'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Class</p>
              <p className="text-white flex items-center gap-2">
                <School className="w-4 h-4 text-gray-400" />
                Class {teacher.classTeacher?.grade}{teacher.classTeacher?.section}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Qualification</p>
              <p className="text-white">{teacher.qualification || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Experience</p>
              <p className="text-white">
                {teacher.experience != null ? `${teacher.experience} years` : 'Not provided'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Date of Joining</p>
              <p className="text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(teacher.dateOfJoining)}
              </p>
            </div>
          </div>
        </div>
        
        {teacher.bio && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-2">Bio</p>
            <p className="text-white">{teacher.bio}</p>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400">Last Login</p>
          <p className="text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            {formatDate(teacher.lastLogin)}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default OrganizationDashboard;