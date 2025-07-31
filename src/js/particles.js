export function initParticles() {
  // ===== MOBILE DETECTION =====
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // ===== PERFORMANCE PRESETS =====
  const config = {
    particleCount: isMobile ? 40 : 120,           // Reduce 66% on mobile
    particleSize: isMobile ? 1.5 : 3,             // Smaller on mobile
    particleSpeed: isMobile ? 0.05 : 0.1,         // Slower on mobile
    starCount: isMobile ? 2 : 5,                  // Fewer stars on mobile
    starTrailLength: isMobile ? 10 : 20,          // Shorter trails on mobile
    shadowQuality: isMobile ? 1.5 : 3             // Reduced glow on mobile
  };

  // ===== THEME SYSTEM (UNCHANGED) =====
  const THEMES = { /* ... (keep existing theme code) ... */ };

  // ===== CANVAS SETUP =====
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { 
    alpha: true,
    desynchronized: !isMobile // Only enable on desktop
  });

  // ===== PARTICLES =====
  const particles = new Array(config.particleCount).fill().map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * config.particleSize + 1,
    color: theme.particles[Math.floor(Math.random() * theme.particles.length)],
    speedX: (Math.random() - 0.5) * config.particleSpeed,
    speedY: (Math.random() - 0.5) * config.particleSpeed,
    orbitRadius: Math.random() * 30 + 10,
    angle: Math.random() * Math.PI * 2,
    frequency: Math.random() * 0.002 + 0.001 // Slower orbit on mobile
  }));

  // ===== SHOOTING STARS =====
  const shootingStars = Array(config.starCount).fill().map(() => ({
    x: width + Math.random() * 300,
    y: Math.random() * height * 0.3,
    speed: Math.random() * 4 + (isMobile ? 1 : 3), // Slower on mobile
    size: Math.random() * 1.5 + (isMobile ? 0.5 : 1),
    trail: new Array(config.starTrailLength),
    lastUpdate: performance.now(),
    color: theme.starColor
  }));

  // ===== MOBILE-SPECIFIC OPTIMIZATIONS =====
  if (isMobile) {
    // Reduce rendering quality
    canvas.imageRendering = 'optimizeSpeed';
    // Throttle FPS
    const targetFPS = 30;
    let lastFrameTime = 0;
    
    function mobileAnimate(timestamp) {
      if (timestamp - lastFrameTime < 1000 / targetFPS) {
        requestAnimationFrame(mobileAnimate);
        return;
      }
      lastFrameTime = timestamp;
      render(timestamp);
      requestAnimationFrame(mobileAnimate);
    }
    requestAnimationFrame(mobileAnimate);
  } else {
    // Original 60FPS loop
    function desktopAnimate(timestamp) {
      render(timestamp);
      requestAnimationFrame(desktopAnimate);
    }
    requestAnimationFrame(desktopAnimate);
  }

  // Shared render logic
  function render(timestamp) {
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // Particles (simplified on mobile)
    particles.forEach(p => {
      if (!isMobile) {
        p.angle += p.frequency;
        p.x += Math.sin(p.angle) * 0.03 + p.speedX;
        p.y += Math.cos(p.angle * 0.7) * 0.03 + p.speedY;
      } else {
        // Linear movement only on mobile
        p.x += p.speedX;
        p.y += p.speedY;
      }
      
      // Boundary checks
      if (p.x < -20) p.x = width + 20;
      if (p.y < -20) p.y = height + 20;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * config.shadowQuality;
      ctx.shadowColor = p.color;
      ctx.fill();
    });

    // Shooting stars
    shootingStars.forEach(star => {
      const deltaTime = Math.min(timestamp - star.lastUpdate, isMobile ? 48 : 32);
      star.lastUpdate = timestamp;
      
      star.x -= star.speed * (deltaTime / 16);
      star.y += star.speed * 0.5 * (deltaTime / 16);
      
      star.trail[star.lastPos % star.trail.length] = { x: star.x, y: star.y };
      star.lastPos++;
      
      if (star.x < -100) {
        star.x = width + Math.random() * 300;
        star.y = Math.random() * height * 0.3;
      }
      
      // Trail (simplified on mobile)
      if (!isMobile || timestamp % 2 === 0) { // Skip frames on mobile
        ctx.beginPath();
        for (let i = 0; i < star.trail.length; i++) {
          const pos = star.trail[(star.lastPos + i) % star.trail.length];
          if (!pos) continue;
          ctx.lineTo(pos.x, pos.y);
          ctx.strokeStyle = `${star.color.replace('0.9', (i/star.trail.length * 0.7))}`;
          ctx.lineWidth = star.size * (0.3 + (i/star.trail.length * 0.4));
          ctx.stroke();
        }
      }
      
      // Head
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * (isMobile ? 1.2 : 1.5), 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.shadowBlur = star.size * (isMobile ? 8 : 15);
      ctx.shadowColor = star.color;
      ctx.fill();
    });
  }

  // [Rest of the code (resize handler, cleanup) remains unchanged]
}




