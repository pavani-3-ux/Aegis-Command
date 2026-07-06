import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  UserCheck,
  ShieldAlert,
  FileText,
  Activity,
  Send,
  MessageSquare,
  HelpCircle,
  Lock,
  Unlock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Sparkles,
  Filter,
  Server,
  Coins,
  Users,
  Target,
  Briefcase,
  Shield,
  ChevronRight,
  AlertCircle,
  Clock,
  ThumbsUp,
  BrainCircuit,
  Settings,
  Flame,
  LineChart,
  RefreshCw
} from "lucide-react";
import {
  COMPANY_BACKGROUND,
  STUDIO_VISION,
  BUSINESS_PROBLEM,
  STAKEHOLDERS,
  USER_PERSONAS,
  REQUIREMENTS,
  BUSINESS_KPIS,
  RISKS,
  ROADMAP
} from "./data";
import { Requirement, BusinessKPI, RiskItem, ChatMessage } from "./types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function App() {
  const [activeTab, setActiveTab] = useState<"summary" | "stakeholders" | "requirements" | "kpis" | "mentor" | "roadmap">("summary");
  
  // Custom states for interactive learning sandbox
  const [customRequirements, setCustomRequirements] = useState<Requirement[]>(REQUIREMENTS);
  const [customKPIs, setCustomKPIs] = useState<BusinessKPI[]>(BUSINESS_KPIS);
  const [customRisks, setCustomRisks] = useState<RiskItem[]>(RISKS);
  
  // Requirement filters
  const [reqFilterType, setReqFilterType] = useState<"All" | "Functional" | "Non-Functional">("All");
  const [reqFilterCategory, setReqFilterCategory] = useState<string>("All");
  const [reqSearch, setReqSearch] = useState("");
  
  // Requirement Form
  const [newReqTitle, setNewReqTitle] = useState("");
  const [newReqDesc, setNewReqDesc] = useState("");
  const [newReqType, setNewReqType] = useState<"Functional" | "Non-Functional">("Functional");
  const [newReqPriority, setNewReqPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newReqCategory, setNewReqCategory] = useState<any>("Data Ingestion");
  const [showAddReq, setShowAddReq] = useState(false);

  // Chat/Mentor States
  const [selectedPersona, setSelectedPersona] = useState<string>("Senior Product Manager");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "mentor",
      text: "Welcome to the Game Studio Command Center project. I am Elena, your Senior Product Manager. I'm here to mentor you on the foundational business requirements. What aspects of our business strategy, stakeholder alignment, or operational metrics would you like to explore first?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: "Senior Product Manager"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Active QA/Interview items state
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  // Simulation parameters for KPI tuning
  const [playerAcquisitionMultiplier, setPlayerAcquisitionMultiplier] = useState(1.0);
  const [liveOpsEventFrequency, setLiveOpsEventFrequency] = useState(1.0);
  const [serverOptimizationBudget, setServerOptimizationBudget] = useState(1.0);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Handle chat submission
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: "User"
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const queryText = chatInput;
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          persona: selectedPersona,
          history: chatMessages.slice(-8) // Send recent context
        })
      });

      const data = await response.json();
      const mentorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "mentor",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: selectedPersona
      };
      setChatMessages((prev) => [...prev, mentorMsg]);
    } catch (err) {
      console.error("Error communicating with mentor API:", err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: "mentor",
        text: "I experienced a connection lag. However, as your mentor, let's keep moving. Remember that Day-1 retention relies heavily on the onboarding experience, while Day-7 and Day-30 depend on core gameplay loops and social systems.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: selectedPersona
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Add customized Requirement
  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTitle || !newReqDesc) return;

    const added: Requirement = {
      id: `FR-${Math.floor(100 + Math.random() * 900)}`,
      title: newReqTitle,
      description: newReqDesc,
      type: newReqType,
      priority: newReqPriority,
      status: "Drafted",
      category: newReqCategory
    };

    setCustomRequirements([added, ...customRequirements]);
    setNewReqTitle("");
    setNewReqDesc("");
    setShowAddReq(false);

    // Send notification to user through chat
    const systemNotice: ChatMessage = {
      id: `sys-${Date.now()}`,
      sender: "mentor",
      text: `Excellent choice! You added a new ${newReqType} requirement: "${newReqTitle}". This expands our Business Discovery scope and has been cataloged under "${newReqCategory}". Let's discuss how this impacts our tech stack selection in Phase 2!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: selectedPersona
    };
    setChatMessages((prev) => [...prev, systemNotice]);
  };

  // KPI calculations based on simulation parameters
  const getSimulatedKPIs = () => {
    return customKPIs.map(kpi => {
      let val = kpi.currentValue;
      if (kpi.name === "Day-1 Player Retention") {
        // More server optimization leads to better onboarding ping, improving retention
        val = Math.min(55, kpi.currentValue * (0.85 + (serverOptimizationBudget * 0.15)));
      } else if (kpi.name === "Average Revenue Per User (ARPU)") {
        // More active live ops events drives microtransactions, but too many saturates market
        const eventEffect = Math.sin(liveOpsEventFrequency * Math.PI / 2);
        val = kpi.currentValue * (0.8 + (eventEffect * 0.2)) * playerAcquisitionMultiplier;
      } else if (kpi.name === "Battle Pass Attachment Rate") {
        // Event frequency improves BP interest, but too many events dilutes core attention
        val = Math.min(45, kpi.currentValue * (0.9 + (liveOpsEventFrequency * 0.1)));
      } else if (kpi.name === "Mean Time to Resolution (MTTR)") {
        // Server optimization investment drastically cuts down response latency
        val = Math.max(8, Math.round(kpi.currentValue / (serverOptimizationBudget * 1.5)));
      } else if (kpi.name === "Daily Server Crash Rate") {
        val = Math.max(0.01, parseFloat((kpi.currentValue / (serverOptimizationBudget * 1.8)).toFixed(3)));
      }
      return {
        ...kpi,
        currentValue: parseFloat(val.toFixed(2))
      };
    });
  };

  const simulatedKPIs = getSimulatedKPIs();

  // Dynamic Risk Level calculations
  const getDynamicRiskSeverity = (risk: RiskItem) => {
    if (risk.hazard.includes("Monetization Sentiment")) {
      return liveOpsEventFrequency > 1.8 ? "Critical" : "High";
    }
    if (risk.hazard.includes("GDPR/CCPA Compliance")) {
      return "High";
    }
    if (risk.hazard.includes("Database Thread Congestion")) {
      return liveOpsEventFrequency > 1.5 && serverOptimizationBudget < 1.1 ? "Critical" : "Medium";
    }
    if (risk.hazard.includes("Cheater Infiltration")) {
      return "Medium";
    }
    return risk.severity;
  };

  const currentSimulatedKPIs = simulatedKPIs;

  // Change Mentor Persona helper
  const changeMentor = (personaName: string) => {
    setSelectedPersona(personaName);
    let introText = "";
    switch (personaName) {
      case "Senior Product Manager":
        introText = "Elena here. Let's make sure our game KPIs align with high-level studio goals and stakeholder priorities. What needs clarifying?";
        break;
      case "AAA Game Studio Consultant":
        introText = "I've overseen monetization loops for major games. Let's discuss balancing player retention against cosmetic monetization cycles.";
        break;
      case "Solutions Architect":
        introText = "Kenji here. I structure the pipelines. Let's talk telemetry latency limits and how our NFRs (Non-Functional Requirements) will shape Phase 2.";
        break;
      case "Lead Data Engineer":
        introText = "Data integrity is critical. Let's chat about establishing foreign keys, table indexes, or designing robust ETL validation schemas.";
        break;
      case "Game Analytics Expert":
        introText = "Let's dig into the math. DAU/MAU ratios, Day-1/7/30 cohorts, or segmenting whales from casual spenders. What's on your mind?";
        break;
      default:
        introText = "Welcome to the team. How can we optimize this project to look like a premium enterprise suite?";
    }
    
    setChatMessages((prev) => [
      ...prev,
      {
        id: `sys-p-${Date.now()}`,
        sender: "mentor",
        text: introText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: personaName
      }
    ]);
  };

  // Reveal Answer QA
  const toggleQA = (index: number) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Mock historical data for active studio overview
  const activeStudioTrafficData = [
    { hour: "00:00", activePlayers: 18.2, serverLoad: 42, shopRevenue: 85 },
    { hour: "04:00", activePlayers: 14.5, serverLoad: 35, shopRevenue: 62 },
    { hour: "08:00", activePlayers: 22.1, serverLoad: 58, shopRevenue: 110 },
    { hour: "12:00", activePlayers: 35.8, serverLoad: 78, shopRevenue: 195 },
    { hour: "16:00", activePlayers: 45.2, serverLoad: 92, shopRevenue: 280 },
    { hour: "20:00", activePlayers: 42.1, serverLoad: 88, shopRevenue: 240 },
    { hour: "24:00", activePlayers: 28.4, serverLoad: 60, shopRevenue: 155 }
  ];

  // Professional Interview Questions for Mentorship Hub
  const INTERVIEW_QUESTIONS = [
    {
      question: "Why do global game studios separate operational log pipelines from game monetization ledgers?",
      answer: "Transaction records require absolute database ACID compliance (no data loss, perfectly consistent states, e.g., using relational SQL or Google Spanner) as they represent financial value and direct ledger items. In contrast, telemetry log streams (pings, moves, level-ups) are high-volume, low-latency, and can tolerate minor losses. Telemetry is routed via high-throughput message buffers (like Kafka or Pub/Sub) into analytical cold storage (like BigQuery or Snowflake). Blending them into one system causes write locks, slow matches, and risk of database crashes."
    },
    {
      question: "How do you calculate Day-1, Day-7, and Day-30 Retention, and why are they considered 'industry health' markers?",
      answer: "Day-X retention is calculated by taking the cohort of players who registered on a specific day (Day 0) and measuring what percentage of those exact same players initiated a game session exactly X days later. Day-1 evaluates the onboarding experience, game tutorials, and initial core game loop appeal. Day-7 evaluates the progression loop, friend systems, and early cosmetic shop loops. Day-30 measures the elder-game loop, guild dynamics, and live operations cadence. A studio with high acquisition but low retention is essentially a 'leaking bucket', spending massive marketing budgets on players who won't generate return."
    },
    {
      question: "What is the difference between ARPU and ARPPU, and how do they inform shop pricing models?",
      answer: "ARPU (Average Revenue Per User) is calculated as Total Revenue / Total Active Users in a given time. It measures overall platform monetization efficiency across the entire player population. ARPPU (Average Revenue Per Paying User) is calculated as Total Revenue / Total Unique PAYING Users in that time. It isolates the spending behavior of players who actively use the real-money store. If ARPPU is extremely high but ARPU is low, the game relies heavily on 'whales' (a small percentage of high spenders), making it economically vulnerable to community backlash. If ARPU is close to ARPPU, a broader player base is making smaller, frequent purchases (high health profile)."
    },
    {
      question: "How does Mean Time to Resolution (MTTR) relate directly to player churn and financial health?",
      answer: "When game servers experience degradation, ping spikes, or match matchmaking outages, active sessions disconnect. For top competitive titles, players are extremely sensitive to game interruption. High MTTR means players remain disconnected or frustrated for hours. Many will immediately migrate to competitor titles (e.g., from CS:GO to Valorant), causing direct player churn. Furthermore, during a store or server outage, microtransaction velocity crashes to zero, directly impacting daily sales target metrics."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Professional Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-teal-500 to-indigo-600 p-2.5 rounded-lg shadow-lg shadow-teal-500/10">
              <LayoutDashboard className="w-6 h-6 text-slate-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display tracking-tight text-white">
                  Game Studio Command Center
                </h1>
                <span className="text-[10px] bg-teal-500/15 text-teal-400 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono font-medium uppercase tracking-wider">
                  Phase 1 Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                AI-Powered Game Development Intelligence Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden xl:block">
              <span className="text-xs text-slate-400 block">Current Operating Territory</span>
              <span className="text-xs text-teal-400 font-mono font-semibold">Global (8 regions, 12.5k servers)</span>
            </div>
            <div className="h-8 w-px bg-slate-800 mx-2 hidden xl:block" />
            <div className="flex gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-lg">
              <button
                id="tab-summary"
                onClick={() => setActiveTab("summary")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-display transition-all ${
                  activeTab === "summary"
                    ? "bg-slate-800 text-teal-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1. Executive View
              </button>
              <button
                id="tab-stakeholders"
                onClick={() => setActiveTab("stakeholders")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-display transition-all ${
                  activeTab === "stakeholders"
                    ? "bg-slate-800 text-teal-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2. Stakeholders & Personas
              </button>
              <button
                id="tab-requirements"
                onClick={() => setActiveTab("requirements")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-display transition-all ${
                  activeTab === "requirements"
                    ? "bg-slate-800 text-teal-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                3. Scope Matrix
              </button>
              <button
                id="tab-kpis"
                onClick={() => setActiveTab("kpis")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-display transition-all ${
                  activeTab === "kpis"
                    ? "bg-slate-800 text-teal-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                4. Simulation & Risks
              </button>
              <button
                id="tab-mentor"
                onClick={() => setActiveTab("mentor")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-display transition-all flex items-center gap-1.5 ${
                  activeTab === "mentor"
                    ? "bg-indigo-900/55 text-indigo-200 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                5. Mentor Hub
              </button>
              <button
                id="tab-roadmap"
                onClick={() => setActiveTab("roadmap")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium font-display transition-all ${
                  activeTab === "roadmap"
                    ? "bg-slate-800 text-teal-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Roadmap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">

        {/* Phase 1 Banner Alerts */}
        <div className="glass-panel rounded-xl p-5 border-l-4 border-l-teal-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-teal-500/20 text-teal-400 rounded">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-mono font-medium">MENTORSHIP WORKSPACE STATUS</span>
            </div>
            <h2 className="text-lg font-semibold text-white">Phase 1: Business Discovery BRD is Fully Prepared!</h2>
            <p className="text-sm text-slate-300">
              We have completed company vision alignment, requirement prioritizations, operations telemetry mappings, and established risk logs. Review our setup or chat with mentors.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("roadmap")}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-bold font-display rounded-lg text-sm shadow-md shadow-teal-500/10 flex items-center gap-2 transition-all cursor-pointer"
          >
            Review Dev Roadmap
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Tab Rendering */}
        
        {/* TAB 1: EXECUTIVE SUMMARY */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            
            {/* Studio Identity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-xl space-y-1 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <Briefcase className="w-12 h-12 text-teal-400" />
                </div>
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Studio Operator</span>
                <p className="text-xl font-bold text-white font-display">{COMPANY_BACKGROUND.studioName}</p>
                <p className="text-xs text-teal-400 font-mono">{COMPANY_BACKGROUND.scale}</p>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-1 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <Users className="w-12 h-12 text-teal-400" />
                </div>
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Global Traffic Scale</span>
                <p className="text-xl font-bold text-teal-400 font-display">{COMPANY_BACKGROUND.globalDau}</p>
                <p className="text-xs text-slate-400 font-mono">Daily Active Player Logs</p>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-1 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <Coins className="w-12 h-12 text-indigo-400" />
                </div>
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Monthly Economy Velocity</span>
                <p className="text-xl font-bold text-indigo-400 font-display">{COMPANY_BACKGROUND.monthlyRevenue}</p>
                <p className="text-xs text-slate-400 font-mono">Store + Battle Pass Cadence</p>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-1 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-10">
                  <Server className="w-12 h-12 text-teal-400" />
                </div>
                <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Telemetry Footprint</span>
                <p className="text-xl font-bold text-slate-200 font-display">{COMPANY_BACKGROUND.serversCount}</p>
                <p className="text-xs text-slate-400 font-mono">Active match log microservices</p>
              </div>
            </div>

            {/* Narrative Background & Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="glass-panel p-6 rounded-xl space-y-4 lg:col-span-2">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileText className="w-5 h-5 text-teal-400" />
                  <h3 className="font-display font-semibold text-lg text-white">Company Background & Business Problem</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {COMPANY_BACKGROUND.narrative}
                </p>
                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/60 space-y-2">
                  <div className="flex items-center gap-1 text-xs text-red-400 font-mono font-medium uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Key Operation Problem Summary
                  </div>
                  <p className="text-xs text-slate-300">
                    {BUSINESS_PROBLEM.summary}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Live Studio Bottlenecks</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {BUSINESS_PROBLEM.painPoints.map((pt, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1">
                        <span className="text-[10px] text-red-400 font-mono font-bold uppercase tracking-wider">
                          {pt.issue}
                        </span>
                        <p className="text-xs text-slate-300 leading-snug">
                          {pt.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Studio Vision & Strategy */}
              <div className="glass-panel p-6 rounded-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-display font-semibold text-lg text-white">Studio Platform Vision</h3>
                  </div>
                  <p className="text-sm italic text-slate-300 leading-relaxed border-l-2 border-indigo-500 pl-3">
                    &ldquo;{STUDIO_VISION.statement}&rdquo;
                  </p>
                </div>

                <div className="space-y-3 mt-4">
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Platform Core Strategy</p>
                  <div className="space-y-2.5">
                    {STUDIO_VISION.corePillars.map((pillar, idx) => (
                      <div key={idx} className="glass-panel-light p-3 rounded-lg space-y-1">
                        <h4 className="text-xs font-bold text-teal-400 font-display flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          {pillar.title}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {pillar.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Live Matchmaking Telemetry Stream (High Quality Visualization) */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="font-display font-semibold text-lg text-white">Live Telemetry Flow Simulation</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Demonstration of concurrent active multiplayer logs across simulated regional instances (24-hour cycle)
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Cycle Interval: Hourly logs (UTC-7)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Metric Charts */}
                <div className="lg:col-span-3 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeStudioTrafficData}>
                      <defs>
                        <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="hour" stroke="#475569" fontSize={11} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#94a3b8', fontFamily: 'monospace' }}
                      />
                      <Area type="monotone" name="Players (Millions)" dataKey="activePlayers" stroke="#14b8a6" fillOpacity={1} fill="url(#colorPlayers)" strokeWidth={2} />
                      <Area type="monotone" name="Transactions ($k/hr)" dataKey="shopRevenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Simulated Region Load Indicators */}
                <div className="space-y-3 flex flex-col justify-between">
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Active Ingestion Clusters</p>
                  
                  <div className="space-y-2.5">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-slate-200 block">NA-East (Virginia)</span>
                        <span className="text-[10px] text-slate-400 font-mono">Primary Ingestion Cluster</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-teal-400 block font-semibold">18ms</span>
                        <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded">HEALTHY</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-slate-200 block">EU-West (Frankfurt)</span>
                        <span className="text-[10px] text-slate-400 font-mono">Store Ledger Primary</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-teal-400 block font-semibold">24ms</span>
                        <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded">HEALTHY</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-slate-200 block">APAC-South (Singapore)</span>
                        <span className="text-[10px] text-slate-400 font-mono">Matchmaking Sync Log</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-amber-400 block font-semibold">58ms</span>
                        <span className="text-[9px] text-amber-500 font-bold bg-amber-500/10 px-1 rounded">WARN</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/20 text-[11px] text-indigo-300 leading-relaxed">
                    <span className="font-semibold block text-indigo-200 mb-1">💡 Solution Architect Note:</span>
                    During Phase 2, we will design regional data sinks to batch logs asynchronously, cutting backhaul server costs by 45%.
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: STAKEHOLDERS & PERSONAS */}
        {activeTab === "stakeholders" && (
          <div className="space-y-8">
            
            {/* Stakeholders Section */}
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-display font-semibold text-xl text-white">Project Key Stakeholders</h3>
                <p className="text-sm text-slate-400">
                  The studio leadership team members who rely directly on the Command Center metrics for daily operations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STAKEHOLDERS.map((sh) => (
                  <div key={sh.id} className="glass-panel p-5 rounded-xl flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <img src={sh.avatar} alt={sh.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-500/40" />
                        <div>
                          <h4 className="font-semibold text-white text-sm">{sh.name}</h4>
                          <span className="text-[10px] text-teal-400 font-mono block uppercase">{sh.role}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800/40 text-xs">
                        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department Objective</span>
                        <p className="text-slate-200 leading-snug">{sh.objective}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-4 border-t border-slate-800/60 mt-4">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Core Target KPIs</span>
                      <div className="flex flex-wrap gap-1">
                        {sh.coreKPIs.map((kpi, idx) => (
                          <span key={idx} className="bg-slate-950 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-900">
                            {kpi}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Personas Section */}
            <div className="space-y-4 pt-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-display font-semibold text-xl text-white">Operational User Personas</h3>
                <p className="text-sm text-slate-400">
                  Detailed maps of internal studio users who will interact with the platform screens daily to run the game.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {USER_PERSONAS.map((person) => (
                  <div key={person.id} className="glass-panel p-6 rounded-xl flex flex-col justify-between space-y-6 hover:border-slate-600 transition-all">
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img src={person.avatar} alt={person.name} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/40" />
                        <div>
                          <h4 className="font-semibold text-white text-base">{person.name}</h4>
                          <span className="text-xs text-indigo-400 font-mono block uppercase">{person.title}</span>
                        </div>
                      </div>

                      <p className="text-sm italic text-slate-300 leading-relaxed bg-slate-900/55 p-3 rounded-lg border border-slate-800/50">
                        &ldquo;{person.quote}&rdquo;
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {person.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800/60">
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Daily Goals & Focus</span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {person.goals.map((goal, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-teal-400 mt-0.5">•</span>
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider block">Current Pain Points</span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {person.painPoints.map((pain, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-red-400 mt-0.5">▪</span>
                              <span>{pain}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: REQUIREMENTS & SCOPE MATRIX */}
        {activeTab === "requirements" && (
          <div className="space-y-6">
            
            {/* Intro & Filtering toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-xl text-white">Business Requirements Document (BRD) Matrix</h3>
                <p className="text-sm text-slate-400">
                  Comprehensive Functional and Non-Functional specifications for the platform core ingestion services.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddReq(true)}
                  className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold font-display rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Define Requirement
                </button>
              </div>
            </div>

            {/* Custom Interactive Requirement Creation Overlay/Form */}
            {showAddReq && (
              <div className="bg-slate-900 border border-teal-500/40 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    Expand Project Scope: Define Custom Requirement
                  </span>
                  <button onClick={() => setShowAddReq(false)} className="text-xs text-slate-400 hover:text-white">
                    Cancel
                  </button>
                </div>
                <form onSubmit={handleAddRequirement} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-medium">Requirement Title</label>
                    <input
                      type="text"
                      value={newReqTitle}
                      onChange={(e) => setNewReqTitle(e.target.value)}
                      placeholder="e.g. Anti-Cheat Combat Telemetry Ingestion"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-medium">Category</label>
                    <select
                      value={newReqCategory}
                      onChange={(e: any) => setNewReqCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                    >
                      <option value="Data Ingestion">Data Ingestion</option>
                      <option value="Monetization Analytics">Monetization Analytics</option>
                      <option value="Live Ops & Events">Live Ops & Events</option>
                      <option value="Server Monitoring">Server Monitoring</option>
                      <option value="Executive View">Executive View</option>
                      <option value="Infrastructure & Security">Infrastructure & Security</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-medium">Class</label>
                    <select
                      value={newReqType}
                      onChange={(e: any) => setNewReqType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                    >
                      <option value="Functional">Functional (User-Facing / Feature)</option>
                      <option value="Non-Functional">Non-Functional (Uptime / Performance / Safety)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-medium">Priority Severity</label>
                    <select
                      value={newReqPriority}
                      onChange={(e: any) => setNewReqPriority(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
                    >
                      <option value="High">High (Immediate blocker for MVP)</option>
                      <option value="Medium">Medium (Live-ops scaling feature)</option>
                      <option value="Low">Low (Post-release polish)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-slate-400 block font-medium">Requirement Description & Deliverable Specs</label>
                    <textarea
                      value={newReqDesc}
                      onChange={(e) => setNewReqDesc(e.target.value)}
                      placeholder="e.g. Telemetry collection endpoints must capture matches and tag anomalous standard deviation movements..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white h-20 focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-slate-950 font-bold font-display rounded-lg hover:from-teal-400 cursor-pointer"
                    >
                      Commit to BRD Archive
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-slate-400 font-mono font-semibold uppercase flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-teal-400" />
                  Filter Class:
                </span>
                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                  {(["All", "Functional", "Non-Functional"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setReqFilterType(t)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        reqFilterType === t
                          ? "bg-slate-800 text-teal-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <span className="text-slate-400 font-mono font-semibold uppercase ml-2">Category:</span>
                <select
                  value={reqFilterCategory}
                  onChange={(e) => setReqFilterCategory(e.target.value)}
                  className="bg-slate-950 text-slate-300 border border-slate-800 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Data Ingestion">Data Ingestion</option>
                  <option value="Monetization Analytics">Monetization Analytics</option>
                  <option value="Live Ops & Events">Live Ops & Events</option>
                  <option value="Server Monitoring">Server Monitoring</option>
                  <option value="Infrastructure & Security">Infrastructure & Security</option>
                </select>
              </div>

              {/* In-tab search bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search requirement specifications..."
                  value={reqSearch}
                  onChange={(e) => setReqSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-teal-500 placeholder-slate-500"
                />
              </div>
            </div>

            {/* Requirements Matrix List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customRequirements
                .filter((r) => reqFilterType === "All" || r.type === reqFilterType)
                .filter((r) => reqFilterCategory === "All" || r.category === reqFilterCategory)
                .filter((r) =>
                  reqSearch
                    ? r.title.toLowerCase().includes(reqSearch.toLowerCase()) ||
                      r.description.toLowerCase().includes(reqSearch.toLowerCase())
                    : true
                )
                .map((req) => (
                  <div
                    key={req.id}
                    className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/20">
                          {req.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                            req.priority === "High"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : req.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}>
                            {req.priority} Priority
                          </span>
                          <span className="text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-900 px-2 py-0.5 rounded">
                            {req.type}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-semibold text-white font-display text-sm mt-1">{req.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{req.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/40 pt-3 mt-4 text-[10px] font-mono">
                      <span className="text-slate-400">Category: <strong className="text-teal-400">{req.category}</strong></span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" />
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* TAB 4: SIMULATION & RISK REGISTER */}
        {activeTab === "kpis" && (
          <div className="space-y-6">
            
            {/* Interactive Simulation Panel */}
            <div className="glass-panel p-6 rounded-xl space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <BrainCircuit className="w-5 h-5 text-teal-400" />
                <h3 className="font-display font-semibold text-lg text-white">Project Sandbox: Live Studio KPI Simulation</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tune studio operations budgets, player marketing campaigns, and update schedules to simulate how these business strategies directly influence active telemetry KPIs and mitigate risk logs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 uppercase tracking-wider font-semibold">1. Player Acquisition Surge</span>
                    <span className="text-teal-400 font-bold">{Math.round(playerAcquisitionMultiplier * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={playerAcquisitionMultiplier}
                    onChange={(e) => setPlayerAcquisitionMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    Simulates marketing campaigns driving millions of new registrations, increasing total microtransactions but risking server loads.
                  </p>
                </div>

                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 uppercase tracking-wider font-semibold">2. Live Ops Event Frequency</span>
                    <span className="text-indigo-400 font-bold">{Math.round(liveOpsEventFrequency * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={liveOpsEventFrequency}
                    onChange={(e) => setLiveOpsEventFrequency(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    Controls daily seasonal events and battle pass rewards. Higher frequencies drive immediate monetization, but risks player fatigue and community backlash.
                  </p>
                </div>

                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 uppercase tracking-wider font-semibold">3. Infrastructure Scaling Budget</span>
                    <span className="text-teal-400 font-bold">{Math.round(serverOptimizationBudget * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={serverOptimizationBudget}
                    onChange={(e) => setServerOptimizationBudget(parseFloat(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    Invests in automated load balancing, regional replications, and query indexing optimizations. Slashes server MTTR and crash rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Live KPIs */}
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="font-display font-semibold text-base text-white">Dynamic Business KPIs Matrix</h4>
                <p className="text-xs text-slate-400">
                  Calculated real-time objectives based on active simulation modifiers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSimulatedKPIs.map((kpi) => {
                  const isMet = kpi.trend === "down" ? kpi.currentValue <= kpi.targetValue : kpi.currentValue >= kpi.targetValue;
                  return (
                    <div key={kpi.id} className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{kpi.category}</span>
                          {kpi.trend === "up" ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          ) : kpi.trend === "down" ? (
                            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          )}
                        </div>
                        <h5 className="font-semibold text-slate-200 font-display text-xs">{kpi.name}</h5>
                        <p className="text-[10px] text-slate-400">{kpi.description}</p>
                      </div>

                      <div className="pt-4 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl font-mono font-bold text-white">
                            {kpi.currentValue}
                            <span className="text-xs font-normal text-slate-400 ml-0.5">{kpi.unit}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Target: {kpi.targetValue} {kpi.unit}
                          </span>
                        </div>

                        {/* Visual KPI Progress bar */}
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-900">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${isMet ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{
                              width: `${Math.min(100, kpi.trend === "down" 
                                ? (kpi.targetValue / kpi.currentValue) * 100 
                                : (kpi.currentValue / kpi.targetValue) * 100
                              )}%`
                            }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono">
                          <span className={isMet ? "text-emerald-400 font-medium" : "text-amber-400"}>
                            {isMet ? "✓ OBJECTIVE MET" : "⚠️ GAP REMAINS"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risks & Mitigations Log */}
            <div className="space-y-4 pt-4">
              <div className="border-b border-slate-800 pb-2">
                <h4 className="font-display font-semibold text-base text-white">Platform Risks & Mitigations Register</h4>
                <p className="text-xs text-slate-400">
                  Critical hazards identified by our Business Analysts and their respective security mitigations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customRisks.map((risk) => {
                  const dynamicSev = getDynamicRiskSeverity(risk);
                  return (
                    <div key={risk.id} className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-rose-400 font-bold bg-rose-950/20 px-2 py-0.5 border border-rose-500/20 rounded">
                            {risk.id}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${
                            dynamicSev === "Critical"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse"
                              : dynamicSev === "High"
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
                            {dynamicSev} Severity
                          </span>
                        </div>

                        <h5 className="font-semibold text-white font-display text-sm">{risk.hazard}</h5>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950 p-2 rounded border border-slate-900">
                          <span className="text-slate-400">Probability: <strong className="text-slate-200">{risk.probability}</strong></span>
                          <span className="text-slate-400">Impact Profile: <strong className="text-slate-200">{risk.impact}</strong></span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-slate-800/60 mt-4 text-xs">
                        <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Recommended Technical Mitigation</span>
                        <p className="text-slate-300 leading-relaxed italic">{risk.mitigation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: MENTOR HUB & PREP DESK */}
        {activeTab === "mentor" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Sidebar: Mentor Selection & Bio */}
            <div className="glass-panel p-5 rounded-xl space-y-5 lg:col-span-1">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">PROJECT ADVISORS</span>
                <h3 className="font-display font-semibold text-lg text-white">Select Your AI Mentor</h3>
                <p className="text-xs text-slate-400">
                  Switch between professionals of our studio to get customized insights on Phase 1 goals.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { name: "Senior Product Manager", role: "Elena Rostova", specialty: "Business Goals & BRD Alignment" },
                  { name: "AAA Game Studio Consultant", role: "Marcus Sterling", specialty: "Live Ops & Virtual Economy Strategy" },
                  { name: "Solutions Architect", role: "Dr. Kenji Tanaka", specialty: "Telemetry pipelines & scale specs" },
                  { name: "Lead Data Engineer", role: "Sarah Lin", specialty: "Database schemas & ETL performance" },
                  { name: "Game Analytics Expert", role: "Alex Vance", specialty: "Player behavior & math models" }
                ].map((mentor) => (
                  <button
                    key={mentor.name}
                    onClick={() => changeMentor(mentor.name)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      selectedPersona === mentor.name
                        ? "bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/5 text-slate-100"
                        : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-slate-200">{mentor.role}</span>
                      {selectedPersona === mentor.name && (
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono mt-0.5 font-bold uppercase">{mentor.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 italic">{mentor.specialty}</span>
                  </button>
                ))}
              </div>

              {/* Mentorship status cards */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <p className="font-semibold text-white flex items-center gap-1.5 font-display text-xs">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Mentorship Progress Tracker
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span>Phase 1 Requirements Cleared</span>
                    <span className="text-teal-400 font-mono font-semibold">100%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1">
                    <div className="h-full rounded-full bg-teal-400" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Chat Console & Interview QA Desk */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Core Chat Console */}
              <div className="glass-panel rounded-xl flex flex-col h-[400px] justify-between overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                
                {/* Chat Top Header */}
                <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                    <div>
                      <span className="text-xs text-slate-400 block font-mono">ACTIVE SECTOR CHAT</span>
                      <span className="text-xs text-white font-bold font-display">{selectedPersona}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                    Live Mentoring Session
                  </span>
                </div>

                {/* Chat Log Message stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] space-y-1 ${
                        msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                        <span>{msg.persona}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      
                      <div
                        className={`p-3 rounded-xl border leading-relaxed whitespace-pre-wrap ${
                          msg.sender === "user"
                            ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-100 rounded-tr-none"
                            : "bg-slate-900/80 border-slate-800 text-slate-200 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono italic">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      <span>{selectedPersona} is composing advice...</span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Send Console Form */}
                <form onSubmit={handleSendChatMessage} className="bg-slate-900/80 border-t border-slate-800 p-3 flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ask the ${selectedPersona} about Phase 1 business decisions...`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-semibold rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>

              {/* AAA Job Interview Prep Desk */}
              <div className="glass-panel p-5 rounded-xl space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="font-display font-semibold text-base text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-teal-400" />
                    Phase 1 Studio Interview Prep Desk
                  </h4>
                  <p className="text-xs text-slate-400">
                    Prepare for real-world product and data job interviews at top global game publishers using these detailed QAs.
                  </p>
                </div>

                <div className="space-y-3">
                  {INTERVIEW_QUESTIONS.map((qa, index) => (
                    <div key={index} className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-900 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-slate-200 text-xs font-display">
                          Q: {qa.question}
                        </h5>
                        <button
                          onClick={() => toggleQA(index)}
                          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap"
                        >
                          {revealedAnswers[index] ? "Hide answer" : "Reveal Answer"}
                        </button>
                      </div>

                      {revealedAnswers[index] && (
                        <div className="bg-slate-900/60 p-3 rounded border border-slate-800/40 text-[11px] text-slate-300 leading-relaxed border-l-2 border-l-teal-500">
                          <strong className="text-[10px] text-teal-400 font-mono uppercase block mb-1">Mentor Explanation:</strong>
                          {qa.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 6: DEVELOPMENT ROADMAP */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-display font-semibold text-xl text-white">Platform Development Roadmap</h3>
              <p className="text-sm text-slate-400">
                A 10-phase roadmap mapping the progression of the Game Studio Command Center.
              </p>
            </div>

            {/* Structured 10-Phase Pipeline */}
            <div className="relative pl-6 border-l border-slate-800 space-y-8">
              {ROADMAP.map((phase) => (
                <div key={phase.number} className="relative">
                  {/* Phase dot indicator */}
                  <span className={`absolute -left-10 top-1.5 w-8 h-8 rounded-full flex items-center justify-center border font-mono text-xs font-semibold ${
                    phase.status === "Current"
                      ? "bg-slate-950 text-teal-400 border-teal-500 shadow-md shadow-teal-500/20"
                      : phase.status === "Upcoming"
                      ? "bg-slate-900 text-slate-300 border-slate-700"
                      : "bg-slate-950 text-slate-600 border-slate-900"
                  }`}>
                    {phase.status === "Current" ? (
                      <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                    ) : phase.status === "Upcoming" ? (
                      phase.number
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </span>

                  <div className="glass-panel p-5 rounded-xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">PHASE {phase.number}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            phase.status === "Current"
                              ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                              : phase.status === "Upcoming"
                              ? "bg-slate-800 text-slate-300 border border-slate-700"
                              : "bg-slate-950 text-slate-600 border border-slate-900"
                          }`}>
                            {phase.status}
                          </span>
                        </div>
                        <h4 className="font-display font-semibold text-base text-white mt-0.5">{phase.title}</h4>
                      </div>

                      {phase.status === "Current" && (
                        <div className="bg-slate-950 p-2 border border-slate-900 rounded-lg text-xs font-mono text-slate-400">
                          Waiting for your approval to start <span className="text-indigo-400">Phase 2</span>.
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                      {phase.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-slate-800/60 mt-3">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phase Deliverables</span>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((del, idx) => (
                          <span key={idx} className="bg-slate-950 text-slate-300 text-[10px] px-2.5 py-1 rounded border border-slate-900 flex items-center gap-1.5 font-mono">
                            {phase.status === "Current" ? (
                              <CheckCircle className="w-3 h-3 text-teal-400" />
                            ) : (
                              <span className="w-1 h-1 rounded-full bg-slate-500" />
                            )}
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>

                    {phase.status === "Current" && (
                      <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/20 space-y-3 mt-4 text-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                          <h5 className="font-semibold text-white font-display">Mentor Approval Protocol</h5>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          Excellent work digesting and setting up Phase 1! According to our strict AAA mentor instructions, you must approve the BRD structure before moving forward.
                        </p>
                        <div className="bg-slate-950 p-2.5 rounded border border-slate-900 text-teal-400 font-mono font-medium text-[11px] leading-relaxed">
                          To advance, simply type a message in the chat (e.g. &ldquo;I approve Phase 1, let's start Phase 2&rdquo;) so our elite developers, architects, and engineers can draft the Solutions Architecture document!
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Footer credits and information */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-6 text-center text-xs text-slate-500 space-y-1 mt-auto">
        <p className="font-mono">Game Studio Command Center • Created with Google AI Studio Build</p>
        <p className="text-[10px]">A professional-grade portfolio platform simulating real AAA studios. All rights reserved © 2026.</p>
      </footer>

    </div>
  );
}
