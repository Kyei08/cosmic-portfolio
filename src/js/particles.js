export function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });
  
  // Cosmic dimensions
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // Enhanced cosmic palette
  const colors = [
    'rgba(255, 215, 0, 0.8)',     // Gold
    'rgba(255, 107, 53, 0.7)',    // Orange
    'rgba(106, 30, 127, 0.6)',    // Purple
    'rgba(0, 191, 255, 0.5)'      // Cosmic blue
  ];

  // REBALANCED PARTICLES (better performance/visual ratio)
  const particles = [];
  const particleCount = 120; // Sweet spot between epic and efficient
  
  // RECLAIMED SHOOTING STARS
  const shootingStars = Array(5).fill().map(() => ({
    x: Math.random() * width * 1.5,
    y: Math.random() * height * 0.5,
    speed: Math.random() * 8 + 4,  // Faster trails
    size: Math.random() * 3 + 1,
    trail: [],
    lastUpdate: performance.now(),
    color: `rgba(255, ${Math.floor(150 + Math.random() * 105)}, 50, 0.9)`
  }));

  // Initialize particles with cosmic motion
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      orbitRadius: Math.random() * 50 + 20,
      angle: Math.random() * Math.PI * 2,
      frequency: Math.random() * 0.02 + 0.01
    });
  }

  // SMART ANIMATION LOOP (60FPS when possible, gracefully degrades)
  let lastFrameTime = 0;
  const targetFPS = 60;
  
  function animate(timestamp) {
    // Adaptive frame skipping
    const timeSinceLast = timestamp - lastFrameTime;
    const targetInterval = 1000 / targetFPS;
    
    if (timeSinceLast < targetInterval - 3) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = timestamp;

    // DARK COSMIC BACKGROUND (fixed)
    ctx.fillStyle = 'rgba(10, 10, 26, 0.15)'; // Slightly more visible
    ctx.fillRect(0, 0, width, height);

    // GALACTIC PARTICLES
    particles.forEach(p => {
      // Orbital motion with noise
      p.angle += p.frequency;
      p.x += Math.sin(p.angle) * 0.3 + p.speedX;
      p.y += Math.cos(p.angle * 0.7) * 0.3 + p.speedY;
      
      // Boundary recycling
      if (p.x < -50) p.x = width + 50;
      if (p.x > width + 50) p.x = -50;
      if (p.y < -50) p.y = height + 50;
      if (p.y > height + 50) p.y = -50;
      
      // Pulsing glow effect
      const pulse = 0.7 + 0.3 * Math.sin(timestamp * 0.002 + p.x * 0.01);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 5 * pulse;
      ctx.shadowColor = p.color;
      ctx.fill();
    });

    // EPIC SHOOTING STARS
    shootingStars.forEach(star => {
      const deltaTime = Math.min(timestamp - star.lastUpdate, 32); // Cap for consistency
      star.lastUpdate = timestamp;
      
      star.x -= star.speed * (deltaTime / 16);
      star.y += star.speed * 0.5 * (deltaTime / 16);
      
      // Trail magic
      star.trail.push({ x: star.x, y: star.y });
      if (star.trail.length > 25) star.trail.shift();
      
      // Cosmic rebirth
      if (star.x < -100 || star.y > height + 100) {
        star.x = width + Math.random() * 300;
        star.y = Math.random() * height * 0.3;
        star.trail = [];
      }
      
      // Draw fiery trail
      ctx.beginPath();
      star.trail.forEach((pos, i) => {
        const alpha = i / star.trail.length;
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `rgba(255, ${150 + i * 3}, ${50 + i * 2}, ${alpha * 0.8})`;
        ctx.lineWidth = star.size * (0.5 + alpha * 0.5);
        ctx.stroke();
      });
      
      // Blazing head
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.shadowBlur = star.size * 15;
      ctx.shadowColor = star.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // Start cosmic dance
  requestAnimationFrame(animate);

  // Responsive cosmic field
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}