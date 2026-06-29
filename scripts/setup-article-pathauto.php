<?php

use Drupal\pathauto\Entity\PathautoPattern;

if (!PathautoPattern::load('node_article')) {
  PathautoPattern::create([
    'id' => 'node_article',
    'label' => 'Article',
    'type' => 'canonical_entities:node',
    'pattern' => '/articles/[node:title]',
    'selection_criteria' => [
      'node_type' => [
        'id' => 'entity_bundle:node',
        'bundles' => ['article' => 'article'],
        'negate' => FALSE,
        'context_mapping' => ['node' => 'node'],
      ],
    ],
    'weight' => 2,
  ])->save();
  echo "Created pattern: /articles/[node:title]\n";
}
