import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';

// Login with email and password
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Auth state observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
