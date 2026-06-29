<?php
$nodes = \Drupal::entityTypeManager()->getStorage('node')
  ->loadByProperties(['type' => 'language_entry', 'status' => 0]);
echo "Unpublished nodes: " . count($nodes) . "\n";
foreach ($nodes as $node) {
  echo "- [{$node->id()}] {$node->getTitle()} | moderation: {$node->moderation_state->value}\n";
}

$nodes2 = \Drupal::entityTypeManager()->getStorage('node')
  ->loadByProperties(['type' => 'language_entry', 'status' => 1]);
echo "Published nodes: " . count($nodes2) . "\n";
