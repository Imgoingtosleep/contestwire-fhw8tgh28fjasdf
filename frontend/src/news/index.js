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
    const item = mod.default || mod;
    // พาธรูปที่ขึ้นต้นด้วย "/" อ้างถึงโฟลเดอร์ public/ — เติม PUBLIC_URL
    // ไม่งั้นรูปหายเมื่อเว็บไม่ได้อยู่ที่ราก (เช่น GitHub Pages)
    if (item.cover && item.cover.startsWith("/")) {
      return { ...item, cover: `${process.env.PUBLIC_URL}${item.cover}` };
    }
    return item;
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // ใหม่สุดขึ้นก่อน

export default newsList;

export function getNewsById(id) {
  return newsList.find((item) => item.id === id);
}
