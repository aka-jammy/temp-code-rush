import { Component, ElementRef, input, effect, ViewChild, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-salary-chart',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host { display: block; }
  `],
  template: `
    <div class="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-500 flex flex-col w-full">
      <!-- Background Grid Decoration -->
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 relative z-10 flex-shrink-0">
        <div>
          <h3 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Compensation Trajectory
          </h3>
          <p class="text-xs text-zinc-400 mt-1">Estimated market range based on local economic data ({{ currencyCode() }})</p>
        </div>
        
        <!-- Frequency Toggle -->
        <div class="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
          <button 
            (click)="setView('Annual')"
            class="px-4 py-1.5 text-[10px] font-bold rounded-md transition-all duration-300 uppercase tracking-wider"
            [class]="viewMode() === 'Annual' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'">
            Annual
          </button>
          <button 
            (click)="setView('Monthly')"
            class="px-4 py-1.5 text-[10px] font-bold rounded-md transition-all duration-300 uppercase tracking-wider"
            [class]="viewMode() === 'Monthly' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'">
            Monthly
          </button>
        </div>
      </div>
      
      <!-- Chart Container -->
      <div #chartContainer class="w-full relative touch-none z-10"></div>

      <!-- Tooltip (HTML overlay) -->
      <div #tooltip class="absolute pointer-events-none opacity-0 bg-zinc-900/95 text-white text-xs rounded-lg px-4 py-3 shadow-2xl border border-zinc-700 transition-opacity duration-200 z-50 whitespace-nowrap top-0 left-0 backdrop-blur-md bg-opacity-95 transform -translate-x-1/2 -translate-y-full mb-3 pointer-events-none"></div>
    </div>
  `
})
export class SalaryChartComponent implements OnDestroy {
  data = input<{label: string, value: number}[]>([]);
  currencySymbol = input<string>('$');
  currencyCode = input<string>('USD');
  
  viewMode = signal<'Annual' | 'Monthly'>('Annual');
  
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('tooltip') tooltip!: ElementRef;
  
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const chartData = this.data();
      const mode = this.viewMode();
      if (chartData && chartData.length > 0 && this.chartContainer) {
        requestAnimationFrame(() => this.setupChart());
      }
    });
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      requestAnimationFrame(() => {
        this.renderChart();
      });
    });
    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  setView(mode: 'Annual' | 'Monthly') {
    this.viewMode.set(mode);
  }

  private setupChart() {
    this.renderChart();
  }

  private renderChart() {
    const rawData = this.data();
    const symbol = this.currencySymbol();
    const isMonthly = this.viewMode() === 'Monthly';

    if (!rawData || rawData.length === 0 || !this.chartContainer) return;

    // Filter out invalid data
    const validData = rawData.filter(d => d.value > 0);
    if (validData.length === 0) return;

    const data = validData.map(d => ({
      label: d.label,
      value: isMonthly ? d.value / 12 : d.value
    }));

    const element = this.chartContainer.nativeElement;
    const tooltip = this.tooltip.nativeElement;
    
    // Clear previous chart
    d3.select(element).selectAll('*').remove();

    const rect = element.getBoundingClientRect();
    
    // Dimensions
    const barHeight = 60; // Increased height as requested
    const margin = { top: 20, right: 60, bottom: 20, left: 100 };
    // Dynamic height based on number of bars to prevent empty space
    const height = (data.length * barHeight); 
    const width = rect.width - margin.left - margin.right;

    if (width <= 0) return;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Y Axis (Categories) - Band Scale
    const y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(d => d.label))
      .padding(0.4); // Space between bars

    // X Axis (Values) - Linear Scale
    const maxVal = d3.max(data, d => d.value) || 100000;
    const x = d3.scaleLinear()
      .domain([0, maxVal * 1.1]) // Headroom for labels
      .range([0, width]);

    // Grid Lines (Vertical)
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickSize(-height)
        .tickFormat(() => '')
      )
      .style('stroke', '#3f3f46')
      .style('stroke-opacity', '0.3')
      .style('stroke-dasharray', '4,4');

    // Gradient Definition (Horizontal)
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradientHoriz')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#8b5cf6'); // Violet 500
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#a78bfa'); // Violet 400

    // Y Axis Text (Labels)
    const yAxis = svg.append('g')
      .call(d3.axisLeft(y).tickSize(0));
      
    yAxis.select('.domain').remove();
    yAxis.selectAll('text')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', '#a1a1aa') // Zinc-400
      .attr('dx', '-10');

    // Bars (Horizontal)
    svg.selectAll('mybar')
      .data(data)
      .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d.label) || 0)
        .attr('height', y.bandwidth())
        .attr('width', 0) // Start at 0 width for animation
        .attr('fill', 'url(#barGradientHoriz)')
        .attr('rx', 4) // Rounded corners
        .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#fff'); // Highlight White
        tooltip.style.opacity = '1';
        
        const formattedVal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(d.value).replace('$', '');

        tooltip.innerHTML = `
          <div class="font-bold text-violet-300 text-[10px] uppercase tracking-wider mb-1">${d.label}</div>
          <div class="text-white text-lg font-bold flex items-center gap-1">
             <span class="text-zinc-400 font-normal">${symbol}</span>${formattedVal}
          </div>
          <div class="text-[9px] text-zinc-500 mt-1">${isMonthly ? 'Monthly Est.' : 'Annual Est.'}</div>
        `;
      })
      .on('mousemove', function(event) {
        const [mouseX, mouseY] = d3.pointer(event, element);
        let left = mouseX + margin.left;
        const top = mouseY + margin.top - 20;
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      })
      .on('mouseleave', function() {
        d3.select(this).attr('fill', 'url(#barGradientHoriz)');
        tooltip.style.opacity = '0';
      })
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
        .attr('width', d => x(d.value));

    // Value Labels (Right of bars)
    svg.selectAll('.value-label')
      .data(data)
      .join('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.value) + 8)
      .attr('y', d => (y(d.label) || 0) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .text(d => {
         const val = d.value;
         if (val >= 10000000) return `${(val/10000000).toFixed(1)}Cr`; 
         if (val >= 1000000) return `${(val/1000000).toFixed(1)}M`;
         if (val >= 1000) return `${(val/1000).toFixed(0)}k`;
         return val;
      })
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', '#ffffff')
      .style('opacity', 0)
      .transition()
      .delay(600)
      .duration(400)
      .style('opacity', 1);
  }
}
