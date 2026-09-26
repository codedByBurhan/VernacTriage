import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let activeScrollRaf: number | null = null;

export function scrollToCompiler(offset = 76, duration = 600) {
  if (typeof window === "undefined") return;

  const compilerEl = document.getElementById("compiler");
  if (!compilerEl) return;

  if (activeScrollRaf !== null) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = null;
  }

  const startY = window.scrollY;
  const initialTargetY = Math.max(
    0,
    compilerEl.getBoundingClientRect().top + window.scrollY - offset
  );

  if (Math.abs(startY - initialTargetY) < 5) return;

  const startTime = performance.now();
  const root = document.documentElement;
  const originalScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  const stopListener = () => {
    if (activeScrollRaf !== null) {
      cancelAnimationFrame(activeScrollRaf);
      activeScrollRaf = null;
      root.style.scrollBehavior = originalScrollBehavior;
    }
    window.removeEventListener("wheel", stopListener);
    window.removeEventListener("touchstart", stopListener);
  };

  window.addEventListener("wheel", stopListener, { passive: true, once: true });
  window.addEventListener("touchstart", stopListener, { passive: true, once: true });

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Smooth cubic ease-out
    const ease = 1 - Math.pow(1 - progress, 3);

    // Dynamically recalculate target in case layout shifted above
    const currentTargetY = Math.max(
      0,
      compilerEl!.getBoundingClientRect().top + window.scrollY - offset
    );

    const nextY = startY + (currentTargetY - startY) * ease;
    window.scrollTo(0, nextY);

    if (progress < 1) {
      activeScrollRaf = requestAnimationFrame(step);
    } else {
      window.scrollTo(0, currentTargetY);
      root.style.scrollBehavior = originalScrollBehavior;
      window.removeEventListener("wheel", stopListener);
      window.removeEventListener("touchstart", stopListener);
      activeScrollRaf = null;
    }
  }

  activeScrollRaf = requestAnimationFrame(step);
}
