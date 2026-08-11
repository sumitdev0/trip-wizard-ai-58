# Trip Architect

{

  "project": {

    "name": "TripWise",

    "type": "AI-powered travel discovery, planning and recommendation platform",

    "version": "1.0",

    "status": "planning",

    "primary_goal": "Help users discover, evaluate and plan trips based on budget, available time, starting location, interests and travel preferences.",

    "core_idea": "A user provides their starting location, budget, number of days and preferences. The system discovers destinations that are realistically affordable, calculates estimated costs, ranks destinations, generates optimized routes and produces a practical day-by-day itinerary.",

    "target_users": [

      "Students",

      "Budget travelers",

      "Solo travelers",

      "Couples",

      "Families",

      "Groups of friends",

      "Backpackers",

      "Offbeat travelers",

      "International travelers"

    ],

    "primary_differentiator": "Instead of simply showing destinations, the platform answers: 'Where can I realistically go with my budget, time and preferences?'"

  },

  "product_philosophy": {

    "principles": [

      "Do not overwhelm users with unnecessary information.",

      "Every recommendation should have a reason.",

      "Never invent prices, availability or travel information.",

      "Separate factual travel data from AI-generated explanations.",

      "Prefer realistic recommendations over impressive-looking recommendations.",

      "Show estimated costs transparently.",

      "Allow users to understand why a destination was recommended.",

      "Optimize for mobile-first usability.",

      "Build the system so that recommendation algorithms can improve as user data increases."

    ]

  },

  "primary_user_flow": {

    "step_1": {

      "name": "Trip Requirements",

      "collect": [

        "starting_location",

        "destination_preference",

        "travel_dates",

        "number_of_days",

        "number_of_travelers",

        "total_budget",

        "travel_style",

        "interests",

        "transport_preference",

        "accommodation_preference",

        "maximum_travel_time",

        "trip_type"

      ]

    },

    "step_2": {

      "name": "Requirement Processing",

      "actions": [

        "Validate user input",

        "Normalize locations",

        "Normalize currency",

        "Calculate available daily budget",

        "Determine travel season",

        "Determine destination constraints"

      ]

    },

    "step_3": {

      "name": "Destination Discovery",

      "actions": [

        "Retrieve candidate destinations",

        "Filter impossible destinations",

        "Calculate approximate trip cost",

        "Calculate travel time",

        "Calculate preference compatibility"

      ]

    },

    "step_4": {

      "name": "Recommendation",

      "actions": [

        "Calculate destination score",

        "Rank destinations",

        "Explain recommendation",

        "Show estimated budget",

        "Show pros and cons",

        "Show best time to visit"

      ]

    },

    "step_5": {

      "name": "Trip Selection",

      "actions": [

        "User selects destination",

        "System loads nearby attractions",

        "System loads activities",

        "System loads transportation options",

        "System loads accommodation options"

      ]

    },

    "step_6": {

      "name": "Itinerary Generation",

      "actions": [

        "Group attractions geographically",

        "Consider opening hours",

        "Consider travel time",

        "Consider activity duration",

        "Consider user preferences",

        "Optimize daily schedule",

        "Generate day-by-day itinerary"

      ]

    },

    "step_7": {

      "name": "Trip Management",

      "features": [

        "Save trip",

        "Edit itinerary",

        "Share trip",

        "Collaborate with others",

        "Export itinerary",

        "View trip budget",

        "Packing checklist",

        "Travel notes"

      ]

    }

  },

  "homepage": {

    "hero": {

      "headline": "Where can you go with your budget?",

      "subheadline": "Tell us where you're starting, how much you want to spend and how many days you have. We'll find trips that actually fit.",

      "primary_cta": "Plan My Trip",

      "secondary_cta": "Explore Destinations"

    },

    "search_box": {

      "placeholder": "Where do you want to go?",

      "support_natural_language": true,

      "examples": [

        "4 days from Kolkata under ₹15000",

        "Mountain trip under ₹20000",

        "Best places near Kolkata for 3 days",

        "Offbeat North Bengal trip for 5 days"

      ]

    },

    "sections": [

      "Popular destinations",

      "Best destinations for your budget",

      "Hidden gems",

      "Trending trips",

      "Weekend getaways",

      "Seasonal destinations",

      "Community itineraries"

    ]

  },

  "trip_planner": {

    "title": "Plan Your Trip",

    "fields": {

      "starting_location": {

        "type": "location",

        "required": true,

        "description": "City, town, airport or current location."

      },

      "destination": {

        "type": "location",

        "required": false,

        "description": "Optional. If empty, recommendation engine discovers destinations."

      },

      "budget": {

        "type": "currency",

        "required": true,

        "default_currency": "INR"

      },

      "days": {

        "type": "integer",

        "required": true,

        "minimum": 1

      },

      "travelers": {

        "type": "integer",

        "required": true,

        "minimum": 1

      },

      "travel_dates": {

        "type": "date_range",

        "required": false

      },

      "travel_style": {

        "type": "multi_select",

        "options": [

          "budget",

          "comfort",

          "luxury",

          "backpacking",

          "family",

          "romantic",

          "adventure",

          "relaxed"

        ]

      },

      "interests": {

        "type": "multi_select",

        "options": [

          "mountains",

          "beaches",

          "wildlife",

          "history",

          "culture",

          "food",

          "photography",

          "adventure",

          "nightlife",

          "shopping",

          "nature",

          "architecture",

          "spiritual",

          "offbeat"

        ]

      },

      "transport": {

        "type": "multi_select",

        "options": [

          "train",

          "bus",

          "flight",

          "car",

          "bike",

          "public_transport",

          "any"

        ]

      },

      "accommodation": {

        "type": "select",

        "options": [

          "hostel",

          "budget_hotel",

          "hotel",

          "resort",

          "homestay",

          "camping",

          "any"

        ]

      },

      "maximum_travel_time": {

        "type": "duration"

      }

    }

  },

  "destination_model": {

    "destination": {

      "id": "unique_identifier",

      "name": "string",

      "country": "string",

      "state": "string",

      "district": "string",

      "latitude": "number",

      "longitude": "number",

      "description": "text",

      "short_description": "text",

      "tags": [],

      "categories": [],

      "best_months": [],

      "average_stay_days": "number",

      "difficulty": "easy|moderate|hard",

      "popularity_score": "number",

      "offbeat_score": "number",

      "family_score": "number",

      "solo_score": "number",

      "couple_score": "number",

      "budget_score": "number"

    }

  },

  "destination_tags": {

    "purpose": "Tags are used for search, filtering and recommendation.",

    "examples": [

      "mountain",

      "beach",

      "forest",

      "waterfall",

      "trekking",

      "wildlife",

      "heritage",

      "temple",

      "food",

      "photography",

      "camping",

      "snow",

      "adventure",

      "family",

      "romantic",

      "backpacking",

      "budget",

      "luxury",

      "offbeat",

      "weekend",

      "road_trip"

    ],

    "rules": [

      "Use normalized lowercase tags internally.",

      "Avoid duplicate semantic tags.",

      "Allow hierarchical categories.",

      "Allow administrators to merge incorrect tags.",

      "Use tags in recommendation scoring."

    ]

  },

  "cost_engine": {

    "purpose": "Estimate the realistic total cost of a trip.",

    "components": [

      "transportation",

      "accommodation",

      "food",

      "local_transport",

      "activities",

      "entry_fees",

      "miscellaneous",

      "emergency_buffer"

    ],

    "formula": {

      "subtotal": "transport + accommodation + food + local_transport + activities + entry_fees + miscellaneous",

      "total": "subtotal + emergency_buffer"

    },

    "rules": [

      "Never present estimated prices as guaranteed prices.",

      "Show price ranges where exact prices are unavailable.",

      "Store source and timestamp for externally sourced prices.",

      "Support multiple currencies.",

      "Allow user to modify estimated values."

    ]

  },

  "recommendation_engine": {

    "purpose": "Rank destinations according to the user's actual constraints and preferences.",

    "pipeline": [

      "candidate_generation",

      "constraint_filtering",

      "feature_calculation",

      "scoring",

      "ranking",

      "diversification",

      "explanation"

    ],

    "hard_constraints": [

      "budget_limit",

      "maximum_days",

      "maximum_travel_time",

      "destination_availability",

      "transport_availability"

    ],

    "soft_constraints": [

      "interests",

      "travel_style",

      "season",

      "popularity",

      "offbeat_preference",

      "comfort_preference"

    ],

    "initial_scoring_model": {

      "budget_match": 0.30,

      "interest_match": 0.25,

      "season_match": 0.15,

      "travel_time_match": 0.10,

      "travel_style_match": 0.10,

      "destination_quality": 0.05,

      "offbeat_score": 0.05

    },

    "score_range": "0-100",

    "explanation": {

      "show_score": true,

      "show_reasons": true,

      "show_tradeoffs": true,

      "example": "Recommended because it fits your budget, matches your interest in mountains and photography, and is reachable within your preferred travel time."

    }

  },

  "recommendation_algorithms": {

    "phase_1": [

      "constraint filtering",

      "sorting",

      "weighted scoring",

      "rule-based recommendation"

    ],

    "phase_2": [

      "content-based recommendation",

      "feature similarity",

      "cosine similarity",

      "user preference vectors"

    ],

    "phase_3": [

      "collaborative filtering",

      "user-item interaction matrix",

      "implicit feedback modeling"

    ],

    "phase_4": [

      "embedding-based recommendation",

      "semantic similarity",

      "learning-to-rank",

      "personalized ranking"

    ]

  },

  "route_engine": {

    "model": "graph",

    "nodes": [

      "cities",

      "airports",

      "railway_stations",

      "bus_stations",

      "destinations",

      "attractions"

    ],

    "edges": [

      "roads",

      "rail_routes",

      "bus_routes",

      "flight_routes",

      "walking_routes"

    ],

    "algorithms": [

      "Dijkstra",

      "A*",

      "BFS",

      "graph traversal",

      "heuristic optimization"

    ],

    "optimization_targets": [

      "minimum travel time",

      "minimum cost",

      "minimum distance",

      "balanced cost and time"

    ]

  },

  "itinerary_engine": {

    "purpose": "Generate realistic day-by-day schedules.",

    "inputs": [

      "destination",

      "number_of_days",

      "attractions",

      "activities",

      "opening_hours",

      "closing_hours",

      "travel_time",

      "activity_duration",

      "budget",

      "user_preferences"

    ],

    "process": [

      "retrieve candidate attractions",

      "filter unavailable attractions",

      "cluster attractions geographically",

      "estimate travel time",

      "assign attractions to days",

      "optimize ordering",

      "check opening hours",

      "check budget",

      "add breaks",

      "generate final itinerary"

    ],

    "algorithms": [

      "geographical clustering",

      "shortest path",

      "TSP heuristics",

      "constraint satisfaction",

      "greedy optimization",

      "local search"

    ],

    "output": {

      "day": "number",

      "date": "date",

      "morning": [],

      "afternoon": [],

      "evening": [],

      "estimated_cost": "number",

      "travel_time": "duration",

      "distance": "number",

      "notes": []

    }

  },

  "ai_layer": {

    "purpose": "Use AI for natural language understanding, explanations and conversational planning.",

    "important_rule": "The AI must not be the source of truth for prices, availability, schedules or factual travel data.",

    "ai_tasks": [

      "parse natural language travel requests",

      "extract budget",

      "extract dates",

      "extract location",

      "extract interests",

      "explain recommendations",

      "summarize destinations",

      "generate travel tips",

      "convert structured itinerary into natural language",

      "answer travel planning questions",

      "help modify itineraries"

    ],

    "pipeline": {

      "user_message": "natural language",

      "llm": "extract structured requirements",

      "backend": "validate requirements",

      "recommendation_engine": "calculate recommendations",

      "database_and_apis": "retrieve factual data",

      "optimization_engine": "calculate itinerary",

      "llm": "explain final result"

    },

    "example": {

      "input": "I have 20000 rupees and 4 days starting from Kolkata. I want mountains and photography.",

      "structured_output": {

        "starting_location": "Kolkata",

        "budget": 20000,

        "days": 4,

        "interests": [

          "mountains",

          "photography"

        ]

      }

    }

  },

  "natural_language_search": {

    "enabled": true,

    "examples": [

      "Where can I go from Kolkata for 3 days under ₹10000?",

      "I want an offbeat mountain trip under ₹15000.",

      "Give me a romantic trip for two under ₹30000.",

      "I have 5 days and want somewhere peaceful.",

      "Find me a trip where most of my budget goes toward experiences rather than hotels."

    ],

    "processing": [

      "intent_detection",

      "entity_extraction",

      "constraint_extraction",

      "normalization",

      "recommendation"

    ]

  },

  "database": {

    "database_type": "PostgreSQL",

    "core_tables": [

      "users",

      "destinations",

      "destination_tags",

      "tags",

      "attractions",

      "activities",

      "restaurants",

      "accommodations",

      "transport_routes",

      "transport_prices",

      "destination_prices",

      "travel_seasons",

      "reviews",

      "ratings",

      "trips",

      "itineraries",

      "itinerary_items",

      "user_preferences",

      "user_interactions",

      "saved_destinations",

      "saved_trips"

    ]

  },

  "user_model": {

    "profile": {

      "id": "uuid",

      "name": "string",

      "email": "string",

      "home_location": "location",

      "preferred_currency": "INR",

      "created_at": "timestamp"

    },

    "preferences": {

      "favorite_tags": [],

      "budget_range": {},

      "preferred_trip_duration": {},

      "preferred_transport": [],

      "preferred_accommodation": [],

      "travel_style": []

    },

    "behavior_data": {

      "searches": [],

      "views": [],

      "saved_destinations": [],

      "completed_trips": [],

      "ratings": [],

      "clicks": []

    }

  },

  "community": {

    "features": [

      "user profiles",

      "travel stories",

      "reviews",

      "ratings",

      "photos",

      "public itineraries",

      "comments",

      "likes",

      "follows",

      "trip sharing"

    ],

    "trust_system": {

      "verified_reviews": true,

      "spam_detection": true,

      "duplicate_review_detection": true,

      "moderation": true

    }

  },

  "destination_page": {

    "sections": [

      "hero image",

      "overview",

      "why visit",

      "best time to visit",

      "estimated budget",

      "how to reach",

      "things to do",

      "nearby places",

      "food",

      "accommodation",

      "map",

      "weather",

      "local tips",

      "community reviews",

      "sample itineraries",

      "similar destinations"

    ],

    "actions": [

      "Plan trip",

      "Save destination",

      "Share",

      "Add to itinerary"

    ]

  },

  "map_features": {

    "required": [

      "interactive map",

      "destination markers",

      "attraction markers",

      "route visualization",

      "distance calculation",

      "travel time estimation"

    ],

    "future": [

      "offline maps",

      "crowd information",

      "live transport information",

      "weather overlays",

      "custom trip layers"

    ]

  },

  "search": {

    "searchable_entities": [

      "destinations",

      "cities",

      "attractions",

      "activities",

      "restaurants",

      "accommodations",

      "travel guides"

    ],

    "filters": [

      "budget",

      "distance",

      "duration",

      "season",

      "category",

      "interest",

      "difficulty",

      "popularity"

    ],

    "ranking": [

      "relevance",

      "distance",

      "personalization",

      "popularity",

      "quality"

    ]

  },

  "seo": {

    "strategy": "Programmatic and editorial travel SEO",

    "page_types": [

      "destination pages",

      "city guides",

      "budget travel pages",

      "seasonal travel pages",

      "travel itineraries",

      "things-to-do pages",

      "offbeat destination pages",

      "comparison pages"

    ],

    "metadata": [

      "title",

      "description",

      "canonical_url",

      "open_graph",

      "structured_data"

    ],

    "structured_data": [

      "TouristDestination",

      "Article",

      "Review",

      "BreadcrumbList"

    ]

  },

  "content_system": {

    "content_types": [

      "destination guide",

      "travel guide",

      "itinerary",

      "travel story",

      "local tip",

      "activity description",

      "restaurant description",

      "hotel description"

    ],

    "content_rules": [

      "Avoid duplicate content.",

      "Prefer useful information over keyword stuffing.",

      "Clearly distinguish editorial content from user-generated content.",

      "Display last updated date for time-sensitive information."

    ]

  },

  "admin_panel": {

    "features": [

      "destination management",

      "tag management",

      "attraction management",

      "activity management",

      "price management",

      "review moderation",

      "user management",

      "content management",

      "analytics",

      "API monitoring",

      "recommendation analytics"

    ]

  },

  "analytics": {

    "track": [

      "searches",

      "destination_views",

      "recommendation_clicks",

      "saved_destinations",

      "trip_creation",

      "trip_completion",

      "itinerary_edits",

      "shares",

      "reviews",

      "conversion_events"

    ],

    "key_metrics": [

      "daily_active_users",

      "monthly_active_users",

      "trip_plans_created",

      "recommendation_click_rate",

      "trip_completion_rate",

      "user_retention",

      "average_session_duration"

    ]

  },

  "monetization": {

    "phase_1": [

      "affiliate links"

    ],

    "phase_2": [

      "hotel partnerships",

      "activity partnerships",

      "travel insurance partnerships",

      "featured listings"

    ],

    "phase_3": [

      "premium AI trip planner",

      "premium itinerary optimization",

      "local guide marketplace",

      "travel packages"

    ],

    "rule": "Recommendations must not become biased solely because a business pays for placement. Sponsored content must be clearly labeled."

  },

  "security": {

    "requirements": [

      "secure authentication",

      "password hashing",

      "JWT or secure session management",

      "rate limiting",

      "input validation",

      "SQL injection prevention",

      "XSS protection",

      "CSRF protection",

      "API key protection",

      "role-based authorization",

      "secure file uploads"

    ]

  },

  "privacy": {

    "requirements": [

      "collect only necessary user data",

      "allow account deletion",

      "allow users to delete saved trips",

      "protect location data",

      "do not expose private itineraries",

      "clearly explain personalization data usage"

    ]

  },

  "technical_architecture": {

    "frontend": {

      "recommended": "React or Next.js",

      "responsibilities": [

        "UI",

        "search",

        "maps",

        "trip planner",

        "itinerary editor",

        "authentication"

      ]

    },

    "backend": {

      "recommended": "Python FastAPI",

      "responsibilities": [

        "REST API",

        "authentication",

        "business logic",

        "recommendation engine",

        "cost engine",

        "itinerary engine",

        "AI orchestration"

      ]

    },

    "database": {

      "recommended": "PostgreSQL"

    },

    "cache": {

      "recommended": "Redis",

      "use_cases": [

        "API caching",

        "popular destinations",

        "temporary recommendations",

        "rate limiting"

      ]

    },

    "background_jobs": {

      "recommended": "Celery or equivalent",

      "tasks": [

        "price updates",

        "weather updates",

        "recommendation recalculation",

        "content processing",

        "email notifications"

      ]

    }

  },

  "api_categories": {

    "maps": [

      "geocoding",

      "routing",

      "distance_matrix",

      "places"

    ],

    "travel": [

      "transport schedules",

      "flight data",

      "hotel data",

      "activity data"

    ],

    "environment": [

      "weather",

      "air_quality"

    ],

    "ai": [

      "LLM",

      "embeddings"

    ]

  },

  "algorithm_stack": {

    "basic": [

      "filtering",

      "sorting",

      "hash maps",

      "binary search"

    ],

    "graphs": [

      "BFS",

      "DFS",

      "Dijkstra",

      "A*"

    ],

    "optimization": [

      "knapsack",

      "constraint satisfaction",

      "TSP heuristics",

      "greedy algorithms",

      "local search",

      "multi-objective optimization"

    ],

    "recommendation": [

      "weighted scoring",

      "content-based filtering",

      "cosine similarity",

      "collaborative filtering",

      "learning-to-rank"

    ],

    "machine_learning_future": [

      "ranking models",

      "user embeddings",

      "destination embeddings",

      "personalized recommendation"

    ]

  },

  "performance": {

    "requirements": [

      "cache expensive calculations",

      "paginate large result sets",

      "index database search fields",

      "avoid unnecessary API requests",

      "use asynchronous API calls where appropriate",

      "precompute frequently requested recommendations",

      "use background jobs for expensive operations"

    ]

  },

  "mobile": {

    "priority": "mobile-first",

    "features": [

      "responsive design",

      "touch-friendly itinerary editor",

      "mobile map",

      "offline saved itinerary",

      "shareable trip link"

    ]

  },

  "accessibility": {

    "requirements": [

      "semantic HTML",

      "keyboard navigation",

      "screen-reader compatibility",

      "sufficient contrast",

      "accessible forms",

      "alt text for images",

      "visible focus states"

    ]

  },

  "future_features": {

    "phase_2": [

      "AI travel assistant",

      "personalized recommendations",

      "collaborative trips",

      "offline itinerary",

      "travel journal"

    ],

    "phase_3": [

      "community marketplace",

      "local guides",

      "live travel alerts",

      "price alerts",

      "crowd estimation"

    ],

    "phase_4": [

      "advanced personalization",

      "machine learning recommendation engine",

      "predictive travel pricing",

      "dynamic itinerary optimization",

      "computer vision for destination recognition"

    ]

  },

  "mvp": {

    "must_have": [

      "homepage",

      "destination database",

      "destination search",

      "budget input",

      "days input",

      "starting location",

      "interest selection",

      "cost estimation",

      "basic recommendation engine",

      "destination ranking",

      "destination details",

      "basic itinerary generator",

      "interactive map",

      "responsive UI"

    ],

    "do_not_build_initially": [

      "complex machine learning",

      "social network",

      "marketplace",

      "real-time crowd prediction",

      "predictive pricing",

      "complex collaborative editing"

    ]

  },

  "development_order": [

    {

      "phase": 1,

      "name": "Foundation",

      "tasks": [

        "Design database",

        "Create backend",

        "Create frontend",

        "Create destination model",

        "Create basic API"

      ]

    },

    {

      "phase": 2,

      "name": "Discovery",

      "tasks": [

        "Search",

        "Filters",

        "Destination pages",

        "Tags",

        "Map integration"

      ]

    },

    {

      "phase": 3,

      "name": "Budget Engine",

      "tasks": [

        "Cost model",

        "Transport cost",

        "Accommodation cost",

        "Food cost",

        "Activity cost",

        "Budget validation"

      ]

    },

    {

      "phase": 4,

      "name": "Recommendation Engine",

      "tasks": [

        "Constraint filtering",

        "Weighted scoring",

        "Ranking",

        "Recommendation explanations"

      ]

    },

    {

      "phase": 5,

      "name": "Itinerary",

      "tasks": [

        "Attraction selection",

        "Geographical clustering",

        "Route optimization",

        "Day allocation",

        "Schedule generation"

      ]

    },

    {

      "phase": 6,

      "name": "AI",

      "tasks": [

        "Natural language search",

        "AI travel assistant",

        "AI itinerary explanation",

        "AI trip modification"

      ]

    },

    {

      "phase": 7,

      "name": "Personalization",

      "tasks": [

        "Track user interactions",

        "Build preference profiles",

        "Content-based recommendations",

        "Personalized ranking"

      ]

    },

    {

      "phase": 8,

      "name": "Community",

      "tasks": [

        "Reviews",

        "Travel stories",

        "Public itineraries",

        "Profiles",

        "Social interactions"

      ]

    },

    {

      "phase": 9,

      "name": "Monetization",

      "tasks": [

        "Affiliate integration",

        "Partner listings",

        "Premium features"

      ]

    },

    {

      "phase": 10,

      "name": "Scale",

      "tasks": [

        "Caching",

        "Background processing",

        "Database optimization",

        "Recommendation optimization",

        "Monitoring",

        "Analytics"

      ]

    }

  ],

  "example_request": {

    "user": {

      "starting_location": "Kolkata",

      "budget": 20000,

      "days": 4,

      "travelers": 2,

      "interests": [

        "mountains",

        "photography",

        "offbeat"

      ],

      "transport": [

        "train",

        "bus"

      ],

      "travel_style": "budget"

    },

    "system_process": [

      "Generate candidate destinations",

      "Remove destinations exceeding hard constraints",

      "Estimate total trip cost",

      "Calculate preference compatibility",

      "Calculate travel time",

      "Calculate destination score",

      "Rank destinations",

      "Return top destinations",

      "Explain each recommendation"

    ],

    "example_output": [

      {

        "destination": "Destination A",

        "score": 92,

        "estimated_cost": 14500,

        "estimated_travel_time": "8 hours",

        "why_recommended": [

          "Fits comfortably within budget",

          "Strong mountain match",

          "Strong photography potential",

          "Good offbeat score"

        ]

      },

      {

        "destination": "Destination B",

        "score": 87,

        "estimated_cost": 17200,

        "estimated_travel_time": "10 hours",

        "why_recommended": [

          "Excellent mountain experience",

          "Fits the budget",

          "More popular than Destination A"

        ]

      }

    ]

  },

  "quality_control": {

    "recommendation_tests": [

      "Does destination fit budget?",

      "Does destination fit available days?",

      "Does destination fit travel time?",

      "Does destination match user interests?",

      "Are price estimates sourced?",

      "Are recommendations diverse?",

      "Are unavailable attractions excluded?"

    ],

    "ai_tests": [

      "Does AI hallucinate prices?",

      "Does AI invent transport schedules?",

      "Does AI contradict database information?",

      "Does AI clearly distinguish estimates from facts?"

    ]

  },

  "final_product_definition": {

    "one_sentence": "An intelligent travel platform that converts a user's budget, time, starting location and preferences into realistic destination recommendations, optimized routes and personalized itineraries.",

    "core_pipeline": "User Requirements -> Data Validation -> Candidate Destinations -> Constraint Filtering -> Cost Calculation -> Recommendation Scoring -> Ranking -> Route Optimization -> Itinerary Generation -> AI Explanation",

    "long_term_goal": "Become a personalized travel operating system rather than a simple travel information website."

  },

  "instruction_to_ai_developer": {

    "role": "Act as a senior full-stack engineer, software architect, UX designer, database engineer, recommendation-system engineer and AI engineer.",

    "rules": [

      "Do not build everything at once.",

      "Implement the MVP first.",

      "Keep the architecture modular.",

      "Use clean separation between UI, API, business logic and algorithms.",

      "Never hard-code dynamic travel information when an API or database should be used.",

      "Never allow AI-generated information to silently override verified data.",

      "Explain technical decisions.",

      "Write maintainable code.",

      "Use meaningful variable and database names.",

      "Add validation and error handling.",

      "Design APIs so the recommendation engine can later be replaced with an ML model.",

      "Design the database so new countries and destinations can be added without restructuring the entire system.",

      "Optimize only after measuring performance.",

      "Build the project incrementally and test each module before moving to the next."

    ]

  }

}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/acaf2b59-0c03-439c-bc17-8ffebb9febf4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
