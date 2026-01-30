
<<<<<<< HEAD
import React, { useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Memory } from '../types';
import { ACTIVITY_COLORS } from '../constants';
=======
import React, { useEffect, useRef, useImperativeHandle, forwardRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Memory } from './types';
import { ACTIVITY_COLORS } from './constants';
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152

interface GlobeViewProps {
  memories: Memory[];
  focusedMemory: Memory | null; 
  onFocusMemory: (memory: Memory) => void; 
  onExpandMemory: (memory: Memory) => void; 
  onReset: () => void;
<<<<<<< HEAD
  showFootprints: boolean;
  playbackIndex?: number;
}

export interface GlobeRef {
  zoomTo: (lat: number, lng: number) => Promise<void>;
  resetView: () => Promise<void>;
=======
  showAllPaths: boolean; 
  playbackIndex?: number; // Optional prop for playback history
  lang: 'en' | 'zh';
}

export interface GlobeRef {
  zoomToMemory: (lat: number, lng: number) => Promise<void>;
  resetView: () => Promise<void>;
  showCurrentPointCard: () => void;
  hideCurrentPointCard: () => void;
  animatePath: (startLng: number, startLat: number, endLng: number, endLat: number) => Promise<void>;
  resetPlaybackState: () => void;
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
}

const GlobeView = forwardRef<GlobeRef, GlobeViewProps>(({ 
  memories, 
  focusedMemory, 
  onFocusMemory, 
  onExpandMemory, 
  onReset, 
<<<<<<< HEAD
  showFootprints, 
  playbackIndex = -1 
=======
  showAllPaths, 
  playbackIndex = -1,
  lang
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
<<<<<<< HEAD
  
  const projectionRef = useRef(d3.geoOrthographic().precision(0.1));
  const rotationRef = useRef<[number, number, number]>([-110, -20, 0]);
  const scaleRef = useRef<number>(0);
  const landDataRef = useRef<any>(null);
  const isZoomingRef = useRef(false);

  const BASE_SCALE_DIV = window.innerWidth < 768 ? 2.2 : 2.8; 
  const FOCUS_SCALE_DIV = window.innerWidth < 768 ? 0.6 : 0.8;

=======
  const [animProgress, setAnimProgress] = useState(0); 

  const rotationRef = useRef<[number, number, number]>([-110, -20, 0]);
  const scaleRef = useRef<number>(0);
  const landDataRef = useRef<any>(null);
  const isInteractingRef = useRef(false);
  
  // Path animation states
  const pathAnimProgressRef = useRef(1); 
  const pathAnimationSegmentRef = useRef<{ start: [number, number], end: [number, number] } | null>(null);

  // Refs to hold latest props for the animation loop to avoid stale closures
  const showAllPathsRef = useRef(showAllPaths);
  const focusedMemoryRef = useRef(focusedMemory);
  const sortedMemoriesRef = useRef<Memory[]>([]);
  const playbackIndexRef = useRef(playbackIndex);

  // Reduce star size for a more subtle, deep space effect
  const starsRef = useRef(Array.from({ length: 800 }, () => ({ 
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 0.7 + 0.2, // Reduced from 1.5 + 0.5 to 0.7 + 0.2
    opacity: Math.random() * 0.5 + 0.5, 
    phase: Math.random() * Math.PI * 2 
  })));

  const isMobile = window.innerWidth < 768;
  const BASE_SCALE_DIV = isMobile ? 2.5 : 2.8; 
  const FOCUS_SCALE_DIV = isMobile ? 0.7 : 0.8;

  // Sync sorting logic EXACTLY with App.tsx to ensure index alignment
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
  const sortedMemories = useMemo(() => 
    [...memories].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.id.localeCompare(b.id);
    }),
  [memories]);

<<<<<<< HEAD
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
=======
  // Keep refs in sync with props/memos
  useEffect(() => { showAllPathsRef.current = showAllPaths; }, [showAllPaths]);
  useEffect(() => { focusedMemoryRef.current = focusedMemory; }, [focusedMemory]);
  useEffect(() => { sortedMemoriesRef.current = sortedMemories; }, [sortedMemories]);
  useEffect(() => { playbackIndexRef.current = playbackIndex; }, [playbackIndex]);

  const getProjection = (w: number, h: number) => {
    return d3.geoOrthographic()
      .scale(scaleRef.current)
      .translate([w / 2, h / 2])
      .rotate(rotationRef.current)
      .clipAngle(90)
      .precision(0.1);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      requestAnimationFrame(draw); 
      return; 
    }
    const context = canvas.getContext('2d');
    if (!context) {
      requestAnimationFrame(draw); 
      return;
    }
    
    // Use refs inside the loop to get latest values
    const _showAllPaths = showAllPathsRef.current;
    const _focusedMemory = focusedMemoryRef.current;
    const _sortedMemories = sortedMemoriesRef.current;
    const _playbackIndex = playbackIndexRef.current;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    
    if (scaleRef.current === 0) scaleRef.current = Math.min(width, height) / BASE_SCALE_DIV;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    const projection = getProjection(width, height);
    const path = d3.geoPath(projection, context);
    
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(dpr, dpr);

    // 1. Stars
    context.fillStyle = "white"; 
    starsRef.current.forEach(star => {
      context.beginPath();
      context.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
      context.globalAlpha = star.opacity * (0.5 + 0.5 * Math.sin(performance.now() * 0.005 + star.phase)); 
      context.fill();
    });
    context.globalAlpha = 1; 

    const bounds = path.bounds({ type: "Sphere" });
    const globeCenterX = (bounds[0][0] + bounds[1][0]) / 2;
    const globeCenterY = (bounds[0][1] + bounds[1][1]) / 2;
    const globeRadius = (bounds[1][0] - bounds[0][0]) / 2;

    // 1.5. Atmosphere (Brightened)
    context.save();
    context.beginPath();
    context.arc(globeCenterX, globeCenterY, globeRadius * 1.05, 0, Math.PI * 2);
    context.clip(); 

    const atmosphereGrad = context.createRadialGradient(
        globeCenterX, globeCenterY, globeRadius * 0.9, 
        globeCenterX, globeCenterY, globeRadius * 1.05 
    );
    atmosphereGrad.addColorStop(0, "rgba(0, 255, 255, 0)"); 
    atmosphereGrad.addColorStop(0.6, "rgba(0, 255, 255, 0.1)"); 
    atmosphereGrad.addColorStop(1, "rgba(255, 0, 255, 0.2)"); 
    
    context.fillStyle = atmosphereGrad;
    context.filter = `blur(${globeRadius * 0.02}px)`;
    context.fill();
    context.filter = 'none'; 
    context.restore(); 

    // 2. Globe Body (Brightened)
    context.beginPath();
    path({ type: "Sphere" });
    const globeGrad = context.createRadialGradient(width/2 - scaleRef.current * 0.2, height/2 - scaleRef.current * 0.2, 0, width/2, height/2, scaleRef.current);
    globeGrad.addColorStop(0, "#1a1a1a"); 
    globeGrad.addColorStop(1, "#050505"); 
    context.fillStyle = globeGrad;
    context.fill();
    
    // Grid/Stroke (Brightened)
    context.strokeStyle = "rgba(255, 255, 255, 0.12)"; 
    context.lineWidth = 1; 
    context.shadowBlur = 0; 
    context.stroke();

    // 3. Land (Significantly Brightened)
    if (landDataRef.current) {
      context.beginPath();
      path(landDataRef.current);
      context.fillStyle = "rgba(255, 255, 255, 0.04)"; 
      context.fill();
      
      context.strokeStyle = "rgba(255, 255, 255, 0.15)"; 
      context.lineWidth = 0.5; 
      context.shadowBlur = 0; 
      context.stroke();
    }

    // 4. Paths

    // 4a. Traveled/History Paths (During Playback)
    if (_playbackIndex > 0) {
       const limit = Math.min(_playbackIndex, _sortedMemories.length - 1);
       for (let i = 0; i < limit; i++) {
         const start = _sortedMemories[i];
         const end = _sortedMemories[i+1];
         if (start && end) {
             const p1: [number, number] = [start.location.lng, start.location.lat];
             const p2: [number, number] = [end.location.lng, end.location.lat];
             
             context.beginPath();
             path({ type: "LineString", coordinates: [p1, p2] });
             context.strokeStyle = "rgba(255, 255, 255, 0.5)"; 
             context.lineWidth = 1.5; 
             context.setLineDash([]); 
             context.stroke();
         }
       }
    }

    // 4b. Active Animating Segment
    if (pathAnimationSegmentRef.current && pathAnimProgressRef.current < 1) {
      const segment = pathAnimationSegmentRef.current;
      const interpolator = d3.geoInterpolate(segment.start, segment.end);
      const currentEnd = interpolator(pathAnimProgressRef.current);
      const currentSegment = { type: "LineString", coordinates: [segment.start, currentEnd] };
      
      context.beginPath();
      path(currentSegment);
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2; 
      context.setLineDash([4, 4]); 
      context.stroke();
      context.setLineDash([]); 
    }
    
    // 4c. All Paths (Exploration Mode)
    else if (_showAllPaths && !_focusedMemory && !pathAnimationSegmentRef.current && _sortedMemories.length > 1 && _playbackIndex === -1) { 
       for (let i = 0; i < _sortedMemories.length - 1; i++) {
         const start = _sortedMemories[i];
         const end = _sortedMemories[i+1];
         const p1: [number, number] = [start.location.lng, start.location.lat];
         const p2: [number, number] = [end.location.lng, end.location.lat];
         
         context.beginPath();
         path({ type: "LineString", coordinates: [p1, p2] });
         context.strokeStyle = "rgba(255, 255, 255, 0.3)";
         context.lineWidth = 1; 
         context.setLineDash([3, 3]); 
         context.stroke();
         context.setLineDash([]); 
       }
    }

    context.restore();
    updateMarkers(projection, _showAllPaths, _focusedMemory, _sortedMemories, _playbackIndex);

    requestAnimationFrame(draw);
  };

  const updateMarkers = (
    projection: d3.GeoProjection, 
    _showAllPaths: boolean, 
    _focusedMemory: Memory | null, 
    _sortedMemories: Memory[],
    _playbackIndex: number
  ) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    
    // Determine which memories to show
    let visibleMemories: Memory[] = [];

    if (_playbackIndex > -1) {
        visibleMemories = _sortedMemories.slice(0, _playbackIndex + 1);
    } else if (_focusedMemory) {
        visibleMemories = [_focusedMemory];
    } else if (_showAllPaths && !pathAnimationSegmentRef.current) {
        visibleMemories = _sortedMemories;
    }
    
    const markerGroups = svg.selectAll<SVGGElement, Memory>(".marker-group")
      .data(visibleMemories, d => d.id);
    
    markerGroups.exit().remove();
    
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
    const enter = markerGroups.enter()
      .append("g")
      .attr("class", "marker-group cursor-pointer")
      .on("click", (e, d) => {
<<<<<<< HEAD
        if (playbackIndex !== -1) return; 
=======
        if (isInteractingRef.current || focusedMemoryRef.current || pathAnimationSegmentRef.current) return; 
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
        e.stopPropagation();
        onFocusMemory(d);
      });
    
