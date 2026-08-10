// Static seed data for the MVP destination database.
// In production this table lives in Postgres; the shape here mirrors the
// planned `destinations` / `attractions` tables so the engine can be reused.

export type Interest =
  | "mountains"
  | "beaches"
  | "wildlife"
  | "history"
  | "culture"
  | "food"
  | "photography"
  | "adventure"
  | "nightlife"
  | "nature"
  | "architecture"
  | "spiritual"
  | "offbeat";

export type TravelStyle =
  | "budget"
  | "comfort"
  | "luxury"
  | "backpacking"
  | "family"
  | "romantic"
  | "adventure"
  | "relaxed";

export type TransportMode = "train" | "bus" | "flight" | "car";

export interface Attraction {
  name: string;
  /** Geographic cluster id — attractions in the same cluster are grouped into one day. */
  cluster: number;
  /** Typical visit duration in hours. */
  durationHours: number;
  entryFee: number;
  bestPartOfDay: "morning" | "afternoon" | "evening" | "any";
  note: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  shortDescription: string;
  description: string;
  tags: Interest[];
  bestMonths: number[]; // 1-12
  averageStayDays: number;
  difficulty: "easy" | "moderate" | "hard";
  popularityScore: number; // 0-100
  offbeatScore: number; // 0-100
  /** Per person per day, excluding long-distance transport, in INR. */
  dailyCost: { budget: number; comfort: number; luxury: number };
  styles: TravelStyle[];
  /** Long-distance modes that realistically serve this destination. */
  reachableBy: TransportMode[];
  localTips: string[];
  attractions: Attraction[];
}

export interface Origin {
  name: string;
  lat: number;
  lon: number;
}

