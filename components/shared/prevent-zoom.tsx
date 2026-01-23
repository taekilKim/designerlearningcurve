"use client";

import { useEffect } from "react";

export function PreventZoom() {
  useEffect(() => {
    // 모바일 디바이스에서만 작동
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Prevent pinch zoom (모바일만)
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent double-tap zoom (모바일만)
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Add event listeners (모바일만)
    document.addEventListener("touchstart", preventZoom, { passive: false });
    document.addEventListener("touchmove", preventZoom, { passive: false });
    document.addEventListener("touchend", preventDoubleTapZoom, {
      passive: false,
    });

    // Cleanup
    return () => {
      document.removeEventListener("touchstart", preventZoom);
      document.removeEventListener("touchmove", preventZoom);
      document.removeEventListener("touchend", preventDoubleTapZoom);
    };
  }, []);

  return null;
}
