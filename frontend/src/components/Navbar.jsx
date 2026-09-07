import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/images/logos/logo-road-safety.png";
import "../styles/navbar.css";

const MENU = [
  { to: "/youth-camp", label: "YOUTH CAMP" },
  { to: "/events", label: "EVENTS" },
  { to: "/articles", label: "ARTICLES" },
  { to: "/about", label: "ABOUT US" },
];

export default function Navbar() {
  const siteName = process.env.REACT_APP_SITE_NAME || "โตโยต้า ถนนสีขาว";
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // ปิดเมนูอัตโนมัติเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ล็อกการเลื่อนหน้าจอขณะเปิดเมนูบนมือถือ
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-logo" aria-label={siteName}>
          <img src={logo} alt={siteName} width="115" height="62" />
        </NavLink>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={open}
          aria-controls="primary-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={open ? "navbar-toggle-bars is-open" : "navbar-toggle-bars"}
          />
        </button>

        <nav
          id="primary-menu"
          className={open ? "navbar-menu is-open" : "navbar-menu"}
        >
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}

          <span className="navbar-divider" aria-hidden="true" />

          <span className="navbar-lang" title="ภาษาไทย">
            TH
          </span>

          <NavLink to="/login" className="btn btn-blue navbar-login">
            LOGIN
          </NavLink>
        </nav>

        <div
          className={open ? "navbar-backdrop is-open" : "navbar-backdrop"}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
