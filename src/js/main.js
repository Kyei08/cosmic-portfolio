import { initCursor } from './cursor.js';
import { initParticles } from './particles.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initParticles();
  
  // Add cosmic vortex HTML
  const vortexHTML = `
    <div class="cosmic-vortex">
      <div class="vortex-layer vortex-outer"></div>
      <div class="vortex-layer vortex-middle"></div>
      <div class="vortex-layer vortex-inner"></div>
    </div>
    <div class="energy-pulse"></div>
  `;
  document.body.insertAdjacentHTML('beforeend', vortexHTML);
});