"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Drives a demand-mode canvas at a fixed rate, and holds its breath while the
 * visitor is actually scrolling.
 *
 * The jank a phone user feels on this page is one specific collision: the
 * thumb is dragging, the compositor needs every millisecond, and the WebGL
 * scene insists on repainting in the middle of it. Pausing the repaint for
 * exactly those moments removes the stutter without the scene ever looking
 * stopped: the pause lasts as long as the flick does, and the mark is
 * drifting slowly anyway.
 *
 * On top of that, phones get 30 frames a second instead of 60. For a slow
 * ambient rotation the eye cannot tell, and it halves the GPU bill.
 */
export function FrameGovernor({ fps, active }: { fps: number; active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) return;

    let scrolling = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    function onScroll() {
      scrolling = true;
      clearTimeout(settleTimer);
      // One frame time after the last scroll event, drawing resumes. Long
      // enough to stay out of the flick, short enough to be invisible.
      settleTimer = setTimeout(() => {
        scrolling = false;
      }, 120);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    const tick = setInterval(() => {
      if (!scrolling) invalidate();
    }, 1000 / fps);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(tick);
      clearTimeout(settleTimer);
    };
  }, [fps, active, invalidate]);

  return null;
}
