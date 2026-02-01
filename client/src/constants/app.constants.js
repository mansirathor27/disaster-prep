
// Disaster Types
export const DISASTER_TYPES = {
  EARTHQUAKE: 'earthquake',
  CYCLONE: 'cyclone',
  FLOOD: 'flood',
  FIRE: 'fire',
  LANDSLIDE: 'landslide',
  STAMPEDE: 'stampede',
};

// Disaster Icons
export const DISASTER_ICONS = {
  earthquake: '🌍',
  cyclone: '🌀',
  flood: '🌊',
  fire: '🔥',
  landslide: '⛰️',
  stampede: '👥',
};

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

// Grade Options
export const GRADE_OPTIONS = [
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
];

// Language Options
export const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Malayalam',
];

// Routes
export const ROUTES = {
  HOME: '/',
  SETUP: '/setup',
  DASHBOARD: '/dashboard',
  GAME: '/game',
  QUIZ: '/quiz',
  DISASTER_INFO: '/disaster',
  PROGRESS: '/progress',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: 'disaster_response_user',
  LOCATION_DATA: 'disaster_response_location',
  PROGRESS_DATA: 'disaster_response_progress',
};

// API Endpoints
export const API_ENDPOINTS = {
  LOCATION_DISASTERS: '/location/disasters',
  LOCATION_STATES: '/location/states',
  DISASTERS: '/disasters',
  USERS_REGISTER: '/users/register',
  GAMES: '/games',
  QUIZ: '/quiz',
  PROGRESS: '/progress',
};
