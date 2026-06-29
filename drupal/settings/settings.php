<?php

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

$settings['hash_salt'] = getenv('DRUPAL_HASH_SALT') ?: 'CHANGE_ME';
$settings['config_sync_directory'] = '/var/www/html/config/sync';

$settings['reverse_proxy'] = TRUE;
$settings['reverse_proxy_addresses'] = ['127.0.0.1', '::1'];

if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
  $_SERVER['HTTPS'] = 'on';
}

$settings['trusted_host_patterns'] = [
  '^192\.168\.1\.157$',
  '^localhost$',
  '^talknotes\.codenil\.online$',
];

$settings['file_public_path']  = 'sites/default/files';
$settings['file_private_path'] = '/var/www/html/sites/default/private';
$settings['update_free_access'] = FALSE;
