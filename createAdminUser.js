/**
 * Create Admin User Script
 * 
 * This script creates an admin user in Firebase Authentication
 * 
 * Usage:
 * 1. Download your Firebase Admin SDK service account key JSON
 * 2. Save it as 'serviceAccountKey.json' in this directory
 * 3. Run: node createAdminUser.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Admin user credentials
const ADMIN_EMAIL = 'admin@wasync.com';
const ADMIN_PASSWORD = 'admin123456';
const ADMIN_DISPLAY_NAME = 'WASync Admin';

// Check if service account key exists
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  console.log('\n📋 Setup Instructions:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com');
  console.log('2. Select your WASync project');
  console.log('3. Go to Project Settings (gear icon) → Service Accounts');
  console.log('4. Click "Generate new private key"');
  console.log('5. Save the JSON file as "serviceAccountKey.json" in this directory');
  console.log('6. Run this script again: node createAdminUser.js\n');
  process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create admin user
async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`👤 Display Name: ${ADMIN_DISPLAY_NAME}\n`);

    // Check if user already exists
    try {
      const existingUser = await admin.auth().getUserByEmail(ADMIN_EMAIL);
      console.log('⚠️  User already exists!');
      console.log(`UID: ${existingUser.uid}`);
      console.log(`Email: ${existingUser.email}`);
      console.log('\nTo update the password, please use Firebase Console or modify this script.\n');
      process.exit(0);
    } catch (error) {
      // User doesn't exist, create new one
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Create the user
    const userRecord = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      emailVerified: true,
      password: ADMIN_PASSWORD,
      displayName: ADMIN_DISPLAY_NAME,
      disabled: false
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🆔 UID: ${userRecord.uid}`);
    console.log(`📧 Email: ${userRecord.email}`);
    console.log(`👤 Name: ${userRecord.displayName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 Login Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

    // Optional: Add custom claim for admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'admin',
      isAdmin: true
    });

    console.log('✅ Admin role assigned to user!\n');
    console.log('🎉 You can now login to the admin panel!\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the script
createAdminUser();
