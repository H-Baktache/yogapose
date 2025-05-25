import React, { useState, useEffect } from 'react';
import YogaClassifier from './components/YogaClassifier';
import YogaSequence from './components/YogaSequence';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<'classifier' | 'sequence'>('classifier');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handler to switch between pages
  const handlePageChange = (page: 'classifier' | 'sequence') => {
    setActivePage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Cercles décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white z-50">
          <div className="flex flex-col items-center">
            <svg className="w-24 h-24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <style>
                {`
                  .spinner_P7sC{transform-origin:center;animation:spinner_svv2 1.2s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite}
                  @keyframes spinner_svv2{100%{transform:rotate(360deg)}}
                `}
              </style>
              <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" className="spinner_P7sC" fill="#6366f1"/>
            </svg>
            <p className="mt-4 text-indigo-700 font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text animate-pulse">Chargement...</p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 transition-all duration-1000 ease-out opacity-0 animate-fadeIn">
          <Header />
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handlePageChange('classifier')}
                  className={`px-4 py-2 rounded-md ${
                    activePage === 'classifier'
                      ? 'bg-white shadow-sm text-indigo-700 font-medium'
                      : 'text-gray-600 hover:text-indigo-600'
                  } transition-all duration-200`}
                >
                  Pose Classifier
                </button>
                <button
                  onClick={() => handlePageChange('sequence')}
                  className={`px-4 py-2 rounded-md ${
                    activePage === 'sequence'
                      ? 'bg-white shadow-sm text-indigo-700 font-medium'
                      : 'text-gray-600 hover:text-indigo-600'
                  } transition-all duration-200`}
                >
                  Pose Sequences
                </button>
              </div>
            </div>
            <main className="flex-grow mx-auto mb-8">
              {activePage === 'classifier' ? <YogaClassifier /> : <YogaSequence />}
            </main>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App; 