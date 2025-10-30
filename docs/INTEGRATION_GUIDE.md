# SafeNow Integration Guide

Quick reference for integrating the core services into React components.

---

## 📦 Importing Services

```typescript
// Storage
import storageService from '@/lib/services/storageService';

// Location
import locationService from '@/lib/services/locationService';

// Voice
import voiceService from '@/lib/services/voiceService';

// Alert
import alertService from '@/lib/services/alertService';

// Voice Command Processing
import voiceCommandProcessor from '@/lib/utils/voiceCommandProcessor';
import commandMatcher from '@/lib/utils/commandMatcher';

// Data
import { firstAidData, getFirstAidById } from '@/lib/data/firstAidData';
import { voiceCommands, getCommandDescriptions } from '@/lib/data/voiceCommands';

// PWA
import pwaUtils from '@/lib/utils/pwaUtils';
```

---

## 🏠 Home Page Integration

### Emergency Alert Button

```typescript
'use client';

import { useState } from 'react';
import alertService from '@/lib/services/alertService';
import storageService from '@/lib/services/storageService';
import { Button } from '@/components/ui/button';

export default function EmergencyButton() {
  const [loading, setLoading] = useState(false);

  const handleEmergencyAlert = async () => {
    setLoading(true);
    try {
      // Get contacts and profile
      const contacts = storageService.getContacts();
      const profile = storageService.getUserProfile();

      if (contacts.length === 0) {
        alert('No emergency contacts configured');
        return;
      }

      // Generate alert
      const { alertData, alertLinks } = await alertService.sendAlertToContacts(
        contacts,
        profile
      );

      // Open all alert links (SMS/WhatsApp)
      alertService.openAllAlertLinks(alertLinks);

      alert('Emergency alerts sent!');
    } catch (error) {
      console.error('Alert failed:', error);
      alert('Failed to send alerts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEmergencyAlert}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 text-white text-xl px-8 py-6"
    >
      {loading ? 'Sending...' : '🚨 EMERGENCY ALERT'}
    </Button>
  );
}
```

---

## 🎤 Voice Commands Integration

### Voice Command Page

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import voiceCommandProcessor from '@/lib/utils/voiceCommandProcessor';
import { Button } from '@/components/ui/button';
import type { VoiceCommandAction } from '@/lib/data/voiceCommands';
import type { CommandMatch } from '@/lib/utils/commandMatcher';

