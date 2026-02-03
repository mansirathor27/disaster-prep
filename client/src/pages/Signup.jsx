import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { registerOrganization, registerTeacher, registerStudent, setAuthToken } from '../services/auth.api';
import { indianStatesAndCities } from '../data/indianStatesAndCities';
import toast from 'react-hot-toast';

const Signup = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Location fields
    state: '',
    city: '',
    district: '',
    pincode: '',
    // Organization specific
    organizationName: '',
    organizationType: 'school',
    contactPersonName: '',
    contactPersonPhone: '',
    // Teacher specific
    subject: '',
    grade: '',
    section: 'A',
    // Student specific
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    parentPhone: '',
    parentEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);

  const roleConfig = {
    organization: {
      title: 'Organization/School',
      icon: '🏫',
      registerFn: registerOrganization,
      redirectPath: '/dashboard/organization',
      requiredFields: ['organizationName', 'email', 'password', 'state', 'city']
    },
    teacher: {
      title: 'Teacher',
      icon: '👨‍🏫',
      registerFn: registerTeacher,
      redirectPath: '/dashboard/teacher',
      requiredFields: ['organizationName', 'name', 'email', 'password', 'subject', 'grade', 'state', 'city']
    },
    student: {
      title: 'Student',
      icon: '👨‍🎓',
      registerFn: registerStudent,
      redirectPath: '/dashboard/student',
      requiredFields: ['organizationName', 'name', 'email', 'password', 'grade', 'rollNumber', 'state', 'city']
    }
  };

  const config = roleConfig[role] || roleConfig.organization;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Update cities when state changes
    if (name === 'state' && value) {
      const cities = indianStatesAndCities[value] || [];
      setAvailableCities(cities);
      setFormData(prev => ({ ...prev, city: '' })); // Reset city
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate required fields
    const missingFields = config.requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      // Prepare data based on role
      let submitData = {
        email: formData.email,
        password: formData.password,
        state: formData.state,
        city: formData.city,
        district: formData.district || undefined,
        pincode: formData.pincode || undefined
      };

      if (role === 'organization') {
        submitData = {
          ...submitData,
          organizationName: formData.organizationName,
          organizationType: formData.organizationType,
          contactPerson: {
            name: formData.contactPersonName,
            phone: formData.contactPersonPhone
          }
        };
      } else if (role === 'teacher') {
        submitData = {
          ...submitData,
          organizationName: formData.organizationName,
          name: formData.name,
          subject: formData.subject,
          grade: parseInt(formData.grade),
          section: formData.section,
          phone: formData.phone || undefined
        };
      } else if (role === 'student') {
        submitData = {
          ...submitData,
          organizationName: formData.organizationName,
          name: formData.name,
          grade: parseInt(formData.grade),
          section: formData.section,
          rollNumber: formData.rollNumber,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          phone: formData.phone || undefined,
          parentPhone: formData.parentPhone || undefined,
          parentEmail: formData.parentEmail || undefined
        };
      }

      const response = await config.registerFn(submitData);
      
      if (response.success) {
        setAuthToken(response.token);
        toast.success(`Welcome! Account created successfully.`);
        navigate(config.redirectPath);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const states = Object.keys(indianStatesAndCities);

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{config.icon}</div>
          <h1 className="text-3xl font-bold text-white mb-2">{config.title} Registration</h1>
          <p className="text-slate-400">Create your account to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            {role !== 'organization' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Organization Name */}
            {role === 'organization' ? (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Organization/School Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter organization name"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Organization/School Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your organization name"
                />
                <p className="mt-1 text-xs text-slate-500">Enter the exact name of your school/organization</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Location Fields */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">📍 Location Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={!formData.state}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter district (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="6-digit pincode (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'teacher' && (
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">👨‍🏫 Teacher Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Mathematics, Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Class Grade *
                    </label>
                    <input
                      type="number"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                      min="1"
                      max="12"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="1-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      maxLength={1}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'student' && (
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">👨‍🎓 Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter roll number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Class Grade *
                    </label>
                    <input
                      type="number"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                      min="1"
                      max="12"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="1-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      maxLength={1}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Parent Phone
                    </label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Parent Email
                    </label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'organization' && (
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">🏫 Organization Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Organization Type
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="school">School</option>
                      <option value="organization">Organization</option>
                      <option value="institution">Institution</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Contact Person Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPersonPhone"
                      value={formData.contactPersonPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate(`/auth/${role}/login`)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Login
              </button>
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="text-slate-500 hover:text-slate-400 text-sm"
            >
              ← Back to role selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


