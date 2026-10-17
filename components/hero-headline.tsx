"use client";

import { useEffect, useRef } from "react";

/** Stretch FOOD and FOR EVERY (via letter-spacing) to the width of the MOOD line. */
function fitHeadline(root: HTMLElement) {
  const spans = Array.from(root.querySelectorAll<HTMLElement>(".ln > span"));
  if (spans.length < 3) return;
  spans.forEach((sp) => { sp.style.letterSpacing = ""; });
  /* visible width: the range includes the trailing letter-space after the last glyph */
  const ink = (sp: HTMLElement) => {
    const r = document.createRange();
    r.selectNodeContents(sp);
    return r.getBoundingClientRect().width - (parseFloat(getComputedStyle(sp).letterSpacing) || 0);
  };
  const target = ink(spans[2]);
  [0, 1].forEach((i) => {
    const sp = spans[i];
    const n = (sp.textContent ?? "").length;
    const cur = parseFloat(getComputedStyle(sp).letterSpacing) || 0;
    sp.style.letterSpacing = `${cur + (target - ink(sp)) / (n - 1)}px`;
  });
}

/** "Food for every mood" headline plus tagline and Shop now button. */
export function HeroHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h = ref.current!;
    const fit = () => fitHeadline(h);
    fit();
    window.addEventListener("resize", fit);
    void document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <>
      <h1 className="hl" ref={ref}>
        <span className="ln top"><span>Food</span></span>
        <span className="ln mid"><span>for every</span></span>
        <span className="ln bot"><span>mood</span></span>
      </h1>
      <div className="hero-cta">
        <p>High Protein Peanut Butter</p>
        <a
          className="btn"
          href="#chunky"
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("mf:goto", { detail: 1 }));
          }}
        >
          Shop now <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}
