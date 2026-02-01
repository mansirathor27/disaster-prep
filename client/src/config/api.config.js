
// Default to local development with correct backend port (5000, not 5001!)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('📡 API Base URL:', API_BASE_URL);

export default API_BASE_URL;