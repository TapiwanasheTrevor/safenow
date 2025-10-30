// First Aid Database - Complete emergency scenarios with step-by-step instructions

export interface FirstAidScenario {
  id: string;
  title: string;
  category: 'cardiac' | 'respiratory' | 'trauma' | 'medical';
  icon: string;
  description: string;
  steps: string[];
  warnings: string[];
  duration?: string;
}

export const firstAidData: FirstAidScenario[] = [
  {
    id: 'cpr',
    title: 'CPR - Cardiopulmonary Resuscitation',
    category: 'cardiac',
    icon: '❤️',
    description: 'For unresponsive person not breathing normally',
    steps: [
      'Check for responsiveness: Tap shoulders and shout "Are you okay?"',
      'Call for help: Shout for someone to call emergency services (911/112)',
      'Position the person: Lay them flat on their back on a firm surface',
      'Open airway: Tilt head back, lift chin to open airway',
      'Check breathing: Look, listen, feel for 10 seconds maximum',
      'Start compressions: Place heel of hand on center of chest',
      'Compress hard and fast: Push down 5-6cm, 100-120 compressions per minute',
      'Give 30 compressions, then 2 rescue breaths if trained',
      'Continue CPR until help arrives or person shows signs of life',
    ],
    warnings: [
      'Do not perform if person is breathing normally',
      'Do not give up - continue until help arrives',
    ],
    duration: 'Continue until help arrives',
  },
  {
    id: 'choking',
    title: 'Choking',
    category: 'respiratory',
    icon: '🫁',
    description: 'For person unable to breathe due to blocked airway',
    steps: [
      'Ask: "Are you choking?" - if they cannot speak, act immediately',
      'Encourage them to cough if they can',
      'If unable to cough: give 5 back blows',
      'Stand behind them, lean them forward',
      'Strike firmly between shoulder blades with heel of hand',
      'If back blows fail: give 5 abdominal thrusts (Heimlich)',
      'Stand behind, make fist above navel, pull sharply inward and upward',
      'Alternate 5 back blows and 5 abdominal thrusts',
      'Continue until object is dislodged or person becomes unconscious',
      'If unconscious: begin CPR and call emergency services',
    ],
    warnings: [
      'Do not perform on pregnant women or infants',
      'Seek medical check-up after abdominal thrusts',
    ],
  },
  {
    id: 'severe-bleeding',
    title: 'Severe Bleeding',
    category: 'trauma',
    icon: '🩸',
    description: 'For wounds with heavy blood flow',
    steps: [
      'Ensure your safety first - wear gloves if available',
      'Call for emergency help immediately',
      'Apply direct pressure to wound with clean cloth',
      'Maintain firm pressure for at least 10 minutes',
      'Do not remove cloth if blood soaks through - add more on top',
      'If possible, elevate injured area above heart level',
      'Apply pressure to pressure points if bleeding continues',
      'Secure bandage firmly once bleeding slows',
      'Keep person warm and lying down',
      'Monitor for shock: pale skin, rapid breathing, confusion',
    ],
    warnings: [
      'Do not remove embedded objects',
      'Do not use tourniquet unless trained',
      'Seek immediate medical care',
    ],
  },
  {
    id: 'burns',
    title: 'Burns',
    category: 'trauma',
    icon: '🔥',
    description: 'For thermal, chemical, or electrical burns',
    steps: [
      'Remove person from source of burn immediately',
      'Cool the burn with running water for 20 minutes',
      'Remove jewelry and tight clothing near burn (not stuck to skin)',
      'Do not apply ice directly - use cool running water only',
      'Cover burn loosely with sterile, non-stick bandage',
      'Do not break blisters or apply creams/ointments',
      'Give over-the-counter pain relief if needed',
      'Keep person warm with blanket (not on burned area)',
      'Seek medical help for large, deep, or facial burns',
    ],
    warnings: [
      'Never apply ice, butter, or creams',
      'Seek immediate help for electrical or chemical burns',
    ],
  },
  {
    id: 'fracture',
    title: 'Fracture or Broken Bone',
    category: 'trauma',
    icon: '🦴',
    description: 'For suspected broken bones',
    steps: [
      'Do not move the person unless in immediate danger',
      'Call for emergency medical help',
      'Immobilize the injured area - do not try to realign',
      'Apply ice pack wrapped in cloth to reduce swelling',
      'Support the injury with padding (pillows, towels)',
      'If bleeding, apply pressure with clean cloth',
      'Keep person warm and calm',
      'Do not give food or drink (may need surgery)',
      'Monitor for shock: pale skin, rapid breathing',
      'Wait for professional medical help to move person',
    ],
    warnings: [
      'Do not move neck or back injuries',
      'Do not attempt to straighten broken bones',
    ],
  },
  {
    id: 'shock',
    title: 'Shock',
    category: 'medical',
    icon: '⚠️',
    description: 'Life-threatening condition requiring immediate care',
    steps: [
      'Call emergency services immediately',
      'Lay person down on their back',
      'Elevate legs 30cm (if no head, neck, or back injury)',
      'Keep person warm with blankets',
      'Do not give food or drink',
      'Loosen tight clothing',
      'Turn head to side if vomiting',
      'Monitor breathing and pulse continuously',
      'Begin CPR if person stops breathing',
      'Stay with person until help arrives',
    ],
    warnings: [
      'Do not elevate legs if suspect head/spine injury',
      'This is a medical emergency - always call for help',
    ],
  },
  {
    id: 'heart-attack',
    title: 'Heart Attack',
    category: 'cardiac',
    icon: '💔',
    description: 'Chest pain, shortness of breath, arm pain',
    steps: [
      'Call emergency services immediately',
      'Help person sit down and rest (semi-upright position)',
      'Loosen any tight clothing',
      'If person has prescribed nitroglycerin, help them take it',
      'Give aspirin (300mg) if available and no allergy - chew it',
      'Keep person calm and reassured',
      'Monitor breathing and consciousness',
      'If person becomes unconscious: check breathing',
      'If not breathing: begin CPR immediately',
      'Stay with person until emergency services arrive',
    ],
    warnings: [
      'Never give aspirin to children or those with aspirin allergy',
      'This is a medical emergency',
    ],
  },
  {
    id: 'seizure',
    title: 'Seizure',
    category: 'medical',
    icon: '🧠',
    description: 'Uncontrolled muscle movements and loss of consciousness',
    steps: [
      'Stay calm and time the seizure',
      'Clear area of dangerous objects',
      'Cushion head with something soft',
      'Loosen tight clothing around neck',
      'Turn person on their side when possible (recovery position)',
      'Do NOT restrain the person',
      'Do NOT put anything in their mouth',
      'Stay with them until fully conscious',
      'Speak calmly and reassure them after seizure ends',
      'Call emergency services if: first seizure, lasts >5 min, or injury occurs',
    ],
    warnings: [
      'Never put objects in mouth',
      'Do not restrain movement',
      'Protect from injury but do not hold down',
    ],
  },
];

// Helper function to get scenario by ID
export const getFirstAidById = (id: string): FirstAidScenario | undefined => {
  return firstAidData.find((scenario) => scenario.id === id);
};

// Helper function to get scenarios by category
export const getFirstAidByCategory = (
  category: FirstAidScenario['category']
): FirstAidScenario[] => {
  return firstAidData.filter((scenario) => scenario.category === category);
};

// Category metadata
export const categories = [
  { id: 'all', name: 'All', icon: '🏥' },
  { id: 'cardiac', name: 'Cardiac', icon: '❤️' },
  { id: 'respiratory', name: 'Respiratory', icon: '🫁' },
  { id: 'trauma', name: 'Trauma', icon: '🔧' },
  { id: 'medical', name: 'Medical', icon: '💊' },
];

export default firstAidData;
