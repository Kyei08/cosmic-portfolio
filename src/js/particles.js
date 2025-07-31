export function initParticles() {
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

  // ===== COLOR THEMES =====
  const COLOR_THEMES = [
    { // Cosmic Purple (default)
      bg: 'rgba(10, 10, 26, 0.15)',
      particles: ['rgba(106, 30, 127, 0.8)', 'rgba(255, 215, 0, 0.7)', 'rgba(0, 191, 255, 0.6)']
    },
    { // Deep Space
      bg: 'rgba(16, 5, 36, 0.15)',
      particles: ['rgba(159, 39, 176, 0.8)', 'rgba(255, 152, 0, 0.7)', 'rgba(0, 188, 212, 0.6)']
    },
    { // Nebula
      bg: 'rgba(5, 20, 30, 0.15)',
      particles: ['rgba(63, 81, 181, 0.8)', 'rgba(255, 87, 34, 0.7)', 'rgba(0, 230, 118, 0.6)']
    }
  ];

  let currentTheme = 0;
  let nextThemeChange = performance.now() + 15000; // 15-second intervals

  // ===== PARTICLES =====
  const particles = new Array(120).fill().map(() => {
    const theme = COLOR_THEMES[currentTheme];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      color: theme.particles[Math.floor(Math.random() * theme.particles.length)],
      originalColor: theme.particles[Math.floor(Math.random() * theme.particles.length)],
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
      orbitRadius: Math.random() * 40 + 10,
      angle: Math.random() * Math.PI * 2,
      frequency: Math.random() * 0.003 + 0.001
    };
  });

  // ===== SHOOTING STARS =====
  const shootingStars = Array(5).fill().map(() => ({
    x: width + Math.random() * 300,
    y: Math.random() * height * 0.3,
    speed: Math.random() * 6 + 3,
    size: Math.random() * 2 + 1,
    trail: [],
    lastUpdate: performance.now(),
    color: `rgba(255, ${150 + Math.random() * 105}, 50, 0.9)`
  }));

  // ===== RENDER LOOP =====
  function animate(timestamp) {
    // Theme cycling (every 15s)
    if (timestamp > nextThemeChange) {
      currentTheme = (currentTheme + 1) % COLOR_THEMES.length;
      nextThemeChange = timestamp + 15000;
    }

    // Background (current theme)
    ctx.fillStyle = COLOR_THEMES[currentTheme].bg;
    ctx.fillRect(0, 0, width, height);

    // Particles
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

    // Shooting Stars
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
      
      // Draw trail
      ctx.beginPath();
      star.trail.forEach((pos, i) => {
        const alpha = i / star.trail.length;
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `rgba(255, ${150 + i * 3}, ${50 + i * 2}, ${alpha * 0.8})`;
        ctx.lineWidth = star.size * (0.5 + alpha * 0.5);
        ctx.stroke();
      });
      
      // Draw head
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