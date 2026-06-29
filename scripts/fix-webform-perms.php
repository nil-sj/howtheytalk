<?php

$perms = \Drupal::service('user.permissions')->getPermissions();
foreach ($perms as $key => $perm) {
  if (strpos($key, 'webform') !== FALSE) {
    echo $key . "\n";
  }
}
