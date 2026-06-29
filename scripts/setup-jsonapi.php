<?php

use Drupal\jsonapi_extras\Entity\JsonapiResourceConfig;

// Configure Language Entry resource — hide admin-only fields
$config_id = 'node--language_entry';

if ($existing = JsonapiResourceConfig::load($config_id)) {
  $existing->delete();
}

JsonapiResourceConfig::create([
  'id' => $config_id,
  'resourceType' => 'node--language_entry',
  'resourceFields' => [
    'field_admin_notes' => [
      'fieldName' => 'field_admin_notes',
      'publicName' => 'field_admin_notes',
      'enhancer' => ['id' => ''],
      'disabled' => TRUE,
    ],
    'field_ai_draft' => [
      'fieldName' => 'field_ai_draft',
      'publicName' => 'field_ai_draft',
      'enhancer' => ['id' => ''],
      'disabled' => TRUE,
    ],
  ],
])->save();

echo "JSON:API configured — admin_notes and ai_draft hidden from API\n";
echo "Test your API at: /jsonapi/node/language_entry\n";
