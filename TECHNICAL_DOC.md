# Technical Documentation

## Architecture Overview

This project is built using **Modern Angular** best practices, focusing on performance and maintainability.

- **Zoneless**: Uses `provideZonelessChangeDetection()` for optimal performance without `zone.js` overhead.
- **Standalone Components**: No `NgModule` complexity; components import their dependencies directly.
- **Signals**: Used exclusively for state management (local component state and derived state).
- **Tailwind CSS**: Utility-first styling with no external CSS files (styles are encapsulated or inline).

## 📂 Project Structure

```
src/
├── app.component.ts           # Main layout and orchestrator
├── components/
│   ├── interview-prep.ts      # Interview questions & topic heatmap
│   ├── market-radar.ts        # Global/Local comparison & financial data
│   ├── positioning.ts         # Fit score calculator form & results
│   ├── roadmap-display.ts     # Timeline, skills, and certs view
│   ├── salary-chart.ts        # D3.js interactive bar chart
│   └── tech-hubs.ts           # Company lists & regional tables
└── services/
    └── gemini.service.ts      # AI integration layer
```

## 🧠 Key Services

### `GeminiService`
The core intelligence layer connecting to the `@google/genai` SDK.

- **Model**: Uses `gemini-2.5-flash` for high-speed, cost-effective text generation.
- **Prompt Engineering**:
    - Uses strict system instructions to force **JSON** output.
    - **Financial Granularity**: Specifically requests local currency detection, global salary ranges (Min-Max USD), and granular living cost breakdowns (Transport/Rent/Food).
    - Requests structured data (arrays, objects) to render UI elements (charts, lists) rather than unstructured text.
- **Methods**:
    - `generateRoadmap()`: Fetches the primary plan, skills gap, salary data, and market trend comparisons.
    - `getLocalInsights()`: Fetches company lists and regional data.
    - `getPositioningAnalysis()`: Detailed scoring logic based on user profile.
    - `generateInterviewQuestions()`: Uses the `thinkingConfig` (budget: 8192) for deep reasoning on interview scenarios.
- **Helpers**:
    - `cleanJson()`: A utility to strip markdown code blocks (```json ... ```) from the LLM response before parsing.

## 🧩 Key Components

### `AppComponent`
- **Role**: State orchestrator.
- **Logic**: Handles the main form input (`FormGroup`) and calls `GeminiService`.
- **State**: Manages `activeTab` signal to switch views.
- **Async Handling**: Triggers multiple API calls in parallel (Roadmap vs. Local Insights) to create a "lazy loading" effect for secondary data.

### `MarketRadarComponent`
- **Role**: Visualizes the divergence between local and global markets.
- **Features**:
    - Displays adoption lag and salary arbitrage.
    - Shows estimated monthly living costs and typical benefit packages (Stock, Insurance).
    - Provides a "Strategic Advantage" insight based on tech stack differentials.

### `SalaryChartComponent`
- **Tech**: D3.js.
- **Features**:
    - Responsive SVG rendering using `ResizeObserver`.
    - Dynamic scale bands for categories.
    - Interactive tooltips on hover.
    - Toggle between Annual and Monthly views using Angular Signals to trigger re-renders via `effect()`.

### `PositioningComponent`
- **Role**: A "Calculator" within the app.
- **Features**:
    - Contains its own form (`ReactiveFormsModule`) separate from the main app form.
    - Visualizes the "Fit Score" using a dynamic SVG circle dash-offset calculation based on the score signal.
    - Renders HTML-safe content for the AI Verdict using `DomSanitizer`.

### `TechHubsComponent`
- **Features**:
    - Uses `computed()` signals to filter the raw company list into categories (Global Titans, National Leaders, Startups).
    - Renders comparative tables for Cities vs. States.

## 🔄 Data Flow

1. **User Input**: User fills out the main form in `AppComponent`.
2. **Signal Update**: `isLoading` set to true.
3. **AI Request**: `GeminiService` constructs a prompt with the user's context.
4. **Processing**: Google Gemini processes the prompt and returns a JSON string.
5. **Sanitization**: `cleanJson` ensures the string is valid JSON.
6. **State Update**: Result is parsed and set to `roadmapData` (Signal).
7. **UI Render**: The template reacts to the signal change, removing the loading spinner and rendering the dashboard.

## 🎨 Styling Strategy

- **Theme**: Dark mode default (`bg-black`, `text-zinc-200`).
- **Accents**: Violet (AI/Future), Emerald (Success/Money), Rose (Gaps/Alerts).
- **Interactive**: Hover effects on cards, distinct borders, and backdrop blurs (`backdrop-blur-xl`) for a modern feel.
- **Responsive**: Grid layouts change from 1 column (mobile) to 2/3 columns (desktop) using Tailwind breakpoints (`md:`, `lg:`).

## ⚠️ Constraints & Guidelines

- **No Zone.js**: Change detection is manual or signal-driven.
- **Images**: Uses `https://grainy-gradients.vercel.app/noise.svg` for texture overlays.
- **Error Handling**: Basic try/catch blocks around JSON parsing to handle potential LLM hallucinations or malformed JSON.