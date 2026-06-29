# TalkNotes

Personal English language diary — built on Drupal 10.

## First-time setup

### 1. Place this folder

```
/home/nil/docker/projects/talknotes/
```

### 2. Find your network names

Your postgres and Nginx Proxy Manager containers run on Docker networks.
You need their exact network names:

```bash
# See all networks
docker network ls

# See which network your postgres container is on
docker inspect <your_postgres_container_name> | grep -A5 '"Networks"'
```

Update `docker-compose.yml` and `docker-compose.prod.yml`:
- `databases_net` → replace with your actual postgres network name
- `proxy_net` → replace with your actual Nginx Proxy Manager network name

### 3. Create your .env file

```bash
cp .env.example .env
nano .env     # fill in all values
```

Generate a hash salt:
```bash
openssl rand -base64 55
```

### 4. Create the database

```bash
bash scripts/setup-database.sh
```

### 5. Start the containers

```bash
docker compose up -d
```

### 6. Run the Drupal installer

Open http://localhost:8090 in your browser.

- Profile: **Standard**
- Database type: **PostgreSQL**
- Host: value of `POSTGRES_HOST` from your .env
- Database: `talknotes`
- Username/password: from your .env

### 7. First things after install

In the Drupal admin:

1. `Configuration → People → Account settings` → set registration to **Administrators only**
2. `Appearance` → set **Gin** as administration theme
3. Install modules: see [Phase 1 in the implementation guide]

### 8. Set up daily backups

```bash
chmod +x scripts/backup.sh
crontab -e
# Add this line:
0 2 * * * /home/nil/docker/projects/talknotes/scripts/backup.sh >> /home/nil/docker/projects/talknotes/logs/backup.log 2>&1
```

---

## Daily workflow

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f drupal

# Export config after structural changes
docker exec talknotes_drupal_dev drush cex -y
git add drupal/config/ && git commit -m "Config: describe what changed"

# Run database backup manually
bash scripts/backup.sh
```

## Folder structure

```
talknotes/
├── docker-compose.yml          ← dev
├── docker-compose.prod.yml     ← production
├── .env                        ← secrets (gitignored)
├── .env.example                ← template (committed)
├── drupal/
│   ├── config/sync/            ← Drupal config exports (committed)
│   ├── modules/custom/         ← your custom modules (committed)
│   ├── themes/custom/          ← your custom theme (committed)
│   └── settings/
│       ├── settings.php        ← reads from env vars (committed)
│       └── services.yml        ← CORS config (committed)
├── scripts/
│   ├── setup-database.sh       ← run once
│   └── backup.sh               ← run by cron
└── logs/                       ← gitignored
```

## Production deploy

```bash
# On your server
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Import config on first deploy
docker exec talknotes_drupal drush cim -y
docker exec talknotes_drupal drush cr
```