export const ORIGINS: Origin[] = [
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
  { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { name: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
];

export const DESTINATIONS: Destination[] = [
  {
    id: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    country: "India",
    lat: 27.041,
    lon: 88.2663,
    shortDescription: "Tea slopes, toy trains and a clear-morning view of Kanchenjunga.",
    description:
      "A colonial hill station wrapped around a ridge at 2,000m. Mornings are for Himalayan sunrises, afternoons for tea estates and monastery walks. Compact enough to explore on foot, well connected by shared jeep from Siliguri.",
    tags: ["mountains", "photography", "nature", "culture", "food"],
    bestMonths: [3, 4, 5, 10, 11, 12],
    averageStayDays: 3,
    difficulty: "easy",
    popularityScore: 88,
    offbeatScore: 20,
    dailyCost: { budget: 1300, comfort: 2400, luxury: 5200 },
    styles: ["budget", "comfort", "family", "romantic", "relaxed", "backpacking"],
    reachableBy: ["train", "bus", "flight", "car"],
    localTips: [
      "Shared jeeps from Siliguri cost a fraction of a private cab.",
      "Book Tiger Hill sunrise the previous evening — it fills up.",
    ],
    attractions: [
      { name: "Tiger Hill sunrise", cluster: 1, durationHours: 3, entryFee: 100, bestPartOfDay: "morning", note: "Leave by 4am" },
      { name: "Batasia Loop & War Memorial", cluster: 1, durationHours: 1, entryFee: 20, bestPartOfDay: "morning", note: "On the way back" },
      { name: "Ghoom Monastery", cluster: 1, durationHours: 1, entryFee: 0, bestPartOfDay: "morning", note: "Oldest Tibetan monastery here" },
      { name: "Happy Valley Tea Estate", cluster: 2, durationHours: 2, entryFee: 100, bestPartOfDay: "afternoon", note: "Closed Mondays" },
      { name: "Himalayan Mountaineering Institute", cluster: 2, durationHours: 2, entryFee: 250, bestPartOfDay: "afternoon", note: "Includes the zoo" },
      { name: "Mall Road & Glenary's", cluster: 3, durationHours: 2, entryFee: 0, bestPartOfDay: "evening", note: "Best momos nearby" },
      { name: "Toy train joyride", cluster: 3, durationHours: 2, entryFee: 1500, bestPartOfDay: "afternoon", note: "Book online in advance" },
    ],
  },
  {
    id: "kalimpong",
    name: "Kalimpong",
    state: "West Bengal",
    country: "India",
    lat: 27.06,
    lon: 88.47,
    shortDescription: "A quieter ridge town of orchid nurseries, old churches and river views.",
    description:
      "Kalimpong keeps the Himalayan views of its famous neighbour without the crowds. Flower nurseries, Himalayan handmade paper, Teesta river valley drives and some of the best cloud-watching balconies in the region.",
    tags: ["mountains", "offbeat", "nature", "photography", "spiritual"],
    bestMonths: [3, 4, 5, 9, 10, 11, 12],
    averageStayDays: 2,
    difficulty: "easy",
    popularityScore: 52,
    offbeatScore: 68,
    dailyCost: { budget: 1100, comfort: 2000, luxury: 4200 },
    styles: ["budget", "backpacking", "relaxed", "romantic", "comfort"],
    reachableBy: ["train", "bus", "car", "flight"],
    localTips: ["Deolo Hill at sunset is free and near-empty on weekdays."],
    attractions: [
      { name: "Deolo Hill viewpoint", cluster: 1, durationHours: 2, entryFee: 20, bestPartOfDay: "evening", note: "Paragliding takeoff point" },
      { name: "Durpin Monastery", cluster: 1, durationHours: 1, entryFee: 0, bestPartOfDay: "morning", note: "Panoramic Teesta views" },
      { name: "Orchid & cactus nurseries", cluster: 2, durationHours: 2, entryFee: 50, bestPartOfDay: "morning", note: "Pick one, they are similar" },
      { name: "Himalayan handmade paper mill", cluster: 2, durationHours: 1, entryFee: 0, bestPartOfDay: "afternoon", note: "Small workshop tour" },
      { name: "Teesta river valley drive", cluster: 3, durationHours: 4, entryFee: 0, bestPartOfDay: "afternoon", note: "Rafting available in season" },
    ],
  },
  {
    id: "gangtok",
    name: "Gangtok",
    state: "Sikkim",
    country: "India",
    lat: 27.3389,
    lon: 88.6065,
    shortDescription: "Clean mountain capital with monasteries and high-altitude day trips.",
    description:
      "Sikkim's capital works as a comfortable base: cable cars, a pedestrian high street and day trips to Tsomgo Lake and Nathula. Permits are required for the high-altitude routes and are arranged by local agents.",
    tags: ["mountains", "culture", "spiritual", "photography", "adventure"],
    bestMonths: [3, 4, 5, 10, 11, 12],
    averageStayDays: 3,
    difficulty: "moderate",
    popularityScore: 84,
    offbeatScore: 30,
    dailyCost: { budget: 1500, comfort: 2700, luxury: 5800 },
    styles: ["comfort", "family", "adventure", "romantic", "budget"],
    reachableBy: ["train", "bus", "flight", "car"],
    localTips: ["Tsomgo Lake needs a permit — carry two passport photos and ID."],
    attractions: [
      { name: "MG Marg evening walk", cluster: 1, durationHours: 2, entryFee: 0, bestPartOfDay: "evening", note: "Vehicle-free street" },
      { name: "Ropeway cable car", cluster: 1, durationHours: 1, entryFee: 130, bestPartOfDay: "afternoon", note: "Short but scenic" },
      { name: "Rumtek Monastery", cluster: 2, durationHours: 3, entryFee: 10, bestPartOfDay: "morning", note: "24km from town" },
      { name: "Tsomgo Lake & Baba Mandir", cluster: 3, durationHours: 7, entryFee: 600, bestPartOfDay: "morning", note: "Full-day permit trip" },
      { name: "Ganesh Tok & Tashi viewpoint", cluster: 2, durationHours: 2, entryFee: 0, bestPartOfDay: "afternoon", note: "Kanchenjunga on clear days" },
    ],
  },
  {
    id: "sandakphu",
    name: "Sandakphu",
    state: "West Bengal",
    country: "India",
    lat: 27.1,
    lon: 88.0,
    shortDescription: "The Sleeping Buddha trek — four of the world's five highest peaks in one frame.",
    description:
      "A 3,636m ridge on the Singalila range, reached on a multi-day trek from Sepi or Manebhanjan. Trekker huts and homestays only. Physically demanding but the cheapest way to stand in front of Everest, Lhotse, Makalu and Kanchenjunga together.",
    tags: ["mountains", "adventure", "photography", "offbeat", "nature"],
    bestMonths: [3, 4, 10, 11, 12],
    averageStayDays: 5,
    difficulty: "hard",
    popularityScore: 46,
    offbeatScore: 84,
    dailyCost: { budget: 1400, comfort: 2200, luxury: 3500 },
    styles: ["backpacking", "adventure", "budget"],
    reachableBy: ["train", "bus", "car"],
    localTips: ["Carry cash — there are no ATMs past Manebhanjan."],
    attractions: [
      { name: "Manebhanjan to Tumling", cluster: 1, durationHours: 6, entryFee: 200, bestPartOfDay: "morning", note: "Singalila park entry" },
      { name: "Tumling to Kalipokhri", cluster: 2, durationHours: 6, entryFee: 0, bestPartOfDay: "morning", note: "Crosses into Nepal side trail" },
      { name: "Sandakphu summit sunrise", cluster: 3, durationHours: 3, entryFee: 0, bestPartOfDay: "morning", note: "The Sleeping Buddha view" },
      { name: "Ridge walk to Sabargram", cluster: 3, durationHours: 5, entryFee: 0, bestPartOfDay: "afternoon", note: "Exposed, windy" },
      { name: "Descent to Sepi via Gurdum", cluster: 4, durationHours: 7, entryFee: 0, bestPartOfDay: "morning", note: "Steep knees day" },
    ],
  },
  {
    id: "gokarna",
    name: "Gokarna",
    state: "Karnataka",
    country: "India",
    lat: 14.5479,
    lon: 74.318,
    shortDescription: "Temple town with a string of cliff-linked beaches and cheap shacks.",
    description:
      "A pilgrimage town that quietly became a backpacker beach circuit. Om, Kudle and Paradise beaches are connected by a coastal cliff walk. Low costs, simple stays, and swimming that is safest outside the monsoon.",
    tags: ["beaches", "spiritual", "offbeat", "nature", "food"],
    bestMonths: [10, 11, 12, 1, 2, 3],
    averageStayDays: 3,
    difficulty: "easy",
    popularityScore: 70,
    offbeatScore: 55,
    dailyCost: { budget: 1000, comfort: 2100, luxury: 4800 },
    styles: ["budget", "backpacking", "relaxed", "romantic"],
    reachableBy: ["train", "bus", "car"],
    localTips: ["The cliff walk is unlit — do it before sunset."],
    attractions: [
      { name: "Kudle Beach sunrise yoga", cluster: 1, durationHours: 2, entryFee: 300, bestPartOfDay: "morning", note: "Drop-in classes" },
      { name: "Om Beach cliff walk", cluster: 1, durationHours: 3, entryFee: 0, bestPartOfDay: "afternoon", note: "Carry water" },
      { name: "Mahabaleshwar Temple", cluster: 2, durationHours: 1, entryFee: 0, bestPartOfDay: "morning", note: "Dress modestly" },
      { name: "Half Moon & Paradise beaches", cluster: 3, durationHours: 4, entryFee: 0, bestPartOfDay: "afternoon", note: "Boat or trek in" },
      { name: "Mirjan Fort", cluster: 4, durationHours: 2, entryFee: 25, bestPartOfDay: "afternoon", note: "22km out, laterite ruins" },
    ],
  },
  {
    id: "hampi",
    name: "Hampi",
    state: "Karnataka",
    country: "India",
    lat: 15.335,
    lon: 76.46,
    shortDescription: "A boulder-strewn ruined empire that rewards slow, cycling days.",
    description:
      "The Vijayanagara capital spread over 26 sq km of granite boulders and banana fields. Best covered by bicycle or moped across two to three days, split between the sacred centre and the royal enclosure.",
    tags: ["history", "architecture", "photography", "culture", "offbeat"],
    bestMonths: [10, 11, 12, 1, 2],
    averageStayDays: 3,
    difficulty: "easy",
    popularityScore: 76,
    offbeatScore: 48,
    dailyCost: { budget: 950, comfort: 1900, luxury: 4300 },
    styles: ["budget", "backpacking", "relaxed", "family"],
    reachableBy: ["train", "bus", "car"],
    localTips: ["One ₹40 ticket covers Vittala and the Zenana enclosure the same day."],
    attractions: [
      { name: "Virupaksha Temple", cluster: 1, durationHours: 2, entryFee: 50, bestPartOfDay: "morning", note: "Still an active temple" },
      { name: "Vittala Temple & stone chariot", cluster: 1, durationHours: 3, entryFee: 40, bestPartOfDay: "morning", note: "Musical pillars" },
      { name: "Hemakuta Hill sunset", cluster: 1, durationHours: 2, entryFee: 0, bestPartOfDay: "evening", note: "Short climb" },
      { name: "Royal Enclosure & Lotus Mahal", cluster: 2, durationHours: 3, entryFee: 40, bestPartOfDay: "morning", note: "Elephant stables adjacent" },
      { name: "Matanga Hill sunrise", cluster: 2, durationHours: 2, entryFee: 0, bestPartOfDay: "morning", note: "Steep 30-min climb" },
      { name: "Coracle ride on the Tungabhadra", cluster: 3, durationHours: 1, entryFee: 300, bestPartOfDay: "afternoon", note: "Negotiate the rate" },
    ],
  },
  {
    id: "spiti",
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    country: "India",
    lat: 32.246,
    lon: 78.017,
    shortDescription: "High-altitude cold desert, thousand-year-old monasteries, almost no crowds.",
    description:
      "A Trans-Himalayan valley above 3,500m reached via Manali or Shimla. Homestays in Langza, Komic and Kibber, fossil hunting, and monasteries older than most countries. Acclimatisation days are not optional.",
    tags: ["mountains", "offbeat", "photography", "spiritual", "adventure", "nature"],
    bestMonths: [6, 7, 8, 9],
    averageStayDays: 7,
    difficulty: "hard",
    popularityScore: 62,
    offbeatScore: 90,
    dailyCost: { budget: 1600, comfort: 2900, luxury: 6000 },
    styles: ["backpacking", "adventure", "budget"],
    reachableBy: ["bus", "car", "flight"],
    localTips: ["Spend the first night below 3,500m — altitude sickness ruins itineraries."],
    attractions: [
      { name: "Key Monastery", cluster: 1, durationHours: 2, entryFee: 0, bestPartOfDay: "morning", note: "Donation appreciated" },
      { name: "Kibber & Chicham bridge", cluster: 1, durationHours: 3, entryFee: 0, bestPartOfDay: "afternoon", note: "Asia's highest bridge" },
      { name: "Langza fossil village", cluster: 2, durationHours: 3, entryFee: 0, bestPartOfDay: "morning", note: "Buddha statue viewpoint" },
      { name: "Komic & Hikkim post office", cluster: 2, durationHours: 3, entryFee: 0, bestPartOfDay: "afternoon", note: "Post a card home" },
      { name: "Dhankar Monastery & lake hike", cluster: 3, durationHours: 4, entryFee: 50, bestPartOfDay: "morning", note: "Steep 1hr hike" },
      { name: "Chandratal Lake", cluster: 4, durationHours: 6, entryFee: 0, bestPartOfDay: "afternoon", note: "Camping only in season" },
    ],
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    state: "Uttarakhand",
    country: "India",
    lat: 30.0869,
    lon: 78.2676,
    shortDescription: "Ganga rafting, riverside ashrams and cheap cafes with a view.",
    description:
      "Where the Ganga leaves the mountains. Whitewater rafting and bungee in the day, ghat aarti in the evening, and a long-running yoga scene across the two footbridges.",
    tags: ["adventure", "spiritual", "nature", "food", "photography"],
    bestMonths: [2, 3, 4, 9, 10, 11],
    averageStayDays: 3,
    difficulty: "easy",
    popularityScore: 90,
    offbeatScore: 18,
    dailyCost: { budget: 1000, comfort: 2000, luxury: 4600 },
    styles: ["budget", "backpacking", "adventure", "family", "relaxed"],
    reachableBy: ["train", "bus", "flight", "car"],
    localTips: ["Rafting closes during the monsoon — check before booking."],
    attractions: [
      { name: "Ganga rafting (16km)", cluster: 1, durationHours: 4, entryFee: 900, bestPartOfDay: "morning", note: "Shivpuri start" },
      { name: "Triveni Ghat aarti", cluster: 2, durationHours: 1, entryFee: 0, bestPartOfDay: "evening", note: "Arrive 30 min early" },
      { name: "Beatles Ashram", cluster: 2, durationHours: 2, entryFee: 150, bestPartOfDay: "afternoon", note: "Murals in the domes" },
      { name: "Neer Garh waterfall trek", cluster: 3, durationHours: 3, entryFee: 30, bestPartOfDay: "morning", note: "Slippery in rain" },
      { name: "Kunjapuri sunrise", cluster: 3, durationHours: 3, entryFee: 0, bestPartOfDay: "morning", note: "Shared cab at 4:30am" },
    ],
  },
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    country: "India",
    lat: 24.5854,
    lon: 73.7125,
    shortDescription: "Lake palaces, rooftop dinners and the most walkable old city in Rajasthan.",
    description:
      "Built around Lake Pichola, Udaipur is compact, photogenic and unusually pleasant to wander. The City Palace complex alone takes half a day; the rest is ghats, miniature-painting workshops and sunset boat rides.",
    tags: ["history", "architecture", "culture", "photography", "food"],
    bestMonths: [10, 11, 12, 1, 2, 3],
    averageStayDays: 3,
    difficulty: "easy",
    popularityScore: 92,
    offbeatScore: 15,
    dailyCost: { budget: 1200, comfort: 2600, luxury: 7000 },
    styles: ["romantic", "comfort", "family", "luxury", "budget"],
    reachableBy: ["train", "bus", "flight", "car"],
    localTips: ["Sunset boat tickets are sold at the City Palace jetty and sell out."],
    attractions: [
      { name: "City Palace complex", cluster: 1, durationHours: 3, entryFee: 300, bestPartOfDay: "morning", note: "Crystal gallery extra" },
      { name: "Lake Pichola sunset boat", cluster: 1, durationHours: 1, entryFee: 400, bestPartOfDay: "evening", note: "Stops at Jag Mandir" },
      { name: "Jagdish Temple & old city walk", cluster: 1, durationHours: 2, entryFee: 0, bestPartOfDay: "morning", note: "Great for street food" },
      { name: "Saheliyon ki Bari", cluster: 2, durationHours: 1, entryFee: 50, bestPartOfDay: "afternoon", note: "Fountain garden" },
      { name: "Monsoon Palace sunset", cluster: 3, durationHours: 3, entryFee: 100, bestPartOfDay: "evening", note: "Inside a wildlife sanctuary" },
      { name: "Bagore ki Haveli dance show", cluster: 1, durationHours: 2, entryFee: 200, bestPartOfDay: "evening", note: "7pm daily" },
    ],
  },
  {
    id: "mawlynnong",
    name: "Mawlynnong & Dawki",
    state: "Meghalaya",
    country: "India",
    lat: 25.2,
    lon: 91.9,
    shortDescription: "Living root bridges, glass-clear river water and village homestays.",
    description:
      "The cleanest village in Asia, an hour from the Umngot river at Dawki where boats appear to float on air. Combine with Cherrapunji's waterfalls for a rain-country loop out of Shillong.",
    tags: ["nature", "offbeat", "photography", "culture", "adventure"],
    bestMonths: [10, 11, 12, 1, 2, 3],
    averageStayDays: 3,
    difficulty: "moderate",
    popularityScore: 58,
    offbeatScore: 76,
    dailyCost: { budget: 1300, comfort: 2400, luxury: 4900 },
    styles: ["backpacking", "relaxed", "family", "budget", "romantic"],
    reachableBy: ["flight", "bus", "car", "train"],
    localTips: ["Umngot water is clearest between November and February."],
    attractions: [
      { name: "Living root bridge, Riwai", cluster: 1, durationHours: 2, entryFee: 50, bestPartOfDay: "morning", note: "Short descent" },
      { name: "Mawlynnong sky view & village walk", cluster: 1, durationHours: 2, entryFee: 100, bestPartOfDay: "afternoon", note: "Bamboo tower" },
      { name: "Dawki Umngot boat ride", cluster: 2, durationHours: 2, entryFee: 1000, bestPartOfDay: "morning", note: "Per boat, not per head" },
      { name: "Nohkalikai Falls", cluster: 3, durationHours: 2, entryFee: 30, bestPartOfDay: "afternoon", note: "Near Cherrapunji" },
      { name: "Mawsmai caves", cluster: 3, durationHours: 1, entryFee: 30, bestPartOfDay: "afternoon", note: "Tight in places" },
    ],
  },
  {
    id: "puri",
    name: "Puri & Konark",
    state: "Odisha",
    country: "India",
    lat: 19.8135,
    lon: 85.8312,
    shortDescription: "A long east-coast beach, a great temple and the Konark sun chariot.",
    description:
      "An easy coastal break: Jagannath temple and its ritual life, a wide swimmable beach, the Sun Temple at Konark 35km away, and Chilika lagoon for dolphins and migratory birds.",
    tags: ["beaches", "spiritual", "history", "architecture", "wildlife", "food"],
    bestMonths: [10, 11, 12, 1, 2],
    averageStayDays: 3,
    difficulty: "easy",
    popularityScore: 74,
    offbeatScore: 34,
    dailyCost: { budget: 900, comfort: 1800, luxury: 4000 },
    styles: ["budget", "family", "relaxed", "comfort"],
    reachableBy: ["train", "bus", "car", "flight"],
    localTips: ["Non-Hindus cannot enter Jagannath temple; the library roof gives a view."],
    attractions: [
      { name: "Jagannath Temple precinct", cluster: 1, durationHours: 2, entryFee: 0, bestPartOfDay: "morning", note: "No phones inside" },
      { name: "Puri beach sunrise", cluster: 1, durationHours: 1, entryFee: 0, bestPartOfDay: "morning", note: "Fishing boats return early" },
      { name: "Konark Sun Temple", cluster: 2, durationHours: 3, entryFee: 40, bestPartOfDay: "morning", note: "Hire a guide, it's worth it" },
      { name: "Chandrabhaga beach", cluster: 2, durationHours: 2, entryFee: 0, bestPartOfDay: "afternoon", note: "Next to Konark" },
      { name: "Chilika lake dolphin boat", cluster: 3, durationHours: 5, entryFee: 1200, bestPartOfDay: "morning", note: "Satapada jetty" },
      { name: "Raghurajpur artist village", cluster: 3, durationHours: 2, entryFee: 0, bestPartOfDay: "afternoon", note: "Pattachitra painting" },
    ],
  },
  {
    id: "kaziranga",
    name: "Kaziranga",
    state: "Assam",
    country: "India",
    lat: 26.5775,
    lon: 93.1711,
    shortDescription: "Grassland safaris with the world's densest one-horned rhino population.",
    description:
      "A UNESCO floodplain park on the Brahmaputra. Jeep safaris across four ranges, elephant grass taller than the vehicle, and near-guaranteed rhino sightings between November and April.",
    tags: ["wildlife", "nature", "photography", "adventure"],
    bestMonths: [11, 12, 1, 2, 3, 4],
    averageStayDays: 3,
    difficulty: "easy",
    popularityScore: 68,
    offbeatScore: 52,
    dailyCost: { budget: 1800, comfort: 3200, luxury: 7500 },
    styles: ["family", "comfort", "adventure", "budget"],
    reachableBy: ["flight", "train", "bus", "car"],
    localTips: ["The park closes mid-May to October for the monsoon."],
    attractions: [
      { name: "Central range jeep safari", cluster: 1, durationHours: 4, entryFee: 2200, bestPartOfDay: "morning", note: "Shared jeep rates apply" },
      { name: "Western range safari", cluster: 2, durationHours: 4, entryFee: 2000, bestPartOfDay: "afternoon", note: "Best for birds" },
      { name: "Tea garden walk", cluster: 3, durationHours: 2, entryFee: 0, bestPartOfDay: "afternoon", note: "Around Bokakhat" },
      { name: "Orchid & biodiversity park", cluster: 3, durationHours: 2, entryFee: 100, bestPartOfDay: "evening", note: "Cultural show at dusk" },
      { name: "Brahmaputra sunset point", cluster: 4, durationHours: 2, entryFee: 0, bestPartOfDay: "evening", note: "Near Agoratoli" },
    ],
  },
  {
    id: "pondicherry",
    name: "Puducherry",
    state: "Puducherry",
    country: "India",
    lat: 11.9416,
    lon: 79.8083,
    shortDescription: "French-quarter cafés, a promenade and Auroville's forest experiments.",
    description:
      "A coastal town split between the mustard-yellow French quarter and the busier Tamil town. Cycle-friendly, good food, and Auroville twenty minutes north for slow days.",
    tags: ["culture", "food", "architecture", "beaches", "photography", "nightlife"],
    bestMonths: [10, 11, 12, 1, 2, 3],
    averageStayDays: 3,
    difficulty: "easy",
    popularityScore: 82,
    offbeatScore: 26,
    dailyCost: { budget: 1200, comfort: 2500, luxury: 6000 },
    styles: ["relaxed", "romantic", "comfort", "budget", "family"],
    reachableBy: ["train", "bus", "car", "flight"],
    localTips: ["Matrimandir viewing passes must be booked a day ahead."],
    attractions: [
      { name: "French Quarter walk", cluster: 1, durationHours: 2, entryFee: 0, bestPartOfDay: "morning", note: "Start at Rue Dumas" },
      { name: "Promenade Beach evening", cluster: 1, durationHours: 2, entryFee: 0, bestPartOfDay: "evening", note: "Traffic-free after 6pm" },
      { name: "Sri Aurobindo Ashram", cluster: 1, durationHours: 1, entryFee: 0, bestPartOfDay: "morning", note: "Silence maintained" },
      { name: "Auroville & Matrimandir", cluster: 2, durationHours: 4, entryFee: 0, bestPartOfDay: "morning", note: "Pass needed for inner chamber" },
      { name: "Paradise Beach boat", cluster: 3, durationHours: 3, entryFee: 300, bestPartOfDay: "afternoon", note: "Chunnambar backwaters" },
    ],
  },
  {
    id: "tirthan",
    name: "Tirthan Valley",
    state: "Himachal Pradesh",
    country: "India",
    lat: 31.63,
    lon: 77.35,
    shortDescription: "Riverside guesthouses, trout streams and the Great Himalayan National Park.",
    description:
      "An unhurried alternative to Manali. Wooden homestays on the Tirthan river, day treks into GHNP buffer forest, trout fishing permits, and no shopping street to speak of.",
    tags: ["nature", "offbeat", "mountains", "adventure", "photography"],
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    averageStayDays: 4,
    difficulty: "moderate",
    popularityScore: 50,
    offbeatScore: 78,
    dailyCost: { budget: 1400, comfort: 2600, luxury: 5200 },
    styles: ["relaxed", "backpacking", "romantic", "adventure", "family"],
    reachableBy: ["bus", "car", "flight", "train"],
    localTips: ["Overnight Volvo to Aut tunnel, then a shared cab up the valley."],
    attractions: [
      { name: "Jalori Pass & Serolsar Lake trek", cluster: 1, durationHours: 5, entryFee: 0, bestPartOfDay: "morning", note: "5km each way" },
      { name: "Great Himalayan NP day trek", cluster: 2, durationHours: 6, entryFee: 200, bestPartOfDay: "morning", note: "Guide mandatory" },
      { name: "Chhoie waterfall hike", cluster: 3, durationHours: 3, entryFee: 0, bestPartOfDay: "afternoon", note: "From Nagini" },
      { name: "Trout fishing on the Tirthan", cluster: 3, durationHours: 3, entryFee: 100, bestPartOfDay: "afternoon", note: "Catch and release permit" },
      { name: "Riverside evening by the water", cluster: 3, durationHours: 2, entryFee: 0, bestPartOfDay: "evening", note: "Bonfire at most stays" },
    ],
  },
];

export const INTEREST_OPTIONS: Interest[] = [
  "mountains",
  "beaches",
  "wildlife",
  "history",
  "culture",
  "food",
  "photography",
  "adventure",
  "nightlife",
  "nature",
  "architecture",
  "spiritual",
  "offbeat",
];

export const STYLE_OPTIONS: TravelStyle[] = [
  "budget",
  "comfort",
  "luxury",
  "backpacking",
  "family",
  "romantic",
  "adventure",
  "relaxed",
];

export const TRANSPORT_OPTIONS: TransportMode[] = ["train", "bus", "flight", "car"];

export function getDestination(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}