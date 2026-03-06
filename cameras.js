const CAMERAS = [
  // ── Original 19 ──────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Sydney Harbour",
    location: "Sydney, Australia",
    lat: -33.8568,
    lng: 151.2153,
    timezone: "Australia/Sydney",
    embedId: "5uZa3-RMFos",
    tags: { vibe: "city", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 2,
    name: "Crystal Bay Yacht Club",
    location: "Lamai, Koh Samui, Thailand",
    lat: 9.4776,
    lng: 100.0607,
    timezone: "Asia/Bangkok",
    embedId: "kkVrj2cr9Ko",
    tags: { vibe: "beach", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 3,
    name: "Pacific Bay Restaurant",
    location: "Mallorca, Spain",
    lat: 39.6953,
    lng: 3.0176,
    timezone: "Europe/Madrid",
    embedId: "8hVKqQLart8",
    tags: { vibe: "beach", timeOfDay: "any", region: "europe", weather: "sunny" }
  },
  {
    id: 4,
    name: "Hvar Harbour",
    location: "Hvar, Croatia",
    lat: 43.1729,
    lng: 16.4412,
    timezone: "Europe/Zagreb",
    embedId: "0wHWHAFnNh0",
    tags: { vibe: "beach", timeOfDay: "any", region: "europe", weather: "sunny" }
  },
  {
    id: 5,
    name: "Ramsgate Royal Harbour",
    location: "Ramsgate, Kent, UK",
    lat: 51.3352,
    lng: 1.4168,
    timezone: "Europe/London",
    embedId: "knsu8IQ03KU",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 6,
    name: "Forest, Northern Denmark",
    location: "Northern Denmark",
    lat: 57.0,
    lng: 9.9,
    timezone: "Europe/Copenhagen",
    embedId: "F0GOOP82094",
    tags: { vibe: "nature", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 7,
    name: "Tokyo Shinjuku",
    location: "Shinjuku, Tokyo, Japan",
    lat: 35.6938,
    lng: 139.7036,
    timezone: "Asia/Tokyo",
    embedId: "GLQhbRGv5qU",
    tags: { vibe: "city", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 8,
    name: "Dorset Coast",
    location: "Dorset, UK",
    lat: 50.6138,
    lng: -2.4579,
    timezone: "Europe/London",
    embedId: "UeRL1dm9Axk",
    tags: { vibe: "nature", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 9,
    name: "Princess Juliana Airport",
    location: "Sint Maarten, Caribbean",
    lat: 18.0410,
    lng: -63.1089,
    timezone: "America/Lower_Princes",
    embedId: "2IQmpCXbOmM",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 10,
    name: "Fuego Volcano",
    location: "Guatemala",
    lat: 14.4730,
    lng: -90.8796,
    timezone: "America/Guatemala",
    embedId: "UdZxw7rKqrw",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 11,
    name: "New York City",
    location: "New York, USA",
    lat: 40.7580,
    lng: -73.9855,
    timezone: "America/New_York",
    embedId: "VGnFLdQW39A",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 12,
    name: "Houston",
    location: "Houston, Texas, USA",
    lat: 29.7604,
    lng: -95.3698,
    timezone: "America/Chicago",
    embedId: "SDK_m1_BVJ4",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 13,
    name: "Las Vegas Airport",
    location: "Las Vegas, Nevada, USA",
    lat: 36.0840,
    lng: -115.1537,
    timezone: "America/Los_Angeles",
    embedId: "cn8_34TuMaM",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 14,
    name: "Santa Claus Village",
    location: "Rovaniemi, Finland",
    lat: 66.5436,
    lng: 25.8470,
    timezone: "Europe/Helsinki",
    embedId: "Cp4RRAEgpeU",
    tags: { vibe: "nature", timeOfDay: "any", region: "europe", weather: "snowy" }
  },
  {
    id: 15,
    name: "St. Petersburg",
    location: "St. Petersburg, Russia",
    lat: 59.9343,
    lng: 30.3351,
    timezone: "Europe/Moscow",
    embedId: "h1wly909BYw",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 16,
    name: "LAX Airport",
    location: "Los Angeles, California, USA",
    lat: 33.9425,
    lng: -118.4081,
    timezone: "America/Los_Angeles",
    embedId: "UQaSS4_VAV4",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 17,
    name: "St Ann",
    location: "St Ann, Jamaica",
    lat: 18.4271,
    lng: -77.1975,
    timezone: "America/Jamaica",
    embedId: "4X9dtsZmSw8",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 18,
    name: "Wales Coast",
    location: "Wales, UK",
    lat: 52.1307,
    lng: -3.7837,
    timezone: "Europe/London",
    embedId: "HVNqA-vTBX8",
    tags: { vibe: "nature", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 19,
    name: "Namib Desert",
    location: "Namibia, Africa",
    lat: -24.7553,
    lng: 15.9994,
    timezone: "Africa/Windhoek",
    embedId: "ydYDqZQpim8",
    tags: { vibe: "nature", timeOfDay: "any", region: "africa", weather: "sunny" }
  },

  // ── New cameras ───────────────────────────────────────────────────────────────
  {
    id: 20,
    name: "House of Sanskara",
    location: "Koh Phangan, Thailand",
    lat: 9.9528,
    lng: 100.0624,
    timezone: "Asia/Bangkok",
    embedId: "FBYUkqutqzE",
    tags: { vibe: "beach", timeOfDay: "any", region: "asia", weather: "sunny" }
  },

  {
    id: 22,
    name: "Downtown Kingston",
    location: "Kingston, Jamaica",
    lat: 17.9970,
    lng: -76.7936,
    timezone: "America/Jamaica",
    embedId: "cVpdwCQ7LEc",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 23,
    name: "Crystal Bay Beach Resort",
    location: "Lamai, Koh Samui, Thailand",
    lat: 9.4776,
    lng: 100.0607,
    timezone: "Asia/Bangkok",
    embedId: "Fw9hgttWzIg",
    tags: { vibe: "beach", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 24,
    name: "Bald Eagle Nest",
    location: "Big Bear, California, USA",
    lat: 34.2439,
    lng: -116.9114,
    timezone: "America/Los_Angeles",
    embedId: "B4-L2nfGcuE",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 25,
    name: "Walworth Road",
    location: "London, UK",
    lat: 51.4875,
    lng: -0.0932,
    timezone: "Europe/London",
    embedId: "8JCk5M_xrBs",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 26,
    name: "LionsDive Beach Resort",
    location: "Mambo Beach, Curaçao",
    lat: 12.1224,
    lng: -68.9324,
    timezone: "America/Curacao",
    embedId: "loHbMM9JfCs",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 27,
    name: "San Diego",
    location: "San Diego, California, USA",
    lat: 32.7157,
    lng: -117.1611,
    timezone: "America/Los_Angeles",
    embedId: "edz0ux7JClE",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 28,
    name: "Wildlife Cam",
    location: "USA",
    lat: 39.5,
    lng: -98.35,
    timezone: "America/Chicago",
    embedId: "oI8R4_UG3Fs",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 29,
    name: "Underwater Reef Cam",
    location: "Utopia Village, Caribbean",
    lat: 18.4655,
    lng: -66.1057,
    timezone: "America/Puerto_Rico",
    embedId: "jzx_n25g3kA",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 30,
    name: "Kilauea Volcano",
    location: "Hawaii, USA",
    lat: 19.4210,
    lng: -155.2872,
    timezone: "Pacific/Honolulu",
    embedId: "iws3rh5vLAQ",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 31,
    name: "Seychelles Ocean",
    location: "Seychelles, Africa",
    lat: -4.6796,
    lng: 55.4920,
    timezone: "Indian/Mahe",
    embedId: "Thtj8Ht7Z_c",
    tags: { vibe: "beach", timeOfDay: "any", region: "africa", weather: "sunny" }
  },
  {
    id: 32,
    name: "Tokyo Street",
    location: "Tokyo, Japan",
    lat: 35.6762,
    lng: 139.6503,
    timezone: "Asia/Tokyo",
    embedId: "_k-5U7IeK8g",
    tags: { vibe: "city", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 33,
    name: "Philippines, Davao City",
    location: "Davao City, Philippines",
    lat: 7.1907,
    lng: 125.4553,
    timezone: "Asia/Manila",
    embedId: "-3a_6XzwHas",
    tags: { vibe: "city", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 34,
    name: "Times Square",
    location: "New York City, USA",
    lat: 40.7580,
    lng: -73.9855,
    timezone: "America/New_York",
    embedId: "rnXIjl_Rzy4",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 35,
    name: "Marine City",
    location: "Michigan, USA",
    lat: 42.7198,
    lng: -82.4946,
    timezone: "America/Detroit",
    embedId: "F_bENs4GV24",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "cloudy" }
  },
  {
    id: 36,
    name: "Cape Kiwanda Beach",
    location: "Oregon Coast, USA",
    lat: 45.2329,
    lng: -123.9749,
    timezone: "America/Los_Angeles",
    embedId: "S5FRz8m4xWI",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "cloudy" }
  },
  {
    id: 37,
    name: "Winter Garden",
    location: "Florida, USA",
    lat: 28.5653,
    lng: -81.5862,
    timezone: "America/New_York",
    embedId: "67zqaidhq-U",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 38,
    name: "Vancouver",
    location: "Vancouver, Canada",
    lat: 49.2827,
    lng: -123.1207,
    timezone: "America/Vancouver",
    embedId: "rxyNjFKwzJA",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "cloudy" }
  },
  {
    id: 39,
    name: "The Swinging Bridge",
    location: "USA",
    lat: 39.5,
    lng: -98.35,
    timezone: "America/Chicago",
    embedId: "28U-t3fA9ks",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 40,
    name: "New York City Harbour",
    location: "Brooklyn, New York, USA",
    lat: 40.6892,
    lng: -74.0445,
    timezone: "America/New_York",
    embedId: "OgqbZLzEbQU",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 41,
    name: "Prague",
    location: "Prague, Czech Republic",
    lat: 50.0755,
    lng: 14.4378,
    timezone: "Europe/Prague",
    embedId: "IFnbDmgP69Q",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 42,
    name: "Soo Locks",
    location: "Sault Ste Marie, Michigan, USA",
    lat: 46.5015,
    lng: -84.3476,
    timezone: "America/Detroit",
    embedId: "TkY4BzCikQ4",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "cloudy" }
  },
  {
    id: 43,
    name: "Sukhumvit Road",
    location: "Bangkok, Thailand",
    lat: 13.7380,
    lng: 100.5601,
    timezone: "Asia/Bangkok",
    embedId: "UemFRPrl1hk",
    tags: { vibe: "city", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 44,
    name: "Atlantic City Boardwalk",
    location: "Atlantic City, New Jersey, USA",
    lat: 39.3643,
    lng: -74.4229,
    timezone: "America/New_York",
    embedId: "GDU59FNpYAM",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 45,
    name: "La Grange",
    location: "Kentucky, USA",
    lat: 38.4073,
    lng: -85.3788,
    timezone: "America/Kentucky/Louisville",
    embedId: "9SLt3AT0rXk",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 46,
    name: "Kansas City",
    location: "Missouri, USA",
    lat: 39.0997,
    lng: -94.5786,
    timezone: "America/Chicago",
    embedId: "u6UbwlQQ3QU",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 47,
    name: "Dover Harbour",
    location: "Dover, UK",
    lat: 51.1279,
    lng: 1.3134,
    timezone: "Europe/London",
    embedId: "AQMaw6OAeHY",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 48,
    name: "Leavenworth",
    location: "Washington, USA",
    lat: 47.5962,
    lng: -120.6615,
    timezone: "America/Los_Angeles",
    embedId: "TmtVbezZaqg",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "snowy" }
  },
  {
    id: 49,
    name: "Victoria Harbour",
    location: "Hong Kong",
    lat: 22.2855,
    lng: 114.1577,
    timezone: "Asia/Hong_Kong",
    embedId: "ZvqDwjNoN7Y",
    tags: { vibe: "city", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 50,
    name: "Jackson Hole Town Square",
    location: "Wyoming, USA",
    lat: 43.4799,
    lng: -110.7624,
    timezone: "America/Denver",
    embedId: "1EiC9bvVGnk",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 51,
    name: "Santa Monica Beach",
    location: "California, USA",
    lat: 34.0195,
    lng: -118.4912,
    timezone: "America/Los_Angeles",
    embedId: "qmE7U1YZPQA",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 52,
    name: "Venice Beach",
    location: "Los Angeles, California, USA",
    lat: 33.9850,
    lng: -118.4695,
    timezone: "America/Los_Angeles",
    embedId: "EO_1LWqsCNE",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 53,
    name: "Underwater Florida Keys",
    location: "Florida Keys, USA",
    lat: 24.5551,
    lng: -81.7800,
    timezone: "America/New_York",
    embedId: "qi0mY6zVQnY",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 54,
    name: "Narrowboat UK",
    location: "UK Canal",
    lat: 52.5,
    lng: -1.5,
    timezone: "Europe/London",
    embedId: "Qd8LE-KocBk",
    tags: { vibe: "nature", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 55,
    name: "Mauna Kea Observatory",
    location: "Hawaii, USA",
    lat: 19.8207,
    lng: -155.4680,
    timezone: "Pacific/Honolulu",
    embedId: "qJ8lYplu1y0",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 56,
    name: "Gran Canaria",
    location: "Gran Canaria, Spain",
    lat: 27.7957,
    lng: -15.5904,
    timezone: "Atlantic/Canary",
    embedId: "Ea48y09PuNc",
    tags: { vibe: "beach", timeOfDay: "any", region: "europe", weather: "sunny" }
  },
  {
    id: 57,
    name: "Fuerteventura Airport",
    location: "Canary Islands, Spain",
    lat: 28.4527,
    lng: -13.8633,
    timezone: "Atlantic/Canary",
    embedId: "JMFFi4Ma5M4",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "sunny" }
  },
  {
    id: 58,
    name: "Port of Helsinki",
    location: "Helsinki, Finland",
    lat: 60.1699,
    lng: 24.9384,
    timezone: "Europe/Helsinki",
    embedId: "6hPWq2IG08M",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 59,
    name: "Levi Ski Resort",
    location: "Levi, Finland",
    lat: 67.8009,
    lng: 24.8009,
    timezone: "Europe/Helsinki",
    embedId: "LwihxyJ4V20",
    tags: { vibe: "nature", timeOfDay: "any", region: "europe", weather: "snowy" }
  },
  {
    id: 60,
    name: "Tallinn Old Town",
    location: "Tallinn, Estonia",
    lat: 59.4370,
    lng: 24.7536,
    timezone: "Europe/Tallinn",
    embedId: "VhVgZi2lGv0",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 61,
    name: "Baden",
    location: "Baden, Germany",
    lat: 48.7603,
    lng: 8.2400,
    timezone: "Europe/Berlin",
    embedId: "JBKs0WYlbHQ",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 62,
    name: "Berlin",
    location: "Berlin, Germany",
    lat: 52.5200,
    lng: 13.4050,
    timezone: "Europe/Berlin",
    embedId: "IRqboacDNFg",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 63,
    name: "Amsterdam",
    location: "Amsterdam, Netherlands",
    lat: 52.3676,
    lng: 4.9041,
    timezone: "Europe/Amsterdam",
    embedId: "ZnOoxCd7BGU",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 64,
    name: "Siesta Key",
    location: "Florida, USA",
    lat: 27.2672,
    lng: -82.5457,
    timezone: "America/New_York",
    embedId: "NLhxcyzXQxM",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 65,
    name: "Clearwater Beach",
    location: "Florida, USA",
    lat: 27.9778,
    lng: -82.8272,
    timezone: "America/New_York",
    embedId: "V7sUbjD_e3I",
    tags: { vibe: "beach", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 66,
    name: "Castro Street",
    location: "San Francisco, California, USA",
    lat: 37.7609,
    lng: -122.4350,
    timezone: "America/Los_Angeles",
    embedId: "sWDrkFJctyI",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 67,
    name: "Castro Street (2)",
    location: "San Francisco, California, USA",
    lat: 37.7609,
    lng: -122.4350,
    timezone: "America/Los_Angeles",
    embedId: "0-6foXFYqvM",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 68,
    name: "Brighton Ski Resort",
    location: "Utah, USA",
    lat: 40.5977,
    lng: -111.5838,
    timezone: "America/Denver",
    embedId: "4a-3iEM7bHk",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "snowy" }
  },
  {
    id: 69,
    name: "Yorkshire",
    location: "Yorkshire, UK",
    lat: 53.9591,
    lng: -1.0819,
    timezone: "Europe/London",
    embedId: "vByZX49lCic",
    tags: { vibe: "nature", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 70,
    name: "Town Quay Southampton",
    location: "Southampton, UK",
    lat: 50.8976,
    lng: -1.4042,
    timezone: "Europe/London",
    embedId: "u7GyFcQJs98",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 71,
    name: "Broad Street Oxford",
    location: "Oxford, UK",
    lat: 51.7548,
    lng: -1.2544,
    timezone: "Europe/London",
    embedId: "-FguEt6H91s",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 72,
    name: "Cresswell Beach",
    location: "Northumberland, UK",
    lat: 55.2170,
    lng: -1.5450,
    timezone: "Europe/London",
    embedId: "8vZZMvqBNHQ",
    tags: { vibe: "beach", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 73,
    name: "Madikwe Game Reserve",
    location: "South Africa",
    lat: -24.7450,
    lng: 26.2450,
    timezone: "Africa/Johannesburg",
    embedId: "DsNtwGJXTTs",
    tags: { vibe: "nature", timeOfDay: "any", region: "africa", weather: "sunny" }
  },
  {
    id: 74,
    name: "Honeycomb Canyon",
    location: "Utah, USA",
    lat: 37.5,
    lng: -110.5,
    timezone: "America/Denver",
    embedId: "1LmE10tNdwI",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 75,
    name: "Mammoth Mountain Village",
    location: "California, USA",
    lat: 37.6485,
    lng: -118.9721,
    timezone: "America/Los_Angeles",
    embedId: "MwHWDokyUhw",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "snowy" }
  },
  {
    id: 76,
    name: "Snow Summit Ski Resort",
    location: "Big Bear, California, USA",
    lat: 34.2154,
    lng: -116.8901,
    timezone: "America/Los_Angeles",
    embedId: "SOo3NBmvJQI",
    tags: { vibe: "nature", timeOfDay: "any", region: "americas", weather: "snowy" }
  },
  {
    id: 77,
    name: "New Orleans",
    location: "New Orleans, Louisiana, USA",
    lat: 29.9511,
    lng: -90.0715,
    timezone: "America/Chicago",
    embedId: "Ksrleaxxxhw",
    tags: { vibe: "city", timeOfDay: "any", region: "americas", weather: "sunny" }
  },
  {
    id: 78,
    name: "Weymouth Harbour",
    location: "Weymouth, UK",
    lat: 50.6143,
    lng: -2.4566,
    timezone: "Europe/London",
    embedId: "ev1hgKJlnQA",
    tags: { vibe: "city", timeOfDay: "any", region: "europe", weather: "cloudy" }
  },
  {
    id: 79,
    name: "Shibuya Scramble Crossing",
    location: "Tokyo, Japan",
    lat: 35.6595,
    lng: 139.7004,
    timezone: "Asia/Tokyo",
    embedId: "8H3nRCFVR6Y",
    tags: { vibe: "city", timeOfDay: "any", region: "asia", weather: "sunny" }
  },
  {
    id: 80,
    name: "Shibuya Scramble Crossing (2)",
    location: "Tokyo, Japan",
    lat: 35.6595,
    lng: 139.7004,
    timezone: "Asia/Tokyo",
    embedId: "dfVK7ld38Ys",
    tags: { vibe: "city", timeOfDay: "any", region: "asia", weather: "sunny" }
  }
];
