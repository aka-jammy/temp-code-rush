import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiService } from './services/gemini.service';
import { RoadmapDisplayComponent } from './components/roadmap-display.component';
import { TechHubsComponent } from './components/tech-hubs.component';
import { SalaryChartComponent } from './components/salary-chart.component';
import { InterviewPrepComponent } from './components/interview-prep.component';
import { PositioningComponent } from './components/positioning.component';
import { MarketRadarComponent } from './components/market-radar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RoadmapDisplayComponent, 
    TechHubsComponent, 
    SalaryChartComponent,
    InterviewPrepComponent,
    PositioningComponent,
    MarketRadarComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private geminiService = inject(GeminiService);

  careerForm: FormGroup = this.fb.group({
    role: ['', Validators.required],
    location: ['', Validators.required],
    level: ['Beginner', Validators.required],
    difficulty: ['Intermediate', Validators.required],
    goal: ['', Validators.required]
  });

  isLoading = signal(false);
  isInsightsLoading = signal(false); // New signal for lazy loaded insights
  roadmapData = signal<any>(null);
  insightsData = signal<any>(null);
  error = signal<string | null>(null);
  roadmapSources = signal<any[]>([]);
  
  activeTab = signal<string>('roadmap');
  
  // Feedback Logic
  showFeedback = signal(false);
  feedbackSent = signal(false);

  // Info Logic
  showInfo = signal(false);

  async generate() {
    if (this.careerForm.invalid) return;

    this.isLoading.set(true);
    this.isInsightsLoading.set(true); // Start insights loading
    this.error.set(null);
    this.roadmapData.set(null);
    this.insightsData.set(null);
    this.roadmapSources.set([]);
    this.activeTab.set('roadmap');

    const { role, level, goal, location, difficulty } = this.careerForm.value;

    try {
      // 1. Generate Roadmap (Primary Data)
      const roadmapResult = await this.geminiService.generateRoadmap(role, level, goal, location, difficulty);
      this.roadmapData.set(roadmapResult.data);
      this.roadmapSources.set(roadmapResult.grounding);
      this.isLoading.set(false); // Main roadmap is ready

      // 2. Fetch Local Insights in parallel (Lazy loading effect)
      // Positioning is now handled on-demand in its own component
      this.geminiService.getLocalInsights(role, location)
        .then(res => this.insightsData.set(res))
        .catch(err => console.error(err))
        .finally(() => this.isInsightsLoading.set(false)); // Stop insights loading

    } catch (e: any) {
      console.error('Full Error:', e);
      let msg = "Unable to analyze career data. Please verify inputs and try again.";
      
      if (e.toString().includes('400') || e.toString().includes('API key') || e.toString().includes('403')) {
        msg = "Configuration Error: Invalid or Missing API Key in environment.";
      }
      
      this.error.set(msg);
      this.isLoading.set(false);
      this.isInsightsLoading.set(false);
    }
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
    
    // Smooth scroll to top of content area to reset view
    if (typeof window !== 'undefined') {
       setTimeout(() => {
         const element = document.getElementById('main-content');
         if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({
               top: offsetPosition,
               behavior: "smooth"
            });
         }
       }, 0);
    }
  }

  reset() {
    this.roadmapData.set(null);
    this.careerForm.reset({ level: 'Beginner', difficulty: 'Intermediate' });
  }

  toggleFeedback() {
    this.showFeedback.update(v => !v);
    if (!this.showFeedback()) {
      this.feedbackSent.set(false); // Reset on close
    }
  }

  toggleInfo() {
    this.showInfo.update(v => !v);
  }

  submitFeedback(event: Event) {
    event.preventDefault();
    // Simulate submission
    this.feedbackSent.set(true);
    setTimeout(() => {
       this.showFeedback.set(false);
       this.feedbackSent.set(false);
    }, 2000);
  }
}