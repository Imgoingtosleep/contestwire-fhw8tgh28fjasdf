import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import HomePage from "./pages/HomePage";
import YouthCampPage from "./pages/YouthCampPage";
import EventsPage from "./pages/EventsPage";
import ArticlesPage from "./pages/ArticlesPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AboutPage from "./pages/AboutPage";
import ShowcasePage from "./pages/ShowcasePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <ScrollToTop />
      <Navbar />

      <main id="main-content" className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/youth-camp" element={<YouthCampPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<NewsDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* เส้นทางเดิม — คงไว้ให้ลิงก์เก่ายังใช้งานได้ */}
          <Route path="/contest" element={<Navigate to="/youth-camp" replace />} />
          <Route path="/news" element={<Navigate to="/articles" replace />} />
          <Route path="/news/:id" element={<LegacyNewsRedirect />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

/** เปลี่ยนเส้นทาง /news/:id เดิมไปยัง /articles/:id */
function LegacyNewsRedirect() {
  const id = window.location.pathname.split("/").pop();
  return <Navigate to={`/articles/${id}`} replace />;
}
