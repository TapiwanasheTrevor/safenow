// Re-export from new implementation with backward compatibility
import {
  firstAidData as newFirstAidData,
  getFirstAidById,
  categories as newCategories,
  type FirstAidScenario as NewFirstAidScenario
} from '@/lib/data/firstAidData';

export interface FirstAidScenario {
  id: string
  title: string
  category: "cardiac" | "trauma" | "respiratory" | "burns" | "fractures" | "other" | "medical"
  icon: string
  description: string
  steps: string[]
  warnings: string[]
  duration?: string
}

// Map categories from new system to old system for backward compatibility
const categoryMap: Record<string, "cardiac" | "trauma" | "respiratory" | "burns" | "fractures" | "other" | "medical"> = {
  'cardiac': 'cardiac',
  'respiratory': 'respiratory',
  'trauma': 'trauma',
  'medical': 'other' // Map medical to "other" for backward compatibility
};

// Re-export first aid data from new implementation
export const firstAidData: FirstAidScenario[] = newFirstAidData.map(scenario => ({
  ...scenario,
  category: categoryMap[scenario.category] as any
}));

export function getScenarioById(id: string): FirstAidScenario | undefined {
  const scenario = getFirstAidById(id);
  if (!scenario) return undefined;

  return {
    ...scenario,
    category: categoryMap[scenario.category] as any
  };
}

export function getScenariosByCategory(category: string): FirstAidScenario[] {
  if (category === 'all') return firstAidData;
  return firstAidData.filter((scenario) => scenario.category === category);
}

export const categories = [
  { id: "all", name: "All", icon: "🏥" },
  { id: "cardiac", name: "Cardiac", icon: "❤️" },
  { id: "respiratory", name: "Respiratory", icon: "🫁" },
  { id: "trauma", name: "Trauma", icon: "🔧" },
  { id: "other", name: "Medical", icon: "💊" },
];
