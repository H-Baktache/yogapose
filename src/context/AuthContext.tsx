import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  supabase, 
  signInWithEmail, 
  signUpWithEmail, 
  signOut as supabaseSignOut,
  getCurrentUser 
} from '../services/supabaseClient';
import { User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null, user: User | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active sessions on component mount
    const getUser = async () => {
      setLoading(true);
      try {
        console.log('Checking for existing user session...');
        const { user, error } = await getCurrentUser();
        
        if (error) {
          console.error('Error fetching user:', error);
        } else if (user) {
          console.log('Found existing user:', user.email);
          setUser(user);
        } else {
          console.log('No active user session found');
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        if (session?.user) {
          console.log('User logged in:', session.user.email);
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Signing in user:', email);
      const { data, error } = await signInWithEmail(email, password);
      
      if (!error && data.user) {
        console.log('AuthContext: Sign in successful for', email);
        setUser(data.user);
      } else if (error) {
        console.error('AuthContext: Sign in error:', error.message);
      }
      
      return { error };
    } catch (err) {
      console.error('Error during sign in:', err);
      return { error: new Error('An unexpected error occurred') as unknown as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Signing up user:', email);
      const { data, error } = await signUpWithEmail(email, password);
      
      if (!error && data.user) {
        console.log('AuthContext: Sign up successful for', email);
        setUser(data.user);
        return { error: null, user: data.user };
      } else if (error) {
        console.error('AuthContext: Sign up error:', error.message);
      }
      
      return { error, user: null };
    } catch (err) {
      console.error('Error during sign up:', err);
      return { 
        error: new Error('An unexpected error occurred') as unknown as AuthError,
        user: null
      };
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Signing out user');
      await supabaseSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut: logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 