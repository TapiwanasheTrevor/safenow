// Alert Service - Emergency alert message generation and dispatch
// Handles SMS/WhatsApp deep links and alert history

import locationService from './locationService';
import storageService, { type EmergencyContact, type UserProfile } from './storageService';

export interface AlertMessage {
  message: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  mapLink: string;
}

export interface AlertLink {
  contact: EmergencyContact;
  link: string;
  method: 'sms' | 'whatsapp';
}

class AlertService {
  // Generate emergency alert message
  async generateAlertMessage(userProfile?: UserProfile | null): Promise<AlertMessage> {
    const locationResult = await locationService.getCurrentLocation();

    if (!locationResult.success || !locationResult.location) {
      throw new Error(locationResult.error || 'Unable to get location');
    }

    const { latitude, longitude } = locationResult.location;
    const mapLink = locationService.getMapLink(latitude, longitude);

    // Try to get address (optional, works only online)
    let address: string | undefined;
    try {
      address = await locationService.getReverseGeocode(latitude, longitude);
    } catch {
      address = undefined;
    }

    // Get user name if available
    const name = userProfile?.personal?.name || 'Someone';

    // Generate message
    const message = this.formatAlertMessage(name, mapLink, address);

    return {
      message,
      location: {
        latitude,
        longitude,
        address,
      },
      mapLink,
    };
  }

  // Format alert message text
  private formatAlertMessage(name: string, mapLink: string, address?: string): string {
    let message = `🚨 EMERGENCY ALERT! ${name} needs help!\n\n`;
    message += `Location: ${mapLink}\n`;

    if (address) {
      message += `\nAddress: ${address}\n`;
    }

    message += `\nThis is an automated emergency message from SafeNow app.`;

    return message;
  }

  // Generate SMS deep link
  generateSMSLink(phone: string, message: string): string {
    // Remove spaces and special characters from phone
    const cleanPhone = phone.replace(/[\s+()-]/g, '');

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // SMS deep link format: sms:+number?body=message
    return `sms:${cleanPhone}?body=${encodedMessage}`;
  }

  // Generate WhatsApp deep link
  generateWhatsAppLink(phone: string, message: string): string {
    // Remove spaces and special characters, keep + if international
    let cleanPhone = phone.replace(/[\s()-]/g, '');

    // Remove + for WhatsApp (they expect raw number)
    cleanPhone = cleanPhone.replace('+', '');

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp deep link format: https://wa.me/number?text=message
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  // Send alert to all contacts
  async sendAlertToContacts(
    contacts: EmergencyContact[],
    userProfile?: UserProfile | null
  ): Promise<{
    alertData: AlertMessage;
    alertLinks: AlertLink[];
  }> {
    // Generate alert message
    const alertData = await this.generateAlertMessage(userProfile);

    // Generate links for each contact
    const alertLinks: AlertLink[] = contacts.map((contact) => {
      const link =
        contact.preferredMethod === 'whatsapp'
          ? this.generateWhatsAppLink(contact.phone, alertData.message)
          : this.generateSMSLink(contact.phone, alertData.message);

      return {
        contact,
        link,
        method: contact.preferredMethod,
      };
    });

    // Save to alert history
    storageService.saveAlertHistory({
      timestamp: new Date().toISOString(),
      location: alertData.location,
      message: alertData.message,
      contacts: contacts.map((c) => ({ name: c.name, phone: c.phone })),
    });

    return {
      alertData,
      alertLinks,
    };
  }

  // Open alert link (opens SMS/WhatsApp app)
  openAlertLink(link: string): void {
    window.open(link, '_blank');
  }

  // Open all alert links (for quick send to all contacts)
  openAllAlertLinks(links: AlertLink[]): void {
    links.forEach((alertLink, index) => {
      // Slight delay between opens to avoid browser blocking
      setTimeout(() => {
        this.openAlertLink(alertLink.link);
      }, index * 500);
    });
  }

  // Get alert history
  getAlertHistory() {
    return storageService.getAlertHistory();
  }

  // Clear alert history
  clearAlertHistory(): boolean {
    return storageService.clearAlertHistory();
  }

  // Test alert (doesn't actually send, just generates)
  async testAlert(
    contacts: EmergencyContact[],
    userProfile?: UserProfile | null
  ): Promise<AlertMessage> {
    return this.generateAlertMessage(userProfile);
  }

  // Validate phone number format (basic)
  isValidPhoneNumber(phone: string): boolean {
    // Basic validation: must have at least 10 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  }

  // Format phone number for display
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    // Format as +X (XXX) XXX-XXXX for US/international
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    // Return as-is if format unknown
    return phone;
  }

  // Estimate alert send time
  estimateSendTime(contactCount: number): number {
    // Estimate 500ms per contact (for opening links with delay)
    return contactCount * 500;
  }
}

// Export singleton instance
const alertService = new AlertService();
export default alertService;
