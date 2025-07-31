export function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  // Initial setup
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  
  // Cosmic particles
  const particles = [];
  const particleCount = 150;
  const colors = ['#ffd700', '#ff8c42', '#ff6b35', '#4a0e4e'];
  
  // Shooting stars
  const shootingStars = Array(5).fill().map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: Math.random() * 5 + 3,
    size: Math.random() * 2 + 1,
    trail: [],
    lastUpdate: performance.now()
  }));
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      angle: 0,
      angleSpeed: Math.random() * 0.02 - 0.01
    });
  }
  
  function animate(timestamp) {
    // Resize handling
    if (width !== window.innerWidth || height !== window.innerHeight) {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    
    // Clear with fade effect
    ctx.fillStyle = 'rgba(10, 10, 26, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    // Update cosmic particles
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.angle += p.angleSpeed;
      
      // Boundary wrapping
      if (p.x > width + 50) p.x = -50;
      if (p.x < -50) p.x = width + 50;
      if (p.y > height + 50) p.y = -50;
      if (p.y < -50) p.y = height + 50;
      
      // Draw with pulsing glow
      const pulse = 0.5 + 0.5 * Math.sin(timestamp * 0.002 + p.x * 0.01);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.arc(0, 0, p.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = p.size * 3 * pulse;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    });
    
    // Update shooting stars
    shootingStars.forEach(star => {
      const deltaTime = timestamp - star.lastUpdate;
      const distance = star.speed * (deltaTime / 1000);
      
      star.x -= distance;
      star.y += distance * 0.3;
      star.lastUpdate = timestamp;
      
      star.trail.push({ x: star.x, y: star.y });
      if (star.trail.length > 20) star.trail.shift();
      
      // Boundary reset
      if (star.x < -50 || star.y > height + 50) {
        star.x = width + Math.random() * 200;
        star.y = Math.random() * height;
        star.trail = [];
      }
      
      // Draw trail
      ctx.beginPath();
      star.trail.forEach((pos, i) => {
        const alpha = i / star.trail.length;
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = star.size * alpha;
        ctx.stroke();
      });
      
      // Draw head with intense glow
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = star.size * 5;
      ctx.shadowColor = '#ffffff';
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
  
  // Cleanup
  return () => {
    canvas.remove();
    window.removeEventListener('resize', handleResize);
  };
}

// Add to animate() function
document.addEventListener('mousemove', (e) => {
  particles.forEach(p => {
    const dx = p.x - e.clientX;
    const dy = p.y - e.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 150) {
      p.speedX += dx / distance * 0.1;
      p.speedY += dy / distance * 0.1;
    }
  });
});