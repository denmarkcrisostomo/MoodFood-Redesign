import { gql } from "@shopify/hydrogen/customer-account";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { getAccountContext } from "@/lib/account";
import { toURLSearchParams } from "@/lib/search-params";

export const metadata = { title: "Account" };

const CUSTOMER_QUERY = gql(`
  query CurrentCustomer {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
    }
  }
`);

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function AccountPage({ searchParams }: Props) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="mb-6 text-3xl font-semibold">Account</h1>
      <Suspense fallback={<p role="status">Loading…</p>}>
        <AccountContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

function SignIn({ note }: { note?: string }) {
  return (
    <section className="flex flex-col gap-3">
      {note ? <p className="text-zinc-600">{note}</p> : null}
      {/* Full-document navigation: the handler redirects to Shopify's hosted login. */}
      <a
        href="/account/login?return_to=/account"
        className="w-fit rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      >
        Sign in
      </a>
    </section>
  );
}

async function AccountContent({ searchParams }: Props) {
  await connection();
  const account = await getAccountContext();

  if (!account) {
    return (
      <p className="text-zinc-600">
        Customer accounts are not configured. They need a real Shopify store:
        set SHOP_ID, PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID and
        CUSTOMER_ACCOUNT_SESSION_SECRET.
      </p>
    );
  }

  const { customerSession, requestContext, sessionManager, client } = account;

  if (!(await customerSession.isLoggedIn(sessionManager, requestContext))) {
    return <SignIn />;
  }

  const accessToken = await customerSession.getAccessToken(
    sessionManager,
    requestContext,
  );
  if (!accessToken) {
    // One-shot refresh: a failed refresh falls back to sign-in instead of looping.
    const refreshed = toURLSearchParams(await searchParams).get("refreshed");
    if (refreshed) return <SignIn note="Your session expired. Please sign in again." />;
    redirect("/account/refresh?return_to=/account%3Frefreshed%3D1");
  }

  const { data, errors } = await client.graphql(CUSTOMER_QUERY, { accessToken });
  if (errors || !data?.customer) {
    console.error("[hydrogen] Customer query failed", errors);
    return (
      <p role="alert" className="text-red-700">
        We couldn’t load your account. Please try again.
      </p>
    );
  }

  const { firstName, lastName, emailAddress } = data.customer;
  return (
    <section className="flex flex-col gap-4">
      <p>
        {[firstName, lastName].filter(Boolean).join(" ") || "Customer"}
        <br />
        <span className="text-zinc-600">{emailAddress?.emailAddress}</span>
      </p>
      {/* Native form: the logout handler returns a raw redirect. */}
      <form method="post" action="/account/logout">
        <button type="submit" className="rounded border px-4 py-2">
          Log out
        </button>
      </form>
    </section>
  );
}
