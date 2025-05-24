import React, { useState } from 'react';

const Header: React.FC = () => {
  const [activeLink, setActiveLink] = useState('home');

  return (
    <header className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white shadow-lg backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="relative">
            <svg className="h-12 w-12 mr-3 text-white animate-pulse-slow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Yoga Pose AI</h1>
            <p className="text-xs font-light text-indigo-200 mt-1">Classification intelligente de postures</p>
          </div>
        </div>
        <nav className="w-full md:w-auto">
          <ul className="flex flex-wrap justify-center md:space-x-8">
            <li className="mx-2 my-1">
              <a 
                href="#" 
                onClick={() => setActiveLink('home')}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeLink === 'home' 
                    ? 'bg-white bg-opacity-20 text-white font-medium' 
                    : 'hover:bg-white hover:bg-opacity-10 text-indigo-100'
                }`}
              >
                Accueil
              </a>
            </li>
            <li className="mx-2 my-1">
              <a 
                href="#about" 
                onClick={() => setActiveLink('about')}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeLink === 'about' 
                    ? 'bg-white bg-opacity-20 text-white font-medium' 
                    : 'hover:bg-white hover:bg-opacity-10 text-indigo-100'
                }`}
              >
                À propos
              </a>
            </li>
            <li className="mx-2 my-1">
              <a 
                href="#help" 
                onClick={() => setActiveLink('help')}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeLink === 'help' 
                    ? 'bg-white bg-opacity-20 text-white font-medium' 
                    : 'hover:bg-white hover:bg-opacity-10 text-indigo-100'
                }`}
              >
                Aide
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 