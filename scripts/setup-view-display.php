<?php

use Drupal\Core\Entity\Entity\EntityViewDisplay;

$display = EntityViewDisplay::load('node.language_entry.default');
if (!$display) {
  $display = EntityViewDisplay::create([
    'targetEntityType' => 'node',
    'bundle' => 'language_entry',
    'mode' => 'default',
    'status' => TRUE,
  ]);
}

$fields = [
  'field_main_category' => ['type' => 'entity_reference_label', 'weight' => 1, 'label' => 'above'],
  'field_short_meaning' => ['type' => 'basic_string', 'weight' => 2, 'label' => 'above'],
  'field_detailed_explanation' => ['type' => 'text_default', 'weight' => 3, 'label' => 'above'],
  'field_usage_examples' => ['type' => 'text_default', 'weight' => 4, 'label' => 'above'],
  'field_notes_background' => ['type' => 'text_default', 'weight' => 5, 'label' => 'above'],
  'field_source_links' => ['type' => 'link', 'weight' => 6, 'label' => 'above'],
  'field_tags' => ['type' => 'entity_reference_label', 'weight' => 7, 'label' => 'above'],
];

foreach ($fields as $field_name => $config) {
  $display->setComponent($field_name, [
    'type' => $config['type'],
    'weight' => $config['weight'],
    'label' => $config['label'],
  ]);
  echo "Added to view display: $field_name\n";
}

// Hide admin-only fields from public view
$display->removeComponent('field_admin_notes');
$display->removeComponent('field_ai_draft');

$display->save();
echo "\nView display updated!\n";
