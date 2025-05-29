import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
      <div className="container mx-auto px-6">
        {/* Logo section at top of footer */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg border-2 border-indigo-300">
              <img src="/logo.png" alt="YOGASNAP" className="h-20 w-20 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">YOGASNAP</h2>
            <p className="text-indigo-200 text-sm">Intelligent Yoga Pose Analysis</p>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 shadow-inner border border-white/10">
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              About YOGASNAP
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400"></span>
            </h3>
            <p className="text-indigo-100 mb-6 leading-relaxed">
              Analyze and identify your yoga poses with our advanced artificial intelligence technology. 
              Perfect your practice with instant feedback and detailed instructions.
            </p>
            <div className="flex space-x-5 mt-4">
              <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 shadow-inner border border-white/10">
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400"></span>
            </h3>
            <ul className="space-y-3">
              <li className="transition-transform duration-300 hover:translate-x-1">
                <a href="#" className="text-indigo-100 hover:text-white transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Home
                </a>
              </li>
              <li className="transition-transform duration-300 hover:translate-x-1">
                <a href="#/sequence" className="text-indigo-100 hover:text-white transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Sequences
                </a>
              </li>
              <li className="transition-transform duration-300 hover:translate-x-1">
                <a href="#/history" className="text-indigo-100 hover:text-white transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  History
                </a>
              </li>
              <li className="transition-transform duration-300 hover:translate-x-1">
                <a href="#about" className="text-indigo-100 hover:text-white transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  About
                </a>
              </li>
              <li className="transition-transform duration-300 hover:translate-x-1">
                <a href="#help" className="text-indigo-100 hover:text-white transition-colors flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Help
                </a>
              </li>
            </ul>
          </div>
          
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 shadow-inner border border-white/10">
            <h3 className="text-xl font-bold mb-4 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400"></span>
            </h3>
            <p className="text-indigo-100 mb-6 leading-relaxed">
              Have a question or suggestion? We'd love to hear from you! Reach out to our team anytime.
            </p>
            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg mb-4 hover:bg-white/15 transition-colors">
              <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <a href="mailto:contact@yogasnap.com" className="text-indigo-100 hover:text-white transition-colors">contact@yogasnap.com</a>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg hover:bg-white/15 transition-colors">
              <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span className="text-indigo-100">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
        
        {/* Footer bottom with glowing border and refined styling */}
        <div className="mt-12 pt-6 border-t border-indigo-600/30 text-center text-indigo-200">
          <div className="max-w-lg mx-auto">
            <p className="mb-2">© {new Date().getFullYear()} YOGASNAP. All rights reserved.</p>
            <p className="text-xs text-indigo-300 bg-indigo-900/50 py-2 px-4 rounded-full inline-block mt-2">
              Powered by advanced artificial intelligence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 