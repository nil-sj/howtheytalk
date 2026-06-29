<?php

use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;
use Drupal\node\Entity\NodeType;
use Drupal\Core\Entity\Entity\EntityFormDisplay;
use Drupal\Core\Entity\Entity\EntityViewDisplay;

if (!NodeType::load('article')) {
  NodeType::create([
    'type' => 'article',
    'name' => 'Article',
    'description' => 'Long-form blog posts and language observations.',
    'new_revision' => TRUE,
  ])->save();
  echo "Created content type: Article\n";
} else {
  echo "Already exists: Article\n";
}

$fields = [
  ['field_name' => 'field_summary', 'type' => 'string_long', 'label' => 'Summary', 'required' => FALSE],
  ['field_name' => 'field_body', 'type' => 'text_long', 'label' => 'Body', 'required' => TRUE],
  ['field_name' => 'field_tags', 'type' => 'entity_reference', 'label' => 'Tags', 'required' => FALSE],
  ['field_name' => 'field_source_links', 'type' => 'link', 'label' => 'Source Links', 'required' => FALSE],
];

foreach ($fields as $field_def) {
  $field_name = $field_def['field_name'];

  if (!FieldStorageConfig::loadByName('node', $field_name)) {
    $storage = ['field_name' => $field_name, 'entity_type' => 'node', 'type' => $field_def['type'], 'cardinality' => -1];
    if ($field_def['type'] === 'entity_reference') $storage['settings'] = ['target_type' => 'taxonomy_term'];
    FieldStorageConfig::create($storage)->save();
  }

  if (!FieldConfig::loadByName('node', 'article', $field_name)) {
    $instance = ['field_name' => $field_name, 'entity_type' => 'node', 'bundle' => 'article', 'label' => $field_def['label'], 'required' => $field_def['required']];
    if ($field_def['type'] === 'entity_reference') $instance['settings'] = ['handler_settings' => ['target_bundles' => ['tags' => 'tags'], 'auto_create' => TRUE]];
    if ($field_def['type'] === 'link') $instance['settings'] = ['link_type' => 0x10, 'title' => 1];
    FieldConfig::create($instance)->save();
    echo "Created field: {$field_def['label']}\n";
  }
}

// Form display
$form_display = EntityFormDisplay::load('node.article.default') ??
  EntityFormDisplay::create(['targetEntityType' => 'node', 'bundle' => 'article', 'mode' => 'default', 'status' => TRUE]);
$form_display->setComponent('field_summary', ['type' => 'string_textarea', 'weight' => 1])
  ->setComponent('field_body', ['type' => 'text_textarea', 'weight' => 2])
  ->setComponent('field_tags', ['type' => 'entity_reference_autocomplete_tags', 'weight' => 3])
  ->setComponent('field_source_links', ['type' => 'link_default', 'weight' => 4])
  ->save();

// View display
$view_display = EntityViewDisplay::load('node.article.default') ??
  EntityViewDisplay::create(['targetEntityType' => 'node', 'bundle' => 'article', 'mode' => 'default', 'status' => TRUE]);
$view_display->setComponent('field_summary', ['type' => 'basic_string', 'weight' => 1, 'label' => 'hidden'])
  ->setComponent('field_body', ['type' => 'text_default', 'weight' => 2, 'label' => 'hidden'])
  ->setComponent('field_tags', ['type' => 'entity_reference_label', 'weight' => 3, 'label' => 'above'])
  ->setComponent('field_source_links', ['type' => 'link', 'weight' => 4, 'label' => 'above'])
  ->save();

echo "\nArticle content type ready!\n";
