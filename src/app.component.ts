import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiService } from './services/gemini.service';
import { RoadmapDisplayComponent } from './components/roadmap-display.component';
import { TechHubsComponent } from './components/tech-hubs.component';
import { SalaryChartComponent } from './components/salary-chart.component';
import { InterviewPrepComponent } from './components/interview-prep.component';
import { PositioningComponent } from './components/positioning.component';

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
    PositioningComponent
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
  roadmapData = signal<any>(null);
  insightsData = signal<any>(null);
  error = signal<string | null>(null);
  roadmapSources = signal<any[]>([]);
  
  activeTab = signal<string>('roadmap');

  async generate() {
    if (this.careerForm.invalid) return;

    this.isLoading.set(true);
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

      // 2. Fetch Local Insights in parallel (Lazy loading effect)
      // Positioning is now handled on-demand in its own component
      this.geminiService.getLocalInsights(role, location).then(res => this.insightsData.set(res)).catch(err => console.error(err));

    } catch (e: any) {
      console.error(e);
      this.error.set("Unable to analyze career data. Please verify inputs and try again.");
    } finally {
      this.isLoading.set(false);
    }
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
  }

  reset() {
    this.roadmapData.set(null);
    this.careerForm.reset({ level: 'Beginner', difficulty: 'Intermediate' });
  }
}