<?php
$global = \Drupal::configFactory()->getEditable('metatag.metatag_defaults.global');
$global->set('tags', [
  'title' => '[current-page:title] | TalkNotes',
  'description' => 'TalkNotes — A personal repository of English words, phrases, idioms, and everyday expressions, especially for learning practical American English.',
  'og_title' => '[current-page:title] | TalkNotes',
  'og_description' => 'TalkNotes — A personal repository of English words, phrases, idioms, and everyday expressions.',
  'og_site_name' => 'TalkNotes',
  'og_type' => 'website',
])->save();

$node = \Drupal::configFactory()->getEditable('metatag.metatag_defaults.node');
$node->set('tags', [
  'title' => '[node:title] | TalkNotes',
  'description' => '[node:field_short_meaning]',
  'og_title' => '[node:title] | TalkNotes',
  'og_description' => '[node:field_short_meaning]',
  'og_type' => 'article',
  'canonical_url' => '[node:url]',
])->save();

echo "Metatags configured!\n";
