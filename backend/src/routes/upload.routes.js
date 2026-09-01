const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  handleDirectUpload,
  handlePresignedUrl,
} = require("../controllers/upload.controller");

const maxUploadMb = parseInt(process.env.MAX_UPLOAD_SIZE_MB || "50", 10);
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: maxUploadMb * 1024 * 1024 },
});

// POST /api/upload -> Direct file upload to R2
router.post("/", upload.single("file"), handleDirectUpload);

// POST /api/upload/presign -> Get presigned URL for direct S3/R2 client upload
router.post("/presign", express.json(), handlePresignedUrl);

module.exports = router;
