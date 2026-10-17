/** Peanut butter scrolls to scene 1 (JarLink); `#products` entries scroll to the products section. */
export const PEANUT_BUTTER_HREF = "/#chunky";
export const PRODUCTS_HREF = "/#products";

export const NAV_LEFT: { label: string; href: string }[] = [
  { label: "Peanut butter", href: PEANUT_BUTTER_HREF },
  { label: "Bar", href: PRODUCTS_HREF },
  { label: "Kids", href: PRODUCTS_HREF },
  { label: "Shop all", href: PRODUCTS_HREF },
  { label: "Where to buy", href: "/pages/where-to-buy" },
  { label: "Contact us", href: "/pages/contact" },
];

export type FooterLink = { label: string; href: string };

export const FOOTER_LINKS: {
  help: FooterLink[];
  policies: FooterLink[];
  own: string;
} = {
  help: [
    { label: "FAQs", href: "/pages/faqs" },
    { label: "Contact Us", href: "/pages/contact" },
  ],
  policies: [
    { label: "Refund policy", href: "/policies/refund-policy" },
    { label: "Privacy policy", href: "/policies/privacy-policy" },
    { label: "Terms of service", href: "/policies/terms-of-service" },
    { label: "Shipping policy", href: "/policies/shipping-policy" },
    { label: "Cancellation policy", href: "/pages/cancellation-policy" },
    { label: "Legal notice", href: "/pages/legal-notice" },
  ],
  own: "MOOD FOOD · Powered by Shopify",
};
