export function initParticles() {
  // ======== CANVAS SETUP ========
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d', { 
    alpha: true,
    desynchronized: true // Chrome performance boost
  });
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // ======== COSMIC COLOR PALETTE ========
  const colors = [
    '#ffd700', // Gold
    '#ff6b35', // Orange
    '#6a1e7f', // Purple 
    '#00bfff'  // Cosmic blue
  ];

  // ======== TURTLE-PACED PARTICLES ========
  const particles = new Array(120).fill().map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    color: colors[Math.floor(Math.random() * 4)],
    speedX: (Math.random() - 0.5) * 0.1,  // Very slow
    speedY: (Math.random() - 0.5) * 0.1,
    orbitRadius: Math.random() * 40 + 10,
    angle: Math.random() * Math.PI * 2,
    frequency: Math.random() * 0.003 + 0.001 // Slow orbit
  }));

  // ======== SHOOTING STARS (UNCHANGED) ========
  const shootingStars = {
    list: Array(5).fill().map(() => ({
      x: width + Math.random() * 300,
      y: Math.random() * height * 0.3,
      speed: Math.random() * 5 + 2,  // Moderate speed
      size: Math.random() * 2 + 1,
      trail: new Array(15),
      lastPos: 0,
      color: `rgba(255, ${150 + Math.random() * 105}, 50, 0.9)`
    })),
    update(star) {
      star.x -= star.speed;
      star.y += star.speed * 0.5;
      
      star.trail[star.lastPos] = { x: star.x, y: star.y };
      star.lastPos = (star.lastPos + 1) % star.trail.length;
      
      if (star.x < -100) {
        star.x = width + Math.random() * 300;
        star.y = Math.random() * height * 0.3;
      }
    }
  };

  // ======== RENDER LOOP ========
  let lastFrameTime = 0;
  const particleBatchSize = 15; // Process 15 particles/frame

  function render(timestamp) {
    // Frame pacing
    if (timestamp - lastFrameTime < 16) {
      requestAnimationFrame(render);
      return;
    }
    lastFrameTime = timestamp;

    // Cosmic background
    ctx.fillStyle = 'rgba(10, 10, 26, 0.2)';
    ctx.fillRect(0, 0, width, height);

    // Process particles in batches
    for (let i = 0; i < particleBatchSize; i++) {
      const p = particles[
        (i + Math.floor(timestamp / 100)) % particles.length // Cycle through
      ];
      
      // Gentle orbital drift
      p.angle += p.frequency;
      p.x += Math.sin(p.angle) * 0.03 + p.speedX;
      p.y += Math.cos(p.angle * 0.7) * 0.03 + p.speedY;
      
      // Boundary recycling
      if (p.x < -20) p.x = width + 20;
      if (p.y < -20) p.y = height + 20;
      
      // Draw with soft glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 2;
      ctx.shadowColor = p.color;
      ctx.fill();
    }

    // Draw shooting stars
    ctx.save();
    shootingStars.list.forEach(star => {
      shootingStars.update(star);
      
      // Trail
      ctx.beginPath();
      for (let i = 0; i < star.trail.length; i++) {
        const pos = star.trail[(star.lastPos + i) % star.trail.length];
        if (!pos) continue;
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `rgba(255, 200, 100, ${i/star.trail.length})`;
        ctx.lineWidth = star.size * (i/star.trail.length);
        ctx.stroke();
      }
      
      // Glowing head
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.shadowBlur = star.size * 10;
      ctx.shadowColor = star.color;
      ctx.fill();
    });
    ctx.restore();

    requestAnimationFrame(render);
  }

  // Start animation
  requestAnimationFrame(render);

  // Handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Cleanup
  return () => {
    canvas.remove();
    window.removeEventListener('resize', handleResize);
  };
}