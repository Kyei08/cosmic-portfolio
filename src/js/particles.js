export function initParticles() {
  // Create optimized canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  document.body.appendChild(canvas);
  
  // GPU-accelerated rendering
  const ctx = canvas.getContext('2d', { alpha: true });
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  // Performance-optimized particles
  const particles = [];
  const particleCount = 80; // Reduced from 150
  const colors = ['#ffd700', '#ff8c42', '#ff6b35', '#4a0e4e'];

  // Optimized shooting stars
  const shootingStars = Array(3).fill().map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: Math.random() * 3 + 2, // Reduced speed
    size: Math.random() * 1.5 + 0.5,
    trail: [],
    lastUpdate: performance.now()
  }));

  // Initialize particles with better distribution
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5, // Smaller particles
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: Math.random() * 0.3 - 0.15, // Slower movement
      speedY: Math.random() * 0.3 - 0.15,
      angle: 0,
      angleSpeed: Math.random() * 0.01 - 0.005
    });
  }

  // Throttled animation loop
  let lastFrameTime = 0;
  const frameRate = 30; // Target FPS
  
  function animate(timestamp) {
    // Skip frames to maintain target FPS
    if (timestamp - lastFrameTime < 1000 / frameRate) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = timestamp;

    // Efficient clearing
    ctx.clearRect(0, 0, width, height);
    
    // Batch particle drawing
    ctx.save();
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.angle += p.angleSpeed;
      
      // Boundary wrapping with buffer
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;
      if (p.y > height + 20) p.y = -20;
      if (p.y < -20) p.y = height + 20;
      
      // Optimized glow effect
      const glowIntensity = 0.6 + 0.4 * Math.sin(timestamp * 0.001 + p.x * 0.005);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 2 * glowIntensity;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    ctx.restore();

    // Optimized shooting stars
    shootingStars.forEach(star => {
      const deltaTime = Math.min(timestamp - star.lastUpdate, 100); // Cap delta
      star.lastUpdate = timestamp;
      
      star.x -= star.speed * (deltaTime / 1000);
      star.y += star.speed * 0.3 * (deltaTime / 1000);
      
      star.trail.push({ x: star.x, y: star.y });
      if (star.trail.length > 15) star.trail.shift();
      
      // Boundary reset
      if (star.x < -20 || star.y > height + 20) {
        star.x = width + Math.random() * 100;
        star.y = Math.random() * height;
        star.trail = [];
      }
      
      // Draw trail
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      star.trail.forEach((pos, i) => {
        const alpha = i / star.trail.length;
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
        ctx.lineWidth = star.size * alpha;
        ctx.stroke();
      });
    });

    requestAnimationFrame(animate);
  }

  // Optimized event listeners
  const handleMouseMove = (e) => {
    const mx = e.clientX;
    const my = e.clientY;
    
    particles.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) { // Smaller interaction radius
        p.speedX += dx / distance * 0.05; // Weaker interaction
        p.speedY += dy / distance * 0.05;
      }
    });
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Start with slight delay to prevent initial jank
  setTimeout(() => {
    window.addEventListener('mousemove', handleMouseMove);
    requestAnimationFrame(animate);
  }, 300);

  return () => {
    canvas.remove();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
  };
}