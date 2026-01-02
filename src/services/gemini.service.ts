import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // IMPORTANT: Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual API key from Google AI Studio.
    // Standard Angular CLI env vars are not used here for simplicity in this demo.
    this.ai = new GoogleGenAI({ apiKey: 'YOUR_GEMINI_API_KEY_HERE' });
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
      7. steps: Detailed execution plan (3-4 phases). Each phase must have deep technical specific action items aligned with the "${difficulty}" complexity.
      
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
            "actionItems": ["Master distributed system patterns", "Implement end-to-end MLOps pipelines"],
            "tools": ["Kafka", "Airflow"]
          }
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

      Keep descriptions extremely concise (under 10 words) to ensure fast generation.
      Provide a concise 'cultureVibe' (1-2 words) for each company (e.g., 'Innovative', 'Corporate', 'Fast-Paced').

      Return RAW JSON:
      {
        "topCompanies": [
           { "name": "Name", "category": "Global Titan", "description": "Short bio", "cultureVibe": "Innovative" }
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
