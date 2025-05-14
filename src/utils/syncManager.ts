
// This is a utility to handle offline/online synchronization
// It will be expanded when integrated with Supabase

/**
 * Sync local time entries with the server
 * @param userId The user ID to sync entries for
 */
export const syncTimeEntries = async (userId: string): Promise<void> => {
  // Get entries from localStorage
  const entriesKey = `timeEntries_${userId}`;
  const storedEntries = localStorage.getItem(entriesKey);
  
  if (!storedEntries) return;
  
  try {
    const entries = JSON.parse(storedEntries);
    const unsyncedEntries = entries.filter((entry: any) => !entry.synced);
    
    if (unsyncedEntries.length === 0) return;
    
    // In a real app, this would make an API call to sync the entries
    console.log('Syncing entries with server:', unsyncedEntries);
    
    // Mark entries as synced
    const updatedEntries = entries.map((entry: any) => {
      if (!entry.synced) {
        return { ...entry, synced: true };
      }
      return entry;
    });
    
    // Update localStorage
    localStorage.setItem(entriesKey, JSON.stringify(updatedEntries));
    
    console.log('Entries synced successfully');
  } catch (error) {
    console.error('Failed to sync time entries:', error);
  }
};

/**
 * Register an online/offline event handler to sync data when connection is restored
 * @param userId The user ID to sync entries for
 */
export const registerSyncEvents = (userId: string): () => void => {
  const handleOnline = () => {
    console.log('Connection restored, syncing data...');
    syncTimeEntries(userId);
  };
  
  window.addEventListener('online', handleOnline);
  
  // Return a function to remove the event listener
  return () => {
    window.removeEventListener('online', handleOnline);
  };
};

/**
 * Save a time entry to localStorage
 * @param userId The user ID
 * @param entry The entry to save
 */
export const saveTimeEntryLocally = (userId: string, entry: any): void => {
  const entriesKey = `timeEntries_${userId}`;
  const storedEntries = localStorage.getItem(entriesKey);
  
  let entries = [];
  
  if (storedEntries) {
    try {
      entries = JSON.parse(storedEntries);
    } catch (error) {
      console.error('Failed to parse stored time entries', error);
    }
  }
  
  // Add the new entry and save
  entries.unshift(entry);
  localStorage.setItem(entriesKey, JSON.stringify(entries));
};

/**
 * Setup for PWA - registers the service worker
 */
export const setupPWA = (): void => {
  // This should be expanded to register a service worker for PWA functionality
  // For example:
  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', () => {
  //     navigator.serviceWorker.register('/service-worker.js')
  //       .then(registration => {
  //         console.log('SW registered: ', registration);
  //       })
  //       .catch(error => {
  //         console.log('SW registration failed: ', error);
  //       });
  //   });
  // }
};
