// Shared component-motion vocabulary. GSAP owns scroll timelines, never these surfaces.
export const interactionSpring = { stiffness: 260, damping: 30, mass: .8 };
export const revealTransition = { duration: .32, ease: [.22, 1, .36, 1] as const };
