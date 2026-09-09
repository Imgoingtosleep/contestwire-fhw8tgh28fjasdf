# การนำขึ้นใช้งานจริง (Production Deployment)

> เพิ่งซื้อโดเมนกับเซิร์ฟเวอร์มา และอยากได้ลำดับขั้นตอนแบบเช็กลิสต์
> พร้อมตารางว่าค่าไหนเอาไปใส่ตรงไหน ให้เริ่มที่ [SETUP.md](./SETUP.md) ก่อน
> เอกสารนี้เป็นคู่มืออ้างอิงรายละเอียดของแต่ละขั้น

คู่มือนี้ครอบคลุมการนำเว็บขึ้นเซิร์ฟเวอร์ VPS พร้อมโดเมนของตัวเองและใบรับรอง
TLS ที่ต่ออายุอัตโนมัติ ใช้ได้กับผู้ให้บริการโดเมนและ VPS รายใดก็ได้

---

## 0. สิ่งที่ต้องมี

| สิ่งที่ต้องมี | รายละเอียด |
|---|---|
| VPS | Ubuntu 22.04 LTS ขึ้นไป, RAM อย่างน้อย 2 GB, พื้นที่ 20 GB |
| IP สาธารณะ | เลข IPv4 ที่คงที่ของ VPS |
| โดเมน | เข้าหน้าจัดการ DNS ของผู้ให้บริการโดเมนได้ |
| สิทธิ์ | เข้า SSH ด้วยผู้ใช้ที่ใช้ `sudo` ได้ |

> RAM 1 GB มักไม่พอ เพราะขั้นตอน build ของ React กินหน่วยความจำสูง
> ถ้าเลี่ยงไม่ได้ ให้เพิ่ม swap 2 GB ก่อน (ดูหัวข้อ 9)

---

## 1. ตั้งค่า DNS

ที่หน้าจัดการ DNS ของโดเมน สร้างเรคคอร์ดสองรายการ ชี้ไปที่ IP ของ VPS

| Type  | Name  |   Value | TTL |
|-------|-------|-------|---|
|  `A`  | `@`   | `<IP ของ VPS>` | 600 |
|  `A`  | `www` | `<IP ของ VPS>` | 600 |

ลบเรคคอร์ดเดิมที่ชนกันออกก่อน โดยเฉพาะเรคคอร์ด `A` หรือ `CNAME` ของ `@`
และ `www` ที่ผู้ให้บริการตั้งมาให้ตอนซื้อโดเมน (มักชี้ไปหน้า parking)

ตรวจว่ากระจายแล้วหรือยัง:

```bash
dig +short example.com
dig +short www.example.com
```

ทั้งสองคำสั่งต้องคืน IP ของ VPS **ก่อน** ทำขั้นตอนขอใบรับรอง ไม่งั้นจะขอไม่ผ่าน
โดยปกติใช้เวลา 5 - 30 นาที

---

## 2. เตรียมเซิร์ฟเวอร์

```bash
ssh root@<IP ของ VPS>

# สร้างผู้ใช้ที่ไม่ใช่ root
adduser deploy
usermod -aG sudo deploy

# ย้ายกุญแจ SSH มาให้ผู้ใช้ใหม่ แล้วเข้าใช้ด้วยผู้ใช้นั้นแทน
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy/
```

ปิดการล็อกอินด้วย root และรหัสผ่าน แก้ `/etc/ssh/sshd_config`:

```
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo systemctl restart ssh
```

### ไฟร์วอลล์

เปิดเฉพาะสามพอร์ตนี้ พอร์ตของฐานข้อมูลและ backend ไม่ต้องเปิด
เพราะเข้าถึงกันเองในเครือข่ายภายในของ Docker

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### ติดตั้ง Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy
newgrp docker
docker --version && docker compose version
```

---

## 3. นำโค้ดขึ้นเซิร์ฟเวอร์

```bash
cd ~
git clone <URL ของ repository> app
cd app
```

---

## 4. ตั้งค่า environment

```bash
cp .env.production.example .env.production
nano .env.production
```

ค่าที่ต้องแก้ทุกครั้ง:

| ตัวแปร | ค่าที่ต้องใส่ |
|---|---|
| `DOMAIN` | โดเมนหลัก ไม่ต้องใส่ `https://` และไม่ต้องใส่ `www` |
| `ACME_EMAIL` | อีเมลรับแจ้งเตือนใบรับรองใกล้หมดอายุ |
| `POSTGRES_PASSWORD` | สุ่มด้วย `openssl rand -base64 36` |
| `JWT_SECRET` | สุ่มด้วย `openssl rand -base64 48` |
| `CORS_ORIGIN` | `https://โดเมน,https://www.โดเมน` |
| `R2_*` | ค่าจากผู้ให้บริการที่เก็บไฟล์ |

