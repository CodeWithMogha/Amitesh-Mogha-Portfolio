export const slowSmoothScrollToCenter = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const centeredPosition = targetPosition - (window.innerHeight / 2) + (element.offsetHeight / 2);
  
  const startPosition = window.pageYOffset;
  const distance = centeredPosition - startPosition;
  // Increase duration for a slower scroll (e.g., 1500ms = 1.5 seconds)
  const duration = 1500; 
  let start: number | null = null;

  // Easing function: easeInOutCubic
  const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  };

  const animation = (currentTime: number) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    
    window.scrollTo(0, run);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, centeredPosition);
    }
  };

  requestAnimationFrame(animation);
};