export function initParticles() {
  // ===== THEME SYSTEM =====
  const THEMES = {
    0: { // Cosmic Purple (Default)
      bg: 'rgba(26, 10, 42, 0.15)',
      particles: [
        'rgba(106, 30, 127, 0.8)',
        'rgba(160, 32, 240, 0.7)',
        'rgba(138, 43, 226, 0.6)'
      ],
      starColor: 'rgba(255, 215, 0, 0.9)' // Gold stars for contrast
    },
    1: { // Cosmic Gold 
      bg: 'rgba(42, 26, 10, 0.15)',
      particles: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(255, 165, 0, 0.7)',
        'rgba(218, 165, 32, 0.6)'
      ],
      starColor: 'rgba(106, 30, 127, 0.9)' // Purple stars
    },
    2: { // Cosmic Blue
      bg: 'rgba(10, 26, 42, 0.15)',
      particles: [
        'rgba(0, 191, 255, 0.8)',
        'rgba(65, 105, 225, 0.7)',
        'rgba(100, 149, 237, 0.6)'
      ],
      starColor: 'rgba(255, 140, 0, 0.9)' // Orange stars
    }
  };

  // Load or generate theme
  let themeId = localStorage.getItem('cosmicTheme') || 
                Math.floor(Math.random() * Object.keys(THEMES).length);
  const theme = THEMES[themeId];

  // Rotate theme on next load
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('cosmicTheme', 
      (parseInt(themeId) + 1) % Object.keys(THEMES).length);
  });

  // ===== CANVAS SETUP =====
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { 
    alpha: true,
    desynchronized: true
  });

  // ===== DIMENSIONS =====
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // ===== PARTICLES =====
  const particles = new Array(120).fill().map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    color: theme.particles[Math.floor(Math.random() * theme.particles.length)],
    speedX: (Math.random() - 0.5) * 0.1,
    speedY: (Math.random() - 0.5) * 0.1,
    orbitRadius: Math.random() * 40 + 10,
    angle: Math.random() * Math.PI * 2,
    frequency: Math.random() * 0.003 + 0.001
  }));

  // ===== SHOOTING STARS =====
  const shootingStars = Array(5).fill().map(() => ({
    x: width + Math.random() * 300,
    y: Math.random() * height * 0.3,
    speed: Math.random() * 6 + 3,
    size: Math.random() * 2 + 1,
    trail: [],
    lastUpdate: performance.now(),
    color: theme.starColor
  }));

  // ===== RENDER LOOP =====
  function animate(timestamp) {
    // Stable background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // Draw particles
    particles.forEach(p => {
      p.angle += p.frequency;
      p.x += Math.sin(p.angle) * 0.03 + p.speedX;
      p.y += Math.cos(p.angle * 0.7) * 0.03 + p.speedY;
      
      if (p.x < -20) p.x = width + 20;
      if (p.y < -20) p.y = height + 20;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 3;
      ctx.shadowColor = p.color;
      ctx.fill();
    });

    // Draw shooting stars
    shootingStars.forEach(star => {
      const deltaTime = Math.min(timestamp - star.lastUpdate, 32);
      star.lastUpdate = timestamp;
      
      star.x -= star.speed * (deltaTime / 16);
      star.y += star.speed * 0.5 * (deltaTime / 16);
      
      star.trail.push({ x: star.x, y: star.y });
      if (star.trail.length > 20) star.trail.shift();
      
      if (star.x < -100 || star.y > height + 100) {
        star.x = width + Math.random() * 300;
        star.y = Math.random() * height * 0.3;
        star.trail = [];
      }
      
      // Trail
      ctx.beginPath();
      star.trail.forEach((pos, i) => {
        const alpha = i / star.trail.length;
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `${star.color.replace('0.9', alpha * 0.7)}`;
        ctx.lineWidth = star.size * (0.5 + alpha * 0.5);
        ctx.stroke();
      });
      
      // Head
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.shadowBlur = star.size * 15;
      ctx.shadowColor = star.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // Start animation
  requestAnimationFrame(animate);

  // Handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  return () => {
    canvas.remove();
    window.removeEventListener('resize', handleResize);
  };
}