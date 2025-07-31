export function initCursor() {
    const cursor = document.getElementById('cursor');
    const particles = [];
    const colors = ['#ffd700', '#ff8c42', '#6b1e7f'];
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Create a dedicated canvas for particle trails
    const trailCanvas = document.createElement('canvas');
    trailCanvas.className = 'cursor-trail-canvas';
    document.body.appendChild(trailCanvas);
    const trailCtx = trailCanvas.getContext('2d');
    
    // Style the canvas
    trailCanvas.style.position = 'fixed';
    trailCanvas.style.top = '0';
    trailCanvas.style.left = '0';
    trailCanvas.style.width = '100vw';
    trailCanvas.style.height = '100vh';
    trailCanvas.style.pointerEvents = 'none';
    trailCanvas.style.zIndex = '9998';
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;

    // Mouse move handler
    const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Add new particles with cosmic effects
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: e.clientX + (Math.random() * 20 - 10),
                y: e.clientY + (Math.random() * 20 - 10),
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 100,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: Math.random() * 0.1 - 0.05
            });
        }
    };

    document.addEventListener('mousemove', handleMouseMove);

    function animate() {
        // Clear trail canvas with fading effect
        trailCtx.fillStyle = 'rgba(10, 10, 26, 0.05)';
        trailCtx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);
        
        // Update cursor position (smooth follow)
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Physics update
            p.x += p.speedX;
            p.y += p.speedY;
            p.angle += p.angleSpeed;
            p.life -= 2;
            p.size *= 0.98;
            
            // Cosmic effects
            const pulse = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
            const alpha = (p.life / 100) * (0.3 + pulse * 0.2);
            
            // Draw particle
            trailCtx.save();
            trailCtx.translate(p.x, p.y);
            trailCtx.rotate(p.angle);
            trailCtx.beginPath();
            trailCtx.arc(0, 0, p.size, 0, Math.PI * 2);
            trailCtx.fillStyle = `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            trailCtx.shadowBlur = p.size * 2;
            trailCtx.shadowColor = p.color;
            trailCtx.fill();
            trailCtx.restore();
            
            // Remove dead particles
            if (p.life <= 0 || p.size < 0.1) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle resize
    const handleResize = () => {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        trailCanvas.remove();
    };
}