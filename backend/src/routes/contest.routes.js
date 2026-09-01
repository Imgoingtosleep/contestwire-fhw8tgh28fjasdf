const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
} = require("../controllers/contest.controller");

const maxUploadMb = parseInt(process.env.MAX_UPLOAD_SIZE_MB || "50", 10);
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: maxUploadMb * 1024 * 1024 },
});

// POST /api/contest/submit -> รองรับทั้ง JSON และ multipart/form-data (แนบไฟล์)
router.post("/submit", upload.single("file"), createSubmission);

// GET /api/contest/submissions -> ดูรายการที่ส่งเข้ามาทั้งหมด
router.get("/submissions", getSubmissions);

// PATCH /api/contest/submissions/:id/status -> อัปเดตสถานะ
router.patch("/submissions/:id/status", express.json(), updateSubmissionStatus);

module.exports = router;
