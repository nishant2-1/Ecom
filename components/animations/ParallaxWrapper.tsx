"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ParallaxWrapperProps = {
  children: ReactNode;
  yPercent?: number;
};

gsap.registerPlugin(ScrollTrigger);

export function ParallaxWrapper({ children, yPercent = 12 }: ParallaxWrapperProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) {
      return;
    }

    const animation = gsap.fromTo(
      element,
      { yPercent: -yPercent },
      {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [yPercent]);

  return <div ref={rootRef}>{children}</div>;
}
