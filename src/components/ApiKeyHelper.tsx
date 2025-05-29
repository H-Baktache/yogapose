import React, { useState } from 'react';

interface ApiKeyHelperProps {
  onClose?: () => void;
}

const ApiKeyHelper: React.FC<ApiKeyHelperProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">API Key Error: How to Fix</h2>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="prose prose-indigo max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="font-medium">You're seeing this message because the app failed to connect to Supabase with the current API key.</p>
            </div>

            <h3>Follow these steps to fix the issue:</h3>
            
            <ol className="space-y-4">
              <li>
                <strong>Go to your Supabase dashboard</strong>
                <p>Navigate to <a href="https://app.supabase.io/projects" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">https://app.supabase.io/projects</a></p>
              </li>
              
              <li>
                <strong>Select your project</strong>
                <p>Click on the project you want to connect to</p>
              </li>
              
              <li>
                <strong>Find your API credentials</strong>
                <p>Go to <strong>Project Settings</strong> → <strong>API</strong> in the sidebar</p>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <img 
                    src="https://i.imgur.com/Z4p8BDZ.png" 
                    alt="Supabase API settings location" 
                    className="w-full"
                  />
                </div>
              </li>
              
              <li>
                <strong>Copy the correct credentials</strong>
                <p>You need two values:</p>
                <ul className="space-y-2">
                  <li>
                    <strong>URL:</strong> Copy the "Project URL" - this is your <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code>
                  </li>
                  <li>
                    <strong>API Key:</strong> Copy the "anon public" key (not the service_role key) - this is your <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>
                  </li>
                </ul>
                <div className="border border-gray-200 rounded-md overflow-hidden mt-2">
                  <img 
                    src="https://i.imgur.com/9hMZxj1.png" 
                    alt="Supabase API keys" 
                    className="w-full"
                  />
                </div>
              </li>
              
              <li>
                <strong>Update your .env file</strong>
                <p>Create or edit the <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> file in your project root:</p>
                <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
                  {`VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key`}
                </pre>
                <p className="text-sm text-gray-600 mt-1">Replace with your actual values copied from Supabase</p>
              </li>
              
              <li>
                <strong>Restart your dev server</strong>
                <p>After updating the .env file, restart your development server for the changes to take effect</p>
                <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto">
                  {`npm run dev`}
                </pre>
              </li>
            </ol>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mt-4">
              <h4 className="font-bold">Common Issues:</h4>
              <ul className="mt-2">
                <li>Make sure you're using the <strong>anon public</strong> key, not the service_role key</li>
                <li>Check for any typos or extra spaces in your .env file</li>
                <li>Confirm that your Supabase project is active and not paused</li>
                <li>Verify that you have enabled Email auth in Supabase Authentication settings</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyHelper; 