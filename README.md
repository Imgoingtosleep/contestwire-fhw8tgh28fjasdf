# News & Video Contest Platform

ระบบเว็บไซต์นำเสนอข่าวสาร + รับสมัครส่งประกวดวิดีโอ (พร้อมระบบจัดเก็บไฟล์ Object Storage และฐานข้อมูล PostgreSQL)

Stack:
- **Frontend**: React (Port `9000`)
- **Backend**: Node.js / Express (Port `9100`)
- **Database**: PostgreSQL 16 (Port `5432`)
- **Object Storage**: S3-Compatible Storage (สำหรับจัดเก็บไฟล์/วิดีโอ/เอกสาร)
- **Containerization**: Docker Compose

---

## โครงสร้างโปรเจกต์

```
webproject/
├── .gitignore                # จัดการ ignore files ทั้งโปรเจกต์
├── .dockerignore             # จัดการ ignore files สำหรับ Docker build
├── .env                      # ตัวแปรระบบจริง (PostgreSQL, Storage, Domain, Port)
├── .env.example              # เทมเพลตตัวอย่าง .env
├── docker-compose.yml        # รวม 3 services: frontend, backend, postgres
│
├── docker/                   # โฟลเดอร์รวม Dockerfiles ทั้งหมด
│   ├── Dockerfile.frontend   # Dockerfile สำหรับ React
│   └── Dockerfile.backend    # Dockerfile สำหรับ Node.js API
│
├── nginx/
│   └── default.conf          # Nginx Reverse Proxy Template สำหรับ Custom Domain
│
├── frontend/                 # React Application (Port 9000)
│   ├── public/
│   │   └── news-images/      # รูปภาพข่าวสาร static
│   └── src/
│       ├── styles/           # โฟลเดอร์ CSS แยกส่วนตกแต่งออกจาก JSX ทั้งหมด
│       │   ├── global.css
│       │   ├── navbar.css
│       │   ├── footer.css
│       │   ├── news-card.css
│       │   ├── contest-form.css
│       │   ├── home.css
│       │   └── news-detail.css
│       ├── components/       # UI Components (ใช้ className จาก styles/)
│       ├── pages/            # Page Views (Home, News, Contest)
│       ├── news/items/       # ไฟล์ข่าวสาร static
│       └── utils/api.js
│
└── backend/                  # Express REST API (Port 9100)
    ├── package.json          # pg, @aws-sdk/client-s3, multer
    └── src/
        ├── config/
        │   ├── db.js         # PostgreSQL Connection Pool & Auto Schema Migration
        │   └── r2.js         # Object Storage (S3Client) Config
        ├── services/
        │   └── r2.service.js # Upload, Presigned URLs, Delete helpers
        ├── models/
        │   └── Submission.js # PostgreSQL Submissions Data Model
        ├── controllers/
        │   ├── contest.controller.js
        │   └── upload.controller.js
        ├── routes/
        └── server.js
```

---

## วิธีเริ่มรันโปรเจกต์ (Docker Compose)

1. คัดลอกและตั้งค่า `.env`:
   ```bash
   cp .env.example .env
   ```
2. สั่งรัน container ทั้งหมด:
   ```bash
   docker compose up --build
   ```

