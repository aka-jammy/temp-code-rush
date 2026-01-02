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
        
        <!-- Controls -->
        <div class="flex gap-2 self-start sm:self-auto">
          <!-- Type Toggle -->
          <div class="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
             <button (click)="setChartType('Bar')" class="px-2 py-1.5 rounded transition-all text-zinc-400 hover:text-white" [class.bg-white]="chartType() === 'Bar'" [class.text-black]="chartType() === 'Bar'" [class.hover:text-black]="chartType() === 'Bar'">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
             <button (click)="setChartType('Line')" class="px-2 py-1.5 rounded transition-all text-zinc-400 hover:text-white" [class.bg-white]="chartType() === 'Line'" [class.text-black]="chartType() === 'Line'" [class.hover:text-black]="chartType() === 'Line'">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
             </button>
          </div>

          <!-- Frequency Toggle -->
          <div class="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
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
      </div>
      
      <!-- Chart Container Wrapper for Scroll -->
      <div class="relative w-full z-10 overflow-x-auto overflow-y-hidden max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pb-2">
         <div #chartContainer class="w-full min-h-[300px]"></div>
      </div>

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
  chartType = signal<'Bar' | 'Line'>('Bar');
  
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('tooltip') tooltip!: ElementRef;
  
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const chartData = this.data();
      const mode = this.viewMode();
      const type = this.chartType();
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

  setChartType(type: 'Bar' | 'Line') {
    this.chartType.set(type);
  }

  private setupChart() {
    this.renderChart();
  }

  private renderChart() {
    const rawData = this.data();
    const symbol = this.currencySymbol();
    const isMonthly = this.viewMode() === 'Monthly';
    const chartType = this.chartType();

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
    // Default to at least container width or 500px for scrolling
    const containerWidth = rect.width > 0 ? rect.width : 600; 
    
    const margin = { top: 20, right: 60, bottom: 40, left: 100 };
    // If it's scrolling, we can force a min-width
    const width = Math.max(containerWidth, 500) - margin.left - margin.right;
    
    // Set a fixed height or dynamic based on content, but minimal enough for the line chart
    const height = chartType === 'Bar' ? (data.length * 60) : 300; 

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Common Tooltip Logic
    const showTooltip = (event: any, d: any) => {
        const value = d.value;
        const label = d.label;
        tooltip.style.opacity = '1';
        
        const formattedVal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value).replace('$', '');

        tooltip.innerHTML = `
          <div class="font-bold text-violet-300 text-[10px] uppercase tracking-wider mb-1">${label}</div>
          <div class="text-white text-lg font-bold flex items-center gap-1">
             <span class="text-zinc-400 font-normal">${symbol}</span>${formattedVal}
          </div>
          <div class="text-[9px] text-zinc-500 mt-1">${isMonthly ? 'Monthly Est.' : 'Annual Est.'}</div>
        `;
        const [mouseX, mouseY] = d3.pointer(event, element);
        let left = mouseX + margin.left;
        const top = mouseY + margin.top - 20;
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    };

    const hideTooltip = () => {
        tooltip.style.opacity = '0';
    };

    if (chartType === 'Bar') {
        // --- BAR CHART LOGIC ---
        const y = d3.scaleBand().range([0, height]).domain(data.map(d => d.label)).padding(0.4);
        const maxVal = d3.max(data, d => d.value) || 100000;
        const x = d3.scaleLinear().domain([0, maxVal * 1.1]).range([0, width]);

        // Grid
        svg.append('g').attr('class', 'grid').attr('transform', `translate(0,${height})`)
           .call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(() => ''))
           .style('stroke', '#3f3f46').style('stroke-opacity', '0.3').style('stroke-dasharray', '4,4');

        // Gradient
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient').attr('id', 'barGradientHoriz').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#8b5cf6');
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#a78bfa');

        // Y Axis
        const yAxis = svg.append('g').call(d3.axisLeft(y).tickSize(0));
        yAxis.select('.domain').remove();
        yAxis.selectAll('text').style('font-family', 'Inter').style('font-size', '11px').style('font-weight', '600').style('fill', '#a1a1aa').attr('dx', '-10');

        // Bars
        svg.selectAll('mybar').data(data).join('rect')
            .attr('x', x(0)).attr('y', d => y(d.label) || 0).attr('height', y.bandwidth()).attr('width', 0).attr('fill', 'url(#barGradientHoriz)').attr('rx', 4).style('cursor', 'pointer')
            .on('mouseover', function(e, d) { d3.select(this).attr('fill', '#fff'); showTooltip(e, d); })
            .on('mousemove', showTooltip)
            .on('mouseleave', function() { d3.select(this).attr('fill', 'url(#barGradientHoriz)'); hideTooltip(); })
            .transition().duration(1000).ease(d3.easeCubicOut).attr('width', d => x(d.value));

        // Labels
        svg.selectAll('.value-label').data(data).join('text')
          .attr('class', 'value-label').attr('x', d => x(d.value) + 8).attr('y', d => (y(d.label) || 0) + y.bandwidth() / 2).attr('dy', '0.35em')
          .text(d => this.formatLabel(d.value)).style('font-family', 'Inter').style('font-size', '11px').style('font-weight', 'bold').style('fill', '#ffffff')
          .style('opacity', 0).transition().delay(600).duration(400).style('opacity', 1);

    } else {
        // --- LINE CHART LOGIC ---
        const x = d3.scalePoint().range([0, width]).domain(data.map(d => d.label)).padding(0.5);
        const maxVal = d3.max(data, d => d.value) || 100000;
        const y = d3.scaleLinear().domain([0, maxVal * 1.1]).range([height, 0]);

        // Grid (Horizontal)
        svg.append('g').attr('class', 'grid')
           .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(() => ''))
           .style('stroke', '#3f3f46').style('stroke-opacity', '0.3').style('stroke-dasharray', '4,4').select('.domain').remove();

        // X Axis
        svg.append('g').attr('transform', `translate(0,${height})`)
           .call(d3.axisBottom(x)).select('.domain').remove();
        svg.selectAll('.tick text').style('font-family', 'Inter').style('font-size', '11px').style('font-weight', '600').style('fill', '#a1a1aa').attr('dy', '15');

        // Line Path
        const line = d3.line<{label: string, value: number}>()
            .x(d => x(d.label) || 0)
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);

        // Gradient for Stroke
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient').attr('id', 'lineGradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#8b5cf6');
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#ec4899'); // Pink-500

        // Draw Line
        const path = svg.append('path').datum(data)
           .attr('fill', 'none').attr('stroke', 'url(#lineGradient)').attr('stroke-width', 3).attr('d', line);
        
        // Animation
        const totalLength = path.node()?.getTotalLength() || 0;
        path.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition().duration(1500).ease(d3.easeCubicOut).attr("stroke-dashoffset", 0);

        // Area under line (Optional for cool look)
        const area = d3.area<{label: string, value: number}>()
            .x(d => x(d.label) || 0)
            .y0(height)
            .y1(d => y(d.value))
            .curve(d3.curveMonotoneX);
        
        const areaGradient = defs.append('linearGradient').attr('id', 'areaGradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#8b5cf6').attr('stop-opacity', 0.3);
        areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#8b5cf6').attr('stop-opacity', 0);

        svg.append('path').datum(data).attr('fill', 'url(#areaGradient)').attr('d', area).style('opacity', 0)
           .transition().delay(500).duration(1000).style('opacity', 1);

        // Dots
        svg.selectAll('.dot').data(data).join('circle').attr('class', 'dot')
           .attr('cx', d => x(d.label) || 0).attr('cy', d => y(d.value)).attr('r', 6)
           .attr('fill', '#18181b').attr('stroke', '#a78bfa').attr('stroke-width', 2)
           .style('cursor', 'pointer').style('opacity', 0)
           .on('mouseover', function(e, d) { d3.select(this).attr('fill', '#fff').attr('r', 8); showTooltip(e, d); })
           .on('mousemove', showTooltip)
           .on('mouseleave', function() { d3.select(this).attr('fill', '#18181b').attr('r', 6); hideTooltip(); })
           .transition().delay((d, i) => i * 150 + 500).duration(500).style('opacity', 1);
        
        // Value Labels above dots
        svg.selectAll('.val-label').data(data).join('text')
           .attr('x', d => x(d.label) || 0).attr('y', d => y(d.value) - 15).text(d => this.formatLabel(d.value))
           .attr('text-anchor', 'middle').style('font-family', 'Inter').style('font-size', '10px').style('fill', '#fff').style('opacity', 0)
           .transition().delay((d, i) => i * 150 + 600).duration(500).style('opacity', 1);
    }
  }

  private formatLabel(val: number): string {
     if (val >= 10000000) return `${(val/10000000).toFixed(1)}Cr`; 
     if (val >= 1000000) return `${(val/1000000).toFixed(1)}M`;
     if (val >= 1000) return `${(val/1000).toFixed(0)}k`;
     return val.toString();
  }
}