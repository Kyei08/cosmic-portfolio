export function initParticles() {
  // ===== DEVICE DETECTION =====
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isLowEndDevice = (navigator.hardwareConcurrency || 4) < 4;

  // ===== PERFORMANCE PRESETS =====
  const getSettings = () => {
    if (isMobile || isLowEndDevice) {
      return {
        particleCount: 60,
        particleSize: 1.5,
        speedFactor: 0.6,
        starCount: 3,
        batchSize: 10,
        trailLength: 15,
        shadowQuality: 1.5
      };
    }
    return {
      particleCount: 120,
      particleSize: 3,
      speedFactor: 1,
      starCount: 5,
      batchSize: 15,
      trailLength: 20,
      shadowQuality: 3
    };
  };
  const settings = getSettings();

  // ===== THEME SYSTEM =====
  const THEMES = {
    0: { // Cosmic Purple
      bg: 'rgba(26, 10, 42, 0.15)',
      particles: [
        'rgba(106, 30, 127, 0.8)',
        'rgba(160, 32, 240, 0.7)'
      ],
      starColor: 'rgba(255, 215, 0, 0.9)'
    },
    1: { // Cosmic Gold
      bg: 'rgba(42, 26, 10, 0.15)',
      particles: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(255, 165, 0, 0.7)'
      ],
      starColor: 'rgba(106, 30, 127, 0.9)'
    },
    2: { // Cosmic Blue
      bg: 'rgba(10, 26, 42, 0.15)',
      particles: [
        'rgba(0, 191, 255, 0.8)',
        'rgba(65, 105, 225, 0.7)'
      ],
      starColor: 'rgba(255, 140, 0, 0.9)'
    }
  };

  // ===== THEME INIT =====
  let themeId = localStorage.getItem('cosmicTheme') || 
                Math.floor(Math.random() * Object.keys(THEMES).length);
  const theme = THEMES[themeId];
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
    desynchronized: !isMobile // Chrome only
  });

  // ===== DIMENSIONS =====
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // ===== PARTICLES =====
  const particles = new Array(settings.particleCount).fill().map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * settings.particleSize + 1,
    color: theme.particles[Math.floor(Math.random() * theme.particles.length)],
    speedX: (Math.random() - 0.5) * 0.1 * settings.speedFactor,
    speedY: (Math.random() - 0.5) * 0.1 * settings.speedFactor,
    orbitRadius: Math.random() * 40 + 10,
    angle: Math.random() * Math.PI * 2,
    frequency: (Math.random() * 0.003 + 0.001) * settings.speedFactor
  }));

  // ===== SHOOTING STARS =====
  const shootingStars = Array(settings.starCount).fill().map(() => ({
    x: width + Math.random() * 300,
    y: Math.random() * height * 0.3,
    speed: (Math.random() * 6 + 3) * settings.speedFactor,
    size: Math.random() * 2 + 1,
    trail: new Array(settings.trailLength),
    lastPos: 0,
    lastUpdate: performance.now(),
    color: theme.starColor
  }));

  // ===== RENDER LOOP =====
  let lastFrameTime = 0;
  let frameSkipCounter = 0;

  function render(timestamp) {
    // Frame pacing
    if (timestamp - lastFrameTime < (isMobile ? 32 : 16)) {
      requestAnimationFrame(render);
      return;
    }
    lastFrameTime = timestamp;

    // Background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // Particles
    for (let i = 0; i < settings.batchSize; i++) {
      const p = particles[
        (i + Math.floor(timestamp / 100)) % particles.length
      ];
      
      p.angle += p.frequency;
      p.x += Math.sin(p.angle) * 0.03 * settings.speedFactor + p.speedX;
      p.y += Math.cos(p.angle * 0.7) * 0.03 * settings.speedFactor + p.speedY;
      
      if (p.x < -20) p.x = width + 20;
      if (p.y < -20) p.y = height + 20;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * settings.shadowQuality;
      ctx.shadowColor = p.color;
      ctx.fill();
    }

    // Shooting Stars
    ctx.save();
    shootingStars.forEach(star => {
      const deltaTime = Math.min(timestamp - star.lastUpdate, 32);
      star.lastUpdate = timestamp;
      
      star.x -= star.speed * (deltaTime / 16);
      star.y += star.speed * 0.5 * (deltaTime / 16);
      
      star.trail[star.lastPos] = { x: star.x, y: star.y };
      star.lastPos = (star.lastPos + 1) % star.trail.length;
      
      if (star.x < -100 || star.y > height + 100) {
        star.x = width + Math.random() * 300;
        star.y = Math.random() * height * 0.3;
        star.trail.fill(null);
      }
      
      // Trail
      ctx.beginPath();
      for (let i = 0; i < star.trail.length; i++) {
        const pos = star.trail[(star.lastPos + i) % star.trail.length];
        if (!pos) continue;
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `${star.color.replace('0.9', (i/star.trail.length * 0.7))}`;
        ctx.lineWidth = star.size * (0.3 + (i/star.trail.length * 0.7));
        ctx.stroke();
      }
      
      // Head
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.shadowBlur = star.size * (settings.shadowQuality * 5);
      ctx.shadowColor = star.color;
      ctx.fill();
    });
    ctx.restore();

    requestAnimationFrame(render);
  }

  // Start animation
  requestAnimationFrame(render);

  // Handle resize
  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  // Cleanup
  return () => {
    canvas.remove();
    window.removeEventListener('resize', handleResize);
  };
}