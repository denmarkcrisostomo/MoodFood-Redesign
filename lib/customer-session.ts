import { createCustomerSession } from "@shopify/hydrogen/customer-account";

// Customer Account API needs a real store (mock.shop does not support it).
// Until SHOP_ID and the client ID are set, account handlers are simply not registered.
export const customerSession =
  process.env.SHOP_ID && process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
    ? createCustomerSession({
        shopId: process.env.SHOP_ID,
        customerAccountApiClientId:
          process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      })
    : null;
