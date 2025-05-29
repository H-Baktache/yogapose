/**
 * Validates the presence of required environment variables
 * and provides helpful instructions if they are missing.
 */
export const validateEnvironmentVariables = (): boolean => {
  const missingVars: string[] = [];
  
  // Check for Supabase URL
  if (!import.meta.env.VITE_SUPABASE_URL) {
    missingVars.push('VITE_SUPABASE_URL');
  }
  
  // Check for Supabase Key
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    missingVars.push('VITE_SUPABASE_ANON_KEY');
  }
  
  // If there are missing variables, log helpful error messages
  if (missingVars.length > 0) {
    console.error(`
      ❌ CRITICAL ERROR: Missing environment variables:
      ${missingVars.join(', ')}
      
      Please create a .env file in the root directory with the following variables:
      
      VITE_SUPABASE_URL=your_supabase_url
      VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
      
      You can find these values in your Supabase project dashboard:
      1. Go to https://app.supabase.io/
      2. Select your project
      3. Go to Settings > API
      4. Copy the URL and anon/public key
    `);
    return false;
  }
  
  return true;
};

// Run validation on import
const isValid = validateEnvironmentVariables();
console.log(isValid ? '✅ Environment variables validated successfully' : '❌ Environment validation failed');

export default isValid; 