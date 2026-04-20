# 🔐 Admin User Setup Guide

## Quick Setup (3 Steps)

### Step 1: Download Firebase Service Account Key

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your **WASync project**
3. Click the **gear icon** (⚙️) next to "Project Overview" → **Project settings**
4. Go to **Service accounts** tab
5. Under "Firebase Admin SDK", click **Generate new private key**
6. Click **Generate key** to download the JSON file
7. **Rename** the downloaded file to: `serviceAccountKey.json`
8. **Move** it to: `d:\dadminpanel\wasync-admin\serviceAccountKey.json`

### Step 2: Install Firebase Admin SDK

```bash
cd d:\dadminpanel\wasync-admin
npm install firebase-admin
```

### Step 3: Run the Script

```bash
node createAdminUser.js
```

## 🎉 Default Admin Credentials

After running the script successfully, you can login with:

- **Email:** `admin@wasync.com`
- **Password:** `admin123456`

⚠️ **IMPORTANT:** Change the password after first login for security!

---

## 📋 What the Script Does

1. ✅ Checks if service account key exists
2. ✅ Initializes Firebase Admin SDK
3. ✅ Creates admin user in Firebase Authentication
4. ✅ Sets email as verified
5. ✅ Assigns admin role via custom claims
6. ✅ Displays login credentials

---

## 🔧 Customizing Admin Credentials

If you want to change the default credentials, edit `createAdminUser.js`:

```javascript
// Line 16-18
const ADMIN_EMAIL = 'your-email@example.com';
const ADMIN_PASSWORD = 'your-secure-password';
const ADMIN_DISPLAY_NAME = 'Your Name';
```

Then run the script again.

---

## ❌ Troubleshooting

### Error: "serviceAccountKey.json not found"
- Make sure you downloaded and renamed the file correctly
- File should be in: `d:\dadminpanel\wasync-admin\serviceAccountKey.json`

### Error: "User already exists"
- The admin user was already created
- You can login with the default credentials
- To reset password, use Firebase Console → Authentication → Users

### Error: "Permission denied"
- Make sure your Firebase project has Authentication enabled
- Check that the service account has proper permissions

---

## 🗑️ Security Notes

1. **NEVER commit `serviceAccountKey.json` to Git**
   - It's already in `.gitignore`
   - Keep it secret and secure!

2. **Change the default password** after first login

3. **Enable 2FA** in Firebase Console for extra security

4. **Regularly rotate** service account keys

---

## ✅ Verify Setup

After creating the admin user:

1. Go to Firebase Console → Authentication → Users
2. You should see `admin@wasync.com` listed
3. Email should be verified ✓
4. You can now login to the admin panel!

---

## 🚀 Next Steps

1. Start the admin panel: `npm start`
2. Login with admin credentials
3. Explore the dashboard
4. Configure Firebase Firestore and Storage rules
5. Add more users if needed

---

## 📞 Need Help?

If you encounter any issues:
1. Check Firebase Console for errors
2. Verify service account permissions
3. Make sure Authentication is enabled in Firebase
4. Check the terminal output for error messages
