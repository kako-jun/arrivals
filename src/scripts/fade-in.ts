/** Initialize fade-in animation with IntersectionObserver */
export function initFadeIn(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}

/** Setup fade-in for initial load and View Transitions */
export function setupFadeIn(): void {
  initFadeIn();
  document.addEventListener('astro:page-load', initFadeIn);
}
