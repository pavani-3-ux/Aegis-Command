import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined in the environment. Chat mentorship will operate in simulated offline response mode.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client:", error);
}

// Personas system instructions dictionary
const PERSONA_PROMPTS: Record<string, string> = {
  "Senior Product Manager": `You are a Senior Product Manager at our elite AAA game studio. Your goal is to guide the user in setting up "Game Studio Command Center", an AI-powered game development intelligence platform.
Focus on business logic, functional requirements, alignment with studio goals, user personas, and scoping.
Your tone should be professional, encouraging, analytical, and mentoring.
You are currently helping the user with Phase 1: Business Discovery (Company Background, Studio Vision, Business Problem, Stakeholders, Requirements, and KPIs). Keep responses structured and professional.`,

  "AAA Game Studio Consultant": `You are an elite AAA Game Studio Consultant who has worked with companies like Riot Games, Valve, and Epic Games.
Focus on industry trends, live operations, monetization models (battle passes, events, gacha, cosmetic shops), player lifetime value (LTV), and seasonal event execution.
Provide high-level strategies on how real AAA studios leverage telemetry data to keep players engaged and optimize monetization without causing player backlash. Your tone is authoritative, strategic, and highly knowledgeable.`,

  "Solutions Architect": `You are the Lead Solutions Architect. Your role is to design the robust, scalable, enterprise-grade architecture for the Game Studio Command Center.
Focus on high-availability, real-time data ingestion, telemetry collectors, cloud databases, message queues (Kafka, Pub/Sub), data lakes, and security.
You will soon guide the user on Phase 2: Solution Architecture. For now, answer any high-level design questions or prepare them with architectural principles. Your tone is technically precise, structured, and pragmatic.`,

  "Lead Data Engineer": `You are the Lead Data Engineer. Your role is to guide the user on database structures, data storage, ETL pipelines, normalization, performance, indexing, and stream processing.
You will soon guide the user on Phase 3 (Database Design with 30+ tables like Players, Matches, Sessions, Purchases, etc.) and Phase 5 (Python ETL).
Provide detailed, structured technical assistance on SQL database designs, data warehousing concepts, and data pipelines. Your tone is hands-on, detail-oriented, and highly engineering-focused.`,

  "Game Analytics Expert": `You are the Game Analytics Expert. Your focus is player metrics, analytics, KPIs, behavioral patterns, churn modeling, and matchmaking performance.
Discuss definitions of DAU, MAU, retention cohorts, player lifetime value, telemetry metrics (FPS, ping, crash rates), and dashboard page layouts.
Provide rigorous, statistics-driven mentoring. Your tone is numbers-driven, insightful, and strategic.`
};

// Simulated answers when API key is missing
const SIMULATED_RESPONSES: Record<string, string[]> = {
  "Senior Product Manager": [
    "That is an excellent point. In Phase 1, we must ensure our KPIs map directly to our key objectives. For instance, mapping Player Retention (DAU/MAU) directly to Live Ops seasonal events ensures that our updates are actively driving retention rather than just novelty spikes.",
    "For our target stakeholders, we need to balance different viewpoints: our Executive team cares about Player Lifetime Value (LTV) and quarterly revenue, while our Live Ops producers care about Battle Pass completion rates and skin popularity. Let's make sure the functional requirements reflect this separation."
  ],
  "AAA Game Studio Consultant": [
    "Looking at Epic and Riot Games, the transition from raw game purchases to Live Ops seasonal Battle Passes completely revolutionized studio monetization. The platform must capture this by tracking purchase events immediately in our Store Analytics module.",
    "Player sentiment is our biggest asset and our greatest risk. When designing shop pricing analytics, we must carefully monitor community backlash indicators. I highly recommend establishing automated alerts when a new update correlates with a spike in support ticket volume."
  ],
  "Solutions Architect": [
    "To ingest telemetry data from millions of daily active players, we need a high-throughput message broker like Apache Kafka or Google Cloud Pub/Sub, acting as the front door. This prevents our transactional databases from being choked by matchmaking or session heartbeat logs.",
    "When we map out our High-Level Architecture in Phase 2, we will partition the telemetry path into a 'Hot Path' for real-time live monitoring (using WebSockets or real-time dashboards) and a 'Cold Path' for deep historical SQL/Python analysis in our data warehouse."
  ],
  "Lead Data Engineer": [
    "Our database schema needs to maintain strict referential integrity. In Phase 3, we will define clean primary-foreign key relationships between our core `Players` table and transactional logs like `Purchases` and `MatchStatistics`. We'll also use composite indexes on `player_id` and `timestamp` to speed up query performance.",
    "For the ETL pipelines in Phase 5, python libraries like Pandas, PySpark, or standard SQL staging tables will handle deduplication and schema validation. We must ensure crash records are parsed properly so we can pinpoint memory leaks or faulty server regions."
  ],
  "Game Analytics Expert": [
    "For premium dashboards like we are planning in Phase 8, calculating retention requires tracking player cohorts by their sign-up date. This lets us measure Day-1, Day-7, and Day-30 retention, which are the industry-standard health markers of any live-service game.",
    "Let's focus on monetization metrics: Average Revenue Per User (ARPU) and Average Revenue Per Paying User (ARPPU). Understanding the purchase behavior of 'whales' versus casual spenders is key to sustaining our virtual economy."
  ]
};

// API Endpoint for Chat
app.post("/api/chat", async (req, res) => {
  const { query, persona, history } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const selectedPersona = persona || "Senior Product Manager";
  const systemInstruction = PERSONA_PROMPTS[selectedPersona] || PERSONA_PROMPTS["Senior Product Manager"];

  if (ai) {
    try {
      const formattedHistory = (history || []).map((msg: any) => {
        return `${msg.sender === "user" ? "User" : "Mentor"}: ${msg.text}`;
      }).join("\n");

      const promptContent = `
System Instructions: ${systemInstruction}

Conversation History:
${formattedHistory}

Current User Question: "${query}"

Provide your expert response as the mentor:`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptContent,
      });

      const reply = result.text || "I apologize, I could not formulate a response. Please try again.";
      return res.json({ reply, mode: "api" });
    } catch (error: any) {
      console.error("Gemini API call failed, falling back to simulated response:", error);
    }
  }

  // Simulated fallback
  const list = SIMULATED_RESPONSES[selectedPersona] || SIMULATED_RESPONSES["Senior Product Manager"];
  const randomResponse = list[Math.floor(Math.random() * list.length)] + 
    "\n\n*(Note: Chat mentorship is running in live simulated mode. Set up your GEMINI_API_KEY in Settings > Secrets to unlock live, customized AI mentoring!)*";
  
  res.json({ reply: randomResponse, mode: "simulation" });
});

// Vite integration
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running in development mode on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in production mode on http://localhost:${PORT}`);
  });
}
