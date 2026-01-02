import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-market-radar',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
  `],
  template: `
    <div class="animate-[fadeIn_0.5s_ease-out] space-y-6">
      
      <!-- Summary Card -->
      <div class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
         <div class="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
         
         <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div class="space-y-4">
               <h2 class="text-xl font-bold text-white flex items-center gap-2">
                 <svg class="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Global vs. Local Divergence
               </h2>
               <p class="text-zinc-400 text-sm leading-relaxed">
                  Comparing <span class="text-white font-semibold">{{ location() }}</span> market dynamics against global Tier-1 tech hubs (Silicon Valley, London, Singapore).
               </p>
            </div>
            
            <div class="space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
               <div>
                  <div class="text-[10px] uppercase text-zinc-500 font-bold tracking-widest mb-2">Adoption Lag</div>
                  <p class="text-emerald-400 text-sm leading-relaxed font-medium">{{ data()?.adoptionLag || 'Calculating...' }}</p>
               </div>
               <div>
                  <div class="text-[10px] uppercase text-zinc-500 font-bold tracking-widest mb-2">Global Benchmark (Total Comp)</div>
                  <p class="text-white font-bold text-lg leading-none mb-1">{{ data()?.globalSalaryBenchmark || 'Analyzing...' }}</p>
                  <div class="flex items-center gap-1.5 mb-2">
                     <span class="text-[10px] text-zinc-500">Relocation Target:</span>
                     <span class="text-emerald-400 text-xs font-bold">{{ data()?.relocationSuggestion || 'Loading...' }}</span>
                  </div>
                  <p class="text-zinc-400 text-xs leading-relaxed border-t border-white/5 pt-2">{{ data()?.salaryArbitrage }}</p>
               </div>
            </div>
         </div>
      </div>

      <!-- Comparison Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         <!-- Global Context -->
         <div class="bg-zinc-900/50 border border-violet-500/20 rounded-2xl p-6 hover:border-violet-500/40 transition-all group">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
               <div class="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                  <h3 class="text-lg font-bold text-white">Global Frontier</h3>
                  <p class="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Innovation Standard</p>
               </div>
            </div>

            <div class="space-y-5">
               <div>
                  <div class="text-xs text-violet-300 font-bold mb-1">Dominant Macro Trend</div>
                  <p class="text-sm text-zinc-300 leading-relaxed">{{ data()?.globalTrend }}</p>
               </div>
               
               <div>
                  <div class="text-xs text-zinc-500 font-bold mb-2 uppercase tracking-wide">Emerging Tech Stack</div>
                  <div class="flex flex-wrap gap-2">
                     @for (tech of data()?.globalTech; track $index) {
                        <span class="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-200 text-xs font-semibold border border-violet-500/20">{{ tech }}</span>
                     }
                  </div>
               </div>
            </div>
         </div>

         <!-- Local Context -->
         <div class="bg-zinc-900/50 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all group">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
               <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </div>
               <div>
                  <h3 class="text-lg font-bold text-white">Local Reality</h3>
                  <p class="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Market Demand in {{ location() }}</p>
               </div>
            </div>

            <div class="space-y-5">
               <div>
                  <div class="text-xs text-emerald-300 font-bold mb-1">Local Market & Cost Analysis</div>
                  <p class="text-sm text-zinc-300 leading-relaxed mb-4">{{ data()?.localTrend }}</p>
                  
                  <!-- Estimated Costs -->
                  <div class="bg-black/30 rounded-lg p-3 border border-zinc-800/50 mb-4">
                     <div class="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800/50">
                        <svg class="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Est. Monthly Costs</span>
                     </div>
                     <p class="text-xs text-emerald-100 font-mono leading-relaxed">{{ data()?.localLivingCost || 'Calculating expenses...' }}</p>
                  </div>

                  <!-- Typical Benefits -->
                  <div class="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                     <div class="flex items-center gap-2 mb-2">
                        <svg class="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Typical Perks & Benefits</span>
                     </div>
                     <p class="text-xs text-zinc-300 leading-relaxed">{{ data()?.localBenefits || 'Analyzing benefits structure...' }}</p>
                  </div>
               </div>
               
               <div>
                  <div class="text-xs text-zinc-500 font-bold mb-2 uppercase tracking-wide">Highest Volume Skills</div>
                  <div class="flex flex-wrap gap-2">
                     @for (tech of data()?.localTech; track $index) {
                        <span class="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-200 text-xs font-semibold border border-emerald-500/20">{{ tech }}</span>
                     }
                  </div>
               </div>
            </div>
         </div>

      </div>

      <!-- Actionable Insight -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start gap-4">
         <div class="p-2 bg-amber-500/10 rounded-lg shrink-0 mt-0.5">
            <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
         </div>
         <div>
            <h4 class="text-sm font-bold text-white mb-1">Strategic Advantage</h4>
            <p class="text-xs text-zinc-400 leading-relaxed">
               Bridge the gap: You can command a premium in <span class="text-zinc-200">{{ location() }}</span> by introducing 
               <span class="text-violet-400 font-medium">{{ data()?.globalTech?.[0] || 'emerging tech' }}</span> patterns into 
               <span class="text-emerald-400 font-medium">{{ data()?.localTech?.[0] || 'legacy' }}</span> environments.
            </p>
         </div>
      </div>

    </div>
  `
})
export class MarketRadarComponent {
  data = input<any>();
  location = input.required<string>();
}