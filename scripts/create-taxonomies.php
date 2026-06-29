<?php

$vocab_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_vocabulary');
$term_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');

if (!$vocab_storage->load('main_categories')) {
  $vocab_storage->create(['vid' => 'main_categories', 'name' => 'Main Categories'])->save();
  echo "Created vocabulary: Main Categories\n";
} else {
  echo "Already exists: Main Categories\n";
}

if (!$vocab_storage->load('tags')) {
  $vocab_storage->create(['vid' => 'tags', 'name' => 'Tags'])->save();
  echo "Created vocabulary: Tags\n";
} else {
  echo "Already exists: Tags\n";
}

$categories = [
  'Business Lingo',
  'American Lingo',
  'Vocabulary',
  'Idioms and Phrases',
  'Tales and Origins',
  'Usage Difference',
  'Indian English vs American English',
  'Everyday American Expressions',
  'Politeness and Tone',
  'Cultural Context',
  'Common Confusing Words',
  'Kids and School English',
  'Literal Translation Traps',
];

foreach ($categories as $i => $name) {
  $existing = $term_storage->loadByProperties(['vid' => 'main_categories', 'name' => $name]);
  if (empty($existing)) {
    $term_storage->create(['vid' => 'main_categories', 'name' => $name, 'weight' => $i])->save();
    echo "Created: $name\n";
  } else {
    echo "Already exists: $name\n";
  }
}

echo "\nDone!\n";
