import { Component, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../services/gemini.service';

@Component({
  selector: 'app-interview-prep',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Questions Column -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Strategic Questions
          </h2>
          <button 
            (click)="generateQuestions()" 
            [disabled]="isLoading()"
            class="bg-white text-black hover:bg-zinc-200 border border-transparent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50">
            {{ questions().length ? 'Refresh' : 'Load Questions' }}
          </button>
        </div>

        @if (isLoading()) {
          <div class="p-12 text-center text-zinc-500">
            <div class="flex flex-col items-center gap-3">
               <div class="flex gap-1">
                 <span class="w-2 h-2 rounded-full bg-violet-500 animate-[bounce_1s_infinite_0ms]"></span>
                 <span class="w-2 h-2 rounded-full bg-violet-500 animate-[bounce_1s_infinite_200ms]"></span>
                 <span class="w-2 h-2 rounded-full bg-violet-500 animate-[bounce_1s_infinite_400ms]"></span>
               </div>
               <p class="text-sm font-medium text-violet-400">Thinking deeply...</p>
               <p class="text-xs text-zinc-600">Generating 15 strategic scenarios</p>
            </div>
          </div>
        } @else if (questions().length === 0) {
           <div class="p-8 text-center border border-dashed border-zinc-800 rounded-xl bg-black/20">
             <p class="text-zinc-400 text-sm">Tap 'Load Questions' to generate AI-curated challenges for {{ role() }}.</p>
           </div>
        } @else {
          <!-- Scrollable Question List -->
          <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            @for (q of questions(); track $index) {
              <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden group">
                <div class="p-5 cursor-pointer hover:bg-zinc-800/50 transition-colors" (click)="toggleAnswer($index)">
                  <div class="flex gap-4">
                    <span class="flex-shrink-0 w-6 h-6 rounded bg-black flex items-center justify-center text-xs font-bold text-violet-400 border border-zinc-700">
                      Q{{ $index + 1 }}
                    </span>
                    <div class="flex-1">
                      <h3 class="text-zinc-200 font-medium leading-snug">{{ q.question }}</h3>
                      <div class="mt-2 flex gap-2">
                        <span class="text-[10px] px-2 py-0.5 rounded bg-black text-zinc-400 border border-zinc-800 uppercase tracking-wide">{{ q.type }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                @if (openIndex() === $index) {
                  <div class="px-5 pb-5 pt-2 bg-black/20 border-t border-zinc-800/50">
                    <p class="text-xs text-violet-400 font-bold mb-2 uppercase">Target Response</p>
                    <p class="text-zinc-400 text-sm leading-relaxed">{{ q.answer }}</p>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Hot Topics Column (Heatmap) -->
      @if (hotTopics() && hotTopics().length) {
        <div class="lg:col-span-1">
          <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 sticky top-24">
            <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              High Probability Topics
            </h3>
            
            <div class="space-y-5">
              @for (topic of hotTopics(); track $index) {
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-zinc-300 font-medium">{{ topic.topic }}</span>
                    <span class="text-zinc-500 text-xs">{{ topic.probability }}% Freq</span>
                  </div>
                  <div class="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                    <div class="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full" [style.width.%]="topic.probability"></div>
                  </div>
                </div>
              }
            </div>

            <div class="mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-500 leading-relaxed">
              * Based on analysis of recent interview experiences and job descriptions for this role level.
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class InterviewPrepComponent {
  role = input.required<string>();
  hotTopics = input<any[]>([]); 
  
  questions = signal<any[]>([]);
  isLoading = signal(false);
  openIndex = signal<number | null>(null);

  private geminiService = inject(GeminiService);

  toggleAnswer(index: number) {
    this.openIndex.update(current => current === index ? null : index);
  }

  async generateQuestions() {
    this.isLoading.set(true);
    try {
      const data = await this.geminiService.generateInterviewQuestions(this.role());
      this.questions.set(data);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}