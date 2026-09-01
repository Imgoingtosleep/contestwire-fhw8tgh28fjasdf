import React from "react";
import ContestForm from "../components/ContestForm";

export default function ContestPage() {
  return (
    <div className="page container">
      <h1 className="page-title">สมัครส่งผลงานเข้าประกวดวิดีโอ</h1>
      <p className="page-description">
        กรอกข้อมูลด้านล่างพร้อมแนบลิงก์วิดีโอ หรืออัปโหลดไฟล์ผลงานของคุณ
      </p>
      <ContestForm />
    </div>
  );
}
