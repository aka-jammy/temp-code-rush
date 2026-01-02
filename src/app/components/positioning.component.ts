import { Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GeminiService } from '../services/gemini.service';

@Component({
  selector: 'app-positioning',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="animate-[fadeIn_0.5s_ease-out]">
      
      <!-- Calculator Form State -->
      @if (!data() && !isLoading()) {
        <div class="max-w-3xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden group">
           <div class="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none"></div>
           
           <div class="relative z-10 text-center mb-8">
             <h2 class="text-2xl font-bold text-white mb-2">Analyze Your Strategic Fit</h2>
             <p class="text-zinc-400 text-sm">Input your qualifications to calculate your market readiness score for <span class="text-white font-semibold">{{ role() }}</span> in <span class="text-white font-semibold">{{ location() }}</span>.</p>
           </div>

           <form [formGroup]="calcForm" (ngSubmit)="calculate()" class="space-y-6 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div class="space-y-2">
                    <label class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Education / Degree</label>
                    <select formControlName="education" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 transition-all outline-none appearance-none">
                       <option value="">Select Qualification</option>
                       <option value="Self Taught">Self Taught / Bootcamp</option>
                       <option value="Associate">Associate Degree</option>
                       <option value="Bachelors">Bachelor's Degree</option>
                       <option value="Masters">Master's Degree</option>
                       <option value="PhD">PhD</option>
                    </select>
                 </div>
                 
                 <div class="space-y-2">
                    <label class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Experience</label>
                    <select formControlName="experienceLevel" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 transition-all outline-none appearance-none">
                       <option value="">Select Experience</option>
                       <option value="0-1 Years">0-1 Years (Entry)</option>
                       <option value="1-3 Years">1-3 Years (Junior)</option>
                       <option value="3-5 Years">3-5 Years (Mid)</option>
                       <option value="5-8 Years">5-8 Years (Senior)</option>
                       <option value="8+ Years">8+ Years (Lead)</option>
                    </select>
                 </div>
              </div>

              <div class="space-y-2">
                  <label class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Key Skills & Tools (Comma Separated)</label>
                  <input formControlName="skills" type="text" placeholder="e.g. Python, SQL, Tableau, AWS, Leadership" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 transition-all outline-none">
              </div>

              <div class="space-y-2">
                  <label class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Internships / Key Projects / Work History</label>
                  <textarea formControlName="experience" rows="3" placeholder="Briefly describe relevant internships, major projects, or past roles..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-500 transition-all outline-none resize-none"></textarea>
              </div>

              <button type="submit" [disabled]="calcForm.invalid" class="w-full bg-white text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                 Calculate Score
              </button>
           </form>
        </div>
      }

      <!-- Loading State -->
      @if (isLoading()) {
         <div class="flex flex-col items-center justify-center py-20">
            <div class="relative w-16 h-16 mb-6">
              <div class="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Analyzing Profile</h3>
            <p class="text-zinc-500 text-sm">Benchmarking against {{ location() }} market data...</p>
         </div>
      }

      <!-- Results State -->
      @if (data()) {
        <div class="space-y-8">
          <!-- Top Section: Score & Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Left: Strategic Fit Score & Strengths -->
            <div class="lg:col-span-5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group flex flex-col items-center text-center">
               
               <!-- Strengths (Above) -->
               <div class="w-full mb-6">
                 <h4 class="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-2">Key Strengths</h4>
                 <div class="flex flex-wrap justify-center gap-1.5">
                    @for (item of data()?.keyStrengths; track $index) {
                      <span class="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">{{ item }}</span>
                    }
                 </div>
               </div>
               
               <!-- Score Circle -->
               <div class="relative w-44 h-44 flex items-center justify-center mb-6 shrink-0">
                 <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="45" fill="none" stroke="#18181b" stroke-width="6" />
                   <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" stroke-width="6" />
                   <circle cx="50" cy="50" r="45" fill="none" 
                           [attr.stroke]="getScoreColor(data()?.readinessScore)" 
                           stroke-width="6" 
                           stroke-dasharray="283" 
                           [attr.stroke-dashoffset]="283 - (283 * (data()?.readinessScore || 0) / 100)" 
                           stroke-linecap="round"
                           class="transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                 </svg>
                 <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-5xl font-bold text-white tracking-tighter">{{ data()?.readinessScore || 0 }}</span>
                    <span class="text-[10px] text-zinc-500 uppercase font-bold mt-1">/ 100</span>
                    <span class="px-3 py-0.5 mt-2 rounded-full text-[9px] font-bold border"
                      [class]="getScoreBadgeClass(data()?.readinessScore)">
                       {{ getScoreLabel(data()?.readinessScore) }}
                    </span>
                 </div>
               </div>

               <!-- Growth Areas (Below) -->
               <div class="w-full mt-auto">
                 <h4 class="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-2">Growth Focus</h4>
                 <div class="flex flex-wrap justify-center gap-1.5">
                    @for (item of data()?.growthAreas; track $index) {
                      <span class="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">{{ item }}</span>
                    }
                 </div>
               </div>
            </div>

            <!-- Right: Score Breakdown & Verdict -->
            <div class="lg:col-span-7 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
               
               <!-- Verdict Quote -->
               <div class="mb-6 h-full flex flex-col">
                 <div class="flex items-center gap-2 mb-3">
                    <div class="p-1.5 bg-white/10 rounded-lg">
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-widest">AI Verdict</h3>
                 </div>
                 <div class="text-base text-zinc-200 font-light leading-relaxed border-l-2 border-violet-500 pl-4 prose prose-invert max-w-none" [innerHTML]="formatVerdict(data()?.verdict)">
                 </div>
               </div>

               <!-- Factors Breakdown -->
               <div class="space-y-4 pt-6 border-t border-zinc-800/50 mt-auto">
                 <div class="grid grid-cols-3 gap-4">
                    <!-- Location Fit -->
                    <div>
                      <div class="flex justify-between text-[10px] mb-1.5">
                        <span class="text-zinc-400">Location</span>
                        <span class="text-white font-bold">{{ data()?.scoreBreakdown?.locationFit || 0 }}%</span>
                      </div>
                      <div class="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div class="h-full bg-violet-500 rounded-full" [style.width.%]="data()?.scoreBreakdown?.locationFit"></div>
                      </div>
                    </div>

                    <!-- Role Demand -->
                    <div>
                      <div class="flex justify-between text-[10px] mb-1.5">
                        <span class="text-zinc-400">Demand</span>
                        <span class="text-white font-bold">{{ data()?.scoreBreakdown?.roleDemand || 0 }}%</span>
                      </div>
                      <div class="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full" [style.width.%]="data()?.scoreBreakdown?.roleDemand"></div>
                      </div>
                    </div>

                    <!-- Goal Feasibility -->
                    <div>
                      <div class="flex justify-between text-[10px] mb-1.5">
                        <span class="text-zinc-400">Goal</span>
                        <span class="text-white font-bold">{{ data()?.scoreBreakdown?.goalFeasibility || 0 }}%</span>
                      </div>
                      <div class="h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" [style.width.%]="data()?.scoreBreakdown?.goalFeasibility"></div>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          <!-- Companies List (Detailed Dossier) -->
          <div>
             <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2 pl-1">
                <svg class="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Target Organization Analysis
             </h3>
             
             <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                @for(company of data()?.hiringCompanies; track $index) {
                   <div class="relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-xl p-6 hover:border-violet-500/30 hover:bg-zinc-900/60 transition-all group overflow-hidden flex flex-col">
                      
                      <div class="flex justify-between items-start mb-4">
                         <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg border border-zinc-700 shadow-lg shrink-0">
                               {{ company.name.charAt(0) }}
                            </div>
                            <div>
                               <h4 class="text-white font-bold text-base leading-none group-hover:text-violet-300 transition-colors mb-1">{{ company.name }}</h4>
                               <span class="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{{ company.sector }}</span>
                            </div>
                         </div>
                         <span class="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border shrink-0" 
                               [ngClass]="company.matchLevel === 'High' 
                                 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                 : 'bg-amber-500/10 text-amber-400 border-amber-500/20'">
                            {{ company.matchLevel }} Match
                         </span>
                      </div>

                      <!-- Details Grid -->
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 bg-black/20 p-3 rounded-lg border border-zinc-800/50">
                        <div>
                          <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Hiring Focus</p>
                          <p class="text-xs text-zinc-300 font-medium line-clamp-2">{{ company.hiringFocus || 'General Tech' }}</p>
                        </div>
                        <div>
                           <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Sector Trend</p>
                           <p class="text-xs text-violet-300 font-medium line-clamp-2">{{ company.sectorSpecificFocus || 'N/A' }}</p>
                        </div>
                        <div>
                          <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Culture Vibe</p>
                          <p class="text-xs text-zinc-300 font-medium line-clamp-2">{{ company.cultureVibe || 'Standard' }}</p>
                        </div>
                      </div>
                      
                      <!-- Rationale Section -->
                      <div class="mt-auto pt-3 border-t border-zinc-800/50">
                         <p class="text-sm text-zinc-400 leading-relaxed italic">
                           "{{ company.rationale }}"
                         </p>
                      </div>
                   </div>
                }
             </div>
          </div>

          <!-- Recalculate Option -->
          <div class="text-center pt-8 border-t border-zinc-800">
             <button (click)="resetAnalysis()" class="text-zinc-500 hover:text-white text-sm font-medium underline transition-colors">
               Update Qualifications & Recalculate
             </button>
          </div>
        </div>
      }

    </div>
  `
})
export class PositioningComponent {
  role = input.required<string>();
  location = input.required<string>();
  level = input.required<string>();
  goal = input.required<string>();

  data = signal<any>(null);
  isLoading = signal(false);

  private fb: FormBuilder = inject(FormBuilder);
  private geminiService: GeminiService = inject(GeminiService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  calcForm: FormGroup = this.fb.group({
    education: ['', Validators.required],
    skills: ['', Validators.required],
    experienceLevel: ['', Validators.required],
    experience: ['', Validators.required]
  });

  async calculate() {
    if (this.calcForm.invalid) return;
    this.isLoading.set(true);
    
    const { education, skills, experience, experienceLevel } = this.calcForm.value;

    try {
      const result = await this.geminiService.getPositioningAnalysis(
        this.role(), 
        this.location(), 
        this.level(), 
        this.goal(), 
        skills, 
        education,
        experience,
        experienceLevel
      );
      this.data.set(result);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  resetAnalysis() {
    this.data.set(null);
  }

  getScoreColor(score: number): string {
    if (!score) return '#27272a';
    if (score >= 80) return '#10b981'; // Emerald
    if (score >= 60) return '#fbbf24'; // Amber
    return '#ef4444'; // Red
  }

  getScoreLabel(score: number): string {
    if (!score) return 'Calculating...';
    if (score >= 80) return 'Highly Strategic';
    if (score >= 60) return 'Possible Fit';
    return 'Challenging Fit';
  }

  getScoreBadgeClass(score: number): string {
    if (!score) return 'bg-zinc-900 text-zinc-500 border-zinc-800';
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  }

  formatVerdict(text: string): SafeHtml {
    if (!text) return '';
    // Replace **text** with <strong class="text-white">text</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    // Replace newlines with <br>
    formatted = formatted.replace(/\n/g, '<br/>');
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}