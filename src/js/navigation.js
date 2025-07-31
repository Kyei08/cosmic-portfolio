export function initNavigation() {
  // Smooth scrolling for anchor links
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-scroll-to]')) {
      e.preventDefault();
      const target = document.querySelector(e.target.dataset.scrollTo);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Dynamic navigation highlighting
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.cosmic-section');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const id = section.getAttribute('id');
        history.replaceState(null, null, `#${id}`);
      }
    });
  });
}