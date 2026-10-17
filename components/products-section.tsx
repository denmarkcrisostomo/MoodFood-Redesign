import Image from "next/image";
import Link from "next/link";

import { RiseObserver } from "./rise-observer";

const PRODUCTS = [
  {
    href: "/collections/spreads",
    src: "/jars/recover.png",
    alt: "Mood Food Recover high protein chocolate peanut butter jar",
    name: "High Protein Peanut Butter",
    desc: "Chunky, Recover and Energy. High protein, no added sugar.",
    delay: 0,
  },
  {
    href: "/collections/bar",
    src: "/products/bar-strawberry.png",
    alt: "Mood Food Bar strawberry with collagen box",
    name: "Bar",
    desc: "All natural granola snack bars. 10 flavours.",
    delay: 90,
  },
  {
    href: "/collections/kids",
    src: "/products/kids-brownie-bear.png",
    alt: "Mood Food KiDS Brownie Bear box",
    name: "KiDS",
    desc: "All natural kids granola snack bars, with probiotics.",
    delay: 180,
  },
];

export function ProductsSection() {
  return (
    <section className="products" id="products" aria-labelledby="prod-h">
      <RiseObserver />
      <div className="in">
        <div className="phead">
          <h2 id="prod-h" className="rise">Mood Food products</h2>
          <p className="rise" style={{ "--d": "80ms" } as React.CSSProperties}>
            Peanut butter, granola bars and bars for kids. Pick a group.
          </p>
        </div>
        <div className="pgrid">
          {PRODUCTS.map((p) => (
            <Link
              key={p.href}
              className="pcard rise"
              style={{ "--d": `${p.delay}ms` } as React.CSSProperties}
              href={p.href}
            >
              <div className="pfig">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={713}
                  height={713}
                  sizes="(max-width: 520px) 80vw, (max-width: 900px) 40vw, 27vw"
                />
              </div>
              <div className="pname">
                <span>{p.name}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </div>
              <p className="pdesc">{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
