
import React, { useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Memory } from '../types';
import { ACTIVITY_COLORS } from '../constants';

interface GlobeViewProps {
  memories: Memory[];
  focusedMemory: Memory | null; 
  onFocusMemory: (memory: Memory) => void; 
  onExpandMemory: (memory: Memory) => void; 
  onReset: () => void;
  showFootprints: boolean;
  playbackIndex?: number;
}

export interface GlobeRef {
  zoomTo: (lat: number, lng: number) => Promise<void>;
  resetView: () => Promise<void>;
}

const GlobeView = forwardRef<GlobeRef, GlobeViewProps>(({ 
  memories, 
  focusedMemory, 
  onFocusMemory, 
  onExpandMemory, 
  onReset, 
  showFootprints, 
  playbackIndex = -1 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const projectionRef = useRef(d3.geoOrthographic().precision(0.1));
  const rotationRef = useRef<[number, number, number]>([-110, -20, 0]);
  const scaleRef = useRef<number>(0);
  const landDataRef = useRef<any>(null);
  const isZoomingRef = useRef(false);

  const BASE_SCALE_DIV = window.innerWidth < 768 ? 2.2 : 2.8; 
  const FOCUS_SCALE_DIV = window.innerWidth < 768 ? 0.6 : 0.8;

  const sortedMemories = useMemo(() => 
    [...memories].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.id.localeCompare(b.id);
    }),
  [memories]);

  const cardPosition = useMemo(() => {
    if (!focusedMemory || isZoomingRef.current || !containerRef.current) return null;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const projection = d3.geoOrthographic()
      .scale(scaleRef.current)
      .translate([width / 2, height / 2])
      .rotate(rotationRef.current);
    const coords = projection([focusedMemory.location.lng, focusedMemory.location.lat]);
    const centerPos: [number, number] = [-rotationRef.current[0], -rotationRef.current[1]];
    const dist = d3.geoDistance([focusedMemory.location.lng, focusedMemory.location.lat], centerPos);
    if (coords && dist < 1.5) return { x: coords[0], y: coords[1] };
    return null;
  }, [focusedMemory, memories, playbackIndex, scaleRef.current, rotationRef.current]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const projection = projectionRef.current
      .scale(scaleRef.current)
      .translate([width / 2, height / 2])
      .rotate(rotationRef.current);
    const path = d3.geoPath(projection, context);
    context.clearRect(0, 0, width, height);

    context.beginPath();
    path(d3.geoGraticule()());
    context.strokeStyle = "rgba(0, 255, 255, 0.08)";
    context.lineWidth = 0.5;
    context.stroke();

    context.beginPath();
    path({ type: "Sphere" });
    const grad = context.createRadialGradient(width/2, height/2, scaleRef.current * 0.8, width/2, height/2, scaleRef.current);
    grad.addColorStop(0, "rgba(0, 255, 255, 0)");
    grad.addColorStop(1, "rgba(0, 255, 255, 0.03)");
    context.fillStyle = grad;
    context.fill();
    context.strokeStyle = "rgba(0, 255, 255, 0.2)";
    context.lineWidth = 1;
    context.stroke();

    if (landDataRef.current) {
      context.beginPath();
      path(landDataRef.current);
      context.fillStyle = "rgba(0, 255, 255, 0.02)";
      context.fill();
      context.strokeStyle = "rgba(255, 0, 255, 0.2)";
      context.lineWidth = 1;
      context.stroke();
    }

    if (showFootprints && sortedMemories.length > 1) {
      const visibleSet = playbackIndex === -1 ? sortedMemories : sortedMemories.slice(0, playbackIndex + 1);
      if (visibleSet.length > 1) {
        context.beginPath();
        const lineData: any = {
          type: "LineString",
          coordinates: visibleSet.map(m => [m.location.lng, m.location.lat])
        };
        path(lineData);
        context.shadowBlur = 10;
        context.shadowColor = "#00ffff";
        context.strokeStyle = "rgba(0, 255, 255, 0.5)";
        context.lineWidth = 1.5;
        context.setLineDash([5, 5]);
        context.stroke();
        context.setLineDash([]);
        context.shadowBlur = 0;
      }
    }
    updateMarkers();
  };

  const updateMarkers = () => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const projection = projectionRef.current
      .scale(scaleRef.current)
      .translate([width / 2, height / 2])
      .rotate(rotationRef.current);
    const visibleSet = playbackIndex === -1 ? sortedMemories : sortedMemories.slice(0, playbackIndex + 1);
    const markerGroups = svg.selectAll<SVGGElement, Memory>(".marker-group")
      .data(visibleSet, d => d.id);
    markerGroups.exit().remove();
    const enter = markerGroups.enter()
      .append("g")
      .attr("class", "marker-group cursor-pointer")
      .on("click", (e, d) => {
        if (playbackIndex !== -1) return; 
        e.stopPropagation();
        onFocusMemory(d);
      });
    
    enter.append("rect").attr("class", "outer-box");
    enter.append("circle").attr("class", "inner-dot");

    const allMarkers = enter.merge(markerGroups);
    allMarkers.each(function(d) {
      const coords = projection([d.location.lng, d.location.lat]);
      const centerPos: [number, number] = [-rotationRef.current[0], -rotationRef.current[1]];
      const dist = d3.geoDistance([d.location.lng, d.location.lat], centerPos);
      const isVisible = dist < 1.57;
      const g = d3.select(this);
      
      if (!coords || !isVisible) {
        g.style("display", "none");
      } else {
        const isFocused = focusedMemory?.id === d.id;
        const size = isFocused ? 24 : 12;
        g.style("display", "block").attr("transform", `translate(${coords[0]},${coords[1]})`);
        
        g.select(".outer-box")
          .attr("x", -size/2)
          .attr("y", -size/2)
          .attr("width", size)
          .attr("height", size)
          .attr("stroke", ACTIVITY_COLORS[d.activityType])
          .attr("stroke-width", isFocused ? 3 : 1)
          .attr("fill", "transparent")
          .attr("opacity", isFocused ? 1 : 0.4)
          .attr("transform", isFocused ? `rotate(45)` : `rotate(0)`)
          .style("transition", "all 0.5s ease");
          
        g.select(".inner-dot")
          .attr("r", 3)
          .attr("fill", ACTIVITY_COLORS[d.activityType])
          .attr("opacity", isFocused ? 1 : 0.8);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    zoomTo: async (lat: number, lng: number) => {
      isZoomingRef.current = true;
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;
      const targetScale = Math.min(width, height) / FOCUS_SCALE_DIV;
      const startScale = scaleRef.current;
      const startRotation = rotationRef.current;
      const endRotation: [number, number, number] = [-lng, -lat, 0];
      return new Promise<void>((resolve) => {
        d3.transition()
          .duration(1800)
          .ease(d3.easeExpInOut)
          .tween("zoom", () => {
            const iR = d3.interpolate(startRotation, endRotation);
            const iS = d3.interpolate(startScale, targetScale);
            return (t) => {
              rotationRef.current = iR(t) as [number, number, number];
              scaleRef.current = iS(t);
              draw();
            };
          })
          .on("end", () => {
            rotationRef.current = endRotation;
            scaleRef.current = targetScale;
            isZoomingRef.current = false;
            draw(); 
            resolve();
          });
      });
    },
    resetView: async () => {
      isZoomingRef.current = true;
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;
      const targetScale = Math.min(width, height) / BASE_SCALE_DIV;
      const startScale = scaleRef.current;
      const startRotation = rotationRef.current;
      const endRotation: [number, number, number] = [-110, -20, 0];
      return new Promise<void>((resolve) => {
        d3.transition()
          .duration(1200)
          .ease(d3.easeCubicOut)
          .tween("reset", () => {
            const iS = d3.interpolate(startScale, targetScale);
            const iR = d3.interpolate(startRotation, endRotation);
            return (t) => {
              scaleRef.current = iS(t);
              rotationRef.current = iR(t) as [number, number, number];
              draw();
            };
          })
          .on("end", () => {
            rotationRef.current = endRotation;
            scaleRef.current = targetScale;
            isZoomingRef.current = false;
            draw();
            resolve();
          });
      });
    }
  }));

  useEffect(() => {
    if (!landDataRef.current) {
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((data: any) => {
        if ((window as any).topojson) {
          landDataRef.current = (window as any).topojson.feature(data, data.objects.countries);
          draw();
        }
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      canvasRef.current.width = width * window.devicePixelRatio;
      canvasRef.current.height = height * window.devicePixelRatio;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
      const context = canvasRef.current.getContext('2d');
      context?.scale(window.devicePixelRatio, window.devicePixelRatio);
      if (scaleRef.current === 0) scaleRef.current = Math.min(width, height) / BASE_SCALE_DIV;
      draw();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    handleResize(); 
    return () => resizeObserver.disconnect();
  }, [memories, playbackIndex, focusedMemory]);

  useEffect(() => { draw(); }, [playbackIndex, focusedMemory, scaleRef.current, rotationRef.current]);

  const showCard = !!(focusedMemory && cardPosition);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#050505] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80" />
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" onClick={onReset} />
      
      <div 
        className={`absolute z-[60] -translate-x-1/2 -translate-y-[110%] pointer-events-none transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${showCard ? 'opacity-100 translate-y-[-110%] scale-100' : 'opacity-0 translate-y-[-100%] scale-90'}`}
        style={{ left: cardPosition?.x || 0, top: cardPosition?.y || 0 }}
      >
        {focusedMemory && (
          <div className="flex flex-col items-center">
            <div 
              onClick={(e) => { e.stopPropagation(); onExpandMemory(focusedMemory); }}
              className="glass-panel p-4 md:p-6 border-cyan-500/40 shadow-[0_0_60px_rgba(0,255,255,0.3)] flex items-center gap-6 w-[80vw] md:w-auto md:min-w-[400px] md:max-w-[550px] pointer-events-auto cursor-pointer transition-all active:scale-95 group overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 94% 0, 100% 15%, 100% 100%, 6% 100%, 0 85%)' }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-zinc-900 border border-cyan-500/20 relative overflow-hidden rounded-sm">
                <img src={focusedMemory.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="" />
                <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>
              </div>
              <div className="flex flex-col pr-4 overflow-hidden">
                <p className="text-[8px] md:text-[10px] font-cyber text-pink-500 tracking-[0.4em] mb-2">{focusedMemory.date.replace(/-/g, '/')}</p>
                <h3 className="text-lg md:text-2xl font-cyber italic text-cyan-400 leading-tight truncate uppercase tracking-tight group-hover:text-white transition-colors">{focusedMemory.title}</h3>
                <div className="flex items-center mt-3 gap-2">
                  <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
                  <p className="text-[10px] md:text-[12px] text-zinc-500 truncate font-bold uppercase tracking-widest">
                    {focusedMemory.location.name}
                  </p>
                </div>
                <p className="mt-3 text-[10px] text-zinc-400 line-clamp-1 font-medium">{focusedMemory.description}</p>
              </div>
            </div>
            <div className="w-[2px] h-12 bg-gradient-to-b from-cyan-400 to-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
});

export default GlobeView;
