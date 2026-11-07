import gsap from "gsap";

export interface GradientRevealOptions {
  duration?: number;
  yOffset?: number;
  ease?: string;
  enableContinuousShimmer?: boolean;
}

/**
 * Creates a premium animated gradient + fade-and-slide reveal effect.
 *
 * - Smoothly fades in and slides upward from initial yOffset to 0
 * - Sweeps brand gradient (purple #5B4BDB & teal #18B6A4 on deep navy base #17152F)
 * - Transitions seamlessly into a continuous, subtle ambient shimmer
 * - Maintains 100% text readability without random characters or distracting glitches
 */
export function createGradientRevealTween(
  element: HTMLElement,
  text?: string,
  options: GradientRevealOptions = {}
): gsap.core.Timeline {
  const {
    duration = 1.0,
    yOffset = 22,
    ease = "power3.out",
    enableContinuousShimmer = true,
  } = options;

  // Preserve and restore exact legible text
  if (text && element.textContent !== text) {
    element.textContent = text;
  }

  const tl = gsap.timeline();

  // Fade-and-slide reveal with initial gradient sweep
  tl.fromTo(
    element,
    {
      opacity: 0,
      y: yOffset,
      backgroundPosition: "0% 50%",
    },
    {
      opacity: 1,
      y: 0,
      backgroundPosition: "100% 50%",
      duration,
      ease,
      onComplete: () => {
        if (!enableContinuousShimmer) return;

        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!prefersReducedMotion) {
          gsap.to(element, {
            backgroundPosition: "300% 50%",
            duration: 12,
            repeat: -1,
            ease: "linear",
          });
        }
      },
    }
  );

  return tl;
}

/**
 * Drop-in backward-compatible alias replacing the legacy scramble effect
 * across GRANTLY with the premium animated gradient + fade-and-slide reveal.
 */
export function createScrambleTween(
  element: HTMLElement,
  text: string,
  options?: GradientRevealOptions
): gsap.core.Timeline {
  return createGradientRevealTween(element, text, options);
}