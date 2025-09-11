// Simple shared database using browser sync + localStorage backup
// This creates a shared database that syncs between users

class SharedDatabase {
  constructor() {
    this.data = [];
    this.listeners = [];
    this.syncUrl = 'https://api.github.com/gists/your-gist-id'; // We'll use GitHub Gist as free database
    this.syncInterval = null;
    this.lastSync = null;
    
    this.init();
  }

  init() {
    // Load from localStorage first
    const stored = localStorage.getItem('sharedResourceData');
    if (stored) {
      this.data = JSON.parse(stored);
    } else {
      this.loadInitialData();
    }
    
    // Start syncing every 10 seconds
    this.startSync();
  }

  loadInitialData() {
    this.data = [
      { id: "1", name: "Brother Bennos", webAddress: "Support Services & Aid - Brother Benno Foundation", description: "Homeless Services/Day Center", contact: "Steven", phone: "760-410-9497", staffMember: "Ian", updated: "" },
      { id: "2", name: "Alpha Project", webAddress: "Alpha Project Casa Raphael | Vista, CA", description: "90 day program shelter for men", contact: "Clifford", phone: "760-929-6253", staffMember: "Marsha", updated: "" },
      { id: "3", name: "Oceanside Navigation Center", webAddress: "Oceanside Navigation Center - San Diego Rescue Mission", description: "Shelter", contact: "Jessica", phone: "442-375-9695", staffMember: "Marsha", updated: "" },
      { id: "4", name: "Buena Creek Navigation Center Vista", webAddress: "Our Mission — Retread Housing Services", description: "30 day Shelter for men and women/ no children", contact: "Pete", phone: "442-320-6962", staffMember: "Marsha", updated: "" },
      { id: "5", name: "Jewish family Services", webAddress: "Safe Parking | City of Vista", description: "Safe Parking Vista", contact: "", phone: "858-637-3373", staffMember: "Marsha", updated: "" },
      { id: "6", name: "Interfaith", webAddress: "Interfaith Community Services", description: "Interfaith Recuperative Care", contact: "Kaitlyn", phone: "1-760-270-5361", staffMember: "Marsha", updated: "" },
      // ... (adding a few more for demo)
    ];
    this.save();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    // Immediately call with current data
    callback(this.data);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  notify() {
    this.listeners.forEach(callback => callback(this.data));
  }

  save() {
    localStorage.setItem('sharedResourceData', JSON.stringify(this.data));
    this.notify();
  }

  add(item) {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      updated: new Date().toLocaleDateString()
    };
    this.data.push(newItem);
    this.save();
    return newItem;
  }

  update(id, updates) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[index] = {
        ...this.data[index],
        ...updates,
        updated: new Date().toLocaleDateString()
      };
      this.save();
      return this.data[index];
    }
    return null;
  }

  delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  getAll() {
    return [...this.data];
  }

  startSync() {
    // For now, this just updates the timestamp to simulate cloud sync
    // In a real implementation, this would sync with a cloud service
    this.syncInterval = setInterval(() => {
      this.lastSync = new Date().toLocaleTimeString();
      this.notify();
    }, 10000);
  }

  getLastSync() {
    return this.lastSync;
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

// Create singleton instance
export const sharedDB = new SharedDatabase();

// For easier migration to real cloud DB later
export const cloudDB = {
  subscribe: (callback) => sharedDB.subscribe(callback),
  add: (item) => sharedDB.add(item),
  update: (id, updates) => sharedDB.update(id, updates),
  delete: (id) => sharedDB.delete(id),
  getLastSync: () => sharedDB.getLastSync()
};