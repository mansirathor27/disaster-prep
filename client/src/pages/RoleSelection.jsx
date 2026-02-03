/**
 * Role Selection Page - Enhanced Premium UI
 * Choose user type: Organization, Teacher, or Student
 */

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const roles = [
    {
      id: 'organization',
      title: 'Organization/School',
      icon: '🏫',
      description: 'Comprehensive admin dashboard for schools and organizations',
      features: ['Manage teachers & staff', 'Monitor all classes', 'Location-based setup', 'Advanced analytics & reports'],
      color: '#2563eb',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      glowColor: 'rgba(37, 99, 235, 0.4)',
      bgGradient: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      icon: '👨‍🏫',
      description: 'Empower your teaching with powerful monitoring tools',
      features: ['Real-time student progress', 'Track completion rates', 'Class management suite', 'Individual student reports'],
      color: '#7c3aed',
      gradient: 'from-purple-500 via-purple-600 to-violet-600',
      glowColor: 'rgba(124, 58, 237, 0.4)',
      bgGradient: 'from-purple-500/10 via-violet-500/10 to-fuchsia-500/10'
    },
    {
      id: 'student',
      title: 'Student',
      icon: '👨‍🎓',
      description: 'Engaging learning experience with gamification',
      features: ['Interactive learning modules', 'Fun & challenging quizzes', 'Exciting educational games', 'Achievement badges & rewards'],
      color: '#059669',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      glowColor: 'rgba(5, 150, 105, 0.4)',
      bgGradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10'
    }
  ];

  const handleRoleSelect = (roleId) => {
    navigate(`/auth/${roleId}/login`);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-x-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-slideInUp">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 animate-bounce-slow">🚨</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-teal-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.5)]">
              Disaster Response
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_40px_rgba(147,51,234,0.5)] mt-2">
              Training Platform
            </span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl mx-auto animate-fadeIn">
            Choose your role to begin your journey in disaster preparedness education
          </p>
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>
        </div>

        {/* Enhanced Roles Grid */}
        <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
          {roles.map((role, idx) => (
            <div
              key={role.id}
              className="group relative"
              onMouseEnter={() => setHoveredCard(role.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
            >
              {/* Card Glow Effect */}
              <div 
                className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
                style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
              ></div>
              
              {/* Main Card */}
              <div
                className="relative bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 cursor-pointer transition-all duration-500 ease-out animate-slideInUp hover:border-white/30 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  boxShadow: hoveredCard === role.id 
                    ? `0 25px 50px -12px ${role.glowColor}, 0 0 0 1px ${role.color}40`
                    : '0 20px 40px -12px rgba(0, 0, 0, 0.3)'
                }}
                onClick={() => handleRoleSelect(role.id)}
              >
                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Icon Container with Enhanced Animation */}
                <div className="relative mb-6 sm:mb-8">
                  <div 
                    className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl flex items-center justify-center text-5xl sm:text-6xl bg-gradient-to-br ${role.bgGradient} border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_40px_${role.color}40]`}
                    style={{
                      background: `linear-gradient(135deg, ${role.color}15, ${role.color}25)`,
                      boxShadow: hoveredCard === role.id ? `0 0 30px ${role.glowColor}` : 'none'
                    }}
                  >
                    <span className="block transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                      {role.icon}
                    </span>
                  </div>
                  
                  {/* Orbiting particles around icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          width: '80px',
                          height: '80px',
                          transform: `rotate(${i * 120}deg) translateY(-50px)`,
                          animation: hoveredCard === role.id ? `orbit 3s linear infinite` : 'none',
                          animationDelay: `${i * 0.3}s`
                        }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h2 
                  className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center transition-colors duration-300"
                  style={{ 
                    color: hoveredCard === role.id ? role.color : '#e2e8f0',
                    textShadow: hoveredCard === role.id ? `0 0 20px ${role.glowColor}` : 'none'
                  }}
                >
                  {role.title}
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 text-center leading-relaxed min-h-[3rem]">
                  {role.description}
                </p>

                {/* Enhanced Features List */}
                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {role.features.map((feature, i) => (
                    <li 
                      key={i} 
                      className="flex items-start gap-3 text-gray-300 text-sm sm:text-base group/item"
                      style={{ 
                        animationDelay: `${0.2 + i * 0.1}s`,
                        opacity: hoveredCard === role.id ? 1 : 0.9
                      }}
                    >
                      <div 
                        className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300 group-hover/item:scale-125"
                        style={{ 
                          backgroundColor: `${role.color}20`,
                          border: `2px solid ${role.color}`
                        }}
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: role.color }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="flex-1 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Enhanced CTA Button */}
                <button
                  className={`relative w-full py-4 sm:py-5 rounded-2xl font-bold text-white text-base sm:text-lg overflow-hidden group/btn transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl`}
                  style={{
                    background: `linear-gradient(135deg, ${role.color}, ${role.color}dd)`,
                    boxShadow: `0 10px 30px -10px ${role.glowColor}`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect(role.id);
                  }}
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Button Text */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Continue as {role.title.split('/')[0]}
                    <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  
                  {/* Ripple Effect */}
                  <span className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-active/btn:scale-100 transition-transform duration-300"></span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="text-center relative z-10 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800/50 backdrop-blur-sm border border-white/10">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-sm sm:text-base">
              Not sure which account type? <span className="text-cyan-400 font-medium">Contact your administrator</span>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateY(-50px) rotate(0deg); }
          to { transform: rotate(360deg) translateY(-50px) rotate(-360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RoleSelection;