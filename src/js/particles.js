export function initParticles() {
  // ===== CANVAS SETUP =====
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  // ===== COSMIC DIMENSIONS =====
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // ===== STABLE COLOR SCHEME =====
  const COSMIC_PURPLE = '#1a0a2a'; // Deep space purple from your design
  const PARTICLE_COLORS = [
    'rgba(106, 30, 127, 0.8)',  // Purple
    'rgba(255, 215, 0, 0.6)',   // Gold accents
    'rgba(0, 191, 255, 0.5)'    // Occasional blue twinkle
  ];

  // ===== PARTICLES =====
  const particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      speedX: (Math.random() - 0.5) * 0.08, // Ultra-slow
      speedY: (Math.random() - 0.5) * 0.08,
      orbitRadius: Math.random() * 30 + 10,
      angle: Math.random() * Math.PI * 2
    });
  }

  // ===== RENDER LOOP =====
  function animate() {
    // Stable dark purple background
    ctx.fillStyle = COSMIC_PURPLE;
    ctx.fillRect(0, 0, width, height);

    // Draw particles
    particles.forEach(p => {
      p.x += Math.sin(p.angle) * 0.02 + p.speedX;
      p.y += Math.cos(p.angle) * 0.02 + p.speedY;
      
      // Boundary recycling
      if (p.x < -20) p.x = width + 20;
      if (p.y < -20) p.y = height + 20;
      
      // Gentle glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 3;
      ctx.shadowColor = p.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // Start animation
  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}