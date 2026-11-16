/**
 * Coderia.dev — Intro Boot Animation
 * Manages screen initialization and seamless page entrance
 */

export class IntroAnimation {
  static start() {
    const gsap = window.gsap;
    document.body.classList.remove('is-loading');

    if (gsap) {
      gsap.fromTo('.bg-grid-pattern', 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );
      gsap.fromTo('.bg-radial-gradient', 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
      );
    }
  }
}
