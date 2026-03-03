const CAMERAS = [
  {
    id: 1,
    name: "Sydney Harbour",
    location: "Sydney, Australia",
    lat: -33.8568,
    lng: 151.2153,
    timezone: "Australia/Sydney",
    embedId: "5uZa3-RMFos",
    tags: {
      vibe: "city",
      timeOfDay: "any",
      region: "asia",
      weather: "sunny"
    }
  },
  {
    id: 2,
    name: "Crystal Bay Yacht Club",
    location: "Lamai, Koh Samui, Thailand",
    lat: 9.4776,
    lng: 100.0607,
    timezone: "Asia/Bangkok",
    embedId: "kkVrj2cr9Ko",
    tags: {
      vibe: "beach",
      timeOfDay: "any",
      region: "asia",
      weather: "sunny"
    }
  },
  {
    id: 3,
    name: "Pacific Bay Restaurant",
    location: "Mallorca, Spain",
    lat: 39.6953,
    lng: 3.0176,
    timezone: "Europe/Madrid",
    embedId: "8hVKqQLart8",
    tags: {
      vibe: "beach",
      timeOfDay: "any",
      region: "europe",
      weather: "sunny"
    }
  },
  {
    id: 4,
    name: "Hvar Harbour",
    location: "Hvar, Croatia",
    lat: 43.1729,
    lng: 16.4412,
    timezone: "Europe/Zagreb",
    embedId: "0wHWHAFnNh0",
    tags: {
      vibe: "beach",
      timeOfDay: "any",
      region: "europe",
      weather: "sunny"
    }
  },
  {
    id: 5,
    name: "Ramsgate Royal Harbour",
    location: "Ramsgate, Kent, UK",
    lat: 51.3352,
    lng: 1.4168,
    timezone: "Europe/London",
    embedId: "knsu8IQ03KU",
    tags: {
      vibe: "city",
      timeOfDay: "any",
      region: "europe",
      weather: "cloudy"
    }
  },
  {
    id: 6,
    name: "Forest, Northern Denmark",
    location: "Northern Denmark",
    lat: 57.0,
    lng: 9.9,
    timezone: "Europe/Copenhagen",
    embedId: "F0GOOP82094",
    tags: {
      vibe: "nature",
      timeOfDay: "any",
      region: "europe",
      weather: "cloudy"
    }
  },
  {
    id: 7,
    name: "Tokyo Shinjuku",
    location: "Shinjuku, Tokyo, Japan",
    lat: 35.6938,
    lng: 139.7036,
    timezone: "Asia/Tokyo",
    embedId: "GLQhbRGv5qU",
    tags: {
      vibe: "city",
      timeOfDay: "any",
      region: "asia",
      weather: "sunny"
    }
  },
  {
    id: 8,
    name: "Dorset Coast",
    location: "Dorset, UK",
    lat: 50.6138,
    lng: -2.4579,
    timezone: "Europe/London",
    embedId: "UeRL1dm9Axk",
    tags: {
      vibe: "nature",
      timeOfDay: "any",
      region: "europe",
      weather: "cloudy"
    }
  },
  {
    id: 9,
    name: "Princess Juliana Airport",
    location: "Sint Maarten, Caribbean",
    lat: 18.0410,
    lng: -63.1089,
    timezone: "America/Lower_Princes",
    embedId: "2IQmpCXbOmM",
    tags: {
      vibe: "beach",
      timeOfDay: "any",
      region: "americas",
      weather: "sunny"
    }
  },
  {
    id: 10,
    name: "Fuego Volcano",
    location: "Guatemala",
    lat: 14.4730,
    lng: -90.8796,
    timezone: "America/Guatemala",
    embedId: "UdZxw7rKqrw",
    tags: {
      vibe: "nature",
      timeOfDay: "any",
      region: "americas",
      weather: "sunny"
    }
  },
  {
    id: 11,
    name: "New York City",
    location: "New York, USA",
    lat: 40.7580,
    lng: -73.9855,
    timezone: "America/New_York",
    embedId: "VGnFLdQW39A",
    tags: {
      vibe: "city",
      timeOfDay: "any",
      region: "americas",
      weather: "sunny"
    }
  },
  {
    id: 12,
    name: "Houston",
    location: "Houston, Texas, USA",
    lat: 29.7604,
    lng: -95.3698,
    timezone: "America/Chicago",
    embedId: "SDK_m1_BVJ4",
    tags: {
      vibe: "city",
      timeOfDay: "any",
      region: "americas",
      weather: "sunny"
    }
  },
  {
    id: 13,
    name: "Las Vegas Airport",
    location: "Las Vegas, Nevada, USA",
    lat: 36.0840,
    lng: -115.1537,
    timezone: "America/Los_Angeles",
    embedId: "cn8_34TuMaM",
    tags: {
      vibe: "city",
      timeOfDay: "any",
      region: "americas",
      weather: "sunny"
    }
  },
  {
    id: 14,
    name: "Santa Claus Village",
    location: "Rovaniemi, Finland",
    lat: 66.5436,
    lng: 25.8470,
    timezone: "Europe/Helsinki",
    embedId: "Cp4RRAEgpeU",
    tags: {
      vibe: "nature",
      timeOfDay: "any",
      region: "europe",
      weather: "snowy"
    }
  },
  {
    id: 15,
    name: "St. Petersburg",
    location: "St. Petersburg, Russia",
    lat: 59.9343,
    lng: 30.3351,
    timezone: "Europe/Moscow",
    embedId: "h1wly909BYw",
    tags: {
      vibe: "city",
      timeOfDay: "any",
      region: "europe",
      weather: "cloudy"
    }
  },
  {
    id: 16,
    name: "LAX Airport",
    location: "Los Angeles, California, USA",
    lat: 33.9425,
    lng: -118.4081,
    timezone: "America/Los_Angeles",
    embedId: "UQaSS4_VAV4",
    tags: {
      vibe: "city",
      timeOfDay: "any",
      region: "americas",
      weather: "sunny"
    }
  },
  {
    id: 17,
    name: "St Ann",
    location: "St Ann, Jamaica",
    lat: 18.4271,
    lng: -77.1975,
    timezone: "America/Jamaica",
    embedId: "4X9dtsZmSw8",
    tags: {
      vibe: "beach",
      timeOfDay: "any",
      region: "americas",
      weather: "sunny"
    }
  },
  {
    id: 18,
    name: "Wales Coast",
    location: "Wales, UK",
    lat: 52.1307,
    lng: -3.7837,
    timezone: "Europe/London",
    embedId: "HVNqA-vTBX8",
    tags: {
      vibe: "nature",
      timeOfDay: "any",
      region: "europe",
      weather: "cloudy"
    }
  },
  {
    id: 19,
    name: "Namib Desert",
    location: "Namibia, Africa",
    lat: -24.7553,
    lng: 15.9994,
    timezone: "Africa/Windhoek",
    embedId: "ydYDqZQpim8",
    tags: {
      vibe: "nature",
      timeOfDay: "any",
      region: "africa",
      weather: "sunny"
    }
  }
];
