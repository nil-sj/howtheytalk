<?php

use Drupal\pathauto\Entity\PathautoPattern;

// Delete existing patterns if any
foreach (['node_language_entry', 'node_usage_difference', 'taxonomy_main_categories'] as $id) {
  $pattern = PathautoPattern::load($id);
  if ($pattern) {
    $pattern->delete();
    echo "Deleted old pattern: $id\n";
  }
}

// Language Entry pattern
PathautoPattern::create([
  'id' => 'node_language_entry',
  'label' => 'Language Entry',
  'type' => 'canonical_entities:node',
  'pattern' => '/entries/[node:title]',
  'selection_criteria' => [
    'node_type' => [
      'id' => 'entity_bundle:node',
      'bundles' => ['language_entry' => 'language_entry'],
      'negate' => FALSE,
      'context_mapping' => ['node' => 'node'],
    ],
  ],
  'weight' => 0,
])->save();
echo "Created pattern: /entries/[node:title]\n";

// Usage Difference pattern
PathautoPattern::create([
  'id' => 'node_usage_difference',
  'label' => 'Usage Difference',
  'type' => 'canonical_entities:node',
  'pattern' => '/usage-difference/[node:title]',
  'selection_criteria' => [
    'node_type' => [
      'id' => 'entity_bundle:node',
      'bundles' => ['usage_difference' => 'usage_difference'],
      'negate' => FALSE,
      'context_mapping' => ['node' => 'node'],
    ],
  ],
  'weight' => 1,
])->save();
echo "Created pattern: /usage-difference/[node:title]\n";

// Category pattern
PathautoPattern::create([
  'id' => 'taxonomy_main_categories',
  'label' => 'Main Categories',
  'type' => 'canonical_entities:taxonomy_term',
  'pattern' => '/categories/[term:name]',
  'selection_criteria' => [
    'taxonomy_vocabulary' => [
      'id' => 'entity_bundle:taxonomy_term',
      'bundles' => ['main_categories' => 'main_categories'],
      'negate' => FALSE,
      'context_mapping' => ['taxonomy_term' => 'taxonomy_term'],
    ],
  ],
  'weight' => 0,
])->save();
echo "Created pattern: /categories/[term:name]\n";

echo "\nAll URL patterns created!\n";
