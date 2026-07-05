import { useEffect, useRef } from 'react';

export const BackgroundParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const filmCanvas = filmCanvasRef.current;
    if (!canvas || !filmCanvas) return;
    const ctx = canvas.getContext('2d');
    const fctx = filmCanvas.getContext('2d');
    if (!ctx || !fctx) return;

    let stars: any[] = [];
    let shootingStars: any[] = [];
    const numStars = 400;
    const getNextShootingStarDelay = () => 5000 + Math.random() * 5000;
    let nextShootingStarAt = Date.now() + getNextShootingStarDelay();

    const resize = () => {
      if (!canvas || !filmCanvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      filmCanvas.width = window.innerWidth;
      filmCanvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * Math.max(canvas.width, canvas.height) * 0.8,
          speed: Math.random() * 0.0004 + 0.0001,
          size: Math.random() * 1.2 + 0.4,
          flickerOffset: Math.random() * 100
        });
      }
    };

    const spawnShootingStar = () => {
      if (shootingStars.length > 0) return;
      
      const fromLeft = Math.random() > 0.35;
      const startX = fromLeft
        ? -80 - Math.random() * canvas.width * 0.15
        : Math.random() * canvas.width * 0.75;
      const startY = Math.random() * canvas.height * 0.28;
      const speed = 4.2 + Math.random() * 1.8;
      
      shootingStars.push({
        x: startX,
        y: startY,
        vx: speed,
        vy: speed * (0.45 + Math.random() * 0.25),
        life: 105,
        maxLife: 105,
        length: 24 + Math.random() * 18,
      });
    };

    const generateGrain = () => {
      const imgData = fctx.createImageData(filmCanvas.width, filmCanvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 50 + 10;
        data[i] = data[i+1] = data[i+2] = noise;
        data[i+3] = 25; // grain strength
      }
      fctx.putImageData(imgData, 0, 0);
    };

    const drawScratches = () => {
      fctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`;
      fctx.lineWidth = Math.random() * 1.5 + 0.5;

      for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.6) {
          const x = Math.random() * filmCanvas.width;
          fctx.beginPath();
          fctx.moveTo(x, Math.random() * filmCanvas.height * 0.3);
          fctx.lineTo(x + (Math.random() - 0.5) * 80, filmCanvas.height);
          fctx.stroke();
        }
      }
    };

    let lastGrainTime = 0;
    let animationFrameId: number;
    const animate = () => {
      if (!canvas || !filmCanvas || !ctx || !fctx) return;
      // Clear main canvas - using clearRect instead of fillRect with alpha to ensure transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      stars.forEach((star) => {
        star.angle += star.speed;
        const x = centerX + Math.cos(star.angle) * star.radius;
        const y = centerY + Math.sin(star.angle) * star.radius;

        const flicker = 0.4 + Math.sin(Date.now() * 0.003 + star.flickerOffset) * 0.3;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${flicker})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life--;

        const alpha = s.life / s.maxLife;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * s.length, s.y - s.vy * s.length);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4 + alpha;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * s.length, s.y - s.vy * s.length);
        ctx.stroke();

        if (s.life <= 0 || s.y > canvas.height + 120) shootingStars.splice(i, 1);
      }

      // Film effect - update grain only occasionally for performance
      const now = Date.now();
      if (now >= nextShootingStarAt) {
        spawnShootingStar();
        nextShootingStarAt = now + getNextShootingStarDelay();
      }

      if (now - lastGrainTime > 100) {
        fctx.clearRect(0, 0, filmCanvas.width, filmCanvas.height);
        generateGrain();
        drawScratches();
        lastGrainTime = now;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0 blur-[1px]" 
      />
      <canvas 
        ref={filmCanvasRef} 
        style={{ mixBlendMode: 'overlay', opacity: 0.4 }}
        className="fixed inset-0 pointer-events-none z-[1]" 
      />
    </>
  );
};
