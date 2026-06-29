<?php

use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;
use Drupal\node\Entity\NodeType;

// ── Create Language Entry content type ───────────────────────────────────────
if (!NodeType::load('language_entry')) {
  NodeType::create([
    'type' => 'language_entry',
    'name' => 'Language Entry',
    'description' => 'A word, phrase, idiom, or language observation.',
    'new_revision' => TRUE,
  ])->save();
  echo "Created content type: Language Entry\n";
} else {
  echo "Already exists: Language Entry\n";
}

// ── Field definitions ─────────────────────────────────────────────────────────
$fields = [
  [
    'field_name' => 'field_main_category',
    'type' => 'entity_reference',
    'label' => 'Main Category',
    'required' => TRUE,
    'settings' => ['target_type' => 'taxonomy_term'],
    'instance_settings' => ['handler_settings' => ['target_bundles' => ['main_categories' => 'main_categories']]],
  ],
  [
    'field_name' => 'field_short_meaning',
    'type' => 'string_long',
    'label' => 'Short Meaning / Summary',
    'required' => TRUE,
    'settings' => [],
    'instance_settings' => [],
  ],
  [
    'field_name' => 'field_detailed_explanation',
    'type' => 'text_long',
    'label' => 'Detailed Explanation',
    'required' => FALSE,
    'settings' => [],
    'instance_settings' => [],
  ],
  [
    'field_name' => 'field_usage_examples',
    'type' => 'text_long',
    'label' => 'Usage Examples',
    'required' => FALSE,
    'settings' => ['cardinality' => -1],
    'instance_settings' => [],
  ],
  [
    'field_name' => 'field_notes_background',
    'type' => 'text_long',
    'label' => 'Notes / Story / Background',
    'required' => FALSE,
    'settings' => [],
    'instance_settings' => [],
  ],
  [
    'field_name' => 'field_source_links',
    'type' => 'link',
    'label' => 'Source / External Links',
    'required' => FALSE,
    'settings' => ['cardinality' => -1],
    'instance_settings' => ['link_type' => 0x10, 'title' => 1],
  ],
  [
    'field_name' => 'field_tags',
    'type' => 'entity_reference',
    'label' => 'Tags',
    'required' => FALSE,
    'settings' => ['target_type' => 'taxonomy_term'],
    'instance_settings' => ['handler_settings' => ['target_bundles' => ['tags' => 'tags'], 'auto_create' => TRUE]],
  ],
  [
    'field_name' => 'field_admin_notes',
    'type' => 'string_long',
    'label' => 'Admin Private Notes',
    'required' => FALSE,
    'settings' => [],
    'instance_settings' => [],
  ],
  [
    'field_name' => 'field_ai_draft',
    'type' => 'string_long',
    'label' => 'AI Draft Output',
    'required' => FALSE,
    'settings' => [],
    'instance_settings' => [],
  ],
];

foreach ($fields as $field_def) {
  $field_name = $field_def['field_name'];
  $cardinality = $field_def['settings']['cardinality'] ?? 1;

  // Create field storage if it doesn't exist
  if (!FieldStorageConfig::loadByName('node', $field_name)) {
    $storage = [
      'field_name' => $field_name,
      'entity_type' => 'node',
      'type' => $field_def['type'],
      'cardinality' => $cardinality,
    ];
    if ($field_def['type'] === 'entity_reference') {
      $storage['settings'] = $field_def['settings'];
    }
    FieldStorageConfig::create($storage)->save();
  }

  // Create field instance on language_entry if it doesn't exist
  if (!FieldConfig::loadByName('node', 'language_entry', $field_name)) {
    $instance = [
      'field_name' => $field_name,
      'entity_type' => 'node',
      'bundle' => 'language_entry',
      'label' => $field_def['label'],
      'required' => $field_def['required'],
    ];
    if (!empty($field_def['instance_settings'])) {
      $instance['settings'] = $field_def['instance_settings'];
    }
    FieldConfig::create($instance)->save();
    echo "Created field: {$field_def['label']}\n";
  } else {
    echo "Already exists: {$field_def['label']}\n";
  }
}

echo "\nLanguage Entry content type is ready!\n";
