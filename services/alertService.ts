// Re-export from new implementation with adapter for backward compatibility
import alertServiceNew from '@/lib/services/alertService';
import storageServiceNew from '@/lib/services/storageService';

class AlertService {
  async triggerEmergencyAlert(): Promise<void> {
    try {
      // Get emergency contacts from new storage service
      const contacts = storageServiceNew.getContacts();
      const profile = storageServiceNew.getUserProfile();

      if (contacts.length === 0) {
        throw new Error('No emergency contacts configured');
      }

      // Use new alert service to send alerts
      const { alertData, alertLinks } = await alertServiceNew.sendAlertToContacts(
        contacts,
        profile
      );

      // Open all alert links
      alertServiceNew.openAllAlertLinks(alertLinks);

      return Promise.resolve();
    } catch (error) {
      console.error('Error triggering emergency alert:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  formatAlertMessage(location: { lat: number; lng: number } | null): string {
    if (location) {
      return `EMERGENCY! I need help at: https://www.google.com/maps?q=${location.lat},${location.lng}`;
    }
    return 'EMERGENCY! I need help! (Location unavailable)';
  }

  openMessagingApp(contact: any, message: string): void {
    const encodedMessage = encodeURIComponent(message);

    if (contact.preferredMethod === 'whatsapp') {
      const link = alertServiceNew.generateWhatsAppLink(contact.phone, message);
      window.open(link, '_blank');
    } else {
      const link = alertServiceNew.generateSMSLink(contact.phone, message);
      window.open(link, '_blank');
    }
  }
}

export const alertService = new AlertService();
