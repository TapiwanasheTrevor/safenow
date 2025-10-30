// Re-export from new implementation with adapter for backward compatibility
import storageServiceNew from '@/lib/services/storageService';

class StorageService {
  save(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  saveUserProfile(profile: any): void {
    storageServiceNew.saveUserProfile(profile);
  }

  getUserProfile(): any {
    return storageServiceNew.getUserProfile();
  }

  saveContacts(contacts: any[]): void {
    // Clear existing contacts and add new ones
    const existingContacts = storageServiceNew.getContacts();
    existingContacts.forEach(contact => storageServiceNew.deleteContact(contact.id));

    contacts.forEach(contact => {
      storageServiceNew.addContact({
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship || 'Emergency Contact',
        preferredMethod: contact.preferredMethod || 'sms',
        isPrimary: contact.isPrimary || false,
      });
    });
  }

  getContacts(): any[] {
    return storageServiceNew.getContacts();
  }

  saveAlertHistory(alerts: any[]): void {
    // This method is deprecated, new service manages history automatically
    console.warn('saveAlertHistory is deprecated, history is managed automatically');
  }

  getAlertHistory(): any[] {
    return storageServiceNew.getAlertHistory();
  }

  clearAll(): void {
    storageServiceNew.clearAllData();
  }
}

export const storageService = new StorageService();
