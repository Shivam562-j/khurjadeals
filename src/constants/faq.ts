export interface FAQItem {
  id: string;
  category: "general" | "details";
  categoryLabel: string;
  question: string;
  answer: string;
  bullets?: string[];
}

export const GENERAL_FAQS: FAQItem[] = [
  {
    id: "gen-1",
    category: "general",
    categoryLabel: "1. Homepage FAQs (General Platform Help)",
    question: "What is KhurjaDeals and how does it work?",
    answer:
      "KhurjaDeals is a local online marketplace that connects buyers and sellers in Khurja and nearby areas. You can buy, sell, or rent used products (bikes, cars, electric vehicles/EV, mobiles, laptops, fridge, AC, washing machine) and real estate properties (houses, shops, land). We directly connect buyers with sellers—there are no middleman fees or commissions involved.",
  },
  {
    id: "gen-2",
    category: "general",
    categoryLabel: "1. Homepage FAQs (General Platform Help)",
    question: "Is it free to create an account and post listings on KhurjaDeals?",
    answer:
      "Yes! Creating an account and listing your products or properties on KhurjaDeals is 100% FREE. We do not charge any commission on your deals.",
  },
  {
    id: "gen-3",
    category: "general",
    categoryLabel: "1. Homepage FAQs (General Platform Help)",
    question: "How can I protect myself from advance payment scams?",
    answer:
      "Never send advance payments, booking fees, or scan QR codes before physically inspecting the product or property in person. All transactions on KhurjaDeals are strictly between the buyer and seller. Always meet the seller, inspect the item thoroughly, and pay only after you are satisfied.",
  },
  {
    id: "gen-4",
    category: "general",
    categoryLabel: "1. Homepage FAQs (General Platform Help)",
    question: "Does KhurjaDeals provide delivery or process payments?",
    answer:
      "No. KhurjaDeals does not offer delivery, shipping, or payment processing services. We only provide a platform to connect local buyers and sellers. Inspecting items, negotiating prices, and arranging transportation must be handled directly between the buyer and seller.",
  },
  {
    id: "gen-5",
    category: "general",
    categoryLabel: "1. Homepage FAQs (General Platform Help)",
    question: "What should I do if I find a fake listing or suspicious user?",
    answer:
      "If you suspect a listing is fake or someone tries to scam you, click the 'Report' button on the listing page or contact us immediately via Email (khurjadeals@gmail.com) or Phone (+91 9258550570). We will review and block such accounts promptly.",
  },
];

export const DETAILS_FAQS: FAQItem[] = [
  {
    id: "det-1",
    category: "details",
    categoryLabel: "2. Details Page FAQs (Product / Property Listing Page)",
    question: "How do I contact the seller?",
    answer:
      "On the listing details page, click the 'Call' or 'WhatsApp' button to get in direct contact with the seller. You can discuss the price, ask questions, and arrange a time and place to inspect the item.",
  },
  {
    id: "det-2",
    category: "details",
    categoryLabel: "2. Details Page FAQs (Product / Property Listing Page)",
    question: "What should I inspect before buying a product or property?",
    answer:
      "Please inspect the item thoroughly according to the listing category:",
    bullets: [
      "Second-hand Goods: Check the working condition of the item in person. Always ask for original bills, boxes, and valid ID proofs if applicable.",
      "Real Estate: Visit the property in person and verify legal ownership documents (Registry/Khasra) with local authorities before making any deal.",
    ],
  },
  {
    id: "det-3",
    category: "details",
    categoryLabel: "2. Details Page FAQs (Product / Property Listing Page)",
    question: "Where should I meet the buyer or seller for a deal?",
    answer:
      "Always choose a safe, well-lit public place during daytime hours (such as a busy market, town square, or known landmark). Avoid meeting in isolated locations or private places alone.",
  },
  {
    id: "det-4",
    category: "details",
    categoryLabel: "2. Details Page FAQs (Product / Property Listing Page)",
    question: "What happens if the product turns out to be defective after purchase?",
    answer:
      "KhurjaDeals does not guarantee the condition, quality, or warranty of any listed item. Please inspect the product thoroughly before making a payment. Any issues after the deal is completed must be resolved directly between the buyer and the seller.",
  },
  {
    id: "det-5",
    category: "details",
    categoryLabel: "2. Details Page FAQs (Product / Property Listing Page)",
    question: "Is the listed price final?",
    answer:
      "The price shown is set by the seller. You can negotiate the price directly with the seller via Call or WhatsApp, or request additional photos/videos of the item before meeting up.",
  },
];

export const ALL_FAQS: FAQItem[] = [...GENERAL_FAQS, ...DETAILS_FAQS];
