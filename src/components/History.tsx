import React, { useEffect, useState } from 'react';
import { getUserPoseHistory, deletePoseFromHistory, PoseHistoryEntry } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const History: React.FC = () => {
  const [history, setHistory] = useState<PoseHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getUserPoseHistory();
      if (error) {
        setError('Failed to load history: ' + error.message);
      } else {
        setHistory(data || []);
      }
    } catch (err: any) {
      setError('Error loading history: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { success, error } = await deletePoseFromHistory(id);
      if (success) {
        // Update the local state to remove the deleted item
        setHistory(history.filter(item => item.id !== id));
      } else {
        setError('Failed to delete: ' + (error?.message || 'Unknown error'));
      }
    } catch (err: any) {
      setError('Error deleting item: ' + (err.message || 'Unknown error'));
    }
  };

  // Load history when component mounts or when user changes
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <p className="text-center text-gray-600">Please log in to view your history.</p>
      </div>
    );
  }

  // Format date to display in a readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Yoga Pose History</h2>
        <button 
          onClick={loadHistory}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">No yoga poses in your history yet.</p>
          <p className="mt-2">Classifications will appear here once you analyze some poses.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start">
                {entry.image_url && (
                  <div className="mr-4 flex-shrink-0">
                    <img 
                      src={entry.image_url} 
                      alt={entry.pose_name || 'Yoga pose'} 
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {entry.pose_name || 'Unknown Pose'}
                      {entry.sanskrit_name && (
                        <span className="ml-2 text-sm text-gray-500 font-normal">
                          ({entry.sanskrit_name})
                        </span>
                      )}
                    </h3>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">
                        {Math.round(entry.confidence * 100)}% confidence
                      </span>
                      {entry.level && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          {entry.level}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(entry.created_at)}
                  </p>
                  
                  {entry.description && (
                    <p className="text-gray-700 mt-2">{entry.description}</p>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => entry.id && handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove from history
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History; 