export default function VoiceCommandsPage() {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Initialize voice command processor
    voiceCommandProcessor.initialize({
      onCommandRecognized: (action: VoiceCommandAction, match: CommandMatch) => {
        setLastCommand(`${action} (${Math.round(match.confidence * 100)}% confidence)`);
      },

      onCommandExecuted: (action: VoiceCommandAction, success: boolean) => {
        if (!success) return;

        // Handle navigation based on action
        switch (action) {
          case 'trigger_alert':
            router.push('/?trigger_alert=true');
            break;
          case 'open_first_aid':
            const scenario = match.parameters?.scenario_name || 'cpr';
            router.push(`/first-aid/${scenario}`);
            break;
          case 'call_contact':
            router.push('/contacts');
            break;
          case 'open_profile':
            router.push('/profile');
            break;
        }
      },

      onError: (error: string) => {
        console.error('Voice error:', error);
      },

      onListeningStart: () => setIsListening(true),
      onListeningStop: () => setIsListening(false),
    });

    return () => {
      voiceCommandProcessor.destroy();
    };
  }, [router]);

  const toggleListening = () => {
    if (isListening) {
      voiceCommandProcessor.stopListening();
    } else {
      voiceCommandProcessor.startListening();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Voice Commands</h1>

      <Button
        onClick={toggleListening}
        className={isListening ? 'bg-red-500' : 'bg-green-500'}
      >
        {isListening ? '🎤 Stop Listening' : '🎤 Start Listening'}
      </Button>

      {isListening && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800">Listening for commands...</p>
        </div>
      )}

      {lastCommand && (
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <p className="text-blue-800">Last command: {lastCommand}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🏥 First Aid Integration

### First Aid List

```typescript
'use client';

import { firstAidData } from '@/lib/data/firstAidData';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function FirstAidPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">First Aid Guides</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {firstAidData.map((scenario) => (
          <Link key={scenario.id} href={`/first-aid/${scenario.id}`}>
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{scenario.icon}</span>
                <div>
                  <h3 className="font-bold">{scenario.title}</h3>
                  <p className="text-sm text-gray-600">{scenario.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### First Aid Detail Page

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getFirstAidById } from '@/lib/data/firstAidData';
import voiceCommandProcessor from '@/lib/utils/voiceCommandProcessor';
import { Button } from '@/components/ui/button';

export default function FirstAidDetailPage({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const scenario = getFirstAidById(params.id);

  if (!scenario) {
    return <div>Scenario not found</div>;
  }

  const speakStep = (stepIndex: number) => {
    if (stepIndex >= scenario.steps.length) return;

    voiceCommandProcessor.speakFirstAidStep(
      scenario.steps[stepIndex],
      stepIndex + 1,
      scenario.steps.length
    );
  };

  const nextStep = () => {
    const next = currentStep + 1;
    if (next < scenario.steps.length) {
      setCurrentStep(next);
      if (isVoiceMode) {
        speakStep(next);
      }
    }
  };

  const startVoiceGuide = () => {
    setIsVoiceMode(true);
    setCurrentStep(0);
    speakStep(0);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-5xl">{scenario.icon}</span>
        <h1 className="text-2xl font-bold">{scenario.title}</h1>
      </div>

      <p className="text-gray-600 mb-6">{scenario.description}</p>

      <Button onClick={startVoiceGuide} className="mb-6">
        🎤 Start Voice Guided Instructions
      </Button>

      <div className="space-y-4">
        {scenario.steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded border-2 ${
              index === currentStep
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="font-bold text-lg">Step {index + 1}</span>
              <p>{step}</p>
            </div>
          </div>
        ))}
      </div>

      {currentStep < scenario.steps.length - 1 && (
        <Button onClick={nextStep} className="mt-6 w-full">
          Next Step →
        </Button>
      )}

      {scenario.warnings.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-500 rounded">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ Warnings</h3>
          <ul className="list-disc list-inside space-y-1">
            {scenario.warnings.map((warning, index) => (
              <li key={index} className="text-yellow-800">{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

## 👤 Profile Integration

### Profile Form

```typescript
'use client';

import { useState, useEffect } from 'react';
import storageService from '@/lib/services/storageService';
import type { UserProfile } from '@/lib/services/storageService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodType: '',
    allergies: '',
    conditions: '',
    medications: '',
  });

  useEffect(() => {
    // Load existing profile
    const existingProfile = storageService.getUserProfile();
    if (existingProfile) {
      setProfile(existingProfile);
      setFormData({
        name: existingProfile.personal.name,
        age: existingProfile.personal.age.toString(),
        bloodType: existingProfile.personal.bloodType,
        allergies: existingProfile.medical.allergies.join(', '),
        conditions: existingProfile.medical.conditions.join(', '),
        medications: existingProfile.medical.medications.join(', '),
      });
    }
  }, []);

  const handleSave = () => {
    const newProfile: UserProfile = {
      personal: {
        name: formData.name,
        age: parseInt(formData.age),
        bloodType: formData.bloodType,
      },
      medical: {
        allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
        conditions: formData.conditions.split(',').map(s => s.trim()).filter(Boolean),
        medications: formData.medications.split(',').map(s => s.trim()).filter(Boolean),
        lastUpdated: new Date().toISOString(),
      },
    };

    if (storageService.saveUserProfile(newProfile)) {
      alert('Profile saved successfully!');
      setProfile(newProfile);
    } else {
      alert('Failed to save profile');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Medical Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Age</label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="30"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Blood Type</label>
          <Input
            value={formData.bloodType}
            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
            placeholder="A+"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Allergies (comma separated)</label>
          <Input
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            placeholder="Penicillin, Peanuts"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Medical Conditions (comma separated)</label>
          <Input
            value={formData.conditions}
            onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
            placeholder="Diabetes, Asthma"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Current Medications (comma separated)</label>
          <Input
            value={formData.medications}
            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
            placeholder="Insulin, Inhaler"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Profile
        </Button>
      </div>
    </div>
  );
}
```

---

## 📱 Contacts Management

### Emergency Contacts Page

```typescript
'use client';

import { useState, useEffect } from 'react';
import storageService from '@/lib/services/storageService';
import type { EmergencyContact } from '@/lib/services/storageService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    preferredMethod: 'sms' as 'sms' | 'whatsapp',
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    setContacts(storageService.getContacts());
  };

  const handleAdd = () => {
    const newContact: Omit<EmergencyContact, 'id'> = {
      ...formData,
      isPrimary: contacts.length === 0, // First contact is primary
    };

    if (storageService.addContact(newContact)) {
      alert('Contact added!');
      setFormData({ name: '', phone: '', relationship: '', preferredMethod: 'sms' });
      setShowForm(false);
      loadContacts();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this contact?')) {
      storageService.deleteContact(id);
      loadContacts();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Emergency Contacts</h1>

      <Button onClick={() => setShowForm(!showForm)} className="mb-6">
        {showForm ? 'Cancel' : '+ Add Contact'}
      </Button>

      {showForm && (
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Phone (e.g., +1234567890)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              placeholder="Relationship"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            />
            <select
              value={formData.preferredMethod}
              onChange={(e) => setFormData({ ...formData, preferredMethod: e.target.value as 'sms' | 'whatsapp' })}
              className="w-full p-2 border rounded"
            >
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <Button onClick={handleAdd} className="w-full">Save Contact</Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.phone}</p>
                <p className="text-sm text-gray-600">{contact.relationship}</p>
                <p className="text-sm">
                  Preferred: {contact.preferredMethod === 'sms' ? '📱 SMS' : '💬 WhatsApp'}
                </p>
              </div>
              <Button
                onClick={() => handleDelete(contact.id)}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}

        {contacts.length === 0 && (
          <p className="text-center text-gray-500">No emergency contacts added yet</p>
        )}
      </div>
    </div>
  );
}
```

---

## 📍 Location Integration

### Get Current Location

```typescript
import locationService from '@/lib/services/locationService';

