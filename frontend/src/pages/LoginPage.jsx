import React from "react";
import { Link } from "react-router-dom";
import "../styles/simple-page.css";

export default function LoginPage() {
  return (
    <div className="container simple-page">
      <h1 className="simple-page-title">LOGIN</h1>
      <p className="simple-page-text">
        ระบบสมาชิกและหลังบ้านสำหรับผู้ดูแลอยู่ระหว่างการพัฒนา
        หากต้องการส่งผลงานเข้าประกวด สามารถกรอกแบบฟอร์มได้ที่หน้า YOUTH CAMP
      </p>
      <Link to="/youth-camp#apply" className="btn btn-primary">
        ไปที่แบบฟอร์มสมัคร
      </Link>
    </div>
  );
}
