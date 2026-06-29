<?php

use Drupal\Core\Entity\Entity\EntityFormDisplay;

$display = EntityFormDisplay::load('node.language_entry.default');
if (!$display) {
  $display = EntityFormDisplay::create([
    'targetEntityType' => 'node',
    'bundle' => 'language_entry',
    'mode' => 'default',
    'status' => TRUE,
  ]);
}

$fields = [
  'field_main_category' => ['type' => 'options_select', 'weight' => 1],
  'field_short_meaning' => ['type' => 'string_textarea', 'weight' => 2],
  'field_detailed_explanation' => ['type' => 'text_textarea', 'weight' => 3],
  'field_usage_examples' => ['type' => 'text_textarea', 'weight' => 4],
  'field_notes_background' => ['type' => 'text_textarea', 'weight' => 5],
  'field_source_links' => ['type' => 'link_default', 'weight' => 6],
  'field_tags' => ['type' => 'entity_reference_autocomplete_tags', 'weight' => 7],
  'field_admin_notes' => ['type' => 'string_textarea', 'weight' => 8],
  'field_ai_draft' => ['type' => 'string_textarea', 'weight' => 9],
];

foreach ($fields as $field_name => $config) {
  $display->setComponent($field_name, [
    'type' => $config['type'],
    'weight' => $config['weight'],
  ]);
  echo "Added to form: $field_name\n";
}

$display->save();
echo "\nForm display updated!\n";
