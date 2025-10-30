// Voice Commands Library - Supported voice commands and their actions

export type VoiceCommandAction =
  | 'trigger_alert'
  | 'open_first_aid'
  | 'call_contact'
  | 'speak_location'
  | 'stop_listening'
  | 'open_profile'
  | 'help';

export interface VoiceCommandDefinition {
  action: VoiceCommandAction;
  patterns: string[]; // Phrases that trigger this command
  description: string;
  parameters?: string[]; // Optional parameters (e.g., guide name, contact name)
}

export const voiceCommands: VoiceCommandDefinition[] = [
  {
    action: 'trigger_alert',
    patterns: [
      'emergency',
      'help',
      'help me',
      'i need help',
      'call for help',
      'send alert',
      'emergency alert',
      'alert',
      '911',
      'danger',
    ],
    description: 'Trigger emergency alert to all contacts',
  },
  {
    action: 'open_first_aid',
    patterns: [
      'start cpr',
      'cpr',
      'choking',
      'bleeding',
      'burns',
      'fracture',
      'broken bone',
      'heart attack',
      'seizure',
      'shock',
      'first aid',
      'show me cpr',
      'how to do cpr',
      'help with cpr',
    ],
    description: 'Open specific first aid guide',
    parameters: ['scenario_name'], // e.g., "cpr", "choking"
  },
  {
    action: 'call_contact',
    patterns: [
      'call contact',
      'contact',
      'call emergency contact',
      'notify contact',
      'message contact',
    ],
    description: 'Initiate contact alert',
  },
  {
    action: 'speak_location',
    patterns: [
      'where am i',
      'my location',
      'current location',
      'where is this',
      'what is my location',
      'tell me my location',
    ],
    description: 'Speak current GPS location',
  },
  {
    action: 'stop_listening',
    patterns: [
      'stop listening',
      'stop',
      'cancel',
      'turn off',
      'deactivate',
      'disable voice',
      'stop voice',
    ],
    description: 'Deactivate voice control',
  },
  {
    action: 'open_profile',
    patterns: [
      'open profile',
      'my profile',
      'show profile',
      'profile',
      'medical info',
      'medical information',
    ],
    description: 'Open user profile page',
  },
  {
    action: 'help',
    patterns: [
      'help',
      'what can you do',
      'commands',
      'voice commands',
      'how do i use this',
      'what can i say',
    ],
    description: 'Show available voice commands',
  },
];

// Map first aid keywords to scenario IDs
export const firstAidKeywords: Record<string, string> = {
  cpr: 'cpr',
  'cardiopulmonary resuscitation': 'cpr',
  choking: 'choking',
  'heimlich maneuver': 'choking',
  bleeding: 'severe-bleeding',
  'severe bleeding': 'severe-bleeding',
  blood: 'severe-bleeding',
  burns: 'burns',
  burn: 'burns',
  fire: 'burns',
  fracture: 'fracture',
  'broken bone': 'fracture',
  shock: 'shock',
  'heart attack': 'heart-attack',
  'chest pain': 'heart-attack',
  seizure: 'seizure',
  convulsion: 'seizure',
};

// Get all available commands as a list
export const getAllCommands = (): string[] => {
  return voiceCommands.flatMap((cmd) => cmd.patterns);
};

// Get command descriptions for help
export const getCommandDescriptions = (): Array<{
  examples: string[];
  description: string;
}> => {
  return voiceCommands.map((cmd) => ({
    examples: cmd.patterns.slice(0, 3), // First 3 examples
    description: cmd.description,
  }));
};

export default voiceCommands;