<<<<<<< HEAD
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
=======
    enter.append("path")
      .attr("class", "diamond-node")
      .attr("d", "M 0 -6 L 6 0 L 0 6 L -6 0 Z");
      
    enter.append("path")
      .attr("class", "diamond-outline")
      .attr("d", "M 0 -10 L 10 0 L 0 10 L -10 0 Z")
      .attr("fill", "none")
      .attr("stroke-width", 1);

    const allMarkers = enter.merge(markerGroups);
    const centerPos: [number, number] = [-rotationRef.current[0], -rotationRef.current[1]];

    allMarkers.each(function(d) {
      const dist = d3.geoDistance([d.location.lng, d.location.lat], centerPos);
      const isVisibleOnSphere = dist < 1.57; 
      const g = d3.select(this);
      const coords = projection([d.location.lng, d.location.lat]);
      
      if (!coords || !isVisibleOnSphere) {
        g.style("display", "none");
      } else {
        const isCurrentlyFocused = _focusedMemory?.id === d.id;
        const color = ACTIVITY_COLORS[d.activityType];
        
        g.style("display", "block").attr("transform", `translate(${coords[0]},${coords[1]})`);
        
        g.select(".diamond-node")
          .attr("fill", color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5);

        g.select(".diamond-outline")
          .attr("stroke", color)
          .attr("opacity", isCurrentlyFocused ? 1 : 0.6) 
          .style("transform-origin", "0 0") 
          .style("transform", isCurrentlyFocused ? "scale(1.2)" : "scale(1)")
          .style("transition", "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)");
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
      }
    });
  };

  useImperativeHandle(ref, () => ({
<<<<<<< HEAD
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
=======
    zoomToMemory: async (lat: number, lng: number) => {
      const container = containerRef.current;
      if (!container) return;
      const targetScale = Math.min(container.clientWidth, container.clientHeight) / FOCUS_SCALE_DIV;
      const startScale = scaleRef.current;
      
      const startLng = -rotationRef.current[0];
      const startLat = -rotationRef.current[1];
      
      const interpolateRotation = d3.geoInterpolate([startLng, startLat], [lng, lat]);
      const interpolateScale = d3.interpolate(startScale, targetScale);

      return new Promise<void>((resolve) => {
        d3.select(container)
          .transition()
          .duration(1200)
          .ease(d3.easeCubicInOut)
          .tween("zoom", () => {
            return (t) => {
              const [geoLng, geoLat] = interpolateRotation(t);
              rotationRef.current = [-geoLng, -geoLat, 0];
              scaleRef.current = interpolateScale(t);
            };
          })
          .on("end", () => resolve());
      });
    },
    resetView: async () => {
      const container = containerRef.current;
      if (!container) return;
      const targetScale = Math.min(container.clientWidth, container.clientHeight) / BASE_SCALE_DIV;
      const startScale = scaleRef.current;

      const startLng = -rotationRef.current[0];
      const startLat = -rotationRef.current[1];
      const targetLng = 110;
      const targetLat = 20;

      const interpolateRotation = d3.geoInterpolate([startLng, startLat], [targetLng, targetLat]);
      const interpolateScale = d3.interpolate(startScale, targetScale);

      return new Promise<void>((resolve) => {
        d3.select(container)
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .tween("reset", () => {
            return (t) => {
              scaleRef.current = interpolateScale(t);
              const [geoLng, geoLat] = interpolateRotation(t);
              rotationRef.current = [-geoLng, -geoLat, 0];
            };
          })
          .on("end", () => resolve());
      });
    },
    showCurrentPointCard: () => {
      setAnimProgress(1);
    },
    hideCurrentPointCard: () => {
      setAnimProgress(0); 
    },
    animatePath: async (startLng: number, startLat: number, endLng: number, endLat: number) => {
      const container = containerRef.current;
      if (!container) return;
      
      pathAnimationSegmentRef.current = { start: [startLng, startLat], end: [endLng, endLat] };
      pathAnimProgressRef.current = 0; 

      const coordInterpolator = d3.geoInterpolate([startLng, startLat], [endLng, endLat]);

      return new Promise<void>((resolve) => {
        d3.select(container)
          .transition()
          .duration(2000) 
          .ease(d3.easeLinear)
          .tween("pathAnimation", () => {
            return (t) => {
              pathAnimProgressRef.current = t;
              // Sync camera with path head
              const [lng, lat] = coordInterpolator(t);
              rotationRef.current = [-lng, -lat, 0];
            };
          })
          .on("end", () => {
            pathAnimProgressRef.current = 1; 
            pathAnimationSegmentRef.current = null; 
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
            resolve();
          });
      });
    },
<<<<<<< HEAD
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
=======
    resetPlaybackState: () => {
      setAnimProgress(0); 
      pathAnimProgressRef.current = 1; 
      pathAnimationSegmentRef.current = null; 
      // Cancel any ongoing transitions
      if (containerRef.current) {
        d3.select(containerRef.current).interrupt();
      }
    }
  }));

  // Initial load and resize handling
  useEffect(() => {
    let animationFrameId: number;

    const startDrawLoop = () => {
      animationFrameId = requestAnimationFrame(draw);
    };

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((data: any) => {
      landDataRef.current = (window as any).topojson.feature(data, data.objects.countries);
      startDrawLoop(); 
    });

    const resizeObserver = new ResizeObserver(() => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      startDrawLoop();
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []); 

  // Drag functionality for the globe (outside of playback)
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const drag = d3.drag<SVGSVGElement, unknown>()
      .on("start", () => { isInteractingRef.current = true; })
      .on("drag", (event) => {
        // Check refs to ensure drag logic uses latest state
        if (!focusedMemoryRef.current && !pathAnimationSegmentRef.current) { 
          const rotate = rotationRef.current;
          const k = 75 / scaleRef.current; 
          rotationRef.current = [rotate[0] + event.dx * k, rotate[1] - event.dy * k, rotate[2]];
        }
      })
      .on("end", () => { setTimeout(() => { isInteractingRef.current = false; }, 50); });
    
    if (focusedMemory || pathAnimationSegmentRef.current) {
        svg.on(".drag", null); 
    } else {
        svg.call(drag as any); 
    }

  }, [memories, focusedMemory, pathAnimationSegmentRef.current]); 

  const renderPopup = () => {
    if (!focusedMemory || animProgress !== 1 || !containerRef.current) return null;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const projection = getProjection(width, height);
    const coords = projection([focusedMemory.location.lng, focusedMemory.location.lat]);

    if (!coords) return null; 

    return (
      <div 
        className="absolute z-[100] pointer-events-none animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-400"
        style={{ 
          left: coords[0], 
          top: coords[1], 
          transform: 'translate(-50%, -110%)' 
        }}
      >
        <div className="glass-panel p-2 rounded-xl border border-white/20 flex flex-col items-center gap-2 shadow-[0_15px_50px_rgba(0,0,0,0.8)] bg-black/90">
          <div className="relative w-32 h-32 overflow-hidden rounded-lg border border-white/10">
             <img src={focusedMemory.images[0]} className="w-full h-full object-cover" alt={focusedMemory.title} />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          <div className="text-center px-1 pb-1">
            <p className="text-[10px] font-cyber text-white font-black uppercase tracking-widest truncate max-w-[150px] mb-2 italic">
              {focusedMemory.title}
            </p>
            <button 
              className="px-4 py-1.5 bg-white text-black text-[9px] font-cyber font-black uppercase tracking-widest pointer-events-auto hover:bg-cyan-400 transition-all shadow-lg"
              onClick={() => onExpandMemory(focusedMemory)}
              style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
            >
              {lang === 'zh' ? '查看详情' : 'DETAILS'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#050505] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-auto touch-none" onClick={(e) => { 
        if (e.target === svgRef.current && !focusedMemory && !pathAnimationSegmentRef.current) onReset(); 
      }} />
      {renderPopup()} 
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
    </div>
  );
});

<<<<<<< HEAD
export default GlobeView;
=======
GlobeView.displayName = 'GlobeView';
export default GlobeView;
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
