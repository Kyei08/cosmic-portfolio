export function initParticles() {
  // ======== SETUP ========
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  document.body.appendChild(canvas);
  
  // GPU-optimized context
  const ctx = canvas.getContext('2d', { 
    alpha: true,
    desynchronized: true // Chrome-only perf boost
  });
  
  // Cosmic dimensions
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // ======== OPTIMIZED PARTICLES ========
  const particles = new Array(120).fill().map(() => {
    const colorIdx = Math.floor(Math.random() * 4);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      color: colorIdx === 0 ? '#ffd700' : 
             colorIdx === 1 ? '#ff6b35' :
             colorIdx === 2 ? '#6a1e7f' : '#00bfff',
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
      orbitRadius: Math.random() * 40 + 10,
      angle: Math.random() * Math.PI * 2
    };
  });

  // ======== SHOOTING STARS (TIME-SLICED) ========
  const shootingStars = {
    list: Array(5).fill().map(() => ({
      x: width + Math.random() * 300,
      y: Math.random() * height * 0.3,
      speed: Math.random() * 6 + 3,
      size: Math.random() * 2 + 1,
      trail: new Array(20),
      lastPos: 0
    })),
    update(star, timestamp) {
      // Move star
      star.x -= star.speed;
      star.y += star.speed * 0.5;
      
      // Circular buffer for trail
      star.trail[star.lastPos] = { x: star.x, y: star.y };
      star.lastPos = (star.lastPos + 1) % star.trail.length;
      
      // Reset if out of bounds
      if (star.x < -100 || star.y > height + 100) {
        star.x = width + Math.random() * 300;
        star.y = Math.random() * height * 0.3;
        star.trail.fill(null);
      }
    }
  };

  // ======== OPTIMIZED RENDER LOOP ========
  let lastFrameTime = 0;
  const particleBatchSize = 20;
  let currentBatch = 0;

  function render(timestamp) {
    // Frame rate control
    const delta = timestamp - lastFrameTime;
    if (delta < 16) { // ~60fps
      requestAnimationFrame(render);
      return;
    }
    lastFrameTime = timestamp;

    // Clear with cosmic darkness
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // ===== BATCHED PARTICLE PROCESSING =====
    const batchEnd = Math.min(
      currentBatch + particleBatchSize, 
      particles.length
    );
    
    for (let i = currentBatch; i < batchEnd; i++) {
      const p = particles[i];
      
      // Orbital motion
      p.angle += 0.01;
      p.x += Math.sin(p.angle) * 0.2 + p.speedX;
      p.y += Math.cos(p.angle * 0.7) * 0.2 + p.speedY;
      
      // Boundary wrap
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
      
      // Draw with glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 3;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    
    currentBatch = (currentBatch + particleBatchSize) % particles.length;

    // ===== SHOOTING STARS =====
    ctx.save();
    shootingStars.list.forEach(star => {
      shootingStars.update(star, timestamp);
      
      // Draw trail
      ctx.beginPath();
      let first = true;
      for (let i = 0; i < star.trail.length; i++) {
        const pos = star.trail[(star.lastPos + i) % star.trail.length];
        if (!pos) continue;
        if (first) {
          ctx.moveTo(pos.x, pos.y);
          first = false;
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      }
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.7)';
      ctx.lineWidth = star.size * 0.8;
      ctx.stroke();
      
      // Draw head
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ff8c42';
      ctx.shadowBlur = star.size * 8;
      ctx.shadowColor = '#ff8c42';
      ctx.fill();
    });
    ctx.restore();

    requestAnimationFrame(render);
  }

  // ======== START & CLEANUP ========
  let animationId = requestAnimationFrame(render);
  
  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    canvas.remove();
  };
}