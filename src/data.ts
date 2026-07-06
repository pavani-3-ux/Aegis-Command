import { Stakeholder, UserPersona, Requirement, BusinessKPI, RiskItem, RoadmapPhase } from "./types";

export const COMPANY_BACKGROUND = {
  studioName: "Apex Forge Studios",
  scale: "Global AAA live-service publisher",
  activeTitles: ["Vanguard: Protocol Strike", "Aether Horizons: MMORPG"],
  globalDau: "45,000,000 players",
  monthlyRevenue: "$180,000,000",
  serversCount: "12,500 active virtual instances across 8 regions",
  narrative: "Apex Forge Studios is an elite game developer and publisher with a footprint spanning North America, Europe, Asia-Pacific, and South America. Our flagships are multiplayer, competitive live-service experiences requiring absolute precision in deployment, network synchronization, and monetization cadence. Every millisecond of delay or missed telemetry event translates directly to player attrition, brand damage, and direct financial loss. The executive suite requires a central 'Single Source of Truth' platform to unify game telemetry with financial ledgers, system crashes, and developer throughput."
};

export const STUDIO_VISION = {
  statement: "Establish the definitive real-time dashboard unifying player sentiment, live-service economics, server performance telemetry, and system stability to maximize player lifetime value (LTV) and ensure 99.99% match uptime.",
  corePillars: [
    { title: "Unified Command", description: "Break down silos between game designers, system engineers, and product managers through a shared operational dashboard." },
    { title: "Proactive AI", description: "Transition from reactive disaster mitigation to predictive modeling for player churn, server overflow, and microtransaction bottlenecks." },
    { title: "Empowered Analytics", description: "Provide direct, unmoderated access to clean transactional and behavioral telemetry through robust, low-latency BI tools." }
  ]
};

export const BUSINESS_PROBLEM = {
  summary: "Siloed data pipelines, high server-operation latency, and asynchronous monetization channels currently prevent the studio from responding dynamically to live-service events and technical incidents.",
  painPoints: [
    { issue: "Siloed Operations", impact: "Monetization managers cannot correlate server crashes or regional latency spikes with drop-offs in transaction velocity, delaying marketing mitigations." },
    { issue: "High MTTR (Mean Time to Resolution)", impact: "Engineers take an average of 4.2 hours to isolate server-side matchmaking defects because server logs, container telemetry, and client-side bug reports are in separate tools." },
    { issue: "Imprecise Event Design", impact: "Live Ops designers configure seasonal events without real-time tracking, resulting in either early completion (revenue vacuum) or hyper-difficulty (player churn) which are only caught weeks later." }
  ]
};

export const STAKEHOLDERS: Stakeholder[] = [
  {
    id: "sh-1",
    name: "Marcus Sterling",
    role: "VP of Game Operations",
    department: "Live Operations & Infrastructure",
    objective: "Minimize Mean Time to Resolution (MTTR), secure server capacities, and maintain optimal matchmaking pings.",
    coreKPIs: ["Server MTTR (< 15 mins)", "Peak Concurrency (CCU) Support", "Average Client Ping (< 45ms)"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "sh-2",
    name: "Elena Rostova",
    role: "Director of Live Operations & Commerce",
    department: "Monetization & Strategy",
    objective: "Maximize Battle Pass conversions, optimize skin sales velocity, and design engaging seasonal rewards.",
    coreKPIs: ["Average Revenue Per User (ARPU)", "Battle Pass Attachment Rate", "Daily Store Conversion Rate"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "sh-3",
    name: "Dr. Kenji Tanaka",
    role: "Head of Game Design & Balance",
    department: "Creative Studio",
    objective: "Preserve match fairness, analyze character pick/ban/win rates, and balance weapon metrics.",
    coreKPIs: ["Hero Pick-Rate Deviation (< 5%)", "Matchmaking Fairness Index", "Weapon Death-to-Shot Ratio"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "sh-4",
    name: "Sarah Lin",
    role: "Executive VP & General Manager",
    department: "Executive Suite",
    objective: "Assure quarterly financial goals, protect brand equity, and monitor Monthly Active Player (MAU) health.",
    coreKPIs: ["Global Quarterly Revenue", "Player Lifetime Value (LTV)", "Monthly Active Users (MAU) Growth"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  }
];

export const USER_PERSONAS: UserPersona[] = [
  {
    id: "up-1",
    name: "DevOps Lead Alex",
    title: "Senior Infrastructure Engineer",
    quote: "Every second a region is down or laggy, we are losing thousands of players and bleeding money.",
    description: "Alex coordinates global container deployments. He needs real-time, consolidated infrastructure health maps to route players away from degraded servers and catch crash spikes before the community notices.",
    goals: [
      "Automate failover triggers based on real-time server stress",
      "Correlate game crash reports with specific regional server clusters instantly",
      "Monitor global average ping across active regions in a single view"
    ],
    painPoints: [
      "Currently tailing log streams across 8 SSH terminals manually",
      "Delayed reports of server degradation coming from angry players on social media rather than automated alarms"
    ],
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "up-2",
    name: "Live Ops Coordinator Sofia",
    title: "Product Manager - Monetization",
    quote: "We spent three months designing this event. If our conversion rates drop on Day 2, we need to adjust the rewards instantly.",
    description: "Sofia tracks player progress through battle passes, active daily quests, and in-game shop sales. She needs daily updates on conversion funnels to measure reward appeal.",
    goals: [
      "Track microtransaction velocity during active seasonal events",
      "Monitor progress bottlenecks in daily missions and Battle Pass levels",
      "A/B test skin pricing dynamically across user segments"
    ],
    painPoints: [
      "Takes up to 48 hours to compile store purchases from regional databases",
      "Cannot segment player purchasing power by match performance or gameplay habits"
    ],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "up-3",
    name: "Combat Designer Travis",
    title: "Balance & Systems Designer",
    quote: "A balanced competitive game is a long-lived game. If one weapon dominates, the league dies.",
    description: "Travis lives in match data. He analyzes which weapons, characters, and strategies are overperforming to orchestrate surgical weekly balance patches.",
    goals: [
      "View daily weapon pick rates and match win percentages",
      "Filter combat telemetry by player competitive rank (bronze to grandmaster)",
      "Pinpoint maps causing unbalanced spawns or asymmetrical advantages"
    ],
    painPoints: [
      "Has to request custom SQL queries from the busy data team every Friday",
      "Telemetry contains matches from cheaters, skewed statistics"
    ],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  }
];

export const REQUIREMENTS: Requirement[] = [
  {
    id: "FR-001",
    title: "Real-time Telemetry Ingestion",
    description: "The platform must ingest player log streams, event clicks, and match heartbeats with an end-to-end ingestion latency under 5 seconds.",
    type: "Functional",
    priority: "High",
    status: "Approved",
    category: "Data Ingestion"
  },
  {
    id: "FR-002",
    title: "Unified Live Ops Dashboard",
    description: "Provide interactive, real-time metrics on cosmetic store sales, regional active purchase funnels, and Battle Pass leveling velocity.",
    type: "Functional",
    priority: "High",
    status: "Approved",
    category: "Monetization Analytics"
  },
  {
    id: "FR-003",
    title: "Combat Balance Visualizer",
    description: "Render heatmaps of weapon deaths on individual maps, paired with interactive correlation charts of weapon damage vs. pick rates.",
    type: "Functional",
    priority: "Medium",
    status: "Drafted",
    category: "Live Ops & Events"
  },
  {
    id: "FR-004",
    title: "Automated Incident Alarms",
    description: "Trigger critical Slack or Webhook alerts immediately when server pings exceed 100ms or crash logs spike 15% over a 5-minute rolling window.",
    type: "Functional",
    priority: "High",
    status: "Approved",
    category: "Server Monitoring"
  },
  {
    id: "FR-005",
    title: "Executive Forecast Planner",
    description: "Leverage machine learning algorithms to model and forecast player LTV and expected quarterly shop revenue.",
    type: "Functional",
    priority: "Medium",
    status: "Drafted",
    category: "Executive View"
  },
  {
    id: "NFR-001",
    title: "Ingestion Scalability",
    description: "Data pipelines must scale horizontally to handle up to 250,000 raw JSON records per second during peak weekend traffic.",
    type: "Non-Functional",
    priority: "High",
    status: "Approved",
    category: "Data Ingestion"
  },
  {
    id: "NFR-002",
    title: "99.99% Core API Availability",
    description: "The dashboard backend services and API gateways must achieve 99.99% monthly uptime, running on redundant global instances.",
    type: "Non-Functional",
    priority: "High",
    status: "Approved",
    category: "Infrastructure & Security"
  },
  {
    id: "NFR-003",
    title: "Strict Telemetry Anonymization",
    description: "All telemetry logs containing player IP addresses or regional geo-coordinates must undergo automatic hashing before staging.",
    type: "Non-Functional",
    priority: "High",
    status: "Approved",
    category: "Infrastructure & Security"
  },
  {
    id: "NFR-004",
    title: "Dynamic Query Response Rate",
    description: "Aggregated reporting queries spanning millions of player matches must complete and render in the UI in under 1.5 seconds.",
    type: "Non-Functional",
    priority: "Medium",
    status: "Approved",
    category: "Data Ingestion"
  },
  {
    id: "NFR-005",
    title: "Multi-Region Redundancy",
    description: "All database tables must sync near-instantly across NA, EU, and APAC read-replicas to prevent cross-continental load latency.",
    type: "Non-Functional",
    priority: "High",
    status: "Approved",
    category: "Infrastructure & Security"
  }
];

export const BUSINESS_KPIS: BusinessKPI[] = [
  {
    id: "kpi-1",
    name: "Day-1 Player Retention",
    category: "Engagement",
    currentValue: 42.5,
    targetValue: 48.0,
    unit: "%",
    trend: "up",
    description: "Percentage of new players who return to play exactly one day after their initial registration."
  },
  {
    id: "kpi-2",
    name: "Day-7 Player Retention",
    category: "Engagement",
    currentValue: 18.2,
    targetValue: 22.0,
    unit: "%",
    trend: "stable",
    description: "Percentage of new players who return to play seven days after their initial registration."
  },
  {
    id: "kpi-3",
    name: "Average Revenue Per User (ARPU)",
    category: "Monetization",
    currentValue: 4.85,
    targetValue: 6.00,
    unit: "$",
    trend: "up",
    description: "Calculated by dividing total studio revenue by our Monthly Active Users (MAU)."
  },
  {
    id: "kpi-4",
    name: "Battle Pass Attachment Rate",
    category: "Monetization",
    currentValue: 31.4,
    targetValue: 35.0,
    unit: "%",
    trend: "down",
    description: "Percentage of active players who have purchased or unlocked the current season's battle pass."
  },
  {
    id: "kpi-5",
    name: "Mean Time to Resolution (MTTR)",
    category: "Operations",
    currentValue: 252,
    targetValue: 15,
    unit: "mins",
    trend: "down",
    description: "The average time required for the engineering team to isolate, fix, and verify server-side incidents."
  },
  {
    id: "kpi-6",
    name: "Daily Server Crash Rate",
    category: "Operations",
    currentValue: 0.18,
    targetValue: 0.02,
    unit: "%",
    trend: "stable",
    description: "Percentage of active game lobbies that experience abnormal server-side terminations."
  }
];

export const RISKS: RiskItem[] = [
  {
    id: "risk-1",
    hazard: "Player Churn due to Monetization Sentiment",
    probability: "High",
    impact: "High",
    severity: "Critical",
    mitigation: "Establish a dedicated 'Player Sentiment Health Indicator' correlating cosmetics sales velocity with social media telemetry data."
  },
  {
    id: "risk-2",
    hazard: "GDPR/CCPA Compliance Breaches",
    probability: "Low",
    impact: "High",
    severity: "High",
    mitigation: "Strictly enforce the NFR-003 Anonymization hashing pipeline before any player data lands in our Cloud SQL analytics tables."
  },
  {
    id: "risk-3",
    hazard: "Database Thread Congestion during Major Events",
    probability: "Medium",
    impact: "High",
    severity: "High",
    mitigation: "Implement a robust caching layer (Redis) for hot scoreboard leaderboards and separate transactional from analytical databases."
  },
  {
    id: "risk-4",
    hazard: "Cheater Infiltration corrupting Analytics Accuracy",
    probability: "Medium",
    impact: "Medium",
    severity: "Medium",
    mitigation: "Apply automated standard-deviation flags on combat telemetry; ignore players displaying extreme accuracy or impossible kill velocity."
  }
];

export const ROADMAP: RoadmapPhase[] = [
  {
    number: 1,
    title: "Business Discovery",
    status: "Current",
    description: "Align our project with executive strategies, stakeholder objectives, operational KPIs, and compile the full enterprise BRD.",
    deliverables: ["Product Vision Canvas", "User Persona Map", "Business KPIs", "Functional Requirements Matrix", "Risks & Mitigations Log"]
  },
  {
    number: 2,
    title: "Solution Architecture",
    status: "Upcoming",
    description: "Create the system data flow schemas (Hot Path vs Cold Path), service broker topology, and coordinate tech stacks.",
    deliverables: ["High-Level Data Flow", "Infrastructure Architecture", "Pub/Sub Messaging Flow", "Multi-region Replication Spec"]
  },
  {
    number: 3,
    title: "Database Design",
    status: "Locked",
    description: "Draft a highly extensive schema with 30+ relational gaming tables tracking gameplay, monetization, guilds, and server metrics.",
    deliverables: ["ER Diagram Schema", "DDL Scripts with Constraints", "Indexing & Partitioning Blueprint", "Data Dictionary"]
  },
  {
    number: 4,
    title: "Dataset Generation",
    status: "Locked",
    description: "Develop seed scripts mimicking millions of players, purchases, matchmaking, maps, FPS metrics, ping, and server crash records.",
    deliverables: ["Multi-Table Seed Data", "JSON/CSV Generator scripts", "Referential Integrity Validation Checkers"]
  },
  {
    number: 5,
    title: "Python ETL",
    status: "Locked",
    description: "Formulate a clean, validated ETL pipeline to deduplicate logs, transform raw pings, handle missing values, and structure telemetry.",
    deliverables: ["Python ETL Modules", "Data Validation Report", "Transformation Pipeline logs", "Staged Target Tables"]
  },
  {
    number: 6,
    title: "Exploratory Data Analysis",
    status: "Locked",
    description: "Analyze player growth curves, DAU/MAU ratios, cohort retention curves, weapon pick balances, and global revenue trends.",
    deliverables: ["EDA Notebook Summaries", "Retention Cohort Heatmaps", "Skins sales velocity analysis", "Server outage timelines"]
  },
  {
    number: 7,
    title: "Advanced SQL Analytics",
    status: "Locked",
    description: "Write high-performance window functions, cohort retention scripts, CTE chains, stored procedures, and running totals.",
    deliverables: ["Enterprise SQL Scripts", "Leaderboard Ranking queries", "Cohort Retention SQL", "Dynamic KPI Views"]
  },
  {
    number: 8,
    title: "Power BI Dashboard",
    status: "Locked",
    description: "Create our stunning, executive, dark-themed visual suite including Player, Live Ops, Infrastructure, and Executive dashboards.",
    deliverables: ["Visual UI layouts", "Interactive drill-down reports", "Multi-page navigation layout", "Dynamic bookmarks & filters"]
  },
  {
    number: 9,
    title: "AI Insights",
    status: "Locked",
    description: "Leverage advanced neural models and regression forecasting to predict player churn, detect anomalies (cheaters), and estimate LTV.",
    deliverables: ["ML churn model outputs", "Dynamic forecasts", "Cheater anomaly alarm triggers", "In-game store recommendation engine"]
  },
  {
    number: 10,
    title: "Documentation & Delivery",
    status: "Locked",
    description: "Deliver a complete, production-grade technical portfolio featuring README, architectural blueprints, dictionaries, and interview prep guides.",
    deliverables: ["Enterprise-Grade Repository Docs", "Deployment Guidelines", "Database Data Dictionary", "Interview Pitch Deck"]
  }
];
