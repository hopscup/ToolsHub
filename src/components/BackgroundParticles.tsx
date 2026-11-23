import { useEffect, useRef, useState } from 'react';

interface Star {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  flickerOffset: number;
  opacity: number;
  twinkles: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
}

const DesktopParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const filmCanvas = filmCanvasRef.current;
    if (!canvas || !filmCanvas) return;
    const ctx = canvas.getContext('2d');
    const fctx = filmCanvas.getContext('2d');
    if (!ctx || !fctx) return;

    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const isLowPowerDevice = isMobile && (
      navigator.hardwareConcurrency <= 4
      || (deviceMemory !== undefined && deviceMemory <= 4)
    );
    const numStars = isLowPowerDevice ? 90 : isMobile ? 120 : 320;
    const targetFrameMs = isLowPowerDevice ? 1000 / 24 : isMobile ? 1000 / 30 : 1000 / 60;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    const grainCanvas = document.createElement('canvas');
    const grainContext = grainCanvas.getContext('2d');
    const grainSize = 160;
    grainCanvas.width = grainSize;
    grainCanvas.height = grainSize;
    const grainPattern = fctx.createPattern(grainCanvas, 'repeat');
    const getNextShootingStarDelay = () => 5000 + Math.random() * 5000;
    let nextShootingStarAt = Date.now() + getNextShootingStarDelay();
    let isPageVisible = !document.hidden;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionPreference.matches;
    let isLight = document.documentElement.dataset.siteTheme === 'light';
    const themeObserver = new MutationObserver(() => {
      isLight = document.documentElement.dataset.siteTheme === 'light';
      if (reducedMotion && isPageVisible) animate();
    });
    themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-site-theme']});

    const resize = () => {
      if (!canvas || !filmCanvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      filmCanvas.width = window.innerWidth;
      filmCanvas.height = window.innerHeight;
      initStars();
      if (reducedMotion && isPageVisible) animate();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * Math.max(canvas.width, canvas.height) * 0.8,
          speed: Math.random() * 0.0004 + 0.0001,
          size: Math.random() * 1.2 + 0.4,
          flickerOffset: Math.random() * 100,
          opacity: 0.16 + Math.random() * 0.42,
          twinkles: i % 4 === 0,
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
      if (isMobile || !grainContext) return;
      const imgData = grainContext.createImageData(grainSize, grainSize);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 50 + 10;
        data[i] = data[i+1] = data[i+2] = noise;
        data[i+3] = 25; // grain strength
      }
      grainContext.putImageData(imgData, 0, 0);
      if (grainPattern) {
        fctx.fillStyle = grainPattern;
        fctx.fillRect(0, 0, filmCanvas.width, filmCanvas.height);
      }
    };

    const drawScratches = () => {
      if (isMobile) return;
      fctx.strokeStyle = isLight
        ? `rgba(45, 45, 52, ${Math.random() * 0.04 + 0.01})`
        : `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`;
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
    let lastFrameTime = 0;
    let animationFrameId: number;
    const animate = (frameTime = 0) => {
      if (!canvas || !filmCanvas || !ctx || !fctx) return;
      if (!isPageVisible) {
        return;
      }

      if (!reducedMotion && frameTime - lastFrameTime < targetFrameMs) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = frameTime;

      // Clear main canvas - using clearRect instead of fillRect with alpha to ensure transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const now = Date.now();

      stars.forEach((star) => {
        if (!reducedMotion) star.angle += star.speed;
        const x = centerX + Math.cos(star.angle) * star.radius;
        const y = centerY + Math.sin(star.angle) * star.radius;

        const flicker = star.opacity + (!reducedMotion && star.twinkles ? Math.sin(now * 0.0018 + star.flickerOffset) * 0.14 : 0);
        
        ctx.fillStyle = isLight ? `rgba(29, 29, 31, ${flicker})` : `rgba(255, 255, 255, ${flicker})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = shootingStars.length - 1; !reducedMotion && i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life--;

        const alpha = s.life / s.maxLife;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * s.length, s.y - s.vy * s.length);
        grad.addColorStop(0, isLight ? `rgba(29, 29, 31, ${alpha})` : `rgba(255, 255, 255, ${alpha})`);
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
      if (!reducedMotion && now >= nextShootingStarAt) {
        spawnShootingStar();
        nextShootingStarAt = now + getNextShootingStarDelay();
      }

      if (!isMobile && (reducedMotion || now - lastGrainTime > 150)) {
        fctx.clearRect(0, 0, filmCanvas.width, filmCanvas.height);
        if (!reducedMotion) { generateGrain(); drawScratches(); }
        lastGrainTime = now;
      }

      if (!reducedMotion) animationFrameId = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      cancelAnimationFrame(animationFrameId);
      if (isPageVisible) {
        lastFrameTime = 0;
        if (reducedMotion) animate();
        else animationFrameId = requestAnimationFrame(animate);
      }
    };
    const handleMotionPreference = () => {
      reducedMotion = motionPreference.matches;
      shootingStars = [];
      cancelAnimationFrame(animationFrameId);
      lastFrameTime = 0;
      if (isPageVisible) animate();
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionPreference.addEventListener('change', handleMotionPreference);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      motionPreference.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="site-universe-stars fixed inset-0 pointer-events-none z-0 sm:blur-[1px]"
      />
      <canvas 
        ref={filmCanvasRef} 
        style={{ mixBlendMode: 'overlay', opacity: 0.4 }}
        className="site-universe-film fixed inset-0 pointer-events-none z-[1] hidden md:block"
      />
    </>
  );
};

export const BackgroundParticles = () => {
  const [mobile,setMobile] = useState(() => window.matchMedia('(max-width: 767px), (pointer: coarse)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const change = () => setMobile(media.matches);
    media.addEventListener('change',change);
    return () => media.removeEventListener('change',change);
  }, []);
  return mobile ? <div className="site-mobile-sky" aria-hidden="true"><i/><i/><span className="site-mobile-twinkles"/></div> : <DesktopParticles/>;
};
