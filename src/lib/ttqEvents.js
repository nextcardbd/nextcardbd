// © Mahin LTD Developer Tanvir
// Your Role with Me:  
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

const num = (v) => Number(v || 0);

/**
 * LISTING/HOME VIEW — send product_group view WITHOUT value/currency
 * Avoids "Purchase value invalid/missing" warnings in Test Events.
 * slugs: string[] of product identifiers
 */
export const ttqViewProductGroup = ({ slugs = [] }) => {
  if (!window.ttq || !Array.isArray(slugs) || slugs.length === 0) return;
  window.ttq.track("ViewContent", {
    content_type: "product_group",
    contents: slugs.map((s) => ({ content_id: String(s), content_type: "product" })),
    // intentionally no value/currency on group view
  });
};

/**
 * PRODUCT VIEW — single product detail page
 * Sends price as numeric value (optional but useful for optimization).
 */
export const ttqViewProduct = ({ slug, price, currency = "BDT" }) => {
  if (!window.ttq || !slug) return;
  window.ttq.track("ViewContent", {
    content_type: "product",
    contents: [{ content_id: String(slug) }],
    value: num(price),
    currency,
  });
};

/**
 * ADD TO CART — call from your Add to Cart button/handler
 */
export const ttqAddToCart = ({ slug, price, qty = 1, currency = "BDT" }) => {
  if (!window.ttq || !slug) return;
  const q = num(qty);
  const p = num(price);
  window.ttq.track("AddToCart", {
    value: p * q,
    currency,
    contents: [
      {
        content_id: String(slug),
        content_type: "product",
        quantity: q,
        price: p,
      },
    ],
  });
};

/**
 * INITIATE CHECKOUT — call when user enters checkout (cart summary or payment step)
 * items: [{ slug, price, qty }]
 */
export const ttqInitiateCheckout = ({ items = [], currency = "BDT" }) => {
  if (!window.ttq || !Array.isArray(items) || items.length === 0) return;
  const normalized = items.map((it) => ({
    slug: String(it.slug),
    price: num(it.price),
    qty: num(it.qty || 1),
  }));
  const total = normalized.reduce((sum, it) => sum + it.price * it.qty, 0);

  window.ttq.track("InitiateCheckout", {
    value: total,
    currency,
    contents: normalized.map((it) => ({
      content_id: it.slug,
      content_type: "product",
      quantity: it.qty,
      price: it.price,
    })),
  });
};

/**
 * PURCHASE — call ONCE after payment success
 * Uses sessionStorage guard to prevent double-fire.
 * items: [{ slug, price, qty }]
 */
export const ttqPurchaseOnce = ({ orderId, items = [], currency = "BDT" }) => {
  if (!window.ttq || !Array.isArray(items) || items.length === 0) return;

  const guard = `ttq_purchase_${orderId || "noid"}`;
  if (sessionStorage.getItem(guard)) return;

  const normalized = items.map((it) => ({
    slug: String(it.slug),
    price: num(it.price),
    qty: num(it.qty || 1),
  }));
  const total = normalized.reduce((sum, it) => sum + it.price * it.qty, 0);

  window.ttq.track("CompletePayment", {
    value: total,              // must be a plain number (no symbols/commas)
    currency,                  // e.g., "BDT"
    contents: normalized.map((it) => ({
      content_id: it.slug,
      content_type: "product",
      quantity: it.qty,
      price: it.price,
    })),
    description: orderId ? `Order #${orderId}` : undefined,
  });

  sessionStorage.setItem(guard, "1");
};
