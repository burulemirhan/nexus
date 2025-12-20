import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onDone: () => void;
  minDuration?: number; // Minimum duration in milliseconds
}

class Branch {
  startX: number;
  startY: number;
  angle: number;
  length: number;
  maxLength: number;
  thickness: number;
  speed: number;
  isFinished: boolean;
  generation: number;
  hasBranched: boolean;

  constructor(x: number, y: number, angle: number, length: number, thickness: number, generation: number) {
    this.startX = x;
    this.startY = y;
    this.angle = angle;
    this.length = 0;
    this.maxLength = length;
    this.thickness = thickness;
    // Slower, more elegant speed
    this.speed = 1.0 + (5 - generation) * 0.2; 
    this.isFinished = false;
    this.generation = generation;
    this.hasBranched = false;
  }

  update() {
    if (this.length < this.maxLength) {
      this.length += this.speed;
      // Clamp length to maxLength
      if (this.length > this.maxLength) this.length = this.maxLength;
      return true;
    } else {
      this.isFinished = true;
      return false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const endX = this.startX + Math.cos(this.angle) * this.length;
    const endY = this.startY + Math.sin(this.angle) * this.length;

    // Draw the line segment
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = Math.max(0.5, this.thickness);
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glowing tip effect while growing
    if (!this.isFinished) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(endX, endY, this.thickness * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      // Strong glow at the tip
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
      
      // Secondary inner glow for extra "tip" brightness
      ctx.beginPath();
      ctx.arc(endX, endY, this.thickness * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.restore();
    }
  }

  createSymmetricalChildren(): Branch[] {
    // Limit to 5 generations for clarity and aesthetics
    if (this.generation >= 5 || this.hasBranched) return [];
    this.hasBranched = true;
    
    const endX = this.startX + Math.cos(this.angle) * this.maxLength;
    const endY = this.startY + Math.sin(this.angle) * this.maxLength;
    
    // Spread angle decreases slightly each generation for a more organic tree-like structure
    const baseSpread = Math.PI / 5; // ~36 degrees
    const spread = baseSpread * (1 - (this.generation * 0.1)); 
    
    const leftAngle = this.angle - spread;
    const rightAngle = this.angle + spread;
    
    // Length also scales down
    const newLen = this.maxLength * 0.8;
    const newThickness = this.thickness * 0.7;

    return [
      new Branch(endX, endY, leftAngle, newLen, newThickness, this.generation + 1),
      new Branch(endX, endY, rightAngle, newLen, newThickness, this.generation + 1)
    ];
  }
}

const Preloader: React.FC<PreloaderProps> = ({ onDone, minDuration = 2000 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const branchesRef = useRef<Branch[]>([]);
  const finishedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const [isVisible, setIsVisible] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // alpha: false for better performance and clear black rendering
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const rootX = window.innerWidth / 2;
    const rootY = window.innerHeight * 0.65; // Start slightly below center
    
    // Initial root branch growing straight up
    const startAngle = -Math.PI / 2;
    const initialBranch = new Branch(rootX, rootY, startAngle, 100, 3, 0);
    branchesRef.current = [initialBranch];

    const animate = () => {
      // Performance: Stop animation if preloader is not visible
      if (!isVisible) {
        return;
      }
      
      frameCountRef.current++;
      
      // Clear with solid black - no transparency to avoid flickering/ghosting
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Starting origin pulse
      const originPulse = Math.sin(frameCountRef.current * 0.04) * 1.5 + 4;
      ctx.beginPath();
      ctx.arc(rootX, rootY, originPulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      let stillGrowing = false;
      const currentBranches = branchesRef.current;
      const newBranchesToAdd: Branch[] = [];

      // Update and Draw
      for (let i = 0; i < currentBranches.length; i++) {
        const branch = currentBranches[i];
        const growing = branch.update();
        if (growing) stillGrowing = true;
        
        branch.draw(ctx);

        // If finished growing, spawn children immediately to keep the motion fluid
        if (!growing && branch.isFinished && !branch.hasBranched) {
          const children = branch.createSymmetricalChildren();
          if (children.length > 0) {
            newBranchesToAdd.push(...children);
            stillGrowing = true;
          }
        }
      }

      if (newBranchesToAdd.length > 0) {
        branchesRef.current = [...currentBranches, ...newBranchesToAdd];
      }

      // Check for completion - ensure minDuration and pageReady are met
      const elapsed = Date.now() - startTimeRef.current;
      if (!stillGrowing && !finishedRef.current && frameCountRef.current > 120 && pageReady && elapsed >= minDuration) {
        finishedRef.current = true;
        setIsVisible(false);
        // Small delay for fade-out transition
        setTimeout(() => {
          onDone();
        }, 300);
        return;
      }

      // Performance: Only continue animation if still visible
      if (isVisible) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [onDone, minDuration, pageReady, isVisible]);

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
