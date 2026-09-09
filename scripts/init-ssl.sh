#!/bin/sh
# ==============================================================================
# ขอใบรับรอง TLS ใบแรก — รันครั้งเดียวตอนติดตั้งเซิร์ฟเวอร์
#
#   ./scripts/init-ssl.sh
#
# ปัญหาไก่กับไข่: nginx สตาร์ตไม่ได้ถ้าไม่มีไฟล์ใบรับรอง แต่ certbot ขอใบรับรอง
# ไม่ได้ถ้า nginx ไม่ทำงาน สคริปต์นี้แก้ด้วยการสร้างใบชั่วคราวให้ nginx บูตขึ้นมาก่อน
# แล้วค่อยให้ certbot ขอใบจริงมาทับ
# ==============================================================================
set -eu

ENV_FILE="${ENV_FILE:-.env.production}"
COMPOSE="docker compose -f docker-compose.prod.yml --env-file $ENV_FILE"

[ -f "$ENV_FILE" ] || { echo "ไม่พบไฟล์ $ENV_FILE"; exit 1; }

# shellcheck disable=SC1090
DOMAIN=$(grep -E '^DOMAIN=' "$ENV_FILE" | cut -d= -f2-)
ACME_EMAIL=$(grep -E '^ACME_EMAIL=' "$ENV_FILE" | cut -d= -f2-)
STAGING=$(grep -E '^ACME_STAGING=' "$ENV_FILE" | cut -d= -f2- || echo false)

[ -n "$DOMAIN" ] || { echo "ยังไม่ได้ตั้ง DOMAIN ใน $ENV_FILE"; exit 1; }
[ -n "$ACME_EMAIL" ] || { echo "ยังไม่ได้ตั้ง ACME_EMAIL ใน $ENV_FILE"; exit 1; }

echo "โดเมน: $DOMAIN"

# ---- 1) ใบชั่วคราวแบบ self-signed เพื่อให้ nginx บูตได้ ----
echo "==> สร้างใบรับรองชั่วคราว"
$COMPOSE run --rm --entrypoint sh certbot -c "
  mkdir -p /etc/letsencrypt/live/$DOMAIN &&
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
    -out    /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
    -subj '/CN=localhost'"

# ---- 2) สตาร์ต nginx ----
echo "==> สตาร์ต web"
$COMPOSE up -d --build web

# ---- 3) ลบใบชั่วคราวแล้วขอใบจริง ----
echo "==> ขอใบรับรองจริง"
$COMPOSE run --rm --entrypoint sh certbot -c "rm -rf /etc/letsencrypt/live/$DOMAIN /etc/letsencrypt/archive/$DOMAIN /etc/letsencrypt/renewal/$DOMAIN.conf"

STAGING_FLAG=""
[ "$STAGING" = "true" ] && STAGING_FLAG="--staging"

$COMPOSE run --rm certbot certonly --webroot -w /var/www/certbot \
  $STAGING_FLAG \
  --email "$ACME_EMAIL" \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --agree-tos --no-eff-email --non-interactive

# ---- 4) รีโหลดให้หยิบใบจริง ----
echo "==> รีโหลด nginx"
$COMPOSE exec web nginx -s reload

echo "เสร็จแล้ว — เปิด https://$DOMAIN ได้เลย"
