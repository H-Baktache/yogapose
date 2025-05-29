import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [activeLink, setActiveLink] = useState('home');
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white rounded-xl p-3 mr-4 shadow-lg overflow-hidden border-2 border-indigo-100">
              <img src="/logo.png" alt="YOGASNAP" className="h-16 w-16 object-contain" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold tracking-tight">YOGASNAP</h1>
              <p className="text-indigo-100 text-xs">Intelligent Yoga Pose Analysis</p>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          <nav className={`w-full md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <ul className="flex flex-col md:flex-row md:items-center md:space-x-1">
              <li className="my-1">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setActiveLink('home'); window.location.hash = ''; setIsMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 block ${
                    activeLink === 'home' 
                      ? 'bg-white text-indigo-700 font-medium shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Home
                </a>
              </li>
              <li className="my-1">
                <a 
                  href="#/sequence" 
                  onClick={(e) => { e.preventDefault(); setActiveLink('sequence'); window.location.hash = '#/sequence'; setIsMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 block ${
                    activeLink === 'sequence' 
                      ? 'bg-white text-indigo-700 font-medium shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Sequences
                </a>
              </li>
              {user && (
                <li className="my-1">
                  <a 
                    href="#/history" 
                    onClick={(e) => { e.preventDefault(); setActiveLink('history'); window.location.hash = '#/history'; setIsMobileMenuOpen(false); }}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 block ${
                      activeLink === 'history' 
                        ? 'bg-white text-indigo-700 font-medium shadow-sm' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    History
                  </a>
                </li>
              )}
              <li className="my-1">
                <a 
                  href="#help" 
                  onClick={(e) => { e.preventDefault(); setActiveLink('help'); setIsMobileMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 block ${
                    activeLink === 'help' 
                      ? 'bg-white text-indigo-700 font-medium shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Help
                </a>
              </li>
              
              {user && (
                <li className="my-1 md:ml-4 md:border-l md:border-indigo-400 md:pl-4">
                  <div className="flex items-center flex-col md:flex-row">
                    <span className="text-white md:mr-3 text-sm md:inline-block bg-indigo-500/30 px-3 py-1 rounded-full my-1 md:my-0">
                      {user.email}
                    </span>
                    <button 
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-white/90 text-indigo-700 rounded-lg hover:bg-white transition-all duration-300 text-sm font-medium shadow-sm hover:shadow"
                    >
                      Sign Out
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 