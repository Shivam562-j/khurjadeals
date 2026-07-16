export default function ComingSoon() {
  return (
    <main className="coming-soon-page">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="content-wrapper">

        {/* Logo */}
        <div className="logo-container">
          <img src="/logos/logo.png" alt="Khurja Deals Logo" className="logo" />
        </div>

        {/* Live badge */}
        <div className="badge">
          <span className="badge-dot" />
          Something amazing is coming
        </div>

        {/* Heading */}
        <h1 className="heading">
          Coming <span className="heading-accent">Soon</span>
        </h1>

        {/* Tagline */}
        <p className="tagline">Khurja&apos;s Own Marketplace</p>

        {/* Divider */}
        <div className="divider">
          <div className="divider-line" />
          <div className="divider-icon">✦</div>
          <div className="divider-line" />
        </div>

        {/* Description */}
        <p className="description">
          We are currently building our platform. For any inquiries or
          updates, please contact us at the number below.
        </p>

        {/* Contact Card */}
        <div className="contact-card">
          <p className="contact-label">Contact us directly</p>

          <div className="contact-buttons">
            {/* Phone */}
            <a href="tel:+917906896546" className="contact-btn phone-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18" height="18"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6.29 6.29l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
              </svg>
              +91 79068 96546
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/917906896546"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn whatsapp-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18" height="18"
                viewBox="0 0 24 24" fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="footer-text">
          © {new Date().getFullYear()} Khurja Deals · All rights reserved.
        </p>

      </div>
    </main>
  );
}
