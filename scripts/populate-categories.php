<?php

$term_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');

$categories = [
  'Business Lingo' => [
    'definition' => 'Words or phrases commonly used in professional, corporate, office, or business communication.',
    'when_to_use' => 'Meeting phrases, corporate expressions, workplace jargon, business email language, management or project language.',
    'when_not_to_use' => 'Do not use for general vocabulary unless the main reason for recording it is workplace usage.',
    'examples' => 'Circle back, Take it offline, Bandwidth, Low-hanging fruit, Alignment',
  ],
  'American Lingo' => [
    'definition' => 'Words, phrases, or expressions commonly heard in American English, especially those that may be unfamiliar to someone from another country.',
    'when_to_use' => 'Everyday American expressions, casual phrases, culturally common sayings, expressions heard in daily US life.',
    'when_not_to_use' => 'Do not use if the entry is mainly an idiom, business phrase, or usage comparison.',
    'examples' => 'No worries, You bet, I\'m good, Sounds good, Hang tight',
  ],
  'Vocabulary' => [
    'definition' => 'Useful English words worth remembering because of meaning, usage, elegance, precision, or frequency.',
    'when_to_use' => 'Individual words, good words for writing or speaking, words with useful meanings, words the admin wants to remember.',
    'when_not_to_use' => 'Do not use for phrases, idioms, or cultural expressions unless the entry is mainly about the word itself.',
    'examples' => 'Resilient, Nuance, Emporium, Elaborate, Pragmatic',
  ],
  'Idioms and Phrases' => [
    'definition' => 'Expressions whose meaning is not always clear from the literal meaning of the words.',
    'when_to_use' => 'Idioms, figurative expressions, common phrases with non-literal meaning, expressions with a special cultural meaning.',
    'when_not_to_use' => 'Do not use for ordinary business jargon unless the figurative meaning is the main focus.',
    'examples' => 'Achilles\' heel, Spill the beans, Take it with a grain of salt, Break the ice, Hit the nail on the head',
  ],
  'Tales and Origins' => [
    'definition' => 'Words or phrases that are interesting mainly because of their story, origin, etymology, historical background, or cultural journey.',
    'when_to_use' => 'Expressions with a story, mythological references, historical phrases, etymology notes, cultural background.',
    'when_not_to_use' => 'Do not use if the entry has no meaningful story or origin worth explaining.',
    'examples' => 'Achilles\' heel, Kangaroo court, Red herring, Deadline, The whole nine yards',
  ],
  'Usage Difference' => [
    'definition' => 'Comparisons between similar words, phrases, or expressions that are often confused or used differently.',
    'when_to_use' => 'Word vs word explanations, similar meaning comparisons, confusing pairs, context-based usage differences.',
    'when_not_to_use' => 'Not for entries that are purely vocabulary or idioms without a comparison.',
    'examples' => 'Stone vs rock, House vs home, Bill vs invoice, Affect vs effect, Then vs than',
  ],
  'Indian English vs American English' => [
    'definition' => 'Expressions, words, or sentence patterns common in Indian English that may sound different, unusual, overly formal, or confusing in American English.',
    'when_to_use' => 'Indian English phrases, American alternatives, cross-cultural communication notes, workplace communication differences.',
    'when_not_to_use' => 'Do not use for every American phrase; use only when Indian-English comparison is central.',
    'examples' => 'Prepone, Do the needful, Revert back, Cousin brother, Passed out from college',
  ],
  'Everyday American Expressions' => [
    'definition' => 'Common casual expressions used in daily conversation in the US.',
    'when_to_use' => 'Friendly everyday speech, short conversational phrases, common replies, expressions heard in stores, schools, offices, neighborhoods, and casual interactions.',
    'when_not_to_use' => 'Do not use if the phrase is specifically workplace jargon or an idiom.',
    'examples' => 'How\'s it going?, I\'m good, No problem, Have a good one, That works',
  ],
  'Politeness and Tone' => [
    'definition' => 'Entries explaining how wording changes politeness, softness, directness, friendliness, or professionalism.',
    'when_to_use' => 'Polite alternatives, email tone, softening requests, direct vs indirect speech, phrases that may sound rude or too blunt.',
    'when_not_to_use' => 'Do not use for vocabulary where tone is not important.',
    'examples' => 'Could you please…, I was wondering if…, Would it be possible to…, Just checking in…, When you get a chance…',
  ],
  'Cultural Context' => [
    'definition' => 'Expressions that require cultural background to fully understand.',
    'when_to_use' => 'Sports metaphors, school-related expressions, holiday expressions, pop culture expressions, American social customs, references that non-native speakers may miss.',
    'when_not_to_use' => 'Do not use if the phrase can be explained without cultural background.',
    'examples' => 'Monday morning quarterback, Home run, Touch base, White elephant, Potluck',
  ],
  'Common Confusing Words' => [
    'definition' => 'Words that are often confused because they sound similar, look similar, or have overlapping meanings.',
    'when_to_use' => 'Common grammar/vocabulary confusion, spelling confusion, meaning confusion, similar word pairs.',
    'when_not_to_use' => 'If the entry is a direct comparison, use Usage Difference content type instead.',
    'examples' => 'Affect vs effect, Compliment vs complement, Principal vs principle, Loose vs lose, Advice vs advise',
  ],
  'Kids and School English' => [
    'definition' => 'Words and phrases parents may hear from schools, teachers, children, events, activities, and family life in the US.',
    'when_to_use' => 'School communication, parenting-related language, kids\' activities, classroom vocabulary, US school culture.',
    'when_not_to_use' => 'Do not use for general children\'s vocabulary unless the US school/parenting context matters.',
    'examples' => 'Field trip, Permission slip, Recess, Playdate, Dismissal',
  ],
  'Literal Translation Traps' => [
    'definition' => 'Phrases that may come from translating ideas from another language but do not sound natural in American English.',
    'when_to_use' => 'Unnatural translated phrases, phrases that make sense in Bengali/Hindi/Indian languages but not in American English, better natural alternatives.',
    'when_not_to_use' => 'Do not use for simple grammar mistakes unless translation/cultural transfer is the main issue.',
    'examples' => '"I am having a doubt", "My head is paining", "Today itself", "Discuss about", "Return back"',
  ],
];

foreach ($categories as $name => $data) {
  $terms = $term_storage->loadByProperties(['vid' => 'main_categories', 'name' => $name]);
  if (empty($terms)) {
    echo "NOT FOUND: $name\n";
    continue;
  }

  $term = reset($terms);
  $term->set('field_short_definition', $data['definition']);
  $term->set('field_when_to_use', $data['when_to_use']);
  $term->set('field_when_not_to_use', $data['when_not_to_use']);
  $term->set('field_example_entries', $data['examples']);
  $term->save();
  echo "Updated: $name\n";
}

echo "\nAll categories populated!\n";
