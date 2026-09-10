/**
 * สวิตช์เปิด/ปิดฟีเจอร์จาก environment
 *
 * ช่วงนี้เว็บเปิดใช้เป็น "เว็บข่าว" อย่างเดียว ยังไม่รับข้อมูลจากผู้ใช้
 * จึงปิดทั้งเส้นทางรับสมัครและอัปโหลดไว้ที่ชั้นเดียว แทนที่จะถอด route ออก
 * เพราะโค้ดฝั่งนั้นยังอยู่ครบ พร้อมเปิดกลับด้วยการแก้ค่าเดียวเมื่อถึงเวลา
 *
 * ผลพลอยได้: GET /api/contest/submissions ซึ่งคืนชื่อ อีเมล และเบอร์โทร
 * ของผู้สมัครโดยไม่มีการยืนยันตัวตน ถูกปิดไปด้วยระหว่างนี้
 */

// ต้องเป็น "true" ตรงตัวเท่านั้นถึงจะเปิด — ค่าที่ไม่ได้ตั้ง สะกดผิด
// หรือเป็นค่าว่าง ให้ถือว่าปิด เพื่อไม่ให้เผลอเปิดรับข้อมูลโดยไม่ตั้งใจ
function isContestOpen() {
  return String(process.env.CONTEST_OPEN).trim().toLowerCase() === "true";
}

function requireContestOpen(req, res, next) {
  if (!isContestOpen()) {
    return res.status(503).json({
      success: false,
      message: "ขณะนี้ยังไม่เปิดรับสมัคร กรุณาติดตามประกาศจากทางโครงการ",
    });
  }
  return next();
}

module.exports = { isContestOpen, requireContestOpen };
