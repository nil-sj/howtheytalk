<?php

use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;

$fields = [
  [
    'field_name' => 'field_short_definition',
    'type' => 'string_long',
    'label' => 'Short Definition',
  ],
  [
    'field_name' => 'field_when_to_use',
    'type' => 'string_long',
    'label' => 'When to Use',
  ],
  [
    'field_name' => 'field_when_not_to_use',
    'type' => 'string_long',
    'label' => 'When Not to Use',
  ],
  [
    'field_name' => 'field_example_entries',
    'type' => 'string_long',
    'label' => 'Example Entries',
  ],
];

foreach ($fields as $field_def) {
  $field_name = $field_def['field_name'];

  if (!FieldStorageConfig::loadByName('taxonomy_term', $field_name)) {
    FieldStorageConfig::create([
      'field_name' => $field_name,
      'entity_type' => 'taxonomy_term',
      'type' => $field_def['type'],
      'cardinality' => 1,
    ])->save();
  }

  if (!FieldConfig::loadByName('taxonomy_term', 'main_categories', $field_name)) {
    FieldConfig::create([
      'field_name' => $field_name,
      'entity_type' => 'taxonomy_term',
      'bundle' => 'main_categories',
      'label' => $field_def['label'],
      'required' => FALSE,
    ])->save();
    echo "Created field: {$field_def['label']}\n";
  } else {
    echo "Already exists: {$field_def['label']}\n";
  }
}

echo "\nDone!\n";
