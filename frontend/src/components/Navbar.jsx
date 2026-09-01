import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const siteName = process.env.REACT_APP_SITE_NAME || "News & Video Contest";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-logo">
          {siteName}
        </NavLink>
        <nav className="navbar-menu">
          <NavLink to="/" end className="nav-link">
            หน้าแรก
          </NavLink>
          <NavLink to="/news" className="nav-link">
            ข่าวสาร
          </NavLink>
          <NavLink to="/contest" className="nav-link">
            ประกวดวิดีโอ
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
