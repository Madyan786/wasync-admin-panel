const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Vercel environment variables
const envVars = {
  REACT_APP_FIREBASE_API_KEY: 'AIzaSyAuVlHSPRo4f8nzyl904bbsYbjsBr8zxDQ',
  REACT_APP_FIREBASE_AUTH_DOMAIN: 'pulse-82887.firebaseapp.com',
  REACT_APP_FIREBASE_PROJECT_ID: 'pulse-82887',
  REACT_APP_FIREBASE_STORAGE_BUCKET: 'pulse-82887.firebasestorage.app',
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: '1027307508199',
  REACT_APP_FIREBASE_APP_ID: '1:1027307508199:web:2853902f6eaf1c17e86d42',
  REACT_APP_ADMIN_EMAIL: 'admin@wasync.com'
};

console.log('🚀 Starting Vercel Deployment...\n');

try {
  // Build the project first
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Build successful!\n');

  // Deploy to Vercel
  console.log('🌐 Deploying to Vercel...');
  console.log('⚠️  Please login to Vercel if prompted\n');
  
  const deployCmd = `vercel --prod --token ${process.env.VERCEL_TOKEN || ''}`;
  execSync(deployCmd, { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n🎉 Deployment Complete!');
  console.log('📝 Check the URL above for your live admin panel\n');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
