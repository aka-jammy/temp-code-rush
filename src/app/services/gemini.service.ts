import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

declare var process: any;

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Automatically use the API Key from the environment
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  private cleanJson(text: string): string {
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = clean.search(/[{[]/);
    if (firstBrace > 0) {
      clean = clean.substring(firstBrace);
    }
    for (let i = clean.length - 1; i >= 0; i--) {
        if (clean[i] === '}' || clean[i] === ']') {
            clean = clean.substring(0, i + 1);
            break;
        }
    }
    return clean;
  }

  async generateRoadmap(role: string, currentLevel: string, goal: string, location: string, difficulty: string) {
    const prompt = `
      Act as a Senior Career Data Scientist and Technical Recruiter. Analyze the role of "${role}" in "${location}" (Context: Level "${currentLevel}", Goal "${goal}", Complexity "${difficulty}").
      
      Task: Provide a highly detailed, accurate, and technical market analysis in RAW JSON format.
      
      CRITICAL INSTRUCTION FOR COMPLEXITY ("${difficulty}"):
      - If "Beginner": Focus on core fundamentals, simplified concepts, essential starting tools, and approachable learning resources.
      - If "Intermediate": Focus on standard industry practices, production workflows, breadth of knowledge, and common frameworks.
      - If "Advanced": Focus on deep internals, architectural patterns, performance optimization, scalability, and expert-level nuance.

      CRITICAL INSTRUCTION FOR ACCURACY:
      - Avoid generic terms. Be specific (e.g., instead of "Cloud", say "AWS Lambda & Step Functions"; instead of "AI", say "Transformer Architectures & LLM Fine-tuning").
      - Focus on High-Value skills relevant to the requested complexity.
      
      CRITICAL INSTRUCTION FOR CURRENCY:
      1. Detect the specific local currency for "${location}" (e.g., India = INR, UK = GBP, Europe = EUR, Japan = JPY).
      2. ALL salary numbers (salaryTrends, salaryRange) MUST be in this LOCAL currency.
      3. DO NOT convert to USD. Return the raw local market values.
      
      Structure requirements:
      1. currency: { "symbol": "₹", "code": "INR" } (Adapt symbol/code to location).
      2. salaryTrends: Array of {label: "Entry", value: number} (Local currency numbers). 
         PROVIDE EXACTLY 5 DATA POINTS: "Entry", "Junior", "Mid-Level", "Senior", "Principal/Lead".
      3. hotTopics: CRITICAL: List the Top 8-10 specific technical topics/frameworks with 'probability' (high frequency in interviews).
      4. skillsGap: Compare ${currentLevel} vs ${goal}. List 4 "Missing Skills" (Technical & Architectural) and 4 "Mastery Areas" (Strengths to leverage).
      5. certifications: List 4 top, high-value certifications with "name" and "provider".
      6. resumeTips: 3 specific, high-impact bullet points for CV optimization.
      7. steps: Detailed execution plan (3-4 phases). 
         EACH PHASE ACTION ITEM MUST BE AN OBJECT: { "text": "Specific task...", "type": "Technical" | "Resource" | "Project" }.
      8. trendComparison: A comparison object containing:
         - "globalTrend": "Detailed 30-40 word analysis of the global standard trend (e.g., Agentic AI & Autonomous Systems)...".
         - "localTrend": "Detailed 30-40 word analysis of the local market reality (e.g., Cloud Migration & Modernization)...".
         - "adoptionLag": "Detailed 2-3 sentence explanation of the specific time lag in technology adoption compared to global hubs.".
         - "salaryArbitrage": "Detailed 2-3 sentence comparison of purchasing power parity and salary difference.",
         - "globalSalaryBenchmark": "ESTIMATE the total compensation RANGE (Base + Bonus + Stock) in USD for this role in a Global Tier-1 Tech Hub (e.g. San Francisco/Zurich). Format as '$Min - $Max USD'.",
         - "relocationSuggestion": "Identify the #1 best country for this specific role/stack to maximize earnings/savings (e.g. 'United States' or 'Switzerland').",
         - "localLivingCost": "ESTIMATE monthly living expenses for a single person in ${location} (Rent, Food, Transport) AND approximate income tax rate. Return as concise string (e.g. 'Rent: ₹30k, Food: ₹12k, Transport: ₹5k, Tax: ~30%').",
         - "localBenefits": "Identify standard benefits in ${location} for this role. Include: Performance Bonus frequency/%, Health Insurance coverage, Stock Options (ESOPs) availability, and other perks.",
         - "globalTech": Array of 3 strings (Tech hot globally but rare locally).
         - "localTech": Array of 3 strings (Tech still dominant locally).
      
      JSON Structure:
      {
        "roleSummary": "Executive summary...",
        "marketOutlook": "High Growth",
        "currency": { "symbol": "₹", "code": "INR" },
        "salaryRange": "₹12L - ₹25L",
        "salaryTrends": [
          { "label": "Entry", "value": 800000 },
          { "label": "Junior", "value": 1200000 },
          { "label": "Mid-Level", "value": 1800000 },
          { "label": "Senior", "value": 2800000 },
          { "label": "Principal", "value": 4500000 }
        ],
        "hotTopics": [ 
          { "topic": "System Design", "probability": 90 },
          { "topic": "RAG Architectures", "probability": 85 }
        ],
        "growthTimeline": [ { "role": "Senior", "years": "2-3y" } ],
        "skillsGap": {
           "missing": ["Advanced Kubernetes Operators", "Event-Driven Microservices"],
           "mastery": ["Python Optimization", "SQL Performance Tuning"]
        },
        "certifications": [ { "name": "AWS Certified Solutions Architect - Professional", "provider": "Amazon" } ],
        "resumeTips": ["Quantify impact...", "Highlight X..."],
        "steps": [
          {
            "phase": "Phase 1: Advanced Skill Deepening",
            "duration": "3 Months",
            "description": "Focus on solidifying advanced concepts...",
            "actionItems": [
               { "text": "Master distributed system patterns", "type": "Technical" },
               { "text": "Read 'Designing Data-Intensive Applications'", "type": "Resource" },
               { "text": "Build a real-time recommendation engine", "type": "Project" }
            ],
            "tools": ["Kafka", "Airflow"]
          }
        ],
        "trendComparison": {
           "globalTrend": "Shift towards Agentic Workflows...",
           "localTrend": "Heavy focus on Data Engineering foundations...",
           "adoptionLag": "Local market trails by 6-9 months...",
           "salaryArbitrage": "Local salaries are 30% of US equivalent...",
           "globalSalaryBenchmark": "$150,000 - $220,000 USD",
           "relocationSuggestion": "United States",
           "localLivingCost": "Rent: ₹35k, Food: ₹15k, Transport: ₹5k, Tax: ~30%",
           "localBenefits": "Health Insurance (Family), ESOPs (Vest 4y), Annual Bonus (15%), Remote Allowance",
           "globalTech": ["LangGraph", "Rust", "Vector DBs"],
           "localTech": ["Java Spring Boot", "Legacy SQL", "Jenkins"]
        }
      }
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    let text = response.text || '{}';
    
    return {
      data: JSON.parse(this.cleanJson(text)),
      grounding
    };
  }

  async getLocalInsights(role: string, location: string) {
    const prompt = `
      Analyze the local tech ecosystem for a "${role}" in "${location}".
      
      Task: 
      1. Identify EXACTLY 21 specific active companies in this region hiring for similar roles.
      2. Classify them strictly into: 'Global Titan' (7), 'National Leader' (7), 'Startup' (7).
      3. Provide 'topCities' (Top 10 Cities) and 'topStates' (Top 10 States/Regions).
         For each city/state, estimate 'demand' (High/Med/Low) and 'salary' (Avg string).

      REQUIREMENTS:
      - Keep descriptions extremely concise (under 10 words).
      - Provide a concise 'cultureVibe' (1-2 words) e.g. 'Innovative'.
      - Provide the official 'website' URL (homepage).
      - Provide a 'linkedin' URL (company page) if available, otherwise return null.

      Return RAW JSON:
      {
        "topCompanies": [
           { 
             "name": "Name", 
             "category": "Global Titan", 
             "description": "Short bio", 
             "cultureVibe": "Innovative",
             "website": "https://...",
             "linkedin": "https://linkedin.com/company/..."
           }
        ],
        "topCities": [
           { "location": "City Name", "salary": "Avg String", "demand": "High" }
        ],
        "topStates": [
           { "location": "State Name", "salary": "Avg String", "demand": "Medium" }
        ]
      }
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    return JSON.parse(this.cleanJson(response.text || '{}'));
  }

  async getPositioningAnalysis(
    role: string, 
    location: string, 
    level: string, 
    goal: string, 
    skills: string, 
    education: string,
    experience: string,
    experienceLevel: string
  ) {
    const prompt = `
      Act as a Strategic Career Advisor. 
      Analyze the specific profile for a ${role} role in ${location}.
      
      CANDIDATE PROFILE:
      - Current Level: ${level}
      - Experience Duration: ${experienceLevel}
      - Goal: ${goal}
      - Degree: ${education}
      - Technical Skills: ${skills}
      - Work History / Internships: ${experience}
      
      Task: Calculate a "Strategic Fit Score" (0-100).
      
      Output Requirements:
      1. Score (0-100)
      2. Key Strengths (Array of 3-4 strings, short and punchy, e.g. "Top-Tier Degree", "ML Frameworks").
      3. Growth Areas (Array of 3-4 strings, short and punchy, e.g. "Cloud Native", "Team Leadership").
      4. Verdict: A detailed analysis paragraph. Use markdown bolding (e.g. **Text**) for key skills and points. Break into 2-3 short paragraphs for readability.
      5. Hiring Companies: List EXACTLY 12 companies in ${location} that fit this profile.

      Return RAW JSON:
      {
        "readinessScore": 85,
        "keyStrengths": ["Academic Rigor", "Python Proficiency", "Big Tech Exposure"],
        "growthAreas": ["Cloud Deployments", "System Design", "MLOps"],
        "scoreBreakdown": {
           "locationFit": 90,
           "roleDemand": 85,
           "goalFeasibility": 80
        },
        "verdict": "Detailed verdict using **markdown bold**...",
        "topSectors": ["Fintech", "HealthTech", "Ecommerce"],
        "hiringCompanies": [
           // List 12 SPECIFIC companies
           { 
             "name": "Company Name", 
             "sector": "Sector", 
             "matchLevel": "High/Medium",
             "hiringFocus": "Specific tech focus",
             "sectorSpecificFocus": "Concise (1-2 words) Technology/Trend (e.g. 'Blockchain Integration', 'AI Diagnostics')",
             "cultureVibe": "Company culture",
             "rationale": "A detailed 2-3 sentence explanation of why this specific company fits, explicitly referencing the candidate's specific skills or experience." 
           }
        ],
        "demandTrend": "Rising"
      }
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return JSON.parse(this.cleanJson(response.text || '{}'));
  }

  async generateInterviewQuestions(role: string) {
    const prompt = `
      Act as a Hiring Manager. Generate EXACTLY 15 strategic interview questions for a "${role}".
      Mix Technical, System Design, and Behavioral questions.
      Return RAW JSON array of objects with question, type, context, and answer.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8192 }
      }
    });

    return JSON.parse(this.cleanJson(response.text || '[]'));
  }
}