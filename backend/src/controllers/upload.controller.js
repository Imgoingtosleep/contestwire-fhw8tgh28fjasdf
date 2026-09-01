const r2Service = require("../services/r2.service");

// POST /api/upload
async function handleDirectUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบไฟล์ที่ต้องการอัปโหลด",
      });
    }

    if (!r2Service.isR2Configured) {
      return res.status(503).json({
        success: false,
        message: "ระบบ Cloudflare R2 ยังไม่ได้ตั้งค่าใน .env",
      });
    }

    const folder = req.body.folder || "submissions";
    const uploadResult = await r2Service.uploadBuffer({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      folder,
    });

    return res.status(201).json({
      success: true,
      message: "อัปโหลดไฟล์สำเร็จ",
      data: uploadResult,
    });
  } catch (err) {
    console.error("[Upload Error]", err);
    return res.status(500).json({
      success: false,
      message: err.message || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์",
    });
  }
}

// POST /api/upload/presign
async function handlePresignedUrl(req, res) {
  try {
    const { fileName, mimeType, folder } = req.body;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุ fileName",
      });
    }

    if (!r2Service.isR2Configured) {
      return res.status(503).json({
        success: false,
        message: "ระบบ Cloudflare R2 ยังไม่ได้ตั้งค่าใน .env",
      });
    }

    const result = await r2Service.getPresignedUploadUrl({
      originalName: fileName,
      mimeType: mimeType || "application/octet-stream",
      folder: folder || "submissions",
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[Presign Error]", err);
    return res.status(500).json({
      success: false,
      message: err.message || "เกิดข้อผิดพลาดในการสร้าง Presigned URL",
    });
  }
}

module.exports = {
  handleDirectUpload,
  handlePresignedUrl,
};
