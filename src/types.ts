/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  department: string;
  objective: string;
  coreKPIs: string[];
  avatar: string;
}

export interface UserPersona {
  id: string;
  name: string;
  title: string;
  quote: string;
  description: string;
  goals: string[];
  painPoints: string[];
  avatar: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: "Functional" | "Non-Functional";
  priority: "High" | "Medium" | "Low";
  status: "Drafted" | "Approved" | "Implemented";
  category: "Data Ingestion" | "Monetization Analytics" | "Live Ops & Events" | "Server Monitoring" | "Executive View" | "Infrastructure & Security";
}

export interface BusinessKPI {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: "up" | "down" | "stable";
  description: string;
}

export interface RiskItem {
  id: string;
  hazard: string;
  probability: "High" | "Medium" | "Low";
  impact: "High" | "Medium" | "Low";
  severity: "Critical" | "High" | "Medium";
  mitigation: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  persona: string;
}

export interface RoadmapPhase {
  number: number;
  title: string;
  status: "Current" | "Upcoming" | "Locked";
  description: string;
  deliverables: string[];
}
