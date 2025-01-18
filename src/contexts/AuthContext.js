import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { ALLOWED_DOMAIN } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      hd: ALLOWED_DOMAIN
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLoginAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
      };

      localStorage.setItem('userSession', JSON.stringify(userInfo));
      
      if (!user.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        await signOut(auth);
        throw new Error(`Only ${ALLOWED_DOMAIN} emails are allowed`);
      }

      setCurrentUser(userInfo);
      return userInfo;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userSession');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // Check localStorage for existing session
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const userInfo = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLoginAt: new Date().toISOString(),
          emailVerified: user.emailVerified,
        };
        setCurrentUser(userInfo);
        localStorage.setItem('userSession', JSON.stringify(userInfo));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('userSession');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 