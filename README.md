# HowTheyTalk

A personal American English language diary and public reference site for non-native speakers navigating daily life in the United States.

**Live site:** https://howtheytalk.us  
**Drupal backend:** https://talknotes-app.codenil.online  
**GitHub:** https://github.com/nil-sj/howtheytalk  

---

## What it is

HowTheyTalk is a searchable, public repository of American English words, phrases, idioms, usage differences, and everyday expressions — collected from real life, work, reading, and conversations. It is written especially for people who learned English in one place and continue discovering how it is actually used in everyday American life.

---

## Stack

| Layer | Technology |
|-------|------------|
| CMS / Backend | Drupal 10 (headless, JSON:API) |
| Frontend | React 18 + Vite |
| Database | PostgreSQL 17 |
| Web server | Apache (Drupal), Nginx (React) |
| Infrastructure | Docker Compose on Ubuntu home server |
| Tunnel | Cloudflare Tunnel |
| Analytics | Umami + Google Analytics |
| Version control | GitHub |

---

## Content

- **480+ language entries** across 13 categories
- **20+ usage differences** comparing similar words and phrases
- **21+ articles** on themes like word families, sports metaphors, small talk, and practical American life vocabulary

### Categories

1. American Lingo
2. Everyday Expressions
3. Business Lingo
4. American Life
5. Cultural Context
6. Idioms and Phrases
7. Vocabulary
8. Indian English vs American English
9. Politeness and Tone
10. Tales and Origins
11. Common Confusing Words
12. Literal Translation Traps
13. Usage Difference

---

## Architecture

```
howtheytalk.us (port 9023)          talknotes-app.codenil.online (port 9022)
      |                                           |
React/Vite frontend (Nginx)          Drupal 10 backend (Apache)
      |                                           |
      +------------- JSON:API -------------------+
                                                  |
                                           PostgreSQL 17
```

Both services run as Docker containers on a home Ubuntu server, exposed publicly via Cloudflare Tunnel.

---

## Project structure

```
/home/nil/docker/projects/talknotes/
├── docker-compose.yml
├── .env                          # secrets — not in git
├── drupal/
│   ├── composer.json             # Drupal dependencies
│   ├── composer.lock
│   ├── modules/custom/
│   │   └── talknotes_api/        # custom REST endpoints
│   ├── themes/custom/
│   │   └── talknotes/
│   ├── config/sync/              # Drupal config exports
│   ├── settings/
│   │   ├── settings.php
│   │   └── services.yml          # CORS config
│   └── files/                    # Drupal uploaded files (bind mount)
└── react-frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── api/
    │   ├── admin/
    │   └── hooks/
    ├── public/
    └── index.html
```

---

## Running locally

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start all services
docker compose up -d

# Drupal admin
open http://localhost:9022

# React frontend
open http://localhost:9023
```

---

## Key commands

```bash
# Rebuild Drupal cache
docker exec talknotes_drupal_dev bash -c "cd /opt/drupal && vendor/bin/drush cr"

# Run a PHP script in Drupal context
docker cp script.php talknotes_drupal_dev:/tmp/script.php
docker exec talknotes_drupal_dev bash -c "cd /opt/drupal && vendor/bin/drush php:script /tmp/script.php"

# Rebuild React frontend
docker compose stop react && docker compose rm -f react && docker compose up -d --build react
```

---

## Custom API endpoints

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/public-stats` | None | Entry, article, usage diff counts + pageviews |
| `GET /api/admin-stats` | X-Admin-Secret | Full stats including drafts |
| `POST /api/save-pageviews` | X-Admin-Secret | Store pageview count from Umami |
| `GET /api/recent-drafts` | X-Admin-Secret | Recently created draft entries |

---

## Backup status

| Component | Method | Frequency |
|-----------|--------|-----------|
| PostgreSQL database | pg_dump to `/storage/backups/postgres/` | Nightly 02:45 |
| Project files and config | WD SSD backup | Weekly |
| Source code | GitHub | Every commit |
| Composer dependencies | composer.lock in GitHub | Every commit |
| Uploaded media | N/A — no media uploads in this project | — |

---

## Planned features

### Content expansion

- Ongoing entries across all 13 categories
- Word family articles (Get, Make, Take, Run...)
- Practical American life vocabulary (DMV, credit scores, dining, tipping)
- Indian English vs American English comparisons

### Future enhancements

- **Email subscription** — word of the day and new article notifications via mailing list (Mailchimp or ConvertKit)
- **Social media presence** — Twitter/X first, then Instagram; content cards from existing entries
- Full marketing plan when subscriber base grows

---

## Content creation workflow

1. Check for existing entries via PHP script
2. Create missing entries via PHP script in Drupal container
3. Retrieve path aliases
4. Build article with inline hyperlinks to entries
5. Commit to GitHub

---

## Known patterns and gotchas

**Pagination sort bug:** Drupal JSON:API silently skips entries with identical `changed` timestamps during pagination unless a secondary sort key is added. All paginated API calls must include `sort=changed,drupal_internal__nid`.

**Drush path:** Inside the container, Drupal root is at `/opt/drupal` (symlinked from `/var/www/html`). Drush is at `/opt/drupal/vendor/bin/drush`.

**CORS:** Allowed origins configured in `drupal/settings/services.yml`. Must include any new frontend domain.

**Drupal container:** Uses `drupal:10-apache` image. Contrib modules installed via composer inside the container. If the container is ever recreated from scratch, run `composer install` from `/opt/drupal` before running drush.
