// ไฟล์นี้รวมข่าวทั้งหมดจากโฟลเดอร์ ./items โดยอัตโนมัติ
// ไม่ต้องแก้ไฟล์นี้เวลาเพิ่มข่าวใหม่ — แค่เพิ่มไฟล์ในโฟลเดอร์ items/ ก็พอ
//
// require.context เป็นฟีเจอร์ของ webpack (ที่ Create React App ใช้อยู่)
// พารามิเตอร์: (โฟลเดอร์, ค้นหาลึกเข้าไปในโฟลเดอร์ย่อยไหม, รูปแบบไฟล์ที่จะโหลด)
const newsContext = require.context("./items", false, /news-.*\.js$/);

const newsList = newsContext
  .keys()
  .map((key) => {
    const mod = newsContext(key);
    return mod.default || mod;
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // ใหม่สุดขึ้นก่อน

export default newsList;

export function getNewsById(id) {
  return newsList.find((item) => item.id === id);
}
