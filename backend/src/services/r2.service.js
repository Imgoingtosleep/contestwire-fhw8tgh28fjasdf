const crypto = require("crypto");
const path = require("path");
const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client, isR2Configured, bucketName, publicUrl } = require("../config/r2");

function sanitizeFileName(fileName = "file") {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const randomStr = crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now().toString(36);
  return `${Date.now()}-${randomStr}-${base}${ext}`;
}

async function uploadBuffer({ buffer, originalName, mimeType, folder = "uploads" }) {
  if (!isR2Configured || !s3Client) {
    throw new Error("Cloudflare R2 is not configured. Please set R2 environment variables in .env");
  }

  const fileKey = `${folder}/${sanitizeFileName(originalName)}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: buffer,
    ContentType: mimeType || "application/octet-stream",
  });

  await s3Client.send(command);

  // Compute public URL
  const fileUrl = publicUrl
    ? `${publicUrl.replace(/\/$/, "")}/${fileKey}`
    : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucketName}/${fileKey}`;

  return {
    fileKey,
    fileUrl,
    size: buffer.length,
    mimeType,
  };
}

async function getPresignedUploadUrl({ originalName, mimeType, folder = "uploads", expiresIn = 900 }) {
  if (!isR2Configured || !s3Client) {
    throw new Error("Cloudflare R2 is not configured. Please set R2 environment variables in .env");
  }

  const fileKey = `${folder}/${sanitizeFileName(originalName)}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ContentType: mimeType || "application/octet-stream",
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  const fileUrl = publicUrl
    ? `${publicUrl.replace(/\/$/, "")}/${fileKey}`
    : `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucketName}/${fileKey}`;

  return {
    uploadUrl,
    fileKey,
    fileUrl,
    expiresIn,
  };
}

async function deleteFile(fileKey) {
  if (!isR2Configured || !s3Client) {
    throw new Error("Cloudflare R2 is not configured.");
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  return await s3Client.send(command);
}

module.exports = {
  uploadBuffer,
  getPresignedUploadUrl,
  deleteFile,
  isR2Configured,
};
