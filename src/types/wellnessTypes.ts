export interface NutritionGuide {
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  title: string;
  focus: string;
  micronutrients: string[];
  seedCycling: string;
  recommendedFoods: string[];
  foodsToLimit: string[];
  mealIdea: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
  whyItWorks: string;
}

export interface SexualHealthTopic {
  id: string;
  category: 'birth_control' | 'stis' | 'consent' | 'fertility';
  title: string;
  summary: string;
  keyFacts: string[];
  actionTips: string[];
}

export interface RedFlagSymptom {
  id: string;
  symptom: string;
  category: 'bleeding' | 'pain' | 'cycle_length' | 'discharge';
  urgency: 'routine' | 'prompt' | 'immediate';
  description: string;
  whenToConsult: string;
  disclaimer: string;
}

export interface MentalHealthResource {
  id: string;
  title: string;
  type: 'helpline' | 'exercise' | 'article';
  region?: string;
  contact?: string;
  description: string;
  availability?: string;
  isFree?: boolean;
}

export interface LegalRightTopic {
  id: string;
  category: 'maternity' | 'labor' | 'harassment' | 'health_rights';
  title: string;
  countryScope: string; // e.g. "Peru / Latin America & Global Standards"
  lawReference?: string;
  summary: string;
  practicalRights: string[];
  howToClaim: string[];
}

export interface SafetyHotline {
  id: string;
  name: string;
  number: string;
  country: string;
  type: 'gender_violence' | 'police' | 'mental_health' | 'medical';
  description: string;
  freeAndConfidential: boolean;
}

export interface SafeZonePoint {
  id: string;
  name: string;
  type: 'police' | 'pharmacy_247' | 'shelter' | 'community_hub';
  address: string;
  status: 'verified_safe' | 'well_lit';
  description: string;
}

export interface OpportunityItem {
  id: string;
  category: 'scholarship' | 'mentorship' | 'finance' | 'organization';
  title: string;
  organization: string;
  targetAudience: string;
  description: string;
  linkText: string;
  tags: string[];
}
