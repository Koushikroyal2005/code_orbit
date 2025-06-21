import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiUser, FiArrowRight } from 'react-icons/fi';

const Login = ({ setUser }) => {
  const [userName, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchInfo = async () => {
    if (!userName.trim()) {
      setError("Please enter a Codeforces handle");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const { data } = await axios.get(
        `https://codeforces.com/api/user.info?handles=${userName}`
      );
      
      if (data.status === "OK") {
        const loginRes = await api.login(userName);
        localStorage.setItem('token', loginRes.data.token);
        setUser(data.result[0]);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        navigate("/home");
      } else {
        setError(data.comment || "User not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchInfo();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      {/* Animated App Logo/Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-5xl font-bold mb-2 flex">
          <span className="text-black">Code</span>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent ml-1">
            Orbit
          </span>
        </h1>
        <p className="text-gray-500">Track your competitive programming journey</p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-3">
              <FiUser className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-1">Enter your Codeforces handle</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Codeforces Handle
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="e.g. tourist"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchInfo}
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white transition ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Continue <FiArrowRight className="ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Don't have a Codeforces account?{' '}
            <a 
              href="https://codeforces.com/register" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-sm text-gray-400"
      >
        <p>By continuing, you agree to our Terms of Service</p>
      </motion.div>
    </div>
  );
};

export default Login;