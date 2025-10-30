# SafeNow Emergency Response System

A Progressive Web Application (PWA) that provides offline emergency response guidance with voice-activated controls and location-based alerts.

## Features

### 🚨 Emergency Alert System
- One-tap emergency button to alert contacts
- GPS location sharing via SMS/WhatsApp
- Alert history tracking
- Works offline

### 🏥 First Aid Guides
- 8 comprehensive emergency scenarios:
  - CPR (Cardiopulmonary Resuscitation)
  - Choking (Heimlich Maneuver)
  - Severe Bleeding Control
  - Burns Treatment
  - Fractures and Broken Bones
  - Shock Treatment
  - Heart Attack Response
  - Seizure Response
- Step-by-step instructions
- Voice playback for hands-free guidance
- Searchable and filterable by category
- Completely offline

### 🎤 Voice Control
- Hands-free operation using Web Speech API
- Supported commands:
  - "Emergency" / "Help" - Trigger emergency alert
  - "Start CPR" - Open CPR guide
  - "Choking" - Open choking guide
  - "Where am I" - Speak current location
  - "Stop listening" - Deactivate voice control
- Real-time command recognition
- Command history

### 👤 User Profile & Medical Data
- Personal information (name, age, blood type)
- Medical conditions and allergies
- Current medications
- Emergency contacts management
- All data stored locally and securely

### 📱 Progressive Web App
- Install on home screen
- Works completely offline
- Fast loading and performance
- Mobile-first responsive design
- Cross-platform compatibility

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API
- **Browser APIs**:
  - Web Speech API (voice recognition & synthesis)
  - Geolocation API (location tracking)
  - LocalStorage (data persistence)
- **PWA**: Service Worker for offline functionality

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Setting Up Your Profile
1. Navigate to the Profile tab
2. Fill in your personal information
3. Add medical conditions, allergies, and medications
4. Add emergency contacts with phone numbers

### Using First Aid Guides
1. Go to First Aid tab
2. Search or browse emergency scenarios
3. Tap on a scenario to view step-by-step instructions
4. Use voice playback for hands-free guidance

### Voice Commands
1. Go to Voice tab
2. Tap the microphone button to start listening
3. Speak any supported command
4. The app will execute the command and provide feedback

### Emergency Alerts
1. Tap the large red EMERGENCY button on home screen
2. Confirm your location
3. Review contacts to be alerted
4. Send alert - messaging apps will open with pre-filled messages

## Browser Compatibility

- Chrome/Edge 90+ (recommended)
- Safari 14+ (iOS support)
- Firefox 88+

## Security & Privacy

- All data stored locally on device only
- No server-side data transmission
- No user accounts or authentication required
- No tracking or analytics
- Location only accessed when needed for alerts

## License

Created with v0 by Vercel
