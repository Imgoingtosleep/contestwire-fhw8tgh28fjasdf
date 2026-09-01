const { S3Client } = require("@aws-sdk/client-s3");

const isR2Configured = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
);

let s3Client = null;

if (isR2Configured) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  console.log("[R2] Cloudflare R2 client initialized for bucket:", process.env.R2_BUCKET_NAME);
} else {
  console.warn("[R2] Warning: Cloudflare R2 credentials not fully set in .env");
}

module.exports = {
  s3Client,
  isR2Configured,
  bucketName: process.env.R2_BUCKET_NAME,
  publicUrl: process.env.R2_PUBLIC_URL || "",
};
