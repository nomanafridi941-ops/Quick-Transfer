import { TransferData } from '../types';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, remove, update } from 'firebase/database';

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

// Returns { data, error }: error can be 'expired', 'invalid', or null
export const getDataByCode = async (code: string): Promise<{ data?: TransferData, error?: 'expired' | 'invalid' }> => {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, 'transfers/' + code));

  if (snapshot.exists()) {
    const data = snapshot.val() as TransferData;
    const now = Date.now();
    if (data.expiresAt <= now) {
      return { error: 'expired' };
    } else if (data.downloadCount >= data.maxDownloads) {
      return { error: 'limit' };
    } else {
      return { data };
    }
  }
  return { error: 'invalid' };
};

// Increment download count and delete if limit reached
export const incrementDownloadCount = async (code: string): Promise<boolean> => {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, 'transfers/' + code));
  
  if (snapshot.exists()) {
    const data = snapshot.val() as TransferData;
    const newCount = (data.downloadCount || 0) + 1;
    
    if (newCount >= data.maxDownloads) {
      // Delete if max downloads reached
      await deleteTransfer(code);
      return true;
    } else {
      // Update download count
      const transferRef = ref(database, 'transfers/' + code);
      await update(transferRef, { downloadCount: newCount });
      return false;
    }
  }
  return false;
};

// Delete transfer data after download
export const deleteTransfer = async (code: string): Promise<void> => {
  const transferRef = ref(database, 'transfers/' + code);
  await remove(transferRef);
};
