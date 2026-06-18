import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: 'AIzaSyAi6BptwN63ruuHJiTmm_ofYUyquAaPf9U',
  authDomain: 'chords-viewer.firebaseapp.com',
  databaseURL: 'https://chords-viewer.firebaseio.com',
  projectId: 'chords-viewer',
  storageBucket: 'chords-viewer.appspot.com',
  messagingSenderId: '98010485379',
  appId: '1:98010485379:web:bf6700c3e06ba149ce81b6',
  measurementId: 'G-YYGZ8HR9JB',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);
