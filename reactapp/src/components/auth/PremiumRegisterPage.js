import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../utils/api';

const InputField = ({ type, placeholder, value, onChange, icon }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <span className="text-slate-500 text-lg">{icon}</span>
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/80 backdrop-blur-sm rounded-2xl 
                 text-slate-800 placeholder-slate-500 focus:outline-none transition-all duration-300 text-sm sm:text-base
                 border-2 border-dotted border-blue-300 focus:border-solid focus:border-purple-400
                 hover:border-purple-300 shadow-sm focus:shadow-md"
    />
  </div>
);

const PremiumRegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (name && email && rollNo && department && year && password && confirmPassword && password === confirmPassword) {
      try {
        await registerUser({
          username: email,
          email: email,
          password: password,
          name: name,
          rollNo: rollNo,
          department: department,
          year: year
        });
        alert('Registration successful! Please login.');
        navigate('/login');
      } catch (error) {
        alert('Registration failed: ' + (error.response?.data || error.message));
      }
    } else {
      alert('Please fill all fields and ensure passwords match.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-150 relative overflow-hidden">
      {/* Ethereal Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Unique Shapes */}
        <div className="absolute top-20 left-20 w-40 h-20 bg-gradient-to-r from-emerald-400/60 to-teal-400/60 transform rotate-45 blur-3xl animate-blob-drift" />
        <div className="absolute top-40 right-32 w-32 h-8 bg-gradient-to-r from-rose-400/60 to-pink-400/60 rounded-full blur-2xl animate-blob-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-32 left-1/3 w-24 h-24 bg-gradient-to-br from-blue-400/60 to-cyan-400/60 transform rotate-12 blur-3xl animate-blob-drift" style={{animationDelay: '4s', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}} />
        
        {/* Diamond and Star shapes */}
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-400/60 to-indigo-400/60 transform rotate-45 blur-2xl animate-gentle-float" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-gradient-to-br from-orange-400/60 to-yellow-400/60 blur-2xl animate-gentle-float" style={{animationDelay: '3s', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}} />
        
        {/* Hexagon and Wave shapes */}
        <div className="absolute top-60 left-1/4 w-28 h-28 bg-gradient-to-br from-violet-400/60 to-purple-400/60 blur-3xl animate-blob-pulse" style={{animationDelay: '5s', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'}} />
        <div className="absolute bottom-40 left-20 w-36 h-12 bg-gradient-to-r from-teal-400/60 to-green-400/60 rounded-full blur-2xl animate-gentle-float" style={{animationDelay: '6s'}} />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-white/5" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Glassmorphism Card */}
          <motion.div 
            className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 sm:p-8 
                       shadow-2xl shadow-slate-900/20 drop-shadow-2xl animate-gentle-float
                       hover:shadow-3xl hover:scale-105 transition-all duration-500"
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.02,
              rotateY: 2,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            
            {/* Brand Header */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.h1 
                className="text-3xl sm:text-4xl font-black text-slate-800 mb-2"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, rotateZ: 1 }}
              >
                Join <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">Campus Events</span>
              </motion.h1>
              <motion.p 
                className="text-slate-600 font-medium text-sm sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                Create your account to get started
              </motion.p>
            </div>

            {/* Register Form */}
            <motion.form 
              onSubmit={handleRegister} 
              className="space-y-4 sm:space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
            >
              <InputField
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon="👤"
              />

              <InputField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon="📧"
              />

              <InputField
                type="text"
                placeholder="Enter your roll number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                icon="🎓"
              />

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-lg">🏢</span>
                </div>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/80 backdrop-blur-sm rounded-2xl 
                             text-slate-800 focus:outline-none transition-all duration-300 text-sm sm:text-base
                             border-2 border-dotted border-blue-300 focus:border-solid focus:border-purple-400
                             hover:border-purple-300 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-lg">📚</span>
                </div>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/80 backdrop-blur-sm rounded-2xl 
                             text-slate-800 focus:outline-none transition-all duration-300 text-sm sm:text-base
                             border-2 border-dotted border-blue-300 focus:border-solid focus:border-purple-400
                             hover:border-purple-300 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <InputField
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="🔒"
              />

              <InputField
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon="🔐"
              />

              {/* Register Button */}
              <motion.button
                type="submit"
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                           text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl 
                           transform hover:scale-105 transition-all duration-300 
                           focus:outline-none focus:ring-2 focus:ring-purple-300/50 text-sm sm:text-base"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotateZ: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account
              </motion.button>

              {/* Login Link */}
              <motion.div 
                className="text-center pt-3 sm:pt-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <motion.p 
                  className="text-slate-600 text-sm sm:text-base mb-2"
                  whileHover={{ scale: 1.02 }}
                >
                  Already have an account?
                </motion.p>
                <motion.button
                  type="button"
                  onClick={handleLogin}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.4 }}
                  whileHover={{ scale: 1.08, rotateZ: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in here
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-300/50 to-orange-300/50 rounded-full blur-sm"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.5, rotate: 180 }}
          />
          
          <motion.div
            className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-green-300/50 to-blue-300/50 rounded-full blur-sm"
            animate={{ 
              y: [0, 15, 0],
              x: [0, 10, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            whileHover={{ scale: 1.4, y: -10 }}
          />
          
          <motion.div
            className="absolute top-1/2 -left-8 w-6 h-6 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-full blur-sm"
            animate={{ 
              x: [0, 25, 0],
              scale: [0.8, 1.4, 0.8],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            whileHover={{ scale: 1.6, x: 15 }}
          />
          
          <motion.div
            className="absolute top-1/4 -right-10 w-10 h-10 bg-gradient-to-br from-cyan-300/50 to-teal-300/50 rounded-full blur-sm"
            animate={{ 
              y: [0, -18, 0],
              x: [0, -12, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            whileHover={{ scale: 1.5, rotate: -90 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumRegisterPage;