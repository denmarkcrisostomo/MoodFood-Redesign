/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import type * as ThreeNS from "three";

import { useCartForm } from "@/lib/cart";
import { openCartDrawer } from "@/lib/cart-drawer";
import type { Jar, JarKey } from "@/lib/jars";
import profiles from "@/lib/jar-profiles.json";
import { formatPrice } from "@/lib/money";

type Profile = { W: number; H: number; rows: number[][]; band: number[] };
type RGB = [number, number, number];

const PROFILES = profiles as Profile[];
const IMG = ["/jars/chunky.png", "/jars/recover.png", "/jars/energy.png"];
const HASH: Record<string, number> = { chunky: 1, recover: 2, energy: 3 };

const COPY: Record<
  JarKey,
  { name: string; line: string; facts: string[]; alt: string }
> = {
  chunky: {
    name: "Chunky",
    line: "Peanut pieces left in. Something to chew on.",
    facts: ["High protein", "No added sugar", "250g and 500g"],
    alt: "Mood Food Chunky peanut butter, green label",
  },
  recover: {
    name: "Recover",
    line: "Chocolate peanut butter for after the long one.",
    facts: ["High protein", "Chocolate peanut butter", "250g and 500g"],
    alt: "Mood Food Recover chocolate peanut butter, blue label",
  },
  energy: {
    name: "Energy",
    line: "Peanut butter for the first thing you do today.",
    facts: ["High protein", "No added sugar", "250g and 500g"],
    alt: "Mood Food Energy peanut butter, orange label",
  },
};

const FL = [
  { bg: [123, 212, 138], ink: [15, 38, 20], tone: [108, 196, 124], label: "#7bd48a", txt: "#ffffff", chip: "#fb6a07", chipTxt: "#ffffff", name: "CHUNKY" },
  { bg: [11, 84, 216], ink: [242, 234, 216], tone: [8, 70, 188], label: "#0b54d8", txt: "#f2ead8", chip: "#ffe227", chipTxt: "#0b54d8", name: "RECOVER" },
  { bg: [251, 106, 7], ink: [28, 14, 5], tone: [232, 91, 0], label: "#fb6a07", txt: "#f2ead8", chip: "#0b54d8", chipTxt: "#f2ead8", name: "ENERGY" },
] as const;
/* Stage colours: hero (cream over yellow), then Chunky, Recover, Energy. */
const STAGE_TOP: RGB[] = [[242, 234, 216], [123, 212, 138], [11, 84, 216], [251, 106, 7]];
const STAGE_LOW: RGB[] = [[255, 226, 39], [123, 212, 138], [11, 84, 216], [251, 106, 7]];
const STAGE_INK: RGB[] = [[20, 18, 16], [15, 38, 20], [242, 234, 216], [28, 14, 5]];
const STAGE_TONE: RGB[] = [[242, 234, 216], [108, 196, 124], [8, 70, 188], [232, 91, 0]];

const lin = (c: number) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const unlin = (c: number) =>
  Math.min(255, Math.max(0, 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)));
const toOk = ([r, g, b]: RGB): RGB => {
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const fromOk = ([L, a, b]: RGB): RGB => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    unlin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    unlin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    unlin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
};
const OK = (list: RGB[]) => list.map(toOk);
const OK_TOP = OK(STAGE_TOP), OK_LOW = OK(STAGE_LOW), OK_INK = OK(STAGE_INK), OK_TONE = OK(STAGE_TONE);
const morph = (list: RGB[], k: number, t: number): RGB =>
  fromOk([lerp(list[k][0], list[k + 1][0], t), lerp(list[k][1], list[k + 1][1], t), lerp(list[k][2], list[k + 1][2], t)]);

const css = (c: RGB) => `rgb(${c[0]},${c[1]},${c[2]})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function Buy({
  jar,
  index,
  onSize,
  className,
}: {
  jar: Jar;
  index: number;
  onSize: (i: number) => void;
  className: string;
}) {
  const { formProps, register } = useCartForm();
  const copy = COPY[jar.key];
  const variants = jar.product?.variants ?? [];
  const variant = variants[Math.min(index, variants.length - 1)];

  if (!jar.product || !variant) {
    return (
      <div className={className}>
        <p className="soon">Coming soon to the store</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {variants.length > 1 ? (
        <div className="sizes" role="group" aria-label={`${copy.name} size`}>
          {variants.map((v, i) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={i === index}
              onClick={() => onSize(i)}
            >
              {v.title}
            </button>
          ))}
        </div>
      ) : null}
      <p className="price">{formatPrice(variant.price)}</p>
      <form {...formProps({ beforeSubmit: openCartDrawer })}>
        <input type="hidden" {...register("merchandiseId", { value: variant.id })} />
        <button
          {...register("add")}
          className="btn"
          disabled={!variant.availableForSale}
        >
          {variant.availableForSale ? `Add ${copy.name}` : "Sold out"}
        </button>
      </form>
    </div>
  );
}

export function Showcase({ jars }: { jars: Jar[] }) {
  const showRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chaptersRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<number[]>([1, 1, 1]);
  const setSize = (jarIndex: number) => (i: number) =>
    setSizes((prev) => prev.map((s, k) => (k === jarIndex ? i : s)));

  useEffect(() => {
    const show = showRef.current!;
    const pin = pinRef.current!;
    const hero = heroRef.current!;
    const scenes = Array.from(pin.querySelectorAll<HTMLElement>(".scene"));
    const heroJars = pin.querySelector<HTMLElement>(".hero-jars")!;
    const canvas = canvasRef.current!;
    const chapters = chaptersRef.current!;
    const floor = floorRef.current!;
    const navBtns = Array.from(chapters.querySelectorAll("button"));
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    let raf = 0;
    let renderer: ThreeNS.WebGLRenderer | null = null;
    let THREE: typeof ThreeNS;
    let scene: ThreeNS.Scene;
    let camera: ThreeNS.PerspectiveCamera;
    const groups: ThreeNS.Group[] = [];
    const disposables: { dispose: () => void }[] = [];
    const jarDims = { h: 0, w: 0 };
    const place = { x0: 0, y0: 0, sc0: 1, gy: 0 };
    let sT = 0, sC = 0, lastIdx = -1, lastJar = -1, dirty = true, last = performance.now();

    const nav = () => document.querySelector<HTMLElement>(".nav");
    const navH = () => nav()?.offsetHeight ?? 0;

    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => res(i);
        i.src = src;
      });

    const opaque = (img: HTMLImageElement, base: string) => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const x = c.getContext("2d")!;
      x.fillStyle = base; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
      return c;
    };

    /* The photos only show the front. The back is the same jar mirrored, with the
       label field repainted, so the lid and peanut butter wrap round cleanly. */
    const backCanvas = (img: HTMLImageElement, prof: Profile, f: (typeof FL)[number]) => {
      const c = document.createElement("canvas");
      c.width = prof.W; c.height = prof.H;
      const x = c.getContext("2d")!;
      const [a, b] = prof.band;
      const mid = prof.rows.filter((r) => r[0] > a + 40 && r[0] < b - 40);
      let l = 0, r = 0;
      mid.forEach((m) => { l += m[1]; r += m[2]; });
      l /= mid.length; r /= mid.length;
      const cx = (l + r) / 2, hw = (r - l) / 2, E = hw * 0.05;
      x.fillStyle = "#2a2018"; x.fillRect(0, 0, c.width, c.height);
      x.save(); x.translate(2 * cx, 0); x.scale(-1, 1); x.drawImage(img, 0, 0); x.restore();
      x.fillStyle = f.label;
      x.fillRect(cx - hw + E, a, 2 * hw - 2 * E, b - a);
      x.fillStyle = f.txt; x.textAlign = "center"; x.textBaseline = "alphabetic";
      x.font = "700 112px Outfit, sans-serif";
      x.fillText("MOOD", cx, a + 126);
      x.fillText("FOOD", cx, a + 238);
      x.fillStyle = f.chip; x.fillRect(cx - 118, a + 266, 236, 44);
      x.fillStyle = f.chipTxt; x.font = "700 28px Outfit, sans-serif";
      x.fillText(f.name, cx, a + 298);
      x.fillStyle = f.txt; x.font = "600 22px Outfit, sans-serif";
      x.fillText("HIGH PROTEIN", cx, a + 340);
      return c;
    };

    const ringGeo = (rows: number[][], W: number, H: number, yc: number, side: 1 | -1) => {
      const seg = 44;
      const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = [];
      const th0 = side === 1 ? -Math.PI / 2 : Math.PI / 2;
      rows.forEach((row) => {
        const [y, l, r] = row;
        const hw = (r - l) / 2, cxp = (l + r) / 2, R = hw / 100, Y = (yc - y) / 100, uw = hw - 4;
        for (let s = 0; s <= seg; s++) {
          const th = th0 + (Math.PI * s) / seg, sn = Math.sin(th), cs = Math.cos(th);
          pos.push(R * sn, Y, R * cs); nor.push(sn, 0, cs);
          uv.push((side === 1 ? cxp + sn * uw : cxp - sn * uw) / W, 1 - y / H);
        }
      });
      const n = seg + 1;
      for (let i = 0; i < rows.length - 1; i++) {
        for (let j = 0; j < seg; j++) {
          const a = i * n + j, b = a + 1, c = a + n, d = c + 1;
          idx.push(a, c, b, b, c, d);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      g.setIndex(idx);
      disposables.push(g);
      return g;
    };

    const initGL = (imgs: HTMLImageElement[]) => {
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      } catch {
        return false;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(18, 1, 1, 200);
      // Physical light units: x PI matches the look the photos were tuned to.
      scene.add(new THREE.AmbientLight(0xffffff, 0.5 * Math.PI));
      const key = new THREE.DirectionalLight(0xffffff, 0.52 * Math.PI); key.position.set(0.25, 0.35, 1); scene.add(key);
      const rim = new THREE.DirectionalLight(0xfff2dd, 0.28 * Math.PI); rim.position.set(-1, 0.2, -0.6); scene.add(rim);

      imgs.forEach((img, i) => {
        const p = PROFILES[i], rows = p.rows;
        const yc = (rows[0][0] + rows[rows.length - 1][0]) / 2;
        jarDims.h = Math.max(jarDims.h, (rows[rows.length - 1][0] - rows[0][0]) / 100);
        jarDims.w = Math.max(jarDims.w, (rows[0][2] - rows[0][1]) / 100);
        const ft = new THREE.CanvasTexture(opaque(img, "#2a2018"));
        ft.colorSpace = THREE.SRGBColorSpace; ft.minFilter = THREE.LinearFilter; ft.generateMipmaps = false;
        const bt = new THREE.CanvasTexture(backCanvas(img, p, FL[i]));
        bt.colorSpace = THREE.SRGBColorSpace; bt.minFilter = THREE.LinearFilter; bt.generateMipmaps = false;
        const fm = new THREE.MeshLambertMaterial({ map: ft });
        const bm = new THREE.MeshLambertMaterial({ map: bt });
        const tm = new THREE.MeshLambertMaterial({ color: 0x6c5127 });
        const bom = new THREE.MeshLambertMaterial({ color: 0x8a5a24 });
        disposables.push(ft, bt, fm, bm, tm, bom);
        const g = new THREE.Group();
        g.add(new THREE.Mesh(ringGeo(rows, p.W, p.H, yc, 1), fm));
        g.add(new THREE.Mesh(ringGeo(rows, p.W, p.H, yc, -1), bm));
        const rTop = (rows[0][2] - rows[0][1]) / 200;
        const rBot = (rows[rows.length - 1][2] - rows[rows.length - 1][1]) / 200;
        const top = new THREE.Mesh(new THREE.CircleGeometry(rTop, 48), tm);
        top.rotation.x = -Math.PI / 2; top.position.y = (yc - rows[0][0]) / 100; g.add(top);
        const bot = new THREE.Mesh(new THREE.CircleGeometry(rBot, 48), bom);
        bot.rotation.x = Math.PI / 2; bot.position.y = (yc - rows[rows.length - 1][0]) / 100; g.add(bot);
        g.visible = i === 0;
        scene.add(g); groups.push(g);
      });
      return true;
    };

    const resize = () => {
      if (!renderer) return;
      const w = pin.clientWidth, h = pin.clientHeight, phone = w < 721;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const fov = (camera.fov * Math.PI) / 180;
      const frac = phone ? 0.34 : 0.62;
      const dH = jarDims.h / (frac * 2 * Math.tan(fov / 2));
      const dW = jarDims.w / ((phone ? 0.62 : 0.34) * 2 * Math.tan(fov / 2) * camera.aspect);
      const d = Math.max(dH, dW);
      camera.position.set(0, d * 0.07, d);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      const visH = 2 * d * Math.tan(fov / 2), wpp = visH / h;
      place.gy = phone ? visH * 0.12 : visH * -0.02;

      /* where the Chunky jar stands in the hero, so the 3D jar lifts off from exactly there */
      const him = heroJars.querySelector<HTMLElement>("img")!;
      const cx = heroJars.offsetLeft + (phone ? -heroJars.offsetWidth / 2 : 0) + him.offsetWidth / 2;
      const cy = heroJars.offsetTop + (phone ? heroJars.offsetHeight / 2 : 0);
      place.x0 = (cx - w / 2) * wpp;
      place.y0 = -(cy - h / 2) * wpp;
      place.sc0 = (him.offsetWidth * 0.8 * wpp) / jarDims.h;
      dirty = true;
    };

    const progress = () => {
      const range = Math.max(1, show.offsetHeight - pin.clientHeight);
      const scrolled = navH() - show.getBoundingClientRect().top;
      const t = Math.min(1, Math.max(0, scrolled / range));
      return 3 * Math.min(1, Math.max(0, (t - 0.04) / 0.92));
    };

    const apply = (s: number) => {
      /* background, ink and tone morph between stages */
      const k = Math.min(2, Math.floor(s));
      const t = sstep(0.08, 0.92, s - k);
      const top = css(morph(OK_TOP, k, t)), low = css(morph(OK_LOW, k, t));
      pin.style.setProperty("--bg-top", top);
      pin.style.setProperty("--bg-low", low);
      pin.style.setProperty("--bg", low);
      pin.style.setProperty("--ink", css(morph(OK_INK, k, t)));
      pin.style.setProperty("--tone", css(morph(OK_TONE, k, t)));
      show.style.background = low;

      /* hero headline morphs into the details; other hero jars drop away */
      const o0 = 1 - sstep(0.12, 0.5, s);
      hero.style.setProperty("--o", o0.toFixed(3));
      hero.style.setProperty("--dy", `${(-(1 - o0) * 24).toFixed(1)}px`);
      heroJars.style.setProperty("--hj", (1 - sstep(0, 0.55, s)).toFixed(3));

      scenes.forEach((el, i) => {
        const d = s - (i + 1);
        const o = 1 - sstep(0.12, 0.5, Math.abs(d));
        el.style.setProperty("--o", o.toFixed(3));
        el.style.setProperty("--dy", `${(-Math.sign(d) * (1 - o) * 24).toFixed(1)}px`);
        el.classList.toggle("live", o > 0.6);
        el.toggleAttribute("inert", o < 0.5);
      });
      hero.toggleAttribute("inert", o0 < 0.5);

      const idx = s < 0.5 ? 0 : Math.min(3, Math.round(s));
      if (idx !== lastIdx) {
        lastIdx = idx;
        navBtns.forEach((b) => b.setAttribute("aria-current", Number(b.dataset.go) === idx ? "true" : "false"));
      }
      const vis = sstep(0.3, 0.8, s);
      chapters.style.opacity = vis.toFixed(2);
      chapters.style.pointerEvents = vis > 0.6 ? "auto" : "none";

      const lifted = s > 0.002;
      pin.classList.toggle("lift", lifted);
      canvas.style.visibility = lifted ? "visible" : "hidden";
      /* the product changes while its back faces the camera, mid-spin */
      const jarIdx = s < 1.5 ? 0 : s < 2.5 ? 1 : 2;
      if (jarIdx !== lastJar) {
        lastJar = jarIdx;
        groups.forEach((g, i) => { g.visible = i === jarIdx; });
      }

      /* the jar leaves the hero for the centre while it turns */
      const e = sstep(0, 0.9, Math.min(s, 1));
      groups.forEach((g) => {
        g.position.x = lerp(place.x0, 0, e);
        g.position.y = lerp(place.y0, place.gy, e);
        const sc = lerp(place.sc0, 1, e);
        g.scale.set(sc, sc, sc);
        g.rotation.y = reduce ? 0 : -s * Math.PI * 2;
      });
      floor.style.opacity = sstep(0.6, 1, s).toFixed(2);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      sT = progress();
      const diff = sT - sC;
      if (Math.abs(diff) > 0.0004) { sC += diff * (1 - Math.exp(-dt * 10)); dirty = true; }
      else if (sC !== sT) { sC = sT; dirty = true; }
      if (dirty) {
        apply(sC);
        dirty = false;
      }
      /* Redraw every frame while the stage is on screen. A canvas that is only drawn
         when scroll changes can show a half-stale frame after the browser recycles its
         tiles (seen when the jar scrolls up into the footer). */
      if (renderer && sC > 0.002) {
        const r = show.getBoundingClientRect();
        if (r.bottom > -50 && r.top < window.innerHeight + 50) renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(frame);
    };

    const goTo = (i: number, instant = false) => {
      const range = show.offsetHeight - pin.clientHeight;
      const t = 0.04 + (i / 3) * 0.92;
      const top = show.getBoundingClientRect().top + window.scrollY - navH() + t * range;
      window.scrollTo({ top, behavior: reduce || instant ? "auto" : "smooth" });
    };
    const onGoto = (e: Event) => goTo((e as CustomEvent<number>).detail);
    const onResize = () => { resize(); dirty = true; };
    const onScroll = () => { dirty = true; };
    const onChapter = (e: Event) => goTo(Number((e.currentTarget as HTMLElement).dataset.go));

    const ro = new ResizeObserver(onResize);
    ro.observe(pin);
    const onLost = (e: Event) => e.preventDefault();
    const onRestored = () => { resize(); dirty = true; };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    window.addEventListener("mf:goto", onGoto);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    navBtns.forEach((b) => b.addEventListener("click", onChapter));
    raf = requestAnimationFrame(frame);

    const fonts = document.fonts?.load
      ? Promise.race([document.fonts.load("700 100px Outfit"), new Promise((r) => setTimeout(r, 1500))])
      : Promise.resolve();
    (async () => {
      THREE = await import("three");
      const imgs = await Promise.all(IMG.map(loadImg));
      await fonts;
      if (disposed) return;
      const ok = initGL(imgs);
      if (!ok) root.classList.add("no-gl");
      else resize();
      dirty = true;
      const want = HASH[window.location.hash.slice(1)];
      if (want) setTimeout(() => goTo(want, true), 60);
      (window as unknown as { __moodfood?: object }).__moodfood = { ready: true, gl: ok };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      window.removeEventListener("mf:goto", onGoto);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      navBtns.forEach((b) => b.removeEventListener("click", onChapter));
      root.classList.remove("no-gl");
      disposables.forEach((d) => d.dispose());
      renderer?.dispose();
    };
  }, []);

  return (
    <section className="show" id="show" ref={showRef} aria-label="Mood Food peanut butter">
      <div className="show-pin" ref={pinRef}>
        <div className="bg-low" aria-hidden="true" />

        <div className="hero" ref={heroRef} id="p-hero">
          <div className="hl-layer up">
            <h1 className="hl">
              <span className="ln"><span>Eat your</span></span>
              <span className="ln"><span>mood</span></span>
            </h1>
          </div>
          <div className="hl-layer low" aria-hidden="true">
            <p className="hl">
              <span className="ln"><span>Eat your</span></span>
              <span className="ln"><span>mood</span></span>
            </p>
          </div>
          <div className="hero-jars">
            {(["chunky", "recover", "energy"] as JarKey[]).map((k, i) => (
              <img key={k} src={IMG[i]} width={713} height={713} alt={COPY[k].alt} />
            ))}
          </div>
          <p className="hero-sub">High-protein peanut butter in three jars. Pick the mood.</p>
        </div>

        {jars.map((jar, i) => {
          const c = COPY[jar.key];
          return (
            <article className="scene" id={`p-${jar.key}`} key={jar.key}>
              <div className="word" aria-hidden="true">{c.name}</div>
              <div className="copy">
                <h2>{c.name}</h2>
                <p>{c.line}</p>
                <ul className="facts-inline">
                  {c.facts.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <Buy jar={jar} index={sizes[i]} onSize={setSize(i)} className="buy buy-inline" />
              </div>
              <div className="facts">
                <ul>
                  {c.facts.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <Buy jar={jar} index={sizes[i]} onSize={setSize(i)} className="buy" />
              </div>
              <img className="panel-jar" src={IMG[i]} width={713} height={713} alt={c.alt} />
            </article>
          );
        })}
        <div className="jar-floor" ref={floorRef} aria-hidden="true" />
        <canvas className="jar-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="chapters" ref={chaptersRef} role="group" aria-label="Choose a jar">
          <button type="button" data-go="1">Chunky</button>
          <button type="button" data-go="2">Recover</button>
          <button type="button" data-go="3">Energy</button>
        </div>
      </div>
    </section>
  );
}
