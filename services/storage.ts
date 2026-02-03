import { TransferData } from '../types';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, remove } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdy-_Mh4x2TbkkJONrDwsLvbH8n33b-D4",
  authDomain: "quicktransfer-af521.firebaseapp.com",
  databaseURL: "https://quicktransfer-af521-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quicktransfer-af521",
  storageBucket: "quicktransfer-af521.firebasestorage.app",
  messagingSenderId: "677341634923",
  appId: "1:677341634923:web:28d7fbd1be8699ab7eac2e",
  measurementId: "G-HC2Q1XVX8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveData = async (data: TransferData): Promise<void> => {
  const transferRef = ref(database, 'transfers/' + data.code);
  await set(transferRef, data);
};

export const getDataByCode = async (code: string): Promise<TransferData | undefined> => {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, 'transfers/' + code));
  
  if (snapshot.exists()) {
    const data = snapshot.val() as TransferData;
    const now = Date.now();
    // Check if not expired (10 min expiry)
    if (data.expiresAt > now) {
      return data;
    }
  }
  return undefined;
};

// Delete transfer data after download
export const deleteTransfer = async (code: string): Promise<void> => {
  const transferRef = ref(database, 'transfers/' + code);
  await remove(transferRef);
};
