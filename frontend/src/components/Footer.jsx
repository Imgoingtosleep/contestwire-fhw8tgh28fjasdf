import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        © {new Date().getFullYear()} News & Video Contest. All rights reserved.
      </div>
    </footer>
  );
}
