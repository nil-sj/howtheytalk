<?php

use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;
use Drupal\node\Entity\NodeType;

if (!NodeType::load('usage_difference')) {
  NodeType::create([
    'type' => 'usage_difference',
    'name' => 'Usage Difference',
    'description' => 'Comparison between two or more similar words or phrases.',
    'new_revision' => TRUE,
  ])->save();
  echo "Created content type: Usage Difference\n";
} else {
  echo "Already exists: Usage Difference\n";
}

$fields = [
  [
    'field_name' => 'field_terms_compared',
    'type' => 'string_long',
    'label' => 'Terms Being Compared',
    'required' => TRUE,
  ],
  [
    'field_name' => 'field_quick_difference',
    'type' => 'string_long',
    'label' => 'Quick Difference Summary',
    'required' => TRUE,
  ],
  [
    'field_name' => 'field_detailed_explanation',
    'type' => 'text_long',
    'label' => 'Detailed Explanation',
    'required' => FALSE,
  ],
  [
    'field_name' => 'field_common_mistake',
    'type' => 'text_long',
    'label' => 'Common Mistake',
    'required' => FALSE,
  ],
  [
    'field_name' => 'field_notes_background',
    'type' => 'text_long',
    'label' => 'Notes',
    'required' => FALSE,
  ],
  [
    'field_name' => 'field_source_links',
    'type' => 'link',
    'label' => 'Source / External Links',
    'required' => FALSE,
  ],
  [
    'field_name' => 'field_tags',
    'type' => 'entity_reference',
    'label' => 'Tags',
    'required' => FALSE,
  ],
  [
    'field_name' => 'field_admin_notes',
    'type' => 'string_long',
    'label' => 'Admin Private Notes',
    'required' => FALSE,
  ],
];

foreach ($fields as $field_def) {
  $field_name = $field_def['field_name'];

  if (!FieldStorageConfig::loadByName('node', $field_name)) {
    $storage = [
      'field_name' => $field_name,
      'entity_type' => 'node',
      'type' => $field_def['type'],
      'cardinality' => 1,
    ];
    if ($field_def['type'] === 'entity_reference') {
      $storage['settings'] = ['target_type' => 'taxonomy_term'];
    }
    FieldStorageConfig::create($storage)->save();
  }

  if (!FieldConfig::loadByName('node', 'usage_difference', $field_name)) {
    $instance = [
      'field_name' => $field_name,
      'entity_type' => 'node',
      'bundle' => 'usage_difference',
      'label' => $field_def['label'],
      'required' => $field_def['required'],
    ];
    if ($field_def['type'] === 'entity_reference') {
      $instance['settings'] = ['handler_settings' => ['target_bundles' => ['tags' => 'tags'], 'auto_create' => TRUE]];
    }
    FieldConfig::create($instance)->save();
    echo "Created field: {$field_def['label']}\n";
  } else {
    echo "Already exists: {$field_def['label']}\n";
  }
}

echo "\nUsage Difference content type is ready!\n";
