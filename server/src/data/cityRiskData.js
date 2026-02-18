// data/cityRiskData.js

export const cityRiskData = {
  // Earthquake risk data
  earthquakeRisk: {
    'Zone 5': {
      cities: ['Guwahati', 'Srinagar', 'Imphal', 'Diphu', 'Tezpur', 'Itanagar', 'Kohima', 'Aizawl', 'Gangtok'],
      riskLevel: 'critical',
      description: 'Very High Earthquake Risk Zone',
      recommendations: [
        'Practice Drop, Cover, Hold drills monthly',
        'Secure heavy furniture to walls',
        'Prepare emergency kits with water and food',
        'Identify safe spots in every room',
        'Learn first aid and CPR'
      ],
      drillFrequency: 'Monthly',
      priority: 1
    },
    'Zone 4': {
      cities: ['Delhi', 'Chandigarh', 'Dehradun', 'Shimla', 'Leh', 'Amritsar', 'Jammu', 'Patna', 'Darjeeling', 'Siliguri', 'Bhuj'],
      riskLevel: 'high',
      description: 'High Earthquake Risk Zone',
      recommendations: [
        'Practice earthquake drills quarterly',
        'Secure bookshelves and water heaters',
        'Know gas shut-off location',
        'Create family emergency plan',
        'Keep flashlight near bed'
      ],
      drillFrequency: 'Quarterly',
      priority: 2
    },
    'Zone 3': {
      cities: ['Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Lucknow', 'Jaipur', 'Bhopal', 'Indore'],
      riskLevel: 'moderate',
      description: 'Moderate Earthquake Risk Zone',
      recommendations: [
        'Practice earthquake drills twice a year',
        'Check building safety',
        'Store heavy items on lower shelves',
        'Learn to turn off electricity',
        'Keep emergency numbers handy'
      ],
      drillFrequency: 'Twice a year',
      priority: 3
    },
    'Zone 2': {
      cities: ['Other cities not listed'],
      riskLevel: 'low',
      description: 'Low Earthquake Risk Zone',
      recommendations: [
        'Basic earthquake awareness',
        'Practice drills annually',
        'Know basic safety procedures',
        'Be prepared for moderate shaking'
      ],
      drillFrequency: 'Annually',
      priority: 4
    }
  },

  // Flood risk data
  floodRisk: {
    'veryHigh': {
      cities: ['Patna', 'Guwahati', 'Kolkata', 'Mumbai', 'Chennai', 'Surat', 'Kochi', 'Bardhaman', 'Howrah', 'Hooghly', 'North 24 Parganas', 'South 24 Parganas', 'Nadia', 'Murshidabad', 'Darbhanga', 'Muzaffarpur', 'Purnia', 'Bhagalpur', 'Cuttack', 'Puri', 'Kendrapara', 'Jagatsinghpur'],
      riskLevel: 'critical',
      description: 'Very High Flood Risk Zone',
      recommendations: [
        'Know evacuation routes to higher ground',
        'Prepare waterproof document bags',
        'Keep emergency floatation devices',
        'Learn about flood warnings (Red/Orange/Yellow)',
        'Have sandbags ready during monsoon',
        'Store drinking water in clean containers',
        'Never walk through flood water'
      ],
      season: ['June', 'July', 'August', 'September', 'October'],
      drillFrequency: 'Before monsoon season',
      priority: 1
    },
    'high': {
      cities: ['Delhi', 'Lucknow', 'Srinagar', 'Pune', 'Ahmedabad', 'Varanasi', 'Allahabad', 'Kanpur', 'Agra', 'Mathura', 'Vijayawada', 'Rajahmundry', 'Kurnool', 'Nellore'],
      riskLevel: 'high',
      description: 'High Flood Risk Zone',
      recommendations: [
        'Monitor weather alerts during monsoon',
        'Identify safe assembly points',
        'Prepare emergency kit with torch and batteries',
        'Learn swimming basics',
        'Keep important documents in waterproof covers',
        'Have portable phone charger ready'
      ],
      season: ['July', 'August', 'September'],
      drillFrequency: 'Before and during monsoon',
      priority: 2
    },
    'moderate': {
      cities: ['Bangalore', 'Hyderabad', 'Nagpur', 'Coimbatore', 'Madurai', 'Thiruvananthapuram', 'Mangalore', 'Belgaum', 'Gulbarga', 'Aurangabad', 'Nashik', 'Kolhapur'],
      riskLevel: 'moderate',
      description: 'Moderate Flood Risk Zone',
      recommendations: [
        'Be aware of local drainage issues',
        'Keep emergency contacts handy',
        'Learn about flash flood safety',
        'Avoid low-lying areas during heavy rain',
        'Monitor local news during storms'
      ],
      season: ['July', 'August', 'September'],
      drillFrequency: 'Yearly',
      priority: 3
    }
  },

  // Cyclone risk data
  cycloneRisk: {
    'veryHigh': {
      cities: ['Chennai', 'Kolkata', 'Visakhapatnam', 'Paradeep', 'Puri', 'Bhubaneswar', 'Machilipatnam', 'Kakinada', 'Gopalpur', 'Balasore', 'Digha', 'Fraserganj'],
      riskLevel: 'critical',
      description: 'Very High Cyclone Risk Zone (East Coast)',
      recommendations: [
        'Know cyclone warning signals',
        'Prepare cyclone kit with food and water',
        'Reinforce doors and windows',
        'Know evacuation routes to cyclone shelters',
        'Learn to tie down loose objects',
        'Keep battery-operated radio for updates',
        'Stay indoors during cyclone'
      ],
      season: ['April', 'May', 'October', 'November', 'December'],
      drillFrequency: 'Before cyclone season',
      priority: 1
    },
    'high': {
      cities: ['Surat', 'Ahmedabad', 'Mumbai', 'Pune', 'Veraval', 'Porbandar', 'Jamnagar', 'Dwarka', 'Mangalore', 'Kochi', 'Alappuzha', 'Kollam'],
      riskLevel: 'high',
      description: 'High Cyclone Risk Zone (West Coast)',
      recommendations: [
        'Monitor cyclone alerts during monsoon',
        'Secure outdoor items',
        'Prepare emergency contacts',
        'Know nearest shelter location',
        'Keep documents in waterproof bag',
        'Charge all devices before cyclone'
      ],
      season: ['May', 'June', 'October', 'November'],
      drillFrequency: 'Before cyclone season',
      priority: 2
    },
    'moderate': {
      cities: ['Goa', 'Karwar', 'Bhatkal', 'Udupi', 'Kannur', 'Kozhikode', 'Thrissur', 'Nagapattinam', 'Karaikal'],
      riskLevel: 'moderate',
      description: 'Moderate Cyclone Risk Zone',
      recommendations: [
        'Stay informed about weather updates',
        'Basic cyclone preparedness',
        'Keep emergency kit ready',
        'Know basic safety procedures',
        'Follow official instructions during warnings'
      ],
      season: ['May', 'June', 'October', 'November'],
      drillFrequency: 'Yearly',
      priority: 3
    }
  },

  // Landslide risk data
  landslideRisk: {
    'veryHigh': {
      districts: ['Rudraprayag', 'Tehri Garhwal', 'Pithoragarh', 'Chamoli', 'Uttarkashi', 'Kinnaur', 'Lahaul and Spiti', 'Kullu'],
      riskLevel: 'critical',
      description: 'Very High Landslide Risk Zone',
      recommendations: [
        'Avoid building on steep slopes',
        'Watch for cracks in ground',
        'Listen for rumbling sounds',
        'Evacuate immediately if signs appear',
        'Know safe routes to open areas',
        'Stay away from landslide-prone areas during heavy rain'
      ],
      season: ['June', 'July', 'August', 'September'],
      drillFrequency: 'Before monsoon',
      priority: 1
    },
    'high': {
      districts: ['Darjeeling', 'Kalimpong', 'Kurseong', 'Nilgiris', 'Wayanad', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur'],
      riskLevel: 'high',
      description: 'High Landslide Risk Zone',
      recommendations: [
        'Monitor weather during heavy rain',
        'Report cracks to authorities',
        'Prepare emergency evacuation plan',
        'Keep emergency supplies ready',
        'Avoid travel in hilly areas during rain'
      ],
      season: ['June', 'July', 'August', 'September'],
      drillFrequency: 'Yearly',
      priority: 2
    }
  },

  // Tsunami risk data
  tsunamiRisk: {
    'veryHigh': {
      cities: ['Chennai', 'Visakhapatnam', 'Kakinada', 'Nagapattinam', 'Karaikal', 'Port Blair', 'Car Nicobar'],
      riskLevel: 'critical',
      description: 'Very High Tsunami Risk Zone',
      recommendations: [
        'Know tsunami warning signs',
        'Evacuate immediately to high ground',
        'Learn designated evacuation routes',
        'Never go to shore to watch tsunami',
        'Follow official alerts without delay',
        'Prepare emergency kit for quick evacuation'
      ],
      priority: 1
    },
    'high': {
      cities: ['Kolkata', 'Paradeep', 'Puri', 'Machilipatnam', 'Tuticorin', 'Kochi', 'Alappuzha', 'Kollam'],
      riskLevel: 'high',
      description: 'High Tsunami Risk Zone',
      recommendations: [
        'Know tsunami evacuation procedures',
        'Identify high ground locations',
        'Practice evacuation drills',
        'Keep emergency contacts handy',
        'Learn natural warning signs (earthquake, water receding)'
      ],
      priority: 2
    },
    'moderate': {
      cities: ['Mumbai', 'Surat', 'Mangalore', 'Goa', 'Karwar'],
      riskLevel: 'moderate',
      description: 'Moderate Tsunami Risk Zone',
      recommendations: [
        'Basic tsunami awareness',
        'Know evacuation routes',
        'Stay informed during earthquakes',
        'Follow official warnings',
        'Learn about tsunami safety'
      ],
      priority: 3
    }
  },

  // Heatwave risk data
  heatwaveRisk: {
    'veryHigh': {
      cities: ['Delhi', 'Lucknow', 'Ahmedabad', 'Hyderabad', 'Chennai', 'Kolkata', 'Nagpur', 'Jaipur', 'Bhopal', 'Indore', 'Gwalior', 'Jhansi', 'Allahabad', 'Varanasi', 'Gaya', 'Aurangabad'],
      riskLevel: 'critical',
      description: 'Very High Heatwave Risk Zone',
      recommendations: [
        'Stay indoors during peak heat (12-4 PM)',
        'Drink plenty of water',
        'Wear light cotton clothes',
        'Use fans and coolers',
        'Never leave children in parked cars',
        'Watch for heat stroke symptoms',
        'Keep rooms cool with curtains',
        'Eat light meals'
      ],
      season: ['April', 'May', 'June'],
      drillFrequency: 'During summer months',
      priority: 1
    },
    'high': {
      cities: ['Mumbai', 'Pune', 'Bangalore', 'Surat', 'Vadodara', 'Nashik', 'Kolhapur', 'Belgaum', 'Gulbarga', 'Raipur', 'Bilaspur'],
      riskLevel: 'high',
      description: 'High Heatwave Risk Zone',
      recommendations: [
        'Limit outdoor activities',
        'Stay hydrated',
        'Use sun protection',
        'Check on elderly neighbors',
        'Avoid strenuous work in heat',
        'Keep pets in shade with water'
      ],
      season: ['April', 'May', 'June'],
      drillFrequency: 'During summer',
      priority: 2
    }
  }
};

// Helper function to get all risks for a city
export const getCityRisks = (cityName) => {
  const risks = [];
  
  // Check earthquake zones
  Object.entries(cityRiskData.earthquakeRisk).forEach(([zone, data]) => {
    if (data.cities.some(c => c.toLowerCase() === cityName.toLowerCase())) {
      risks.push({
        disaster: 'Earthquake',
        riskLevel: data.riskLevel,
        description: data.description,
        recommendations: data.recommendations,
        drillFrequency: data.drillFrequency,
        priority: data.priority
      });
    }
  });

  // Check flood risk
  Object.entries(cityRiskData.floodRisk).forEach(([level, data]) => {
    if (data.cities.some(c => c.toLowerCase() === cityName.toLowerCase())) {
      risks.push({
        disaster: 'Flood',
        riskLevel: data.riskLevel,
        description: data.description,
        recommendations: data.recommendations,
        season: data.season,
        drillFrequency: data.drillFrequency,
        priority: data.priority
      });
    }
  });

  // Check cyclone risk
  Object.entries(cityRiskData.cycloneRisk).forEach(([level, data]) => {
    if (data.cities.some(c => c.toLowerCase() === cityName.toLowerCase())) {
      risks.push({
        disaster: 'Cyclone',
        riskLevel: data.riskLevel,
        description: data.description,
        recommendations: data.recommendations,
        season: data.season,
        drillFrequency: data.drillFrequency,
        priority: data.priority
      });
    }
  });

  // Check tsunami risk
  Object.entries(cityRiskData.tsunamiRisk).forEach(([level, data]) => {
    if (data.cities.some(c => c.toLowerCase() === cityName.toLowerCase())) {
      risks.push({
        disaster: 'Tsunami',
        riskLevel: data.riskLevel,
        description: data.description,
        recommendations: data.recommendations,
        priority: data.priority
      });
    }
  });

  // Check heatwave risk
  Object.entries(cityRiskData.heatwaveRisk).forEach(([level, data]) => {
    if (data.cities.some(c => c.toLowerCase() === cityName.toLowerCase())) {
      risks.push({
        disaster: 'Heatwave',
        riskLevel: data.riskLevel,
        description: data.description,
        recommendations: data.recommendations,
        season: data.season,
        drillFrequency: data.drillFrequency,
        priority: data.priority
      });
    }
  });

  // Check landslide risk (by district name)
  Object.entries(cityRiskData.landslideRisk).forEach(([level, data]) => {
    if (data.districts.some(d => d.toLowerCase() === cityName.toLowerCase())) {
      risks.push({
        disaster: 'Landslide',
        riskLevel: data.riskLevel,
        description: data.description,
        recommendations: data.recommendations,
        season: data.season,
        drillFrequency: data.drillFrequency,
        priority: data.priority
      });
    }
  });

  return risks.sort((a, b) => a.priority - b.priority);
};

// Get learning modules based on city risks
export const getPersonalizedLearningModules = (cityName) => {
  const risks = getCityRisks(cityName);
  
  // Map disasters to learning modules
  const modules = [];
  
  if (risks.length === 0) {
    // Default modules for cities without specific risks
    return [
      {
        id: 'basic',
        title: 'Basic Disaster Preparedness',
        description: 'Learn essential safety tips for all disasters',
        duration: '30 min',
        points: 100,
        icon: '📚'
      }
    ];
  }

  risks.forEach(risk => {
    switch(risk.disaster) {
      case 'Earthquake':
        modules.push({
          id: 'earthquake',
          title: `Earthquake Safety (${risk.riskLevel} risk)`,
          description: `Learn how to stay safe during earthquakes`,
          duration: '45 min',
          points: 150,
          icon: '🏢',
          riskLevel: risk.riskLevel,
          priority: risk.priority
        });
        break;
      case 'Flood':
        modules.push({
          id: 'flood',
          title: `Flood Preparedness (${risk.riskLevel} risk)`,
          description: `Flood safety and evacuation tips`,
          duration: '40 min',
          points: 120,
          icon: '🌊',
          riskLevel: risk.riskLevel,
          priority: risk.priority
        });
        break;
      case 'Cyclone':
        modules.push({
          id: 'cyclone',
          title: `Cyclone Safety (${risk.riskLevel} risk)`,
          description: `How to prepare for cyclones`,
          duration: '35 min',
          points: 120,
          icon: '🌀',
          riskLevel: risk.riskLevel,
          priority: risk.priority
        });
        break;
      case 'Tsunami':
        modules.push({
          id: 'tsunami',
          title: `Tsunami Evacuation (${risk.riskLevel} risk)`,
          description: `Learn tsunami warning signs and evacuation`,
          duration: '30 min',
          points: 100,
          icon: '🌊',
          riskLevel: risk.riskLevel,
          priority: risk.priority
        });
        break;
      case 'Landslide':
        modules.push({
          id: 'landslide',
          title: `Landslide Safety (${risk.riskLevel} risk)`,
          description: `How to stay safe during landslides`,
          duration: '25 min',
          points: 100,
          icon: '⛰️',
          riskLevel: risk.riskLevel,
          priority: risk.priority
        });
        break;
      case 'Heatwave':
        modules.push({
          id: 'heatwave',
          title: `Heatwave Protection (${risk.riskLevel} risk)`,
          description: `Stay safe during extreme heat`,
          duration: '20 min',
          points: 80,
          icon: '☀️',
          riskLevel: risk.riskLevel,
          priority: risk.priority
        });
        break;
    }
  });

  return modules.sort((a, b) => a.priority - b.priority);
};

// Get recommended drills based on city risks
export const getRecommendedDrills = (cityName) => {
  const risks = getCityRisks(cityName);
  
  return risks.map(risk => ({
    type: risk.disaster,
    frequency: risk.drillFrequency || 'Monthly',
    duration: '15 minutes',
    description: `Practice ${risk.disaster.toLowerCase()} drill`,
    riskLevel: risk.riskLevel,
    priority: risk.priority
  })).sort((a, b) => a.priority - b.priority);
};



// Add this function to get recommended drills for a specific city
export const getRecommendedDrillsForCity = (cityName) => {
  const risks = getCityRisks(cityName);
  
  const drillRecommendations = [];
  
  risks.forEach(risk => {
    switch(risk.disaster) {
      case 'Earthquake':
        drillRecommendations.push({
          type: 'Earthquake',
          riskLevel: risk.riskLevel,
          priority: risk.priority,
          frequency: risk.drillFrequency || 'Monthly',
          duration: '15-20 minutes',
          objectives: [
            'Practice Drop, Cover, and Hold',
            'Evacuate to safe zone',
            'Count all students after evacuation',
            'Identify safe spots in classroom'
          ],
          successCriteria: {
            responseTime: risk.riskLevel === 'critical' ? '< 30 seconds' : '< 45 seconds',
            participation: '> 95%',
            evacuationTime: '< 3 minutes'
          },
          seasonality: risk.season || ['Year-round'],
          notes: `Critical for ${cityName} due to high seismic activity`
        });
        break;
        
      case 'Flood':
        drillRecommendations.push({
          type: 'Flood',
          riskLevel: risk.riskLevel,
          priority: risk.priority,
          frequency: risk.drillFrequency || 'Before monsoon',
          duration: '20-25 minutes',
          objectives: [
            'Move to higher ground',
            'Avoid walking through water',
            'Turn off electricity if safe',
            'Gather emergency supplies'
          ],
          successCriteria: {
            responseTime: '< 2 minutes',
            participation: '> 95%',
            safeAssembly: '100% at high ground'
          },
          seasonality: risk.season || ['June-September'],
          notes: `Focus on ${cityName}'s flood-prone areas during monsoon`
        });
        break;
        
      case 'Cyclone':
        drillRecommendations.push({
          type: 'Cyclone',
          riskLevel: risk.riskLevel,
          priority: risk.priority,
          frequency: risk.drillFrequency || 'Before cyclone season',
          duration: '15-20 minutes',
          objectives: [
            'Reinforce doors and windows',
            'Gather emergency kit',
            'Move to interior room',
            'Listen to weather updates'
          ],
          successCriteria: {
            preparationTime: '< 10 minutes',
            participation: '> 95%',
            kitReadiness: '100%'
          },
          seasonality: risk.season || ['April-June', 'October-December'],
          notes: `Critical during ${cityName}'s cyclone season`
        });
        break;
        
      case 'Tsunami':
        drillRecommendations.push({
          type: 'Tsunami',
          riskLevel: risk.riskLevel,
          priority: risk.priority,
          frequency: 'Quarterly',
          duration: '15 minutes',
          objectives: [
            'Recognize natural warnings',
            'Evacuate to high ground immediately',
            'Never go to shore to watch',
            'Follow official alerts'
          ],
          successCriteria: {
            responseTime: '< 1 minute',
            participation: '100%',
            evacuationRoute: 'All know route'
          },
          seasonality: ['Year-round'],
          notes: `Immediate evacuation is critical for coastal ${cityName}`
        });
        break;
        
      case 'Landslide':
        drillRecommendations.push({
          type: 'Landslide',
          riskLevel: risk.riskLevel,
          priority: risk.priority,
          frequency: 'Before monsoon',
          duration: '15 minutes',
          objectives: [
            'Watch for warning signs',
            'Evacuate to open areas',
            'Avoid slope areas',
            'Listen for unusual sounds'
          ],
          successCriteria: {
            awareness: '100% know signs',
            evacuationTime: '< 2 minutes',
            safeZone: 'All reach safe area'
          },
          seasonality: risk.season || ['June-September'],
          notes: `Monitor during heavy rains in ${cityName}`
        });
        break;
        
      case 'Heatwave':
        drillRecommendations.push({
          type: 'Heatwave',
          riskLevel: risk.riskLevel,
          priority: risk.priority,
          frequency: 'Before summer',
          duration: '10 minutes',
          objectives: [
            'Stay hydrated',
            'Avoid outdoor activities',
            'Recognize heat stroke symptoms',
            'Keep rooms cool'
          ],
          successCriteria: {
            awareness: '100% know prevention',
            hydration: 'All carry water',
            symptoms: 'All recognize signs'
          },
          seasonality: risk.season || ['April-June'],
          notes: `Critical during ${cityName}'s summer months`
        });
        break;
    }
  });

  return drillRecommendations.sort((a, b) => a.priority - b.priority);
};

// Get drill statistics by city
export const getDrillStatsByCity = (cityName) => {
  const drills = getRecommendedDrillsForCity(cityName);
  
  return {
    city: cityName,
    totalRecommendedDrills: drills.length,
    byRiskLevel: {
      critical: drills.filter(d => d.riskLevel === 'critical').length,
      high: drills.filter(d => d.riskLevel === 'high').length,
      moderate: drills.filter(d => d.riskLevel === 'moderate').length,
      low: drills.filter(d => d.riskLevel === 'low').length
    },
    byDisasterType: drills.reduce((acc, drill) => {
      acc[drill.type] = (acc[drill.type] || 0) + 1;
      return acc;
    }, {}),
    monthlySchedule: generateMonthlyDrillSchedule(drills)
  };
};

// Generate monthly drill schedule based on risks
const generateMonthlyDrillSchedule = (drills) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const schedule = {};
  
  months.forEach(month => {
    schedule[month] = [];
  });

  drills.forEach(drill => {
    if (drill.seasonality[0] === 'Year-round') {
      // Spread throughout the year
      months.forEach(month => {
        if (drill.riskLevel === 'critical') {
          schedule[month].push({ type: drill.type, frequency: 'Monthly' });
        } else if (drill.riskLevel === 'high') {
          if (month === 'Jan' || month === 'Apr' || month === 'Jul' || month === 'Oct') {
            schedule[month].push({ type: drill.type, frequency: 'Quarterly' });
          }
        }
      });
    } else {
      // Specific seasons
      drill.seasonality.forEach(season => {
        const seasonMonths = getMonthsForSeason(season);
        seasonMonths.forEach(month => {
          schedule[month].push({ type: drill.type, frequency: 'Seasonal' });
        });
      });
    }
  });

  return schedule;
};

// Helper to get months for season
const getMonthsForSeason = (season) => {
  const seasonMap = {
    'April-June': ['Apr', 'May', 'Jun'],
    'June-September': ['Jun', 'Jul', 'Aug', 'Sep'],
    'October-December': ['Oct', 'Nov', 'Dec'],
    'July-September': ['Jul', 'Aug', 'Sep'],
    'April-May': ['Apr', 'May']
  };
  return seasonMap[season] || [];
};