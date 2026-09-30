export type UserRole = 'citizen' | 'government' | 'analyst';

export type AuthRole = 'citizen' | 'government';

export interface UserProfile {
  id: string;
  name: string;
  role: AuthRole;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  jurisdiction?: {
    level: 'National' | 'State' | 'District';
    state?: string;
    district?: string;
  };
  employeeId?: string;
  citizenPincode?: string;
  citizenDistrict?: string;
  citizenState?: string;
  avatarUrl?: string;
}

export type IndianLanguage = 
  | 'en' // English
  | 'ta' // Tamil
  | 'hi' // Hindi
  | 'te' // Telugu
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'bn' // Bengali
  | 'mr' // Marathi;

export interface LanguageInfo {
  code: IndianLanguage;
  name: string;
  nativeName: string;
  script: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari' },
];

export type InfrastructureCategory =
  | 'Roads'
  | 'Public transport'
  | 'Healthcare'
  | 'Education'
  | 'Water'
  | 'Sanitation'
  | 'Electricity'
  | 'Internet/connectivity'
  | 'Waste management'
  | 'Street lighting'
  | 'Housing'
  | 'Agriculture'
  | 'Flood management'
  | 'Public safety'
  | 'Other';

export const ALL_CATEGORIES: InfrastructureCategory[] = [
  'Roads',
  'Public transport',
  'Healthcare',
  'Education',
  'Water',
  'Sanitation',
  'Electricity',
  'Internet/connectivity',
  'Waste management',
  'Street lighting',
  'Housing',
  'Agriculture',
  'Flood management',
  'Public safety',
  'Other',
];

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type UrgencyLevel = 'Immediate (0-7 days)' | 'Urgent (1-4 weeks)' | 'Medium-term' | 'Scheduled';

export type RequestStatus = 
  | 'Submitted'
  | 'AI Categorised'
  | 'Verified / Under Review'
  | 'Clustered'
  | 'Forwarded for Review'
  | 'Action Planned'
  | 'Resolved';

export interface LocationData {
  state: string;
  district: string;
  talukOrVillage?: string;
  pincode?: string;
  lat: number;
  lng: number;
  isAutoDetected?: boolean;
}

export interface CitizenRequest {
  id: string;
  timestamp: string;
  originalText: string;
  originalLanguage: string;
  languageCode: IndianLanguage | string;
  inputMode: 'text' | 'voice' | 'messaging';
  translatedTextEn: string;
  category: InfrastructureCategory;
  location: LocationData;
  severity: SeverityLevel;
  urgency: UrgencyLevel;
  estimatedPeopleAffected: number;
  infrastructureType: string;
  requiredDevelopmentType: 'New Construction' | 'Repair / Maintenance' | 'Capacity Upgrade' | 'Equipment / Staffing';
  sentimentContext: string;
  keyEntities: string[];
  status: RequestStatus;
  clusterId?: string;
  explainableReasoning?: string;
  audioRecordingDuration?: number;
  verifiedByAnalyst?: boolean;
  citizenFeedbackFlagged?: boolean;
}

export interface DistrictMetric {
  districtId: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  // Demographic
  population: number;
  populationDensity: number; // per sq km
  ruralPercentage: number;
  urbanPercentage: number;
  literacyRate: number;
  // Request aggregates
  totalRequests: number;
  criticalRequests: number;
  monthlyGrowthRate: number; // e.g. +31%
  categoryRequests: Record<InfrastructureCategory, number>;
  // Infrastructure gap indicators (0-100, where 0 is deficient, 100 is benchmark)
  healthcareScore: number; // hospital beds / distance to PHC
  roadsScore: number; // all-weather connectivity %
  waterScore: number; // piped water supply coverage %
  educationScore: number; // school pupil-teacher ratio & proximity
  electricityScore: number; // daily uninterrupted power hours
  connectivityScore: number; // broadband/mobile coverage
  overallInfraScore: number; // average
  // Gap score (100 - overallInfraScore)
  calculatedGapScore: number;
  // Public Investment
  currentAnnualCapexCr: number; // in ₹ Crores
  plannedProjectsCount: number;
  fundUtilizationRate: number; // %
  // AI Decision Support Priority Index (0 - 100)
  priorityIndex: number;
  topGaps: InfrastructureCategory[];
}

export interface DemandCluster {
  id: string;
  title: string;
  district: string;
  state: string;
  category: InfrastructureCategory;
  requestCount: number;
  estimatedPopulationAffected: number;
  commonIssue: string;
  languagesRepresented: string[];
  trend: 'Rapidly Rising' | 'Steady' | 'Spiking';
  severity: SeverityLevel;
  representativeQuotes: {
    original: string;
    english: string;
    language: string;
  }[];
  suggestedIntervention: string;
  priorityScore: number;
}

export interface PriorityFormulaWeights {
  citizenDemand: number;     // e.g. 0.30
  infrastructureGap: number; // e.g. 0.20
  populationImpact: number;  // e.g. 0.15
  urgency: number;           // e.g. 0.15
  accessibilityGap: number;  // e.g. 0.10
  requestGrowth: number;     // e.g. 0.10
}

export const DEFAULT_WEIGHTS: PriorityFormulaWeights = {
  citizenDemand: 0.30,
  infrastructureGap: 0.20,
  populationImpact: 0.15,
  urgency: 0.15,
  accessibilityGap: 0.10,
  requestGrowth: 0.10,
};

export interface AIRecommendation {
  id: string;
  projectTitle: string;
  location: {
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  infrastructureCategory: InfrastructureCategory;
  priorityIndex: number;
  estimatedPopulationAffected: number;
  citizenDemandCount: number;
  infrastructureGapScore: number;
  supportingIndicators: {
    label: string;
    value: string;
    benchmark: string;
    status: 'Severe Gap' | 'Moderate Gap' | 'Adequate';
  }[];
  existingInvestmentCr: number;
  investmentCoverageStatus: 'Severely Underfunded' | 'Moderate Pipeline' | 'Balanced';
  suggestedIntervention: string;
  expectedImpact: string;
  confidenceScore: number; // 0-100%
  evidenceNarrative: string[];
  lastUpdated: string;
  formulaBreakdown: {
    demandComponent: number;
    gapComponent: number;
    populationComponent: number;
    urgencyComponent: number;
    accessibilityComponent: number;
    growthComponent: number;
  };
}

export interface ImpactSimulationResult {
  interventionType: string;
  targetDistrict: string;
  category: InfrastructureCategory;
  estimatedPopulationBenefited: number;
  accessibilityImprovementPercent: number;
  requestsDirectlyAddressed: number;
  infrastructureGapReductionPercent: number;
  estimatedCapexCr: number;
  socialRoiScore: number; // 1-10
  keyBenefits: string[];
  mitigatedVulnerabilities: string[];
}
