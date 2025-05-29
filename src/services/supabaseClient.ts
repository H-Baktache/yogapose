import { createClient } from '@supabase/supabase-js';

// Create the Supabase client directly using environment variables
// Make sure these match exactly with your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log connection status for debugging
console.log('Supabase Configuration:');
console.log('- URL available:', !!supabaseUrl);
console.log('- API Key available:', !!supabaseKey);

// Create the client with JWT support
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Authentication functions
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    // Use specific options to ensure user is created without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          email: email,
          created_at: new Date().toISOString(),
        }
      }
    });
    
    return { data, error };
  } catch (err) {
    console.error('Error during signup:', err);
    throw err;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  } catch (err) {
    console.error('Error during signin:', err);
    throw err;
  }
};

export const signOut = async () => {
  try {
    return await supabase.auth.signOut();
  } catch (err) {
    console.error('Error during signout:', err);
    throw err;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  } catch (err) {
    console.error('Error getting current user:', err);
    throw err;
  }
};

export const isAuthenticated = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (err) {
    console.error('Error checking authentication:', err);
    throw err;
  }
};

// Pose History functions
export interface PoseHistoryEntry {
  id?: string;
  user_id?: string;
  pose_name: string;
  confidence: number;
  image_url?: string;
  description?: string;
  benefits?: string | string[];
  instructions?: string | string[];
  level?: string;
  sanskrit_name?: string;
  created_at?: string;
}

// Save a pose classification to history
export const savePoseToHistory = async (poseData: PoseHistoryEntry) => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting current user:', userError);
      return { data: null, error: userError };
    }
    
    if (!userData.user) {
      console.error('User not authenticated');
      return { data: null, error: new Error('User not authenticated') };
    }
    
    // Format data for PostgreSQL - particularly handling array fields correctly
    let formattedData = { ...poseData };
    
    // Convert benefits string to proper PostgreSQL array format if needed
    if (typeof formattedData.benefits === 'string') {
      // Split by comma and create an actual array
      const benefitsArray = formattedData.benefits
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      formattedData.benefits = benefitsArray;
    }
    
    // Convert instructions string to proper PostgreSQL array format if needed
    if (typeof formattedData.instructions === 'string') {
      // Split by comma and create an actual array
      const instructionsArray = formattedData.instructions
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      formattedData.instructions = instructionsArray;
    }
    
    // Add user_id and created_at
    const poseEntry = {
      ...formattedData,
      user_id: userData.user.id,
      created_at: new Date().toISOString()
    };
    
    console.log('Attempting to save pose data:', {
      table: 'pose_history',
      user_id: userData.user.id,
      pose_name: poseData.pose_name
    });
    
    // Insert into pose_history table
    const { data, error } = await supabase
      .from('pose_history')
      .insert(poseEntry)
      .select();
    
    if (error) {
      console.error('Error saving pose to history:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return { data: null, error };
    }
    
    console.log('Successfully saved pose to history:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Exception during save pose to history:', err);
    return { data: null, error: err };
  }
};

// Get user's pose history
export const getUserPoseHistory = async () => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Query pose_history table filtered by user_id and ordered by creation date
    const { data, error } = await supabase
      .from('pose_history')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pose history:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Exception during get pose history:', err);
    return { data: null, error: err };
  }
};

// Delete pose from history
export const deletePoseFromHistory = async (poseId: string) => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Delete from pose_history ensuring it belongs to the current user
    const { data, error } = await supabase
      .from('pose_history')
      .delete()
      .eq('id', poseId)
      .eq('user_id', userData.user.id);
    
    if (error) {
      console.error('Error deleting pose from history:', error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error('Exception during delete pose from history:', err);
    return { success: false, error: err };
  }
}; 