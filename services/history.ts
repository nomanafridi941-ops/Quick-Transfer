// Local Transfer History Service
// Stores last 3 transfers in localStorage (privacy-friendly, device-only)

export interface HistoryItem {
  id: string;
  code: string;
  name: string;
  size: number;
  type: 'sent' | 'received';
  timestamp: number;
  expiryMinutes?: number;
}

const HISTORY_KEY = 'quicktransfer_history';
const MAX_HISTORY_ITEMS = 3;

// Get all history items
export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Add a new history item
export const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>): void => {
  try {
    const history = getHistory();
    
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    // Add to beginning and keep only last 3
    const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

// Clear all history
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

// Remove a specific history item
export const removeFromHistory = (id: string): void => {
  try {
    const history = getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to remove history item:', error);
  }
};