### พอร์ตและลิงก์สำหรับเข้าใช้งาน:
| Service | URL / Host | ข้อมูลการเข้าใช้งาน (กำหนดใน `.env`) |
|---|---|---|
| **Frontend** | [http://localhost:9000](http://localhost:9000) | - |
| **Backend API** | [http://localhost:9100/api/health](http://localhost:9100/api/health) | - |
| **PostgreSQL** | `localhost:5432` | User: `POSTGRES_USER` ใน `.env`<br>Password: `POSTGRES_PASSWORD` ใน `.env`<br>Database: `POSTGRES_DB` ใน `.env` |

---

## วิธีเชื่อมต่อฐานข้อมูลผ่านโปรแกรม pgAdmin Desktop (บนเครื่องของคุณ)

1. เปิดโปรแกรม **pgAdmin** (หรือ DBeaver / TablePlus / DataGrip) ที่ติดตั้งอยู่ในเครื่องของคุณ
2. คลิกขวาที่ **Servers** > **Register** > **Server...**
3. แถบ **General**:
   - Name: ตั้งชื่อการเชื่อมต่อ เช่น `News Contest DB`
4. แถบ **Connection**:
   - **Host name/address**: `localhost` หรือ `127.0.0.1`
   - **Port**: ตาม `POSTGRES_PORT` ใน `.env` (ค่าเริ่มต้น `5432`)
   - **Maintenance database**: ตามค่า `POSTGRES_DB` ใน `.env`
   - **Username**: ตามค่า `POSTGRES_USER` ใน `.env`
   - **Password**: ตามค่า `POSTGRES_PASSWORD` ใน `.env`
5. กด **Save** คุณจะสามารถเปิดดูและจัดการตาราง `submissions` ได้ที่ `Databases > news_contest_db > Schemas > public > Tables`

---

## การตั้งค่า Object Storage (S3-Compatible)

1. สร้าง Bucket ในบริการ Object Storage ของคุณ (เช่น `news-contest-bucket`)
2. เปิดการเข้าถึงแบบ Public หรือผูก Custom Domain สำหรับเข้าถึงไฟล์ (เช่น `https://cdn.yourdomain.com`)
3. สร้าง API Access Token / Access Key สำหรับ Read & Write
4. นำค่าที่ได้มากรอกลงใน `.env`:
   ```env
   R2_ACCOUNT_ID=your_storage_account_id
   R2_ACCESS_KEY_ID=your_storage_access_key_id
   R2_SECRET_ACCESS_KEY=your_storage_secret_access_key
   R2_BUCKET_NAME=your_storage_bucket_name
   R2_PUBLIC_URL=https://your-public-cdn-url.com
   ```

---

## การตั้งค่าโดเมน (Custom Domain Setup)

### ขั้นตอนที่ 1: ตั้งค่า DNS Records
ที่ระบบจัดการ DNS ของผู้ให้บริการโดเมนของคุณ ให้เพิ่ม Record ดังนี้:
- **Type `A`**: Name `@` -> ชี้ไปที่ Public IP ของเซิร์ฟเวอร์ (VPS)
- **Type `A`** หรือ **`CNAME`**: Name `www` หรือ `api` -> ชี้ไปที่ Public IP หรือโดเมนหลัก

### ขั้นตอนที่ 2: ตั้งค่า `.env` สำหรับ Production
เมื่อผูกโดเมนแล้ว (สมมติว่าชื่อ `yourdomain.com`):
```env
CORS_ORIGIN=http://localhost:9000,https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com
REACT_APP_API_URL=https://yourdomain.com/api
```
*(หากใช้ Nginx Reverse Proxy ตาม template ใน `nginx/default.conf` จะส่งต่อ request ไปยัง Frontend และ Backend อัตโนมัติ)*

---

## Backend API Endpoints

| Method | Endpoint | รายละเอียด |
|---|---|---|
| `GET` | `/api/health` | ตรวจสอบสถานะ Server, Database PostgreSQL และ Storage |
| `POST` | `/api/contest/submit` | ส่งผลงานเข้าประกวด (รองรับทั้ง JSON และ multipart แนบไฟล์) |
| `GET` | `/api/contest/submissions` | รายการผลงานทั้งหมด (ดึงจาก PostgreSQL) |
| `PATCH` | `/api/contest/submissions/:id/status` | อัปเดตสถานะ (`pending`, `approved`, `rejected`) |
| `POST` | `/api/upload` | อัปโหลดไฟล์ตรงเข้า Object Storage |
| `POST` | `/api/upload/presign` | ขอ Presigned URL สำหรับอัปโหลดไฟล์ขนาดใหญ่เข้า Storage โดยตรงจากเบราว์เซอร์ |
