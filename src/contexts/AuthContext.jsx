import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, onAuthChange } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const user = await loginService(email, password);
    setCurrentUser(user);
    return user;
  }

  async function logout() {
    await logoutService();
    setCurrentUser(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