const handleGetLocation = async () => {
  const result = await locationService.getCurrentLocation();

  if (result.success && result.location) {
    const { latitude, longitude } = result.location;

    // Show on map
    const mapLink = locationService.getMapLink(latitude, longitude);
    window.open(mapLink, '_blank');

    // Get address (optional)
    try {
      const address = await locationService.getReverseGeocode(latitude, longitude);
      console.log('Address:', address);
    } catch (error) {
      console.log('Address unavailable (offline)');
    }
  } else {
    alert(result.error || 'Failed to get location');
  }
};
```

---

## 🔔 PWA Features

### Install Prompt

```typescript
import pwaUtils from '@/lib/utils/pwaUtils';

const handleInstall = async () => {
  if (pwaUtils.canInstall()) {
    const outcome = await pwaUtils.showInstallPrompt();

    if (outcome === 'accepted') {
      console.log('App installed!');
    }
  } else {
    alert('App is already installed or install prompt not available');
  }
};
```

### Online/Offline Status

```typescript
import { useEffect, useState } from 'react';
import pwaUtils from '@/lib/utils/pwaUtils';

export function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = pwaUtils.onOnlineStatusChange((online) => {
      setIsOnline(online);
    });

    setIsOnline(pwaUtils.getOnlineStatus());

    return unsubscribe;
  }, []);

  return (
    <div className={isOnline ? 'text-green-500' : 'text-red-500'}>
      {isOnline ? '🟢 Online' : '🔴 Offline'}
    </div>
  );
}
```

---

## 🧪 Testing Examples

### Test Voice Commands

```typescript
// In browser console
voiceCommandProcessor.testSpeech('Hello, this is a test');
```

### Test Alert Generation

```typescript
// In browser console
const testAlert = async () => {
  const contacts = [
    { name: 'Test', phone: '+1234567890', preferredMethod: 'sms' }
  ];
  const result = await alertService.testAlert(contacts);
  console.log(result);
};
```

### Test Location

```typescript
// In browser console
const testLocation = async () => {
  const result = await locationService.getCurrentLocation();
  console.log(result);
};
```

---

## 🚀 Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Test in browser**:
   - Open http://localhost:3000
   - Open DevTools console
   - Test services directly

4. **Test PWA features**:
   - Build for production: `npm run build`
   - Start production server: `npm start`
   - Test service worker registration
   - Test offline functionality

---

## 📚 Reference

- All services are singletons - import and use directly
- No React context needed (services are stateless)
- Use `'use client'` for components that use browser APIs
- Check browser support before using features
- Handle errors gracefully (offline, permissions, etc.)

---

**Happy coding! 🎉**
