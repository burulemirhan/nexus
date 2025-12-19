import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onDone: () => void;
  minDuration?: number; // Minimum duration in milliseconds
}

// Emerald green color palette
const EMERALD_PRIMARY = '#10b981'; // Emerald-500
const EMERALD_GLOW = '#34d399'; // Emerald-400 for glow
const EMERALD_DARK = '#059669'; // Emerald-600 for subtle variation

interface Branch {
  angle: number;
  length: number;
  maxLength: number;
  curve: number; // Curvature factor
  progress: number;
  dotProgress: number;
  endDotSize: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  nodes: Array<{ x: number; y: number; size: number }>; // Intersection nodes along this branch
}

interface Node {
  x: number;
  y: number;
  size: number;
  connections: number; // Number of branches connecting here
}

const Preloader: React.FC<PreloaderProps> = ({ onDone, minDuration = 2000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const cycleStartTimeRef = useRef<number>(Date.now());
  const [isVisible, setIsVisible] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const reducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check if page is ready
  useEffect(() => {
    const checkPageReady = () => {
      if (document.readyState === 'complete') {
        setPageReady(true);
      } else {
        window.addEventListener('load', () => setPageReady(true), { once: true });
      }
    };
    
    checkPageReady();
  }, []);

  // Deterministic random number generator (seeded)
  const seededRandom = (seed: number) => {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  };

  // Generate complex network of branches in all directions
  const generateBranches = (count: number, seed: number, centerX: number, centerY: number): Branch[] => {
    const random = seededRandom(seed);
    const branches: Branch[] = [];
    
    // Primary branches in many directions
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (random() - 0.5) * 0.5;
      const maxLength = 120 + random() * 140; // 120-260px - varied lengths
      const curve = (random() - 0.5) * 0.6; // More curvature variation
      
      branches.push({
        angle,
        length: 0,
        maxLength,
        curve,
        progress: 0,
        dotProgress: 0,
        endDotSize: 0,
        startX: centerX,
        startY: centerY,
        endX: centerX,
        endY: centerY,
        nodes: [],
      });
    }
    
    return branches;
  };

  // Find intersection points between branches (simplified line-line intersection)
  const findIntersections = (branches: Branch[]): Node[] => {
    const nodes: Map<string, Node> = new Map();
    const threshold = 8; // Distance threshold for considering two points as a node
    
    for (let i = 0; i < branches.length; i++) {
      const branch1 = branches[i];
      if (branch1.progress <= 0) continue;
      
      for (let j = i + 1; j < branches.length; j++) {
        const branch2 = branches[j];
        if (branch2.progress <= 0) continue;
        
        // Check if branches are close enough (simplified - check end points and mid points)
        const dist1 = Math.hypot(branch1.endX - branch2.endX, branch1.endY - branch2.endY);
        const dist2 = Math.hypot(branch1.endX - branch2.startX, branch1.endY - branch2.startY);
        const dist3 = Math.hypot(branch1.startX - branch2.endX, branch1.startY - branch2.endY);
        
        let intersectionX = 0;
        let intersectionY = 0;
        let found = false;
        
        if (dist1 < threshold) {
          intersectionX = (branch1.endX + branch2.endX) / 2;
          intersectionY = (branch1.endY + branch2.endY) / 2;
          found = true;
        } else if (dist2 < threshold && branch2.progress > 0.5) {
          intersectionX = (branch1.endX + branch2.startX) / 2;
          intersectionY = (branch1.endY + branch2.startY) / 2;
          found = true;
        } else if (dist3 < threshold && branch1.progress > 0.5) {
          intersectionX = (branch1.startX + branch2.endX) / 2;
          intersectionY = (branch1.startY + branch2.endY) / 2;
          found = true;
        }
        
        if (found) {
          const key = `${Math.round(intersectionX / 5) * 5},${Math.round(intersectionY / 5) * 5}`;
          if (nodes.has(key)) {
            nodes.get(key)!.connections++;
          } else {
            nodes.set(key, {
              x: intersectionX,
              y: intersectionY,
              size: 2,
              connections: 2,
            });
          }
        }
      }
    }
    
    return Array.from(nodes.values());
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - ensure proper dimensions for mobile
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Set actual canvas size in physical pixels
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Scale context to match device pixel ratio for crisp rendering
      ctx.scale(dpr, dpr);
      
      // Set display size in CSS pixels
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };
    
    resizeCanvas();
    const resizeHandler = () => {
      resizeCanvas();
      // Ensure animation continues after resize
      if (!animationFrameRef.current) {
        cycleStartTimeRef.current = Date.now();
      }
    };
    window.addEventListener('resize', resizeHandler);

    // Reduced motion: simple pulse
    if (reducedMotion.current) {
      const animateReduced = () => {
        const elapsed = Date.now() - cycleStartTimeRef.current;
        const cycleDuration = 2000;
        const t = (elapsed % cycleDuration) / cycleDuration;
        
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        // Clear using logical pixels (ctx is already scaled)
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const pulseSize = 4 + Math.sin(t * Math.PI * 2) * 0.5;
        const opacity = 0.6 + Math.sin(t * Math.PI * 2) * 0.2;
        
        // Central dot with gentle pulse
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = EMERALD_PRIMARY;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        // Halo
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseSize * 3);
        gradient.addColorStop(0, `rgba(16, 185, 129, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        animationFrameRef.current = requestAnimationFrame(animateReduced);
      };
      
      animateReduced();
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener('resize', resizeHandler);
      };
    }

    // Full animation - slower and more complex
    const branchCount = 28; // Many more branches for complex network
    let branches = generateBranches(branchCount, 42, width / 2, height / 2); // Seed: 42
    const cycleDuration = 5000; // 5 seconds per cycle (slower animation)
    const growthPhase = 0.6; // First 60% is growth, rest is fade (slower fade)

    const animate = () => {
      const elapsed = Date.now() - cycleStartTimeRef.current;
      const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
      const isGrowing = cycleProgress < growthPhase;
      const phaseProgress = isGrowing 
        ? cycleProgress / growthPhase 
        : (cycleProgress - growthPhase) / (1 - growthPhase);

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Clear using logical pixels (ctx is already scaled)
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      // Easing functions for smooth motion
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easeInOutCubic = (t: number) => t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      if (isGrowing) {
        const easedProgress = easeOutCubic(phaseProgress);
        
        // Update branches and calculate positions
        branches.forEach((branch) => {
          branch.progress = easedProgress;
          branch.length = branch.maxLength * easedProgress;
          
          // Calculate current end position
          const endX = centerX + Math.cos(branch.angle) * branch.length;
          const endY = centerY + Math.sin(branch.angle) * branch.length;
          
          // Apply curvature
          const midX = (centerX + endX) / 2;
          const midY = (centerY + endY) / 2;
          const perpAngle = branch.angle + Math.PI / 2;
          const curveOffset = branch.curve * branch.length * 0.3;
          const curveX = midX + Math.cos(perpAngle) * curveOffset;
          const curveY = midY + Math.sin(perpAngle) * curveOffset;
          
          // Recalculate end position with curve (simplified)
          branch.endX = curveX + (endX - curveX) * 0.8;
          branch.endY = curveY + (endY - curveY) * 0.8;
          branch.startX = centerX;
          branch.startY = centerY;
          
          // Dot appears when branch is 65% grown
          if (easedProgress > 0.65) {
            branch.dotProgress = Math.min(1, (easedProgress - 0.65) / 0.35);
            branch.endDotSize = 2.5 * easeOutCubic(branch.dotProgress);
          }
        });
      } else {
        // Fade phase - keep branch lengths at max, but fade opacity
        branches.forEach((branch) => {
          branch.length = branch.maxLength;
          branch.progress = 1 - easeInOutCubic(phaseProgress);
          branch.dotProgress = branch.progress;
          branch.endDotSize = 3 * branch.dotProgress;
        });
      }

      // Draw branches and dots
      branches.forEach((branch) => {
        if (branch.progress <= 0) return;

        const opacity = isGrowing 
          ? Math.min(1, branch.progress * 1.4)
          : branch.progress;

        if (opacity <= 0) return;

        // Use calculated positions from branch update
        const startX = branch.startX;
        const startY = branch.startY;
        const endX = branch.endX;
        const endY = branch.endY;

        // Calculate curve control point
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const perpAngle = branch.angle + Math.PI / 2;
        const curveOffset = branch.curve * branch.length * 0.3;
        const curveX = midX + Math.cos(perpAngle) * curveOffset;
        const curveY = midY + Math.sin(perpAngle) * curveOffset;

        // Draw curved branch - white arms
        ctx.save();
        ctx.globalAlpha = opacity * 0.9;
        ctx.strokeStyle = '#ffffff'; // White arms
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 3;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.3})`; // Soft white glow

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(curveX, curveY, endX, endY);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.restore();

        // Draw end dot - white (matching the arms)
        if (branch.dotProgress > 0 && branch.endDotSize > 0) {
          ctx.save();
          const dotOpacity = opacity * branch.dotProgress;
          ctx.globalAlpha = dotOpacity;

          // Dot halo - white
          const dotGradient = ctx.createRadialGradient(
            endX, endY, 0,
            endX, endY, branch.endDotSize * 2.5
          );
          dotGradient.addColorStop(0, `rgba(255, 255, 255, ${dotOpacity * 0.4})`);
          dotGradient.addColorStop(0.6, `rgba(255, 255, 255, ${dotOpacity * 0.15})`);
          dotGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = dotGradient;
          ctx.beginPath();
          ctx.arc(endX, endY, branch.endDotSize * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Dot core - white
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(endX, endY, branch.endDotSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      });

      // Draw intersection nodes (where branches connect)
      nodes.forEach((node) => {
        const avgProgress = branches.length > 0 
          ? branches.reduce((sum, b) => sum + b.progress, 0) / branches.length 
          : 0;
        const nodeOpacity = isGrowing ? 1 : Math.max(0.3, avgProgress);
        if (nodeOpacity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = nodeOpacity * 0.8;
        
        // Node halo
        const nodeGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 3
        );
        nodeGradient.addColorStop(0, `rgba(255, 255, 255, ${nodeOpacity * 0.5})`);
        nodeGradient.addColorStop(0.7, `rgba(255, 255, 255, ${nodeOpacity * 0.2})`);
        nodeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core - size based on connections
        const nodeCoreSize = node.size + (node.connections - 2) * 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeCoreSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw central dot (always visible during growth, fades during fade phase)
      const centralDotOpacity = isGrowing ? 1 : Math.max(0.3, 1 - easeInOutCubic(phaseProgress));
      if (centralDotOpacity > 0) {
        ctx.save();
        ctx.globalAlpha = centralDotOpacity;

        // Central dot halo
        const centerGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, 8
        );
        centerGradient.addColorStop(0, `rgba(52, 211, 153, ${centralDotOpacity * 0.5})`);
        centerGradient.addColorStop(0.7, `rgba(16, 185, 129, ${centralDotOpacity * 0.2})`);
        centerGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Central dot core
        ctx.fillStyle = EMERALD_PRIMARY;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      // Reset cycle if we've faded completely - ensure continuous looping
      if (!isGrowing && phaseProgress >= 1) {
        cycleStartTimeRef.current = Date.now();
        branches = generateBranches(branchCount, 42, centerX, centerY);
      }

      // Always continue animation loop - never stop until component unmounts
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  // Check if we should dismiss the preloader
  useEffect(() => {
    const checkDone = () => {
      const elapsed = Date.now() - startTimeRef.current;
      if (pageReady && elapsed >= minDuration) {
        setIsVisible(false);
        // Small delay for fade-out transition
        setTimeout(() => {
          onDone();
        }, 300);
      }
    };

    const interval = setInterval(checkDone, 50); // Check every 50ms
    return () => clearInterval(interval);
  }, [pageReady, minDuration, onDone]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default Preloader;
