import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import ApiKeyHelper from '../components/ApiKeyHelper';
import { supabase } from '../services/supabaseClient';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showApiHelper, setShowApiHelper] = useState(false);
  
  useEffect(() => {
    // Test connection to determine if we should show the API key helper
    const testConnection = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error && (
          error.message.includes('invalid api key') || 
          error.message.includes('API key') || 
          error.message.includes('Invalid JWT')
        )) {
          console.error('API Key error detected:', error.message);
          setShowApiHelper(true);
        }
      } catch (err) {
        console.error('Connection error:', err);
        setShowApiHelper(true);
      }
    };
    
    testConnection();
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleCloseApiHelper = () => {
    setShowApiHelper(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="z-10 w-full max-w-md px-4 sm:px-0">
        {/* Logo and App title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-xl shadow-md flex items-center justify-center" style={{ width: '140px', height: '140px' }}>
              <img src="/logo.png" alt="YOGASNAP" className="h-full w-full object-contain p-1" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">YOGASNAP</h1>
          <p className="text-gray-600 mt-2">Intelligent Yoga Pose Classification</p>
        </div>

        {/* Authentication forms */}
        {isLogin ? (
          <Login onToggleForm={toggleForm} />
        ) : (
          <SignUp onToggleForm={toggleForm} />
        )}

        {/* API key helper button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowApiHelper(true)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Having trouble connecting? Get API key help
          </button>
        </div>
        
        {/* API Key Helper */}
        {showApiHelper && <ApiKeyHelper onClose={handleCloseApiHelper} />}
      </div>
    </div>
  );
};

export default AuthPage; 