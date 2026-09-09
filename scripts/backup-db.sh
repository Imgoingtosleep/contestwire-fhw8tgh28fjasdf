#!/bin/sh
# ==============================================================================
# สำรองฐานข้อมูลเป็นไฟล์ .sql.gz และลบไฟล์ที่เก่ากว่าที่กำหนดทิ้ง
#
#   ./scripts/backup-db.sh
#
# ตั้งให้ทำอัตโนมัติทุกวันตีสอง (crontab -e):
#   0 2 * * * cd /home/deploy/app && ./scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
# ==============================================================================
set -eu

ENV_FILE="${ENV_FILE:-.env.production}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"
COMPOSE="docker compose -f docker-compose.prod.yml --env-file $ENV_FILE"

[ -f "$ENV_FILE" ] || { echo "ไม่พบไฟล์ $ENV_FILE"; exit 1; }

DB_USER=$(grep -E '^POSTGRES_USER=' "$ENV_FILE" | cut -d= -f2-)
DB_NAME=$(grep -E '^POSTGRES_DB=' "$ENV_FILE" | cut -d= -f2-)

mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql.gz"

$COMPOSE exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$OUT"

# ไฟล์ว่างแปลว่า dump ล้มเหลว อย่าเก็บไว้ให้เข้าใจผิดว่ามีข้อมูลสำรอง
if [ ! -s "$OUT" ]; then
  rm -f "$OUT"
  echo "$(date '+%F %T') สำรองล้มเหลว: ไฟล์ว่าง"
  exit 1
fi

find "$BACKUP_DIR" -name 'backup-*.sql.gz' -mtime "+$KEEP_DAYS" -delete

echo "$(date '+%F %T') สำรองสำเร็จ: $OUT ($(du -h "$OUT" | cut -f1))"