ปิดสิทธิ์อ่านไฟล์ให้เหลือเฉพาะเจ้าของ:

```bash
chmod 600 .env.production
```

> `REACT_APP_API_URL` ให้คงค่า `/api` ไว้ เพราะ frontend เรียก API
> ผ่านโดเมนเดียวกันโดย nginx เป็นตัวส่งต่อ จึงไม่ต้องเปิดพอร์ต backend
> ออกสู่อินเทอร์เน็ต และไม่เจอปัญหา CORS หรือ mixed content

---

## 5. รันครั้งแรกพร้อมขอใบรับรอง TLS

ลองด้วยใบทดสอบก่อน เพื่อไม่ให้ติดลิมิตขอใบจริง 5 ครั้งต่อสัปดาห์
ตั้ง `ACME_STAGING=true` ใน `.env.production` แล้วรัน:

```bash
./scripts/init-ssl.sh
```

ถ้าผ่านไม่มี error ให้เปลี่ยนกลับเป็น `ACME_STAGING=false` แล้วรันซ้ำอีกครั้ง
เพื่อขอใบจริง จากนั้นสตาร์ตทั้งระบบ:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## 6. ตรวจว่าใช้งานได้

```bash
# สถานะทุก service
docker compose -f docker-compose.prod.yml --env-file .env.production ps

# ฐานข้อมูลและที่เก็บไฟล์
curl -s https://example.com/api/health

# ใบรับรอง
curl -sI https://example.com | head -1
```

เปิด `https://example.com` ในเบราว์เซอร์ ต้องขึ้นแม่กุญแจ และพิมพ์
`http://example.com` แล้วต้องถูกผลักไป `https://` อัตโนมัติ

---

## 7. อัปเดตเว็บหลังแก้โค้ด

```bash
cd ~/app
git pull
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

> ถ้าแก้ค่า `REACT_APP_*` ต้องใส่ `--build` เสมอ เพราะ React ฝังค่าพวกนี้
> ตั้งแต่ตอน build ไม่ได้อ่านตอนรัน

ล้างอิมเมจเก่าที่ไม่ใช้แล้วเป็นระยะ:

```bash
docker image prune -f
```

---

## 8. สำรองฐานข้อมูล

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production \
  exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > backup-$(date +%F).sql.gz
```

ตั้งให้ทำอัตโนมัติทุกวันตีสองด้วย `crontab -e`:

```
0 2 * * * cd /home/deploy/app && ./scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
```

กู้คืน:

```bash
gunzip -c backup-2569-01-15.sql.gz | docker compose -f docker-compose.prod.yml \
  --env-file .env.production exec -T postgres psql -U "$POSTGRES_USER" "$POSTGRES_DB"
```

---

## 9. แก้ปัญหาที่พบบ่อย

**ขอใบรับรองไม่ผ่าน** — เกือบทุกครั้งเกิดจาก DNS ยังไม่ชี้มาที่ VPS
ตรวจด้วย `dig +short example.com` ว่าตรงกับ IP จริงหรือยัง และตรวจว่า
พอร์ต 80 เปิดอยู่ (`sudo ufw status`) เพราะการยืนยันสิทธิ์ต้องใช้พอร์ตนี้

**nginx สตาร์ตไม่ขึ้นรอบแรก** — เป็นเรื่องปกติถ้ายังไม่มีไฟล์ใบรับรอง
ให้รัน `./scripts/init-ssl.sh` ซึ่งจะสร้างใบชั่วคราวให้ nginx บูตได้ก่อน

**build ค้างหรือถูก kill** — RAM ไม่พอ เพิ่ม swap:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**เว็บขึ้นแต่เรียก API ไม่ได้** — ตรวจว่า `CORS_ORIGIN` ตรงกับโดเมนจริง
และดู log ด้วย

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f backend
```

**แก้โค้ดแล้วหน้าเว็บยังเป็นของเดิม** — เบราว์เซอร์แคช `index.html` ไว้
ลองเปิดโหมดไม่ระบุตัวตนเพื่อยืนยัน ตัว nginx ตั้ง `no-cache` ให้ไฟล์นี้แล้ว

---

## 10. ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|---|---|
| `docker-compose.prod.yml` | นิยาม service สำหรับโปรดักชัน |
| `docker/Dockerfile.frontend.prod` | build React แล้วเสิร์ฟด้วย nginx |
| `docker/Dockerfile.backend.prod` | รัน Express โดยไม่ติดตั้ง devDependencies |
| `nginx/prod.conf.template` | reverse proxy, TLS, แคช, security headers |
| `scripts/init-ssl.sh` | ขอใบรับรองใบแรก |
| `scripts/backup-db.sh` | สำรองฐานข้อมูลและลบไฟล์เก่า |
| `.env.production.example` | แม่แบบค่าคอนฟิกโปรดักชัน |
