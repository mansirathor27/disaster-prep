import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loginOrganization, loginTeacher, loginStudent, setAuthToken } from '../services/auth.api';
import toast from 'react-hot-toast';

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const roleConfig = {
    organization: {
      title: 'Organization/School',
      icon: '🏫',
      loginFn: loginOrganization,
      redirectPath: '/dashboard/organization'
    },
    teacher: {
      title: 'Teacher',
      icon: '👨‍🏫',
      loginFn: loginTeacher,
      redirectPath: '/dashboard/teacher'
    },
    student: {
      title: 'Student',
      icon: '👨‍🎓',
      loginFn: loginStudent,
      redirectPath: '/dashboard/student'
    }
  };

  const config = roleConfig[role] || roleConfig.organization;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await config.loginFn(formData.email, formData.password);
      
  //     if (response.success) {
  //       setAuthToken(response.token);
  //       toast.success(`Welcome back, ${response.data.user.name || response.data.user.organizationName}!`);
  //       navigate(config.redirectPath);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Login failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await config.loginFn(formData.email, formData.password);
    
    console.log('Login response:', response); // Add this
    
    if (response.success) {
      // IMPORTANT: Save token AND role
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', role); // Make sure role is saved!
      
      // Set auth token for future requests
      setAuthToken(response.token);
      
      toast.success(`Welcome back!`);
      console.log('Redirecting to:', config.redirectPath); // Add this
      navigate(config.redirectPath);
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{config.icon}</div>
            <h1 className="text-3xl font-bold text-white mb-2">{config.title} Login</h1>
            <p className="text-slate-400">Welcome back! Please login to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate(`/auth/${role}/signup`)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign up
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

export default Login;


