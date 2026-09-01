const Submission = require("../models/Submission");
const r2Service = require("../services/r2.service");

// POST /api/contest/submit
async function createSubmission(req, res) {
  try {
    let {
      fullName,
      email,
      phone,
      teamName,
      videoTitle,
      videoUrl,
      fileUrl,
      fileKey,
      description,
    } = req.body;

    // Handle optional direct file attachment in multipart form
    if (req.file) {
      if (r2Service.isR2Configured) {
        const uploadRes = await r2Service.uploadBuffer({
          buffer: req.file.buffer,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          folder: "contest-files",
        });
        fileUrl = uploadRes.fileUrl;
        fileKey = uploadRes.fileKey;
      }
    }

    if (!fullName || !email || !videoTitle) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบ: ชื่อ-นามสกุล, อีเมล และชื่อผลงานวิดีโอ",
      });
    }

    if (!videoUrl && !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุลิงก์วิดีโอ หรือแนบไฟล์ผลงาน",
      });
    }

    const submission = await Submission.create({
      fullName,
      email,
      phone,
      teamName,
      videoTitle,
      videoUrl,
      fileUrl,
      fileKey,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "ส่งผลงานเข้าประกวดสำเร็จ",
      data: submission,
    });
  } catch (err) {
    console.error("[Create Submission Error]", err);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในระบบ: " + (err.message || "Unknown error"),
    });
  }
}

// GET /api/contest/submissions
async function getSubmissions(req, res) {
  try {
    const submissions = await Submission.find();
    return res.json({ success: true, data: submissions });
  } catch (err) {
    console.error("[Get Submissions Error]", err);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

// PATCH /api/contest/submissions/:id/status
async function updateSubmissionStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "สถานะต้องเป็น pending, approved หรือ rejected เท่านั้น",
      });
    }

    const updated = await Submission.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลผลงาน" });
    }

    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("[Update Status Error]", err);
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในระบบ" });
  }
}

module.exports = {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
};
