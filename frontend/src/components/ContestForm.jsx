import React, { useState } from "react";
import api from "../utils/api";
import "../styles/contest-form.css";

/* ช่วงนี้เว็บเปิดเป็นเว็บข่าวก่อน ฟอร์มจึงยังแสดงให้เห็นเต็มรูปแบบว่าต้องกรอกอะไรบ้าง
   แต่ไม่รับข้อมูลจริง — ช่องกรอกถูกปิด และไม่มีการยิง API ออกไปเลย
   เปิดกลับได้ด้วยการตั้ง REACT_APP_CONTEST_OPEN=true (ฝั่ง backend ใช้ CONTEST_OPEN) */
const IS_OPEN =
  String(process.env.REACT_APP_CONTEST_OPEN).trim().toLowerCase() === "true";

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
    // กันไว้อีกชั้นเผื่อมีใครปลด disabled ผ่าน devtools
    if (!IS_OPEN) return;
    setLoading(true);
    setStatus({ type: "", message: "" });

    // ต้องมีลิงก์วิดีโอ หรือไฟล์ผลงานอย่างน้อยหนึ่งอย่าง
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
        headers: { "Content-Type": "multipart/form-data" },
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
      {!IS_OPEN && (
        <div className="form-notice" role="status">
          <strong className="form-notice-title">ยังไม่เปิดรับสมัคร</strong>
          <span className="form-notice-body">
            ขณะนี้อยู่ระหว่างเตรียมการ ยังไม่มีการเก็บข้อมูลใด ๆ
            แบบฟอร์มด้านล่างแสดงไว้เพื่อให้เห็นรายการที่ต้องเตรียมล่วงหน้า
            กรุณาติดตามประกาศวันเปิดรับสมัครจากช่องทางของโครงการ
          </span>
        </div>
      )}

      {/* fieldset ปิดช่องกรอกทั้งก้อนในทีเดียว และเบราว์เซอร์ข้าม
          การตรวจ required ให้เอง จึงไม่มีทางกดส่งได้ */}
      <fieldset className="form-fieldset" disabled={!IS_OPEN}>
        <div className="form-grid">
          <Field
            label="ชื่อ-นามสกุล"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <Field
            label="อีเมล"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Field
            label="เบอร์โทรศัพท์"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
          />
          <Field
            label="ชื่อทีม / สังกัด"
            name="teamName"
            value={form.teamName}
            onChange={handleChange}
          />
        </div>

        <Field
          label="ชื่อผลงานวิดีโอ"
          name="videoTitle"
          value={form.videoTitle}
          onChange={handleChange}
          required
        />

        <Field
          label="ลิงก์วิดีโอ (YouTube / Google Drive / Vimeo)"
          name="videoUrl"
          type="url"
          placeholder="https://..."
          value={form.videoUrl}
          onChange={handleChange}
        />

        <div className="form-field">
          <label className="form-label" htmlFor="file-upload">
            หรือแนบไฟล์ผลงาน (วิดีโอ / โปสเตอร์)
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
          <label className="form-label" htmlFor="description">
            รายละเอียดผลงาน / แนวคิด
          </label>
          <textarea
            id="description"
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
            className={
              status.type === "success"
                ? "form-alert form-alert-success"
                : "form-alert form-alert-error"
            }
            role="status"
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !IS_OPEN}
          className="btn btn-primary btn-block form-submit"
        >
          {!IS_OPEN
            ? "ยังไม่เปิดรับสมัคร"
            : loading
            ? "กำลังบันทึกข้อมูล..."
            : "ส่งผลงานเข้าประกวด"}
        </button>
      </fieldset>
    </form>
  );
}

function Field({ label, name, required, ...props }) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={name}>
        {label}
        {required && <span className="form-required"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        {...props}
        className="form-input"
      />
    </div>
  );
}
