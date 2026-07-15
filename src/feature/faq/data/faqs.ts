export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "about-artworks",
    title: "About the artworks",
    items: [
      {
        id: "religious-annotation",
        question: "Do the artworks have any religious annotation?",
        answer:
          "No. They are only for decoration and beautification of spaces. The themes may be inspired by Indian mythology and tradition, but the artworks are purely decorative in nature.",
      },
      {
        id: "handmade",
        question: "Are all artworks handmade?",
        answer:
          "Yes, all artworks on ArtiSun are 100% handmade by skilled artisans using traditional techniques passed down through generations.",
      },
      {
        id: "types-offered",
        question: "What types of artworks do you offer?",
        answer:
          "We offer:\nCanvas Pattachitra paintings\nPalm Leaf (Patta / Leaf) art\nSilk Pattachitra paintings\nHandcrafted wooden decorative items\n\nAll pieces are created by master artisans from Odisha, India.",
      },
      {
        id: "silk-materials",
        question: "What material is used in silk paintings?",
        answer:
          "Our silk paintings are crafted on silk cloth using traditional Pattachitra techniques. Each piece showcases intricate detailing and vibrant natural colors.",
      },
      {
        id: "price-on-request",
        question: 'What does "Price on Request" mean?',
        answer:
          "Some large-format or custom artworks are priced based on size, material, and artisan availability. Please contact us via WhatsApp or email to get the exact price and availability details.",
      },
    ],
  },
  {
    id: "ordering-payment",
    title: "Ordering & Payment",
    items: [
      {
        id: "how-to-purchase",
        question: "How can I purchase an artwork?",
        answer:
          'You can order directly through our shop page. For artworks marked "Price on Request," please contact us via WhatsApp or email and we will guide you through the order process.',
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer:
          "We accept the following payment methods:\nIndia: UPI, GPay, PhonePe, Paytm, Net Banking, Debit/Credit Cards\nInternational: PayPal, Bank Transfer (on request)\nGST Invoice: Available on request. Please share your GSTIN at the time of ordering.\n\nAll payments must be completed before dispatch.",
      },
      {
        id: "gst",
        question: "Is GST applicable on purchases?",
        answer:
          "GST may be applicable depending on the product category and order value. A proper GST invoice will be provided upon request. Please share your GSTIN when placing the order via WhatsApp or email.",
      },
    ],
  },
  {
    id: "delivery-shipping",
    title: "Delivery & Shipping",
    items: [
      {
        id: "delivery-time",
        question: "How long does delivery take?",
        answer:
          "Delivery time is a minimum of 2 months from the date of order confirmation and payment.\n\nActual delivery time may vary depending on:\nArtisan availability and current workload\nSize and complexity of the artwork\nShipping destination (India or international)\n\nWe will keep you updated on the progress of your order.",
      },
      {
        id: "ship-india",
        question: "Do you ship across India?",
        answer:
          "Yes, we ship to all locations across India. Artworks are carefully packed to ensure safe delivery.",
      },
      {
        id: "international-shipping",
        question: "Do you offer international shipping?",
        answer:
          "Yes, international shipping is available on request. Shipping charges and timelines vary by destination. Please contact us via WhatsApp or email for a shipping quote before placing your order.",
      },
    ],
  },
  {
    id: "cancellation-returns",
    title: "Cancellation, Returns & Refunds",
    items: [
      {
        id: "cancellation",
        question: "What is the cancellation policy?",
        answer:
          "Orders can be cancelled at least 24 hours before the scheduled courier pickup time.\n\nOrders can only be replaced on call / via WhatsApp only. No cancellation allowed after dispatch.",
      },
      {
        id: "return-exchange",
        question: "What is the return and exchange policy?",
        answer:
          "We take great care in packing every artwork. However, if you wish to return a product:\nReturn requests must be raised within 48 hours of delivery\nReturn courier charges are to be borne by the customer\nRefund will be initiated only after the artwork is received back by us in original, undamaged condition\nRefund will be processed within 7–10 business days of receipt\n\nPlease WhatsApp us with photos and order details before initiating a return.",
      },
      {
        id: "damaged-arrival",
        question: "What if my artwork arrives damaged?",
        answer:
          "Please contact us within 48 hours of delivery with clear photographs of the damage. We will review the case and arrange a replacement or refund as appropriate.",
      },
    ],
  },
];

/** Featured FAQs shown on the home page. */
export const HOME_FAQ_IDS = [
  "religious-annotation",
  "handmade",
  "how-to-purchase",
  "delivery-time",
  "return-exchange",
] as const;

export function getAllFaqItems(): FaqItem[] {
  return FAQ_CATEGORIES.flatMap((category) => category.items);
}

export function getHomeFaqs(): FaqItem[] {
  const byId = new Map(getAllFaqItems().map((item) => [item.id, item]));
  return HOME_FAQ_IDS.map((id) => byId.get(id)).filter(
    (item): item is FaqItem => Boolean(item),
  );
}
