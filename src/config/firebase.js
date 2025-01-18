import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the domain for use in other components
export const ALLOWED_DOMAIN = process.env.REACT_APP_DOMAIN;

// Convert comma-separated emails to array and trim whitespace
export const ADMIN_EMAILS = process.env.REACT_APP_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

// Convert points string to array
export const POINTS = process.env.REACT_APP_POINTS?.split(',').map(point => {
  // Convert numeric strings to numbers, leave '?' as string
  return point.trim() === '?' ? point.trim() : Number(point.trim());
}) || [0, 1, 3, 5, 8, 13, 21, 34, 55, '?'];

// Helper function to check if a user is admin
export const isAdmin = (email) => ADMIN_EMAILS.includes(email); 