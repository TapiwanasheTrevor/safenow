// Storage Service - LocalStorage wrapper for SafeNow app
// Handles all persistent data storage on-device

export interface UserProfile {
  personal: {
    name: string;
    age: number;
    bloodType: string;
    photo?: string;
  };
  medical: {
    allergies: string[];
    conditions: string[];
    medications: string[];
    lastUpdated: string;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  preferredMethod: 'sms' | 'whatsapp';
}

export interface AlertHistoryItem {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  message: string;
  contacts: { name: string; phone: string }[];
}

const STORAGE_KEYS = {
  USER_PROFILE: 'safeNow_userProfile',
  EMERGENCY_CONTACTS: 'safeNow_emergencyContacts',
  ALERT_HISTORY: 'safeNow_alertHistory',
  SETTINGS: 'safeNow_settings',
} as const;

class StorageService {
  // Generic save/get methods
  save<T>(key: string, data: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  // User Profile Methods
  saveUserProfile(profile: UserProfile): boolean {
    return this.save(STORAGE_KEYS.USER_PROFILE, profile);
  }

  getUserProfile(): UserProfile | null {
    return this.get<UserProfile>(STORAGE_KEYS.USER_PROFILE);
  }

  // Emergency Contacts Methods
  saveContacts(contacts: EmergencyContact[]): boolean {
    return this.save(STORAGE_KEYS.EMERGENCY_CONTACTS, contacts);
  }

  getContacts(): EmergencyContact[] {
    return this.get<EmergencyContact[]>(STORAGE_KEYS.EMERGENCY_CONTACTS) || [];
  }

  addContact(contact: Omit<EmergencyContact, 'id'>): boolean {
    const contacts = this.getContacts();
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };
    contacts.push(newContact);
    return this.saveContacts(contacts);
  }

  deleteContact(contactId: string): boolean {
    const contacts = this.getContacts();
    const filtered = contacts.filter((c) => c.id !== contactId);
    return this.saveContacts(filtered);
  }

  updateContact(contactId: string, updates: Partial<EmergencyContact>): boolean {
    const contacts = this.getContacts();
    const index = contacts.findIndex((c) => c.id === contactId);
    if (index === -1) return false;

    contacts[index] = { ...contacts[index], ...updates };
    return this.saveContacts(contacts);
  }

  // Alert History Methods
  saveAlertHistory(alert: Omit<AlertHistoryItem, 'id'>): boolean {
    const history = this.getAlertHistory();
    const newAlert: AlertHistoryItem = {
      ...alert,
      id: Date.now().toString(),
    };

    history.unshift(newAlert); // Add to beginning

    // Keep only last 50 alerts
    if (history.length > 50) {
      history.pop();
    }

    return this.save(STORAGE_KEYS.ALERT_HISTORY, history);
  }

  getAlertHistory(): AlertHistoryItem[] {
    return this.get<AlertHistoryItem[]>(STORAGE_KEYS.ALERT_HISTORY) || [];
  }

  clearAlertHistory(): boolean {
    return this.save(STORAGE_KEYS.ALERT_HISTORY, []);
  }

  // Settings Methods
  saveSettings(settings: Record<string, any>): boolean {
    return this.save(STORAGE_KEYS.SETTINGS, settings);
  }

  getSettings(): Record<string, any> {
    return this.get<Record<string, any>>(STORAGE_KEYS.SETTINGS) || {};
  }

  // Check if storage is available
  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Get storage usage (approximate)
  getStorageSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;
