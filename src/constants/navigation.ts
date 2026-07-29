export const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Products",   href: "/products" },
  { label: "Services",   href: "/services" },
  { label: "About",      href: "/about" },
  { label: "Contact",    href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About Us",      href: "/about" },
    { label: "Services",      href: "/services" },
    { label: "Contact",       href: "/contact" },
  ],
  listings: [
    { label: "Properties",    href: "/properties" },
    { label: "Products",      href: "/products" },
    { label: "Submit Query",  href: "/submit-query" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use",   href: "/terms-and-conditions" },
  ],
} as const;
