
const cityCoordinates = {
  // Andhra Pradesh
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  'Vijayawada': { lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
  'Guntur': { lat: 16.3067, lng: 80.4365, state: 'Andhra Pradesh' },
  'Nellore': { lat: 14.4426, lng: 79.9865, state: 'Andhra Pradesh' },
  'Tirupati': { lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },
  'Anantapur': { lat: 14.6819, lng: 77.6006, state: 'Andhra Pradesh' },
  'Rajahmundry': { lat: 17.0005, lng: 81.8040, state: 'Andhra Pradesh' },
  
  // Arunachal Pradesh
  'Itanagar': { lat: 27.0844, lng: 93.6053, state: 'Arunachal Pradesh' },
  
  // Assam
  'Guwahati': { lat: 26.1445, lng: 91.7362, state: 'Assam' },
  'Silchar': { lat: 24.8333, lng: 92.7789, state: 'Assam' },
  'Dibrugarh': { lat: 27.4728, lng: 94.9120, state: 'Assam' },
  'Jorhat': { lat: 26.7509, lng: 94.2037, state: 'Assam' },
  
  // Bihar
  'Patna': { lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  'Gaya': { lat: 24.7955, lng: 85.0002, state: 'Bihar' },
  'Bhagalpur': { lat: 25.2425, lng: 86.9842, state: 'Bihar' },
  'Muzaffarpur': { lat: 26.1225, lng: 85.3906, state: 'Bihar' },
  'Darbhanga': { lat: 26.1542, lng: 85.8918, state: 'Bihar' },
  
  // Chhattisgarh
  'Raipur': { lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh' },
  'Bhilai': { lat: 21.2167, lng: 81.3833, state: 'Chhattisgarh' },
  'Bilaspur': { lat: 22.0797, lng: 82.1409, state: 'Chhattisgarh' },
  
  // Delhi
  'Delhi': { lat: 28.7041, lng: 77.1025, state: 'Delhi' },
  'New Delhi': { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  
  // Goa
  'Panaji': { lat: 15.4909, lng: 73.8278, state: 'Goa' },
  'Margao': { lat: 15.2708, lng: 74.0120, state: 'Goa' },
  'Vasco da Gama': { lat: 15.3989, lng: 73.8157, state: 'Goa' },
  
  // Gujarat
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'Surat': { lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  'Vadodara': { lat: 22.3072, lng: 73.1812, state: 'Gujarat' },
  'Rajkot': { lat: 22.3039, lng: 70.8022, state: 'Gujarat' },
  'Bhavnagar': { lat: 21.7645, lng: 72.1519, state: 'Gujarat' },
  'Jamnagar': { lat: 22.4707, lng: 70.0577, state: 'Gujarat' },
  'Gandhinagar': { lat: 23.2156, lng: 72.6369, state: 'Gujarat' },
  
  // Haryana
  'Faridabad': { lat: 28.4089, lng: 77.3178, state: 'Haryana' },
  'Gurgaon': { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'Gurugram': { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'Panipat': { lat: 29.3909, lng: 76.9635, state: 'Haryana' },
  'Ambala': { lat: 30.3782, lng: 76.7767, state: 'Haryana' },
  'Hisar': { lat: 29.1492, lng: 75.7217, state: 'Haryana' },
  
  // Himachal Pradesh
  'Shimla': { lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
  'Manali': { lat: 32.2432, lng: 77.1892, state: 'Himachal Pradesh' },
  'Dharamshala': { lat: 32.2190, lng: 76.3234, state: 'Himachal Pradesh' },
  
  // Jharkhand
  'Ranchi': { lat: 23.3441, lng: 85.3096, state: 'Jharkhand' },
  'Jamshedpur': { lat: 22.8046, lng: 86.2029, state: 'Jharkhand' },
  'Dhanbad': { lat: 23.7957, lng: 86.4304, state: 'Jharkhand' },
  'Bokaro': { lat: 23.6693, lng: 86.1511, state: 'Jharkhand' },
  
  // Karnataka
  'Bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'Mysore': { lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
  'Mangalore': { lat: 12.9141, lng: 74.8560, state: 'Karnataka' },
  'Hubli': { lat: 15.3647, lng: 75.1240, state: 'Karnataka' },
  'Belgaum': { lat: 15.8497, lng: 74.4977, state: 'Karnataka' },
  'Gulbarga': { lat: 17.3297, lng: 76.8343, state: 'Karnataka' },
  
  // Kerala
  'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366, state: 'Kerala' },
  'Kochi': { lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  'Kozhikode': { lat: 11.2588, lng: 75.7804, state: 'Kerala' },
  'Thrissur': { lat: 10.5276, lng: 76.2144, state: 'Kerala' },
  'Kollam': { lat: 8.8932, lng: 76.6141, state: 'Kerala' },
  'Alappuzha': { lat: 9.4981, lng: 76.3388, state: 'Kerala' },
  
  // Madhya Pradesh
  'Bhopal': { lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  'Indore': { lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  'Jabalpur': { lat: 23.1815, lng: 79.9864, state: 'Madhya Pradesh' },
  'Gwalior': { lat: 26.2183, lng: 78.1828, state: 'Madhya Pradesh' },
  'Ujjain': { lat: 23.1765, lng: 75.7885, state: 'Madhya Pradesh' },
  
  // Maharashtra
  'Mumbai': { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'Pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'Nagpur': { lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  'Nashik': { lat: 19.9975, lng: 73.7898, state: 'Maharashtra' },
  'Thane': { lat: 19.2183, lng: 72.9781, state: 'Maharashtra' },
  'Aurangabad': { lat: 19.8762, lng: 75.3433, state: 'Maharashtra' },
  'Solapur': { lat: 17.6599, lng: 75.9064, state: 'Maharashtra' },
  'Kolhapur': { lat: 16.7050, lng: 74.2433, state: 'Maharashtra' },
  
  // Manipur
  'Imphal': { lat: 24.8170, lng: 93.9368, state: 'Manipur' },
  
  // Meghalaya
  'Shillong': { lat: 25.5788, lng: 91.8933, state: 'Meghalaya' },
  
  // Mizoram
  'Aizawl': { lat: 23.7271, lng: 92.7176, state: 'Mizoram' },
  
  // Nagaland
  'Kohima': { lat: 25.6747, lng: 94.1086, state: 'Nagaland' },
  'Dimapur': { lat: 25.9040, lng: 93.7265, state: 'Nagaland' },
  
  // Odisha
  'Bhubaneswar': { lat: 20.2961, lng: 85.8245, state: 'Odisha' },
  'Cuttack': { lat: 20.4625, lng: 85.8828, state: 'Odisha' },
  'Puri': { lat: 19.8135, lng: 85.8312, state: 'Odisha' },
  'Rourkela': { lat: 22.2604, lng: 84.8536, state: 'Odisha' },
  'Berhampur': { lat: 19.3150, lng: 84.7941, state: 'Odisha' },
  
  // Punjab
  'Ludhiana': { lat: 30.9010, lng: 75.8573, state: 'Punjab' },
  'Amritsar': { lat: 31.6340, lng: 74.8723, state: 'Punjab' },
  'Jalandhar': { lat: 31.3260, lng: 75.5762, state: 'Punjab' },
  'Patiala': { lat: 30.3398, lng: 76.3869, state: 'Punjab' },
  'Chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Punjab' },
  
  // Rajasthan
  'Jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'Jodhpur': { lat: 26.2389, lng: 73.0243, state: 'Rajasthan' },
  'Udaipur': { lat: 24.5854, lng: 73.7125, state: 'Rajasthan' },
  'Kota': { lat: 25.2138, lng: 75.8648, state: 'Rajasthan' },
  'Ajmer': { lat: 26.4499, lng: 74.6399, state: 'Rajasthan' },
  'Bikaner': { lat: 28.0229, lng: 73.3119, state: 'Rajasthan' },
  
  // Sikkim
  'Gangtok': { lat: 27.3389, lng: 88.6065, state: 'Sikkim' },
  
  // Tamil Nadu
  'Chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'Coimbatore': { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  'Madurai': { lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047, state: 'Tamil Nadu' },
  'Salem': { lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu' },
  'Tirunelveli': { lat: 8.7139, lng: 77.7567, state: 'Tamil Nadu' },
  'Vellore': { lat: 12.9165, lng: 79.1325, state: 'Tamil Nadu' },
  
  // Telangana
  'Hyderabad': { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'Warangal': { lat: 17.9689, lng: 79.5941, state: 'Telangana' },
  'Nizamabad': { lat: 18.6725, lng: 78.0941, state: 'Telangana' },
  
  // Tripura
  'Agartala': { lat: 23.8315, lng: 91.2868, state: 'Tripura' },
  
  // Uttar Pradesh
  'Lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  'Kanpur': { lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' },
  'Agra': { lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
  'Varanasi': { lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh' },
  'Meerut': { lat: 28.9845, lng: 77.7064, state: 'Uttar Pradesh' },
  'Allahabad': { lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
  'Prayagraj': { lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
  'Bareilly': { lat: 28.3670, lng: 79.4304, state: 'Uttar Pradesh' },
  'Ghaziabad': { lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh' },
  'Noida': { lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' },
  
  // Uttarakhand
  'Dehradun': { lat: 30.3165, lng: 78.0322, state: 'Uttarakhand' },
  'Haridwar': { lat: 29.9457, lng: 78.1642, state: 'Uttarakhand' },
  'Nainital': { lat: 29.3803, lng: 79.4636, state: 'Uttarakhand' },
  
  // West Bengal
  'Kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'Howrah': { lat: 22.5958, lng: 88.2636, state: 'West Bengal' },
  'Durgapur': { lat: 23.5204, lng: 87.3119, state: 'West Bengal' },
  'Asansol': { lat: 23.6739, lng: 86.9524, state: 'West Bengal' },
  'Siliguri': { lat: 26.7271, lng: 88.3953, state: 'West Bengal' },
  
  // Union Territories
  'Port Blair': { lat: 11.6234, lng: 92.7265, state: 'Andaman and Nicobar Islands' },
  'Puducherry': { lat: 11.9416, lng: 79.8083, state: 'Puducherry' },
  'Leh': { lat: 34.1526, lng: 77.5771, state: 'Ladakh' },
  'Daman': { lat: 20.4283, lng: 72.8397, state: 'Dadra and Nagar Haveli and Daman and Diu' }
};

// State capital fallback coordinates
const stateCapitals = {
  'Andhra Pradesh': { lat: 16.5062, lng: 80.6480, capital: 'Vijayawada' },
  'Arunachal Pradesh': { lat: 27.0844, lng: 93.6053, capital: 'Itanagar' },
  'Assam': { lat: 26.1445, lng: 91.7362, capital: 'Guwahati' },
  'Bihar': { lat: 25.5941, lng: 85.1376, capital: 'Patna' },
  'Chhattisgarh': { lat: 21.2514, lng: 81.6296, capital: 'Raipur' },
  'Goa': { lat: 15.4909, lng: 73.8278, capital: 'Panaji' },
  'Gujarat': { lat: 23.2156, lng: 72.6369, capital: 'Gandhinagar' },
  'Haryana': { lat: 30.7333, lng: 76.7794, capital: 'Chandigarh' },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734, capital: 'Shimla' },
  'Jharkhand': { lat: 23.3441, lng: 85.3096, capital: 'Ranchi' },
  'Karnataka': { lat: 12.9716, lng: 77.5946, capital: 'Bengaluru' },
  'Kerala': { lat: 8.5241, lng: 76.9366, capital: 'Thiruvananthapuram' },
  'Madhya Pradesh': { lat: 23.2599, lng: 77.4126, capital: 'Bhopal' },
  'Maharashtra': { lat: 19.0760, lng: 72.8777, capital: 'Mumbai' },
  'Manipur': { lat: 24.8170, lng: 93.9368, capital: 'Imphal' },
  'Meghalaya': { lat: 25.5788, lng: 91.8933, capital: 'Shillong' },
  'Mizoram': { lat: 23.7271, lng: 92.7176, capital: 'Aizawl' },
  'Nagaland': { lat: 25.6747, lng: 94.1086, capital: 'Kohima' },
  'Odisha': { lat: 20.2961, lng: 85.8245, capital: 'Bhubaneswar' },
  'Punjab': { lat: 30.7333, lng: 76.7794, capital: 'Chandigarh' },
  'Rajasthan': { lat: 26.9124, lng: 75.7873, capital: 'Jaipur' },
  'Sikkim': { lat: 27.3389, lng: 88.6065, capital: 'Gangtok' },
  'Tamil Nadu': { lat: 13.0827, lng: 80.2707, capital: 'Chennai' },
  'Telangana': { lat: 17.3850, lng: 78.4867, capital: 'Hyderabad' },
  'Tripura': { lat: 23.8315, lng: 91.2868, capital: 'Agartala' },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462, capital: 'Lucknow' },
  'Uttarakhand': { lat: 30.3165, lng: 78.0322, capital: 'Dehradun' },
  'West Bengal': { lat: 22.5726, lng: 88.3639, capital: 'Kolkata' },
  'Delhi': { lat: 28.7041, lng: 77.1025, capital: 'New Delhi' },
  'Chandigarh': { lat: 30.7333, lng: 76.7794, capital: 'Chandigarh' },
  'Andaman and Nicobar Islands': { lat: 11.6234, lng: 92.7265, capital: 'Port Blair' },
  'Dadra and Nagar Haveli and Daman and Diu': { lat: 20.4283, lng: 72.8397, capital: 'Daman' },
  'Lakshadweep': { lat: 10.5667, lng: 72.6417, capital: 'Kavaratti' },
  'Puducherry': { lat: 11.9416, lng: 79.8083, capital: 'Puducherry' },
  'Ladakh': { lat: 34.1526, lng: 77.5771, capital: 'Leh' },
  'Jammu and Kashmir': { lat: 34.0837, lng: 74.7973, capital: 'Srinagar' }
};

/**
 * Get coordinates for a location
 * @param {string} state - State name
 * @param {string} city - City name (optional)
 * @param {string} pincode - Pincode (optional)
 * @returns {Object} { latitude, longitude, source }
 */
function getCoordinates(state, city = null, pincode = null) {
  // Priority 1: Try exact city match
  if (city) {
    const cityKey = Object.keys(cityCoordinates).find(
      key => key.toLowerCase() === city.toLowerCase()
    );
    
    if (cityKey) {
      return {
        latitude: cityCoordinates[cityKey].lat,
        longitude: cityCoordinates[cityKey].lng,
        source: 'city',
        resolvedLocation: cityKey
      };
    }
  }
  
  // Priority 2: Fallback to state capital
  if (state && stateCapitals[state]) {
    return {
      latitude: stateCapitals[state].lat,
      longitude: stateCapitals[state].lng,
      source: 'state_capital',
      resolvedLocation: stateCapitals[state].capital
    };
  }
  
  // Priority 3: Default fallback (center of India)
  return {
    latitude: 20.5937,
    longitude: 78.9629,
    source: 'fallback',
    resolvedLocation: 'India (center)'
  };
}

/**
 * Validate and normalize location data
 * @param {Object} location - { state, city, pincode }
 * @returns {Object} Normalized location with coordinates
 */
function normalizeLocation(location) {
  const { state, city, pincode } = location;
  
  if (!state) {
    throw new Error('State is required for geocoding');
  }
  
  const coords = getCoordinates(state, city, pincode);
  
  return {
    state,
    city: city || null,
    pincode: pincode || null,
    latitude: coords.latitude,
    longitude: coords.longitude,
    geocodingSource: coords.source,
    resolvedLocation: coords.resolvedLocation
  };
}

/**
 * Check if coordinates are already available
 * @param {Object} location - Location object
 * @returns {boolean}
 */
function hasCoordinates(location) {
  return location && 
         typeof location.latitude === 'number' && 
         typeof location.longitude === 'number' &&
         !isNaN(location.latitude) &&
         !isNaN(location.longitude);
}

module.exports = {
  getCoordinates,
  normalizeLocation,
  hasCoordinates,
  cityCoordinates,
  stateCapitals
};
