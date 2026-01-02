import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roadmap-display',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
  `],
  template: `
    <div class="space-y-12">
      
      <!-- Skills & Certs Grid -->
      @if (roadmap()?.skillsGap) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.5s_ease-out]">
          
          <!-- Skill Gaps -->
          <div class="bg-zinc-900/50 backdrop-blur border border-rose-500/20 rounded-2xl p-6 group hover:border-rose-500/50 transition-all shadow-lg">
            <h3 class="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Critical Gaps
            </h3>
            <div class="flex flex-wrap gap-2">
              @for (skill of roadmap().skillsGap.missing; track $index) {
                <span class="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-200 text-sm font-medium border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors cursor-default">
                  {{ skill }}
                </span>
              }
            </div>
          </div>

          <!-- Masteries -->
          <div class="bg-zinc-900/50 backdrop-blur border border-emerald-500/20 rounded-2xl p-6 group hover:border-emerald-500/50 transition-all shadow-lg">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Verified Strengths
            </h3>
            <div class="flex flex-wrap gap-2">
              @for (skill of roadmap().skillsGap.mastery; track $index) {
                <span class="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-200 text-sm font-medium border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors cursor-default">
                  {{ skill }}
                </span>
              }
            </div>
          </div>

          <!-- Certifications -->
          <div class="bg-zinc-900/50 backdrop-blur border border-violet-500/20 rounded-2xl p-6 group hover:border-violet-500/50 transition-all shadow-lg md:col-span-2 lg:col-span-1">
            <h3 class="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Target Credentials
            </h3>
             <div class="space-y-3">
              @for (cert of roadmap().certifications; track $index) {
                <div class="bg-black/50 rounded-xl p-3 border border-zinc-800 flex items-start justify-between group/cert hover:border-violet-500/30 transition-all">
                  <div>
                    <div class="text-zinc-200 text-sm font-semibold group-hover/cert:text-violet-200 transition-colors">{{ cert.name }}</div>
                    <div class="text-xs text-zinc-500 mt-1">{{ cert.provider }}</div>
                  </div>
                  <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                    {{ cert.provider.charAt(0) }}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Timeline (Single Column) -->
      <div class="relative py-8 pl-4 sm:pl-8">
        <!-- Continuous Line -->
        <div class="absolute left-8 sm:left-12 top-0 bottom-0 w-px bg-zinc-800"></div>

        @for (step of roadmap()?.steps; track $index) {
          <div class="relative mb-12 last:mb-0 group animate-[slideUp_0.5s_ease-out]" [style.animation-delay]="$index * 150 + 'ms'">
            
            <!-- Timeline Dot -->
            <div class="absolute left-8 sm:left-12 -translate-x-1/2 w-4 h-4 mt-6">
              <div class="w-4 h-4 rounded-full bg-black border-2 border-white z-10 relative group-hover:scale-125 transition-transform duration-300"></div>
            </div>

            <!-- Content Card -->
            <div class="ml-12 sm:ml-20 w-full max-w-4xl">
              <div class="rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-white/10 p-6 hover:border-violet-500/30 transition-all duration-300 relative overflow-hidden group-hover:bg-zinc-900/80">
                
                <div class="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-4">
                  <h4 class="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">{{ step.phase }}</h4>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-black self-start sm:self-auto shadow-md">
                    {{ step.duration }}
                  </span>
                </div>

                <p class="text-zinc-400 text-sm leading-relaxed mb-6">{{ step.description }}</p>

                <!-- Action Items -->
                @if (step.actionItems && step.actionItems.length) {
                   <div class="bg-black/40 rounded-xl p-4 border border-zinc-800">
                      <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Objectives</p>
                      <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        @for (item of step.actionItems; track $index) {
                          <li class="flex items-start gap-3 group/item">
                            <span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 group-hover/item:scale-150 transition-transform"></span>
                            <span class="text-sm text-zinc-300 group-hover/item:text-white transition-colors leading-relaxed">{{ item }}</span>
                          </li>
                        }
                      </ul>
                   </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
      
      <!-- Resume Audit -->
      @if (roadmap()?.resumeTips) {
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
           <div class="mb-8 relative z-10">
             <h3 class="text-lg font-bold text-white flex items-center gap-2">
               <svg class="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               CV Optimization Audit
             </h3>
             <p class="text-xs text-zinc-500 mt-1">High-impact refinements</p>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              @for (tip of roadmap().resumeTips; track $index) {
                 <div class="p-5 rounded-xl bg-black/50 border border-zinc-800 hover:border-violet-500/30 transition-all group">
                    <div class="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 transition-transform shadow-lg">
                      {{ $index + 1 }}
                    </div>
                    <p class="text-sm text-zinc-300 group-hover:text-white transition-colors leading-relaxed">{{ tip }}</p>
                 </div>
              }
           </div>
        </div>
      }

    </div>
  `
})
export class RoadmapDisplayComponent {
  roadmap = input<any>();
}