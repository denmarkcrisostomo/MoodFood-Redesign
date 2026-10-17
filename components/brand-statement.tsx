const CLAIMS = [
  {
    title: "The spreads",
    items: [
      "Energy, Recover and Chunky",
      "10g of plant-based protein per serving",
      "No refined sugar",
      "No artificial flavours or colours",
    ],
  },
  {
    title: "The bars",
    items: [
      "100% whole grain oats",
      "Sweetened with honey",
      "Probiotics in KiDS bars, for ages 3 and up",
    ],
  },
  {
    title: "Everything we make",
    items: ["Halal", "Zero cholesterol", "Low sodium", "Made in the Philippines"],
  },
];

const SOCIALS = [
  { label: "X", d: "M5 5l14 14M19 5L5 19" },
  { label: "Facebook", d: "M14 8h2V5h-2.500A3.500 3.500 0 0010 8.500V11H8v3h2v6h3v-6h2.200l.5-3H13V8.800" },
  { label: "Instagram" },
  { label: "TikTok", d: "M14 4v10.500a3 3 0 11-3-3", d2: "M14 4c.4 2.200 2 3.600 4.500 3.800" },
];

export function BrandStatement() {
  return (
    <section className="brand" aria-labelledby="brand-h">
      <div className="in">
        <h2 id="brand-h">
          <span className="a">Simple ingredients.</span>
          <span className="b">Powerful nutrition.</span>
        </h2>
      </div>
      <div className="in">
        <div className="claims">
          {CLAIMS.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              <ul>
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="in">
        <div className="follow">
          <p>Follow us @MOODFOODMARKET</p>
          <div className="socials" aria-label="Social links">
            {SOCIALS.map((s) => (
              <a key={s.label} className="ib" href="#" aria-label={s.label}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {s.label === "Instagram" ? (
                    <>
                      <rect x="4" y="4" width="16" height="16" rx="5" />
                      <circle cx="12" cy="12" r="3.500" />
                      <path d="M16.800 7.200h.01" />
                    </>
                  ) : (
                    <>
                      <path d={s.d} />
                      {s.d2 && <path d={s.d2} />}
                    </>
                  )}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
