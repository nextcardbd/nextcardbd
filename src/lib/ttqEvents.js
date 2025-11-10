// © Mahin LTD Developer Tanvir
// Your Role with Me:  
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

const num = (v) => Number(v || 0);

/**
 * Listing/Home: send product_group view with a list of slugs
 */
export const ttqViewProductGroup = ({ slugs = [], currency = "BDT" }) => {
  if (!window.ttq || !slugs.length) return;
  window.ttq.track("ViewContent", {
    content_type: "product_group",
    contents: slugs.map((s) => ({ content_id: s, content_type: "product" })),
    value: 0,
    currency,
  });
};

/**
 * Single product view (optional helper if/when you wire product page)
 */
export const ttqViewProduct = ({ slug, price, currency = "BDT" }) => {
  if (!window.ttq || !slug) return;
  window.ttq.track("ViewContent", {
    content_type: "product",
    contents: [{ content_id: slug }],
    value: num(price),
    currency,
  });
};

/**
 * AddToCart (optional – call from your button)
 */
export const ttqAddToCart = ({ slug, price, qty = 1, currency = "BDT" }) => {
  if (!window.ttq || !slug) return;
  window.ttq.track("AddToCart", {
    value: num(price) * num(qty),
    currency,
    contents: [
      {
        content_id: slug,
        content_type: "product",
        quantity: num(qty),
        price: num(price),
      },
    ],
  });
};

/**
 * Purchase/CompletePayment (optional – call on success)
 */
export const ttqPurchaseOnce = ({ orderId, items = [], currency = "BDT" }) => {
  if (!window.ttq || !items.length) return;
  const guard = `ttq_purchase_${orderId || "noid"}`;
  if (sessionStorage.getItem(guard)) return;

  const total = items.reduce((sum, it) => sum + num(it.price) * num(it.qty || 1), 0);

  window.ttq.track("CompletePayment", {
    value: total,
    currency,
    contents: items.map((it) => ({
      content_id: it.slug,
      content_type: "product",
      quantity: num(it.qty || 1),
      price: num(it.price),
    })),
    description: orderId ? `Order #${orderId}` : undefined,
  });

  sessionStorage.setItem(guard, "1");
};
