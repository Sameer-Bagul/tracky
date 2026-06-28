"use client";
import React, { useEffect, useRef } from "react";

export const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dots: { x: number, y: number, originX: number, originY: number }[] = [];
    const spacing = 36;
    let mouse = { x: -1000, y: -1000 };
    let req: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      initDots();
    };

    const initDots = () => {
      dots = [];
      const cols = Math.floor(window.innerWidth / spacing) + 2;
      const rows = Math.floor(window.innerHeight / spacing) + 2;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: i * spacing,
            y: j * spacing,
            originX: i * spacing,
            originY: j * spacing
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    resize();

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        let dx = mouse.x - dot.x;
        let dy = mouse.y - dot.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        // Repulsion physics
        let maxDistance = 150; 
        if (dist < maxDistance) {
          let force = Math.pow((maxDistance - dist) / maxDistance, 2); 
          let directionX = dx / dist;
          let directionY = dy / dist;
          dot.x -= directionX * force * 6; 
          dot.y -= directionY * force * 6;
        } else {
          // Spring back smoothly
          dot.x += (dot.originX - dot.x) * 0.08;
          dot.y += (dot.originY - dot.y) * 0.08;
        }

        // Draw dot
        let color = "rgba(148, 163, 184, 0.6)"; 
        let size = 2.5; 
        
        if (dist < maxDistance) {
          let intensity = (maxDistance - dist) / maxDistance;
          color = `rgba(15, 23, 42, ${0.6 + intensity * 0.4})`; 
          size = 2.5 + (intensity * 1.5); 
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      req = requestAnimationFrame(animate);
    };
    
    req = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(req);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none print:hidden" />;
};
