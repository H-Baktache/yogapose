// Script to check if required environment variables are set
// Run this with: node check-env.js

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.blue}Checking environment variables...${colors.reset}`);

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log(`${colors.red}❌ ERROR: .env file not found!${colors.reset}`);
  console.log(`${colors.yellow}Please create a .env file in the project root with the following variables:${colors.reset}`);
  console.log(`
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
`);
  console.log(`${colors.yellow}You can copy the .env.example file to get started.${colors.reset}`);
  process.exit(1);
}

// Read and parse .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  // Skip empty lines and comments
  if (!line || line.startsWith('#')) return;
  
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    const value = valueParts.join('='); // Rejoin in case the value contains = characters
    envVars[key.trim()] = value.trim();
  }
});

// Required variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

// Check for missing variables
const missingVars = requiredVars.filter(varName => !envVars[varName]);

if (missingVars.length > 0) {
  console.log(`${colors.red}❌ ERROR: Missing required environment variables:${colors.reset}`);
  missingVars.forEach(varName => {
    console.log(`  ${colors.yellow}${varName}${colors.reset}`);
  });
  process.exit(1);
}

// Check for placeholder values
const suspiciousValues = [];

if (envVars.VITE_SUPABASE_URL === 'https://your-project-id.supabase.co') {
  suspiciousValues.push('VITE_SUPABASE_URL (appears to be a placeholder)');
}

if (envVars.VITE_SUPABASE_ANON_KEY === 'your-anon-key') {
  suspiciousValues.push('VITE_SUPABASE_ANON_KEY (appears to be a placeholder)');
}

if (suspiciousValues.length > 0) {
  console.log(`${colors.yellow}⚠️ WARNING: The following variables appear to have placeholder values:${colors.reset}`);
  suspiciousValues.forEach(value => {
    console.log(`  ${colors.yellow}${value}${colors.reset}`);
  });
  console.log(`${colors.yellow}Please update them with your actual Supabase credentials.${colors.reset}`);
}

// Success!
if (missingVars.length === 0 && suspiciousValues.length === 0) {
  console.log(`${colors.green}✅ All required environment variables are set!${colors.reset}`);
  
  // Print masked values for verification
  console.log(`\n${colors.blue}Current environment variables:${colors.reset}`);
  requiredVars.forEach(varName => {
    const value = envVars[varName];
    const maskedValue = value.length > 8 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '********';
    console.log(`  ${colors.cyan}${varName}:${colors.reset} ${maskedValue}`);
  });
}

process.exit(suspiciousValues.length > 0 ? 1 : 0); 