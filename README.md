# Mood Food storefront redesign

A redesign concept for [Mood Food](https://moodfood.co), the high-protein peanut butter brand from the Philippines. It is **inspired by Mood Food** and built from their brand: the name, the three jars (Chunky, Recover, Energy), the product photos and the claims on the page come from the brand and belong to Mood Food. This is not an official Mood Food site.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Cache Components) and React 19
- [Shopify Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen) 2026.10 for the Storefront API client, cart, and request handlers
- [three.js](https://threejs.org) for the 3D jar
- Tailwind CSS 4 and a hand-written stylesheet (`app/brand.css`)
- pnpm

## What's in it

- Home page: announcement bar, centred-logo header, fitted headline, pinned scroll scenes with a WebGL jar, products section, brand statement and footer.
- Storefront: collections (`/collections/spreads`, `/bar`, `/kids`), product pages, search, cart (drawer and `/cart` page), and customer account.
- Info and policy pages: `/pages/*` and `/policies/*` read from Shopify and fall back to a copy of the brand's own text when the store has none.
- Prices in Philippine pesos (PHP). The market is set in one place, `lib/market.ts`.

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

By default the app points at [mock.shop](https://mock.shop), Shopify's tokenless demo store. It has no peanut butter, so the jars show "Coming soon to the store" and no Add button. To try add-to-cart against the demo store, map the jar handles to products it does have:

```bash
JAR_HANDLE_CHUNKY=slides JAR_HANDLE_RECOVER=sweatpants JAR_HANDLE_ENERGY=men-t-shirt pnpm build
JAR_HANDLE_CHUNKY=slides JAR_HANDLE_RECOVER=sweatpants JAR_HANDLE_ENERGY=men-t-shirt pnpm start
```

The jar products are read when the page is built, so set these variables for both `build` and `start`. Prices from mock.shop show in its own currency (CA$), because it doesn't sell in PHP.

### Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript and `hydrogen gql check` |

## Connecting a real store

1. Create a Shopify store that sells in PHP (Markets) and add the products: Chunky, Recover and Energy, each with 250g and 500g variants, plus Bar and KiDS.
2. Create collections with the handles `spreads`, `bar` and `kids`.
3. Fill in the variables in `.env.example`: `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `SHOP_ID`, `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`, `CUSTOMER_ACCOUNT_SESSION_SECRET`, and the `JAR_HANDLE_*` product handles. Customer login needs a public HTTPS address.
4. Add the policies and the pages (FAQs, Contact, Where to buy, Cancellation policy, Legal notice) in Shopify.

## Still to do

- Real Bar and KiDS pack photos (the current ones are placeholders).
- Photos of the back of each jar. The 3D jar's back is generated from the front photo.
- Social media links in the brand section.
- Check the phone layout of the scroll scenes with the real two-size products.

## Deploying

Vercel works as-is for Next.js 16. Set the environment variables above in the project settings. Shopify Oxygen would need rework, because Hydrogen's Oxygen guide covers React Router only.

## Credits

Brand, product photos and copy: Mood Food. This redesign concept and its code are a separate proposal inspired by the brand.
