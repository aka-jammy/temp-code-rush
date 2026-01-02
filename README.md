# AI Career Pathfinder

**AI Career Pathfinder** is a sophisticated Angular application designed to help tech professionals strategize their career growth. Powered by **Google's Gemini 2.5 Flash**, it generates hyper-personalized career roadmaps, market intelligence, and strategic positioning analysis based on real-time data.

## 💡 Solution Description
Tech professionals often face career stagnation due to generic advice that ignores local economic realities. **AI Career Pathfinder** solves this by acting as an on-demand Senior Technical Recruiter. It uniquely calculates **"Adoption Lag"** (the gap between local vs. global tech trends) and **"Salary Arbitrage"**, offering financial intelligence specific to the user's city. By leveraging **Google Search Grounding**, it aggregates live data to provide precise salary ranges, cost-of-living breakdowns, and verifiable "Strategic Fit Scores," empowering users to negotiate better and upskill strategically.

## 🛠️ Google Technologies Used
- **Angular v21+**: Built with the latest "Zoneless" architecture and Signals for high-performance reactivity.
- **Google Gemini API**: Direct integration via the `@google/genai` SDK.
- **Google Fonts**: Utilizes the 'Inter' font family for a clean, accessible UI.
- **Google Search**: Integrated via Gemini Tools for data verification.

## 🤖 Google AI Tools Integrated
1.  **Gemini 2.5 Flash (`gemini-2.5-flash`)**: The core reasoning engine selected for its low latency and high cost-efficiency, essential for real-time interactive apps.
2.  **Google Search Grounding**: Enabled in the `GeminiService` to ensure career data, company lists, and salary trends are based on verifiable web results rather than hallucinations.
3.  **Thinking Config**: Applied specifically to the Interview Prep module (Budget: 8192 tokens) to allow the model to "think" deeply about complex system design scenarios.

## 🚀 Key Features

### 1. Strategic Roadmap
- **Personalized Timeline**: Generates a phase-by-phase execution plan.
- **Skill Gap Analysis**: Identifies critical missing skills and verifies current strengths.
- **Target Credentials**: Recommends high-value certifications.

### 2. Market Intelligence
- **Global vs. Local Radar**: Compares adoption lags and salary arbitrage between the user's location and global hubs.
- **Financial Benchmarking**: Visualizes local salary trajectories vs. global compensation ranges.
- **Ecosystem Discovery**: AI-curated lists of "Global Titans" and "Startups" in the region.

### 3. Strategic Positioning
- **Fit Score**: Calculates a "readiness score" (0-100) based on the user's profile.
- **Target Organizations**: A detailed dossier of 12 specific companies with "Match Level" and "Culture Vibe".

### 4. Interview Prep
- **AI Mock Questions**: Generates 15 strategic interview questions (Behavioral, Technical, System Design).
- **Topic Heatmap**: Visualizes high-probability interview topics.

## 🔮 Future Development
1.  **Multimodal Voice Practice**: Real-time voice mock interviews using Gemini's native audio capabilities.
2.  **Resume Parsing**: "Line-by-line" CV optimization against the generated roadmap.
3.  **Live Job Feed**: Integration with Google Jobs API for "One-Click" outreach.
4.  **Gamified Progression**: Converting the roadmap into an interactive stateful checklist.
5.  **Salary Negotiation Sim**: A role-play agent to practice offer negotiation.

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-career-pathfinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - Ensure the environment has the `API_KEY` set for Google Gemini API access.
   - *Note: In this specific environment, the key is accessed via `process.env['API_KEY']`.*

4. **Run the application**
   ```bash
   npm start
   ```