import React from "react";
import { Link } from "react-router-dom";
import "../styles/simple-page.css";

export default function NotFoundPage() {
  return (
    <div className="container simple-page">
      <h1 className="simple-page-title">404</h1>
      <p className="simple-page-text">ไม่พบหน้าที่คุณกำลังมองหา</p>
      <Link to="/" className="btn btn-primary">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
