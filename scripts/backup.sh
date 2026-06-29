#!/bin/bash
# TalkNotes - Backup Script
# Stores backups into your existing /home/nil/storage/backups/ structure.
#
# Crontab (run daily at 2am):
#   0 2 * * * /home/nil/docker/projects/talknotes/scripts/backup.sh >> /home/nil/docker/projects/talknotes/logs/backup.log 2>&1

set -e

# ── Config ────────────────────────────────────────────────────────────────────
PROJECT_DIR="/home/nil/docker/projects/talknotes"
STORAGE_ROOT="/home/nil/storage/backups"

DB_BACKUP_DIR="$STORAGE_ROOT/postgres/talknotes"
FILES_BACKUP_DIR="$STORAGE_ROOT/docker/talknotes"
LOG_DIR="$PROJECT_DIR/logs"

POSTGRES_CONTAINER="${POSTGRES_CONTAINER_NAME:-postgres-postgres-1}"
DATE=$(date +%Y%m%d_%H%M%S)
KEEP_DAYS=14   # keep 2 weeks of backups

# Load .env for credentials
source "$PROJECT_DIR/.env"

# ── Setup ─────────────────────────────────────────────────────────────────────
mkdir -p "$DB_BACKUP_DIR" "$FILES_BACKUP_DIR" "$LOG_DIR"

echo "[$DATE] Starting TalkNotes backup..."

# ── 1. Database dump ──────────────────────────────────────────────────────────
echo "[$DATE] Backing up PostgreSQL database: $POSTGRES_DB"
docker exec "$POSTGRES_CONTAINER" \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > "$DB_BACKUP_DIR/talknotes_db_${DATE}.sql.gz"
echo "[$DATE] ✅  DB backup: $DB_BACKUP_DIR/talknotes_db_${DATE}.sql.gz"

# ── 2. Drupal files (user uploads) ───────────────────────────────────────────
echo "[$DATE] Backing up Drupal files volume..."
docker run --rm \
  -v talknotes_drupal_files:/data \
  -v "$FILES_BACKUP_DIR":/backup \
  alpine tar -czf /backup/talknotes_files_${DATE}.tar.gz -C /data .
echo "[$DATE] ✅  Files backup: $FILES_BACKUP_DIR/talknotes_files_${DATE}.tar.gz"

# ── 3. Config export (Drupal structure) ──────────────────────────────────────
echo "[$DATE] Exporting Drupal config..."
docker exec talknotes_drupal drush cex -y 2>/dev/null || echo "[$DATE] ⚠  Config export skipped (Drupal not running?)"

# ── 4. Rotate old backups ─────────────────────────────────────────────────────
echo "[$DATE] Rotating backups older than $KEEP_DAYS days..."
find "$DB_BACKUP_DIR" -name "talknotes_db_*.sql.gz" -mtime +$KEEP_DAYS -delete
find "$FILES_BACKUP_DIR" -name "talknotes_files_*.tar.gz" -mtime +$KEEP_DAYS -delete

echo "[$DATE] ✅  Backup complete."
echo "---"
