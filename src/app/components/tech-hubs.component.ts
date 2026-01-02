import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-hubs',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
  `],
  template: `
    <div class="grid grid-cols-1 gap-6 animate-[fadeIn_0.6s_ease-out]">
      
      @if (isLoading() && !companies().length) {
         <div class="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center min-h-[400px] animate-[fadeIn_0.5s_ease-out]">
            <div class="relative w-16 h-16 mb-6">
              <div class="absolute inset-0 border-t-2 border-l-2 border-emerald-500 rounded-full animate-spin"></div>
              <div class="absolute inset-2 border-b-2 border-r-2 border-violet-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Scanning Ecosystem</h3>
            <p class="text-zinc-500 text-sm text-center max-w-xs animate-pulse leading-relaxed">
               Analyzing market data sources for local companies... <br>
               <span class="text-xs text-zinc-600 mt-2 block">Estimated wait: ~1 minute</span>
            </p>
         </div>
      } @else {
         <!-- Categorized Ecosystem Players -->
         <div class="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 flex flex-col hover:border-white/20 transition-colors">
            <div class="flex items-center gap-3 mb-6">
               <div class="p-2 bg-white/10 rounded-lg">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
               </div>
               <h3 class="text-lg font-bold text-white tracking-tight">Ecosystem Landscape</h3>
            </div>
            
            <div class="space-y-8 flex-grow">
               
               <!-- Global Titans -->
               @if (globalTitans().length) {
                  <div>
                  <h4 class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                     <span class="w-1.5 h-1.5 rounded-full bg-violet-500"></span> Global Titans
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     @for (company of globalTitans(); track $index) {
                        <div class="group relative bg-zinc-900/80 border border-zinc-800 p-6 rounded-lg hover:border-violet-500/40 hover:bg-zinc-900 transition-all duration-300">
                           <div class="flex items-center gap-4">
                              <div class="w-10 h-10 rounded bg-white flex items-center justify-center text-black font-bold border border-zinc-400 text-sm shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                 {{ company.name.charAt(0) }}
                              </div>
                              <div class="flex-1 min-w-0">
                                 <div class="flex justify-between items-start gap-2">
                                    <div class="text-sm font-semibold text-zinc-200 truncate group-hover:text-violet-300 transition-colors mb-0.5">{{ company.name }}</div>
                                    <div class="flex items-center gap-2">
                                    @if(company.cultureVibe) {
                                       <span class="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10 uppercase tracking-wide">{{ company.cultureVibe }}</span>
                                    }
                                    </div>
                                 </div>
                                 <div class="text-[11px] text-zinc-500 truncate leading-tight mb-2">{{ company.description }}</div>
                                 
                                 <!-- Links -->
                                 <div class="flex items-center gap-2 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                    @if(company.website) {
                                    <a [href]="company.website" target="_blank" class="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded" title="Official Website">
                                       <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                    </a>
                                    }
                                    @if(company.linkedin) {
                                    <a [href]="company.linkedin" target="_blank" class="text-zinc-500 hover:text-blue-400 transition-colors p-1 hover:bg-zinc-800 rounded" title="LinkedIn Profile">
                                       <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    </a>
                                    }
                                 </div>
                              </div>
                           </div>
                        </div>
                     }
                  </div>
                  </div>
               }

               <!-- National Leaders -->
               @if (nationalLeaders().length) {
                  <div>
                  <h4 class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                     <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> National Leaders
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     @for (company of nationalLeaders(); track $index) {
                        <div class="group relative bg-zinc-900/80 border border-zinc-800 p-6 rounded-lg hover:border-emerald-500/40 hover:bg-zinc-900 transition-all duration-300">
                           <div class="flex items-center gap-4">
                              <div class="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-white font-bold border border-zinc-700 text-sm shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                 {{ company.name.charAt(0) }}
                              </div>
                              <div class="flex-1 min-w-0">
                                 <div class="flex justify-between items-start gap-2">
                                    <div class="text-sm font-semibold text-zinc-200 truncate group-hover:text-emerald-300 transition-colors mb-0.5">{{ company.name }}</div>
                                    @if(company.cultureVibe) {
                                    <span class="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10 uppercase tracking-wide">{{ company.cultureVibe }}</span>
                                    }
                                 </div>
                                 <div class="text-[11px] text-zinc-500 truncate leading-tight mb-2">{{ company.description }}</div>
                                 
                                 <!-- Links -->
                                 <div class="flex items-center gap-2 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                    @if(company.website) {
                                    <a [href]="company.website" target="_blank" class="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded" title="Official Website">
                                       <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                    </a>
                                    }
                                    @if(company.linkedin) {
                                    <a [href]="company.linkedin" target="_blank" class="text-zinc-500 hover:text-blue-400 transition-colors p-1 hover:bg-zinc-800 rounded" title="LinkedIn Profile">
                                       <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    </a>
                                    }
                                 </div>
                              </div>
                           </div>
                        </div>
                     }
                  </div>
                  </div>
               }

               <!-- Startups -->
               @if (startups().length) {
                  <div>
                  <h4 class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 pl-1 flex items-center gap-2">
                     <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> High-Growth Startups
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     @for (company of startups(); track $index) {
                        <div class="group relative bg-zinc-900/80 border border-zinc-800 p-6 rounded-lg hover:border-cyan-500/40 hover:bg-zinc-900 transition-all duration-300">
                           <div class="flex items-center gap-4">
                              <div class="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-white font-bold border border-zinc-700 text-sm shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                 {{ company.name.charAt(0) }}
                              </div>
                              <div class="flex-1 min-w-0">
                                 <div class="flex justify-between items-start gap-2">
                                    <div class="text-sm font-semibold text-zinc-200 truncate group-hover:text-cyan-300 transition-colors mb-0.5">{{ company.name }}</div>
                                    @if(company.cultureVibe) {
                                    <span class="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10 uppercase tracking-wide">{{ company.cultureVibe }}</span>
                                    }
                                 </div>
                                 <div class="text-[11px] text-zinc-500 truncate leading-tight mb-2">{{ company.description }}</div>
                                 
                                 <!-- Links -->
                                 <div class="flex items-center gap-2 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                    @if(company.website) {
                                    <a [href]="company.website" target="_blank" class="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded" title="Official Website">
                                       <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                    </a>
                                    }
                                    @if(company.linkedin) {
                                    <a [href]="company.linkedin" target="_blank" class="text-zinc-500 hover:text-blue-400 transition-colors p-1 hover:bg-zinc-800 rounded" title="LinkedIn Profile">
                                       <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    </a>
                                    }
                                 </div>
                              </div>
                           </div>
                        </div>
                     }
                  </div>
                  </div>
               }
            </div>
         </div>

         <!-- Regional Demand Heatmap (Two Columns) -->
         @if (topCities().length > 0 || topStates().length > 0) {
            <div class="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10">
               <div class="flex items-center gap-3 mb-4">
                  <div class="p-2 bg-emerald-500/10 rounded-lg">
                     <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                  </div>
                  <h3 class="text-lg font-bold text-white tracking-tight">Regional Demand Heatmap</h3>
               </div>
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <!-- Cities Column -->
                  <div class="border border-zinc-800 rounded-xl overflow-hidden bg-black/20">
                  <div class="bg-zinc-950 px-4 py-3 border-b border-zinc-800">
                     <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-widest">Top Cities</h4>
                  </div>
                  <div class="overflow-x-auto">
                     <table class="w-full text-sm text-left">
                        <tbody class="divide-y divide-zinc-800">
                        @for (loc of topCities(); track $index) {
                           <tr class="hover:bg-zinc-900 transition-colors duration-200 group">
                              <td class="px-4 py-3 font-medium text-zinc-300 group-hover:text-white transition-colors whitespace-nowrap">{{ loc.location }}</td>
                              <td class="px-4 py-3 text-right text-emerald-400 font-mono text-xs whitespace-nowrap">{{ loc.salary }}</td>
                              <td class="px-4 py-3 text-right">
                              <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded"
                                 [ngClass]="loc.demand?.includes('High') 
                                    ? 'bg-emerald-500/10 text-emerald-400' 
                                    : 'bg-amber-500/10 text-amber-400'">
                                 {{ loc.demand }}
                              </span>
                              </td>
                           </tr>
                        }
                        </tbody>
                     </table>
                  </div>
                  </div>

                  <!-- States Column -->
                  <div class="border border-zinc-800 rounded-xl overflow-hidden bg-black/20">
                  <div class="bg-zinc-950 px-4 py-3 border-b border-zinc-800">
                     <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-widest">Top States/Regions</h4>
                  </div>
                  <div class="overflow-x-auto">
                     <table class="w-full text-sm text-left">
                        <tbody class="divide-y divide-zinc-800">
                        @for (loc of topStates(); track $index) {
                           <tr class="hover:bg-zinc-900 transition-colors duration-200 group">
                              <td class="px-4 py-3 font-medium text-zinc-300 group-hover:text-white transition-colors whitespace-nowrap">{{ loc.location }}</td>
                              <td class="px-4 py-3 text-right text-emerald-400 font-mono text-xs whitespace-nowrap">{{ loc.salary }}</td>
                              <td class="px-4 py-3 text-right">
                              <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded"
                                 [ngClass]="loc.demand?.includes('High') 
                                    ? 'bg-emerald-500/10 text-emerald-400' 
                                    : 'bg-amber-500/10 text-amber-400'">
                                 {{ loc.demand }}
                              </span>
                              </td>
                           </tr>
                        }
                        </tbody>
                     </table>
                  </div>
                  </div>

               </div>
            </div>
         }
      }

    </div>
  `
})
export class TechHubsComponent {
  data = input<any>(null);
  isLoading = input<boolean>(false); // New input for loading state
  
  companies = computed(() => this.data()?.topCompanies || []);
  
  topCities = computed(() => this.data()?.topCities || []);
  topStates = computed(() => this.data()?.topStates || []);

  globalTitans = computed(() => this.companies().filter((c: any) => c.category?.includes('Global') || c.category?.includes('MNC')));
  nationalLeaders = computed(() => this.companies().filter((c: any) => c.category?.includes('National') || c.category?.includes('Domestic')));
  startups = computed(() => this.companies().filter((c: any) => c.category?.includes('Startup') || c.category?.includes('Growth')));
}