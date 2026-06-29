<?php

/**
 * TalkNotes - Drupal settings.php
 * Reads all credentials from environment variables — no hardcoded secrets.
 * Place at: drupal/settings/settings.php
 */

// ── Database (shared PostgreSQL container) ────────────────────────────────────
$databases['default']['default'] = [
  'driver'   => 'pgsql',
  'database' => getenv('POSTGRES_DB')       ?: 'talknotes',
  'username' => getenv('POSTGRES_USER')     ?: 'talknotes_user',
  'password' => getenv('POSTGRES_PASSWORD') ?: '',
  'host'     => getenv('POSTGRES_HOST')     ?: 'postgres',
  'port'     => getenv('POSTGRES_PORT')     ?: '5432',
  'prefix'   => '',
  'namespace' => 'Drupal\\pgsql\\Driver\\Database\\pgsql',
  'autoload'  => 'core/modules/pgsql/src/Driver/Database/pgsql/',
];

// ── Hash salt ─────────────────────────────────────────────────────────────────
$settings['hash_salt'] = getenv('DRUPAL_HASH_SALT') ?: 'CHANGE_ME_before_install';

// ── Config sync directory (version controlled) ────────────────────────────────
$settings['config_sync_directory'] = '/var/www/html/config/sync';

// ── Reverse proxy (Nginx Proxy Manager) ──────────────────────────────────────
if (getenv('DRUPAL_REVERSE_PROXY') === 'true') {
  $settings['reverse_proxy'] = TRUE;
  $settings['reverse_proxy_addresses'] = array($_SERVER['REMOTE_ADDR']);
  // Force HTTPS awareness
  if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
  }
}

// ── Trusted host patterns (production) ───────────────────────────────────────
$trusted_host = getenv('TRUSTED_HOST');
if ($trusted_host) {
  $settings['trusted_host_patterns'] = [
    '^' . $trusted_host . '$',
    '^localhost$',
  ];
} else {
  // Dev: allow all (NOT safe for production)
  $settings['trusted_host_patterns'] = ['.*'];
}

// ── File paths ────────────────────────────────────────────────────────────────
$settings['file_public_path']  = 'sites/default/files';
$settings['file_private_path'] = '/var/www/html/sites/default/private';

// ── Performance (production) ──────────────────────────────────────────────────
// Uncomment these for production:
// $config['system.performance']['css']['preprocess'] = TRUE;
// $config['system.performance']['js']['preprocess'] = TRUE;
// $settings['cache']['bins']['render'] = 'cache.backend.null'; // disable only for debugging

// ── Environment indicator ─────────────────────────────────────────────────────
$site_url = getenv('SITE_URL') ?: 'http://localhost:8090';
if (strpos($site_url, 'localhost') !== false) {
  // Development environment
  $config['system.logging']['error_level'] = 'verbose';
  $settings['skip_permissions_hardening'] = TRUE;
} else {
  // Production environment
  $config['system.logging']['error_level'] = 'hide';
  $settings['skip_permissions_hardening'] = FALSE;
}

// ── Update free access (keep FALSE always) ────────────────────────────────────
$settings['update_free_access'] = FALSE;
