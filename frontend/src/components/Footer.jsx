import React from "react";
import site from "../data/site.json";
import SocialIcon from "./SocialIcon";
import logo from "../assets/images/logos/logo-road-safety.png";
import partnerToyota from "../assets/images/logos/partner-toyota.png";
import partnerMoph from "../assets/images/logos/partner-moph.png";
import partnerBma from "../assets/images/logos/partner-bma.png";
import "../styles/footer.css";

const PARTNERS = [
  { id: "toyota", src: partnerToyota, alt: "โตโยต้า" },
  { id: "moph", src: partnerMoph, alt: "กระทรวงสาธารณสุข" },
  { id: "bma", src: partnerBma, alt: "กรุงเทพมหานคร" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <section className="footer-partners">
        <div className="container">
          <h2 className="footer-partners-title">PARTNERS</h2>
          <ul className="footer-partners-list">
            {PARTNERS.map((p) => (
              <li key={p.id}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img
              src={logo}
              alt="โตโยต้า ถนนสีขาว"
              className="footer-logo"
              loading="lazy"
            />
            <p className="footer-company">{site.company}</p>
            <p className="footer-address">{site.address}</p>
          </div>

          <div className="footer-contact">
            <h3 className="footer-contact-title">CONTACT</h3>

            <p className="footer-contact-row">
              <svg
                className="footer-contact-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>
                <a href={`tel:${site.phone.replace(/-/g, "")}`}>{site.phone}</a>
                <br />
                {site.callCenter}
              </span>
            </p>

            <p className="footer-contact-row">
              <svg
                className="footer-contact-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.24l-8 4.76-8-4.76V6l8 4.76L20 6v2.24z" />
              </svg>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>

            <ul className="footer-social">
              {site.social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    <SocialIcon name={s.id} className="footer-social-icon" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
