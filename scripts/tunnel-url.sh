#!/bin/sh
# ==============================================================================
# แสดง URL สาธารณะของ tunnel ที่กำลังรันอยู่
#
#   ./scripts/tunnel-url.sh
#
# quick tunnel จะสุ่ม URL ใหม่ทุกครั้งที่คอนเทนเนอร์รีสตาร์ต จึงต้องถามใหม่ทุกที
# ==============================================================================
set -eu

ENV_FILE="${ENV_FILE:-.env.tunnel}"
COMPOSE="docker compose -f docker-compose.tunnel.yml --env-file $ENV_FILE"

[ -f "$ENV_FILE" ] || { echo "ไม่พบไฟล์ $ENV_FILE (คัดลอกจาก .env.tunnel.example ก่อน)"; exit 1; }

# ถาม cloudflared ผ่าน endpoint metrics ของมันเอง — เชื่อถือได้กว่าการอ่านล็อก
# ที่อาจถูกตัดทิ้งไปแล้วถ้าคอนเทนเนอร์รันมานาน
#
# ต้องยิงจากคอนเทนเนอร์ web เพราะอิมเมจของ cloudflared เป็นแบบ distroless
# ไม่มีทั้ง shell และ wget ให้ exec เข้าไปเรียกเอง แต่ web (nginx alpine) มี
i=0
while [ "$i" -lt 30 ]; do
  URL=$($COMPOSE exec -T web sh -c \
        'wget -qO- http://cloudflared:2000/quicktunnel 2>/dev/null' 2>/dev/null |
        sed -n 's/.*"hostname":"\([^"]*\)".*/\1/p') || URL=""
  [ -n "$URL" ] && { echo "https://$URL"; exit 0; }
  i=$((i + 1))
  sleep 2
done

# ถ้าใช้ tunnel แบบมี token จะไม่มี endpoint /quicktunnel ให้ถาม
if grep -qE '^TUNNEL_TOKEN=.+' "$ENV_FILE"; then
  echo "กำลังใช้ tunnel แบบผูกโดเมน — เปิดตามโดเมนที่ตั้งไว้ในหน้า Zero Trust ได้เลย"
  exit 0
fi

echo "ยังไม่ได้ URL — ดูล็อกเพิ่มเติมด้วย:"
echo "  $COMPOSE logs cloudflared"
exit 1
