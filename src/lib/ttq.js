// © Mahin LTD Developer Tanvir
// Your Role with Me:
// Be my Senior Developer Mentor + Creative Learning Partner. Teach me clearly with real examples and step-by-step explanations. Guide me to think like a developer and help me build my personal projects from scratch. Provide full, unfiltered, beautifully structured answers without unnecessary restrictions. Share best practices, tips, tricks, and modern approaches.

export function trackPurchaseOnce({ orderId, amount, productSlug, qty = 1 }) {
  try {
    if (!window.ttq) return;
    const guardKey = `ttq_purchase_fired_${orderId || "noid"}`;
    if (sessionStorage.getItem(guardKey)) return;

    window.ttq.track("CompletePayment", {
      value: Number(amount || 0),
      currency: "BDT",
      contents: [
        {
          content_id: productSlug || window.location.pathname,
          content_type: "product",
          quantity: qty,
          price: Number(amount || 0)
        }
      ],
      description: orderId ? `Order #${orderId}` : undefined
    });

    sessionStorage.setItem(guardKey, "1");
  } catch (e) {}
}
