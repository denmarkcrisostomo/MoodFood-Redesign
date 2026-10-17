/**
 * Static content for info and policy pages. Used when the Shopify store has no
 * page or policy for the handle (for example on mock.shop). Wording follows
 * moodfood.co; it is condensed, not a legal copy of the originals.
 */
export type FallbackSection = {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
};

export type FallbackPage = {
  title: string;
  intro?: string;
  sections: FallbackSection[];
};

const EMAIL = "help@moodfood.co";

export const PAGE_FALLBACKS: Record<string, FallbackPage> = {
  faqs: {
    title: "FAQs",
    sections: [
      {
        heading: "Peanut butter",
        items: [
          "Store in a cool, dry place away from direct sunlight. Refrigerating after opening extends shelf life and slows oil separation.",
          "The oil on top is natural peanut oil. There are no stabilizers or added oil, so stir before use.",
          "Not formulated for pregnant women or young children. Consult a doctor or pediatrician.",
        ],
      },
      {
        heading: "Bars and KiDS",
        items: [
          "Store in a cool, dry place away from sunlight.",
          "Shelf life is 10 to 12 months under favorable conditions. The expiry date is on the packaging.",
          "Allergen warnings: wheat, soy, peanuts, tree nuts, milk, eggs, and traces of sulfites. The facility is not nut-free.",
          "Bars are not formulated for pregnant or breastfeeding women.",
          "Probiotics are generally safe for most healthy kids, but not for those who are immunocompromised or seriously ill.",
        ],
      },
      {
        heading: "Orders",
        items: [
          "Cash on delivery is not accepted.",
          "Orders can be placed anytime. Processing happens Monday to Saturday, 9 a.m. to 5 p.m.",
          "Once confirmed, orders cannot be changed or cancelled. MOOD FOOD may cancel multiple or fraudulent orders.",
          "If a product is unavailable, we will offer a replacement or refund.",
          "Some items have per-customer purchase limits.",
        ],
      },
      {
        heading: "Shipping",
        items: [
          "Nationwide delivery within the Philippines. There is no pickup option.",
          "The delivery fee appears before checkout.",
          "Delivery dates cannot be chosen. Our fulfillment partner, LOCAD, retries failed deliveries.",
          "Tracking updates come by email, call or text.",
        ],
      },
      {
        heading: "Payment",
        items: [
          "Accepted: Mastercard, Visa, Maya, GCash and QRPH.",
          "You get a confirmation email once the order goes through.",
          "Card details are not stored on the site. Payments are processed by Maya.",
        ],
      },
      {
        heading: "Returns",
        paragraphs: [
          `For damaged, incorrect or incomplete items, email hello@moodfood.co within 24 hours. Include a clear photo of the items and waybill, and an unboxing video.`,
        ],
      },
      {
        heading: "Still need help?",
        paragraphs: [`Email ${EMAIL}. We reply Monday to Friday, 9 a.m. to 5 p.m.`],
      },
    ],
  },

  contact: {
    title: "Contact Us",
    sections: [
      {
        items: [
          "Company: Mood Commercial Corp.",
          "Trade name: MOOD FOOD",
          `Email: ${EMAIL}`,
          "Address: Warehouse 2, Samaca Rd. Calzada, 1630 Taguig City, Philippines",
        ],
      },
      {
        paragraphs: ["We reply Monday to Friday, 9 a.m. to 5 p.m."],
      },
    ],
  },

  "where-to-buy": {
    title: "Where to buy",
    intro: "Find MOOD FOOD at these stores in the Philippines.",
    sections: [
      { heading: "Robinsons Supermarket", paragraphs: ["Galleria, Ermita, Magnolia, Eastwood, Tagaytay, Malolos, Angeles, Dumaguete, Tacloban."] },
      { heading: "The Marketplace", paragraphs: ["About 20 locations, mainly in Metro Manila (Makati, Rockwell, BGC, Katipunan, Taguig, Pasay) and Cebu (Ayala Center, Oakridge, Galleria, Banawa)."] },
      { heading: "Shopwise", paragraphs: ["Makati."] },
      { heading: "The Landmark", paragraphs: ["Makati, EDSA Trinoma, Nuvali, Alabang."] },
      { heading: "Landers", paragraphs: ["13 locations, including Alabang, BGC, Fairview, Nuvali, UP Town Center, Vermosa, Naga and Davao."] },
      { heading: "1 World Deli", paragraphs: ["BGC, Makati (Jupiter St.), Cornerhouse San Juan, Alabang."] },
      { heading: "Mitsukoshi Fresh", paragraphs: ["Basement 1, Mitsukoshi BGC, Taguig."] },
      { heading: "Metro Supermarket", paragraphs: ["Alabang, Market-Market BGC, Newport Pasay, Pasig."] },
      { heading: "Real Food", paragraphs: ["Power Plant Mall (Rockwell), Molito Lifestyle Center (Alabang), ICON Showroom (BGC)."] },
      { heading: "Joel's Place", paragraphs: ["The Proscenium, Rockwell Center, Makati."] },
      { heading: "Heyday", paragraphs: ["Glorietta 4 and Festival Mall (Alabang)."] },
      { heading: "Shell Select", paragraphs: ["Mexico (Pampanga), Gen. Trias (Cavite), Tarlac City."] },
      { heading: "Simple and Whole PH", paragraphs: ["SM City Iloilo."] },
      { heading: "Nutrition Depot", paragraphs: ["BGC, SM Megamall, SM North EDSA, SM Fairview, SM Dasmarinas, SM Clark, Glorietta, Alabang Town Center."] },
      { heading: "Also stocked", paragraphs: ["Nova Wellness Store and Better Food Market."] },
    ],
  },

  "cancellation-policy": {
    title: "Cancellation policy",
    intro:
      "Applies to subscriptions, pre-orders, backorders, delayed-fulfillment items, bundles, promotional offers and other special purchase options. It works together with our Terms of Service, Refund Policy, Shipping Policy and Privacy Policy.",
    sections: [
      {
        heading: "Subscriptions",
        items: [
          "You authorize automatic charges for each cycle (product, shipping, taxes and other fees) until you cancel or change the subscription.",
          "Some subscriptions renew automatically at the end of their term unless cancelled.",
          "To cancel, pause, skip or modify, use the link in your order confirmation email, your customer account, or the subscription management page, where available.",
          "Requests must be made before the next order is processed, charged, packed or fulfilled. A cycle already processed or shipped cannot be cancelled, but future cycles can.",
          "Keep your payment, billing, shipping, contact and account details current.",
        ],
      },
      {
        heading: "Pre-orders and backorders",
        items: [
          "The product may be out of stock, newly launched, limited, or awaiting production. Estimated dates are not guaranteed.",
          "You may pay in full, pay a deposit, or pay nothing at checkout. Any balance may be charged later, as stated at checkout.",
          "You can cancel only before the order is processed, packed, fulfilled or handed to the logistics provider. After that, you may request a return, refund or replacement under the Refund Policy and applicable law.",
          "MOOD FOOD may cancel at any time for reasons such as stock, production, quality, supplier, pricing, payment or suspected fraud. If it does, the amount paid is refunded.",
        ],
      },
      {
        heading: "Failed payments",
        paragraphs: [
          "If a payment is declined, expired, reversed or disputed, we may retry the charge, ask for another payment method, pause fulfillment, delay delivery, or cancel the order or subscription.",
        ],
      },
      {
        heading: "Address changes and failed delivery",
        paragraphs: [
          "Keep your shipping address, phone and email accurate before each order is processed. We are not responsible for failed delivery or extra fees caused by incorrect or unreachable customer information, to the extent the law allows.",
        ],
      },
      {
        heading: "Returns and refunds",
        paragraphs: [
          "Cancellations, returns, refunds and replacements for special purchase options follow the Refund Policy and the specific offer terms. Your consumer rights for defective, unsafe, expired, damaged, incomplete or misdescribed goods are not affected.",
          "Approved refunds generally go to the original payment method. Timing depends on Shopify, payment providers and banks.",
        ],
      },
      {
        heading: "Questions",
        paragraphs: [
          `Check your order confirmation email or your customer account, or contact us at ${EMAIL}.`,
        ],
      },
    ],
  },

  "legal-notice": {
    title: "Legal notice",
    intro:
      "This website is operated by MOOD COMMERCIAL CORP. (MOOD FOOD), Warehouse 2, Samaca Rd. Calzada, 1630 Taguig City, Philippines.",
    sections: [
      {
        heading: "Acceptance",
        paragraphs: [
          "By using the site, placing an order or contacting us through it, you accept this notice and the related policies: Terms of Service, Privacy Policy, Refund Policy, Shipping Policy and Cancellation Policy.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "The brand name, logo, content and product materials are owned or licensed by the company. You get a limited personal-use license. Without written consent, copying, reselling, using our trademarks in marketplace or social media content, imitating our packaging, scraping the site, and using site content to train AI systems are prohibited.",
        ],
      },
      {
        heading: "Authorized sales",
        paragraphs: [
          "Genuine products are sold only through this website, official marketplace stores and authorized partners. Resale, repackaging and commercial use are prohibited. We do not verify products bought from other sellers and may decline support for them.",
        ],
      },
      {
        heading: "Using the website",
        items: [
          "Bots, security probing, fake or abusive orders, promotion abuse, impersonation and harassment are prohibited.",
          "Fake reviews, fabricated illness or food safety claims, and false statements made to obtain refunds are prohibited. Truthful reviews and genuine complaints to government agencies are welcome.",
        ],
      },
      {
        heading: "Scam warning",
        paragraphs: [
          `We communicate only through official channels and @moodfood.co emails. We never ask for payment to personal bank or e-wallet accounts, or for OTPs or passwords. Report suspicious messages to ${EMAIL} with the subject "IMPERSONATION".`,
        ],
      },
      {
        heading: "Product information",
        paragraphs: [
          "Product labels are the authoritative source for ingredients, allergens, storage and expiry. Website content is not medical or dietary advice.",
        ],
      },
      {
        heading: "Violations, liability and disputes",
        items: [
          "We may suspend accounts, cancel orders and pursue legal remedies for violations.",
          "To the extent the law allows, liability is limited to the amount paid for the relevant order.",
          `Legal notices must be sent in writing to ${EMAIL} and by courier. Please allow 30 days to resolve a dispute before filing a claim, except for reports to government agencies or urgent injunction requests. Claims must be brought individually, not as class actions.`,
        ],
      },
    ],
  },

  "refund-policy": {
    title: "Refund policy",
    sections: [
      {
        heading: "Change of mind",
        paragraphs: [
          "To the extent the law allows, we do not accept returns, refunds or exchanges for change of mind, taste or texture preference, or ordering errors.",
        ],
      },
      {
        heading: "Reporting windows",
        items: [
          "Report missing, short-packed, wrong, damaged or undelivered parcels within 48 hours of delivery.",
          "Report quality defects within 48 hours of opening, and before the expiry or best-before date.",
          "Food safety concerns or adverse reactions should be reported immediately. They are not subject to the 48-hour windows.",
        ],
      },
      {
        heading: "How to file a claim",
        paragraphs: [
          `Email ${EMAIL} with the subject "CLAIM - [Order Number]". Include photos of the box, product, and batch and expiry codes. Missing or wrong-item claims need a continuous unboxing video showing the sealed parcel and shipping label.`,
          "Orders are recorded on video during packing, and the recordings are kept for at least 30 days after shipment.",
        ],
      },
      {
        heading: "Decisions and remedies",
        items: [
          "We aim to acknowledge claims within 2 business days and decide within 3 business days after receiving complete evidence.",
          "Approved claims can receive a replacement (subject to stock), store credit or a refund, limited to the amount paid for the affected item.",
          "Prepaid refunds go to the original payment method within 3 to 5 business days of approval, then depend on the bank or provider.",
          "Do not send products back unless instructed. For approved returns, we arrange the pickup.",
        ],
      },
      {
        heading: "Cancellations",
        paragraphs: [
          "Orders can be cancelled only before they are packed or handed to the fulfillment partner.",
        ],
      },
      {
        heading: "Not covered",
        items: [
          "Purchases from other sellers or unauthorized resellers.",
          "Damage from storage or handling after delivery.",
          "Products consumed past expiry.",
          "Delivery failures caused by incorrect customer information.",
        ],
      },
      {
        heading: "Chargebacks",
        paragraphs: [
          "Please contact us before filing a chargeback. We may dispute it using our records.",
        ],
      },
    ],
  },

  "privacy-policy": {
    title: "Privacy policy",
    intro:
      "MOOD FOOD (MOOD COMMERCIAL CORP.) explains here how it handles your personal information. This is a summary of the policy published on moodfood.co.",
    sections: [
      {
        heading: "What we collect",
        paragraphs: [
          "Contact details, order and purchase history, payment and billing data, account details, support communications, device and browsing data, marketing preferences, content you submit, and fraud and compliance records. We collect it from you, automatically (cookies, pixels, logs), and from Shopify and our payment, logistics, marketing and review partners.",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: [
          "To operate the store, process orders and refunds, give customer support, investigate food safety and product complaints, market and advertise, run analytics, prevent fraud, and comply with the law.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "Shopify, service providers, payment and fraud-prevention parties, logistics partners, advertising and analytics partners, government authorities where required, and acquirers in a corporate transaction.",
        ],
      },
      {
        heading: "Cookies and tracking",
        paragraphs: [
          "We use cookies, pixels and similar tools for site operation, analytics and advertising. You can manage them in your browser or platform settings, though some features may stop working.",
        ],
      },
      {
        heading: "Shopify and transfers",
        paragraphs: [
          "The store runs on Shopify, which processes data as a provider and under its own practices, possibly outside the Philippines. Data may be processed in the Philippines and other countries, with safeguards where required.",
        ],
      },
      {
        heading: "Children",
        paragraphs: ["Our services are not intended for minors without parental or guardian consent."],
      },
      {
        heading: "Security and retention",
        paragraphs: [
          "We use reasonable safeguards, but no system is guaranteed secure. We keep data as long as needed for the stated purposes or as the law requires, including tax, safety and legal claims.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Subject to legal limits, you may access, correct, object to, delete or port your data, withdraw consent, and complain. You can opt out of promotional emails and SMS; transactional messages continue. In the Philippines, the National Privacy Commission handles data privacy complaints.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Privacy questions: hello@moodfood.co. Order concerns: order@moodfood.co. Warehouse 2 Samaca Rd., Calzada, Taguig City, Philippines 1630.",
        ],
      },
    ],
  },

  "terms-of-service": {
    title: "Terms of service",
    intro:
      "MOOD COMMERCIAL CORP., trading as MOOD FOOD, operates this site. Using it means you agree to these terms and the policies they reference. This is a summary of the terms published on moodfood.co.",
    sections: [
      {
        heading: "Eligibility and accounts",
        paragraphs: [
          "You must be 18 or older, or use the site with parental or guardian consent. Give accurate information and keep your account credentials secure.",
        ],
      },
      {
        heading: "Orders, prices and promotions",
        paragraphs: [
          "Placing an order does not guarantee acceptance. We may cancel orders for stock, pricing, payment, fraud or address problems, and paid orders that are cancelled are refunded. Prices, shipping fees and promotions can change at any time, and promo codes can be voided if abused or applied in error.",
        ],
      },
      {
        heading: "Product information and food safety",
        paragraphs: [
          "Product labels take precedence. Site content is not medical or dietary advice. Products may contain or be processed alongside allergens. Inspect deliveries on receipt and report concerns to hello@moodfood.co, keeping the product and packaging.",
        ],
      },
      {
        heading: "Shelf life and delivery",
        paragraphs: [
          "Store products as the label directs. Risk of failed delivery caused by incorrect information or unavailability is the customer's.",
        ],
      },
      {
        heading: "Returns, refunds and payments",
        paragraphs: [
          "Returns and refunds are governed by the Refund Policy, and your rights under Philippine consumer law are preserved. Unjustified chargebacks can lead to account suspension and cost recovery.",
        ],
      },
      {
        heading: "Use of the site",
        paragraphs: [
          "The brand, content and materials belong to the company. Fake orders, resale, scraping and misuse of the site are prohibited. Reviews and submissions grant the company a broad license to use them.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "The site is provided as is and as available. Liability is generally capped at the amount paid for the relevant order, and indirect damages are excluded. Events beyond our control, such as typhoons or courier delays, excuse non-performance.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "Philippine law governs, and disputes go to the courts of Makati City. Please contact us first to attempt a good-faith resolution. Updates are posted on this page, and continued use means acceptance.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: ["hello@moodfood.co, or Warehouse 2 Samaca Rd., Calzada, Taguig City."],
      },
    ],
  },

  "shipping-policy": {
    title: "Shipping policy",
    sections: [
      {
        heading: "Order processing and payment",
        paragraphs: [
          "Orders are subject to verification, stock, payment confirmation and fraud checks. We may hold, delay, cancel or refuse orders with incomplete or suspicious details. Orders are prepaid at checkout via GCash, Maya, QR Ph or major cards. Cash on delivery is currently unavailable.",
        ],
      },
      {
        heading: "Estimated first-attempt delivery",
        items: [
          "Metro Manila: 2 to 3 business days",
          "Luzon: 4 to 6 business days",
          "Visayas: 7 to 10 business days",
          "Mindanao: 12 to 14 business days",
          "Palawan and remote areas: 14+ business days",
        ],
        paragraphs: ["These are estimates and are not guaranteed."],
      },
      {
        heading: "Shipping fees",
        paragraphs: [
          "Fees are shown at checkout. Qualifying orders of ₱750 or more ship free unless a promotion says otherwise. Fees may be non-refundable once an order is processed or shipped.",
        ],
      },
      {
        heading: "Delays and delivery attempts",
        paragraphs: [
          "Holidays, weather, courier backlogs and other events can cause delays; we are not liable for third-party delays. A second attempt may be made depending on courier policy. Failed attempts caused by the customer can lead to cancellation or extra charges.",
        ],
      },
      {
        heading: "Your responsibilities",
        paragraphs: [
          "Provide a complete address, a reachable phone number and recipient details. Changes may not be possible once an order is handed off for shipping. Delivery is complete once someone who appears authorized at the address accepts the parcel. Store products as the label directs, and inspect your order on arrival.",
        ],
      },
      {
        heading: "Lost or damaged parcels",
        paragraphs: [
          `Email ${EMAIL} with your order number, delivery details and photos. Remedies follow the Refund Policy and the courier's investigation. Refused or returned orders may be cancelled, and related costs may be deducted from any refund.`,
        ],
      },
    ],
  },
};

export const INFO_PAGE_HANDLES = [
  "faqs",
  "contact",
  "where-to-buy",
  "cancellation-policy",
  "legal-notice",
] as const;

export const POLICY_HANDLES = [
  "refund-policy",
  "privacy-policy",
  "terms-of-service",
  "shipping-policy",
] as const;
