<?php
user_role_grant_permissions('anonymous', ['access webform rest settings', 'view any webform submission']);
user_role_grant_permissions('authenticated', ['access webform rest settings']);
echo "Permissions granted!\n";

// Also enable anonymous submissions on the webform
$webform = \Drupal\webform\Entity\Webform::load('suggest_a_word');
if ($webform) {
  $webform->setSetting('form_access', ['create' => ['anonymous' => 'anonymous', 'authenticated' => 'authenticated']]);
  $webform->save();
  echo "Webform anonymous access enabled!\n";
}
