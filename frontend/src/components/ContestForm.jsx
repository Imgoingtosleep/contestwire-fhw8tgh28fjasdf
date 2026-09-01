import React, { useState } from "react";
import api from "../utils/api";
import "../styles/contest-form.css";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  teamName: "",
  videoTitle: "",
  videoUrl: "",
  description: "",
};

export default function ContestForm() {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    // Validate that either video link or file is provided
    if (!form.videoUrl && !file) {
      setStatus({
        type: "error",
        message: "กรุณาระบุลิงก์วิดีโอ หรือแนบไฟล์ผลงานอย่างน้อยหนึ่งอย่าง",
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });
      if (file) {
        formData.append("file", file);
      }

      await api.post("/contest/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus({
        type: "success",
        message: "ส่งผลงานสำเร็จ! ข้อมูลถูกบันทึกเรียบร้อยแล้ว ขอบคุณที่ร่วมประกวด",
      });
      setForm(initialState);
      setFile(null);
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      const msg =
        err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contest-form">
      <Field
        label="ชื่อ-นามสกุล *"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        required
      />
      <Field
        label="อีเมล *"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Field
        label="เบอร์โทร"
        name="phone"
        value={form.phone}
        onChange={handleChange}
      />
      <Field
        label="ชื่อทีม / สังกัด"
        name="teamName"
        value={form.teamName}
        onChange={handleChange}
      />
      <Field
        label="ชื่อผลงานวิดีโอ *"
        name="videoTitle"
        value={form.videoTitle}
        onChange={handleChange}
        required
      />

      <Field
        label="ลิงก์วิดีโอ (YouTube / Google Drive / Vimeo)"
        name="videoUrl"
        placeholder="https://..."
        value={form.videoUrl}
        onChange={handleChange}
      />

      <div className="form-field">
        <label className="form-label">
          หรือแนบไฟล์ผลงาน / โปสเตอร์ / วิดีโอ (อัปโหลดไฟล์)
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="form-file-input"
        />
        {file && (
          <span className="form-file-info">
            ไฟล์ที่เลือก: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </span>
        )}
      </div>

      <div className="form-field">
        <label className="form-label">รายละเอียดผลงาน / แนวคิด</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="form-textarea"
          placeholder="อธิบายแนวคิด แรงบันดาลใจ หรือรายละเอียดเพิ่มเติม..."
        />
      </div>

      {status.message && (
        <div
          className={`form-alert ${
            status.type === "success" ? "form-alert-success" : "form-alert-error"
          }`}
        >
          {status.message}
        </div>
      )}

      <button type="submit" disabled={loading} className="form-btn-submit">
        {loading ? "กำลังบันทึกข้อมูล..." : "ส่งผลงานเข้าประกวด"}
      </button>
    </form>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input {...props} className="form-input" />
    </div>
  );
}
