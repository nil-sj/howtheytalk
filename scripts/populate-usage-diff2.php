<?php

use Drupal\node\Entity\Node;

function make_diff($title, $terms, $quick, $detailed, $mistake, $notes) {
  $existing = \Drupal::entityTypeManager()->getStorage('node')
    ->loadByProperties(['type' => 'usage_difference', 'title' => $title]);
  if ($existing) { echo "Skip (exists): $title\n"; return; }
  Node::create([
    'type' => 'usage_difference',
    'title' => $title,
    'status' => 1,
    'moderation_state' => 'published',
    'field_terms_compared' => $terms,
    'field_quick_difference' => $quick,
    'field_detailed_explanation' => ['value' => $detailed, 'format' => 'basic_html'],
    'field_common_mistake' => ['value' => $mistake, 'format' => 'basic_html'],
    'field_notes_background' => ['value' => $notes, 'format' => 'basic_html'],
  ])->save();
  echo "Created: $title\n";
}

make_diff(
  'Big vs Large',
  'Big: Informal, general size or importance. Large: More formal, usually refers to physical size or quantity.',
  '"Big" is casual and covers size, importance, and significance. "Large" is more formal and usually refers only to physical size or quantity.',
  '"Big" is the everyday casual word — a big deal, a big mistake, big news, big dreams. It covers physical size but also figurative importance. "Large" is more precise and formal — it usually refers to physical dimensions or quantities. You order a large coffee, buy a large-sized shirt, or describe a large building. You would not normally say "a large deal" or "large news" — those sound wrong because "large" does not work for abstract importance.',
  'Using "large" in casual contexts where "big" is more natural: "That was a large mistake" sounds formal and odd. "That was a big mistake" is the natural choice. Conversely, in formal writing, "big" can sound too casual — "the large majority of respondents" is more formal than "the big majority."',
  '"Big" is one of the first English words children learn and remains the most versatile. "Large" is preferred in formal writing, business contexts, and when describing measurable physical quantities. On clothing labels, you see L for Large, not B for Big.'
);

make_diff(
  'Watch vs Look vs See',
  'See: Passive — images enter your eyes without focused attention. Look: Active — you direct your eyes intentionally at something. Watch: Active over time — you observe something moving or changing with sustained attention.',
  '"See" is passive and involuntary. "Look" is a deliberate act of directing your gaze. "Watch" implies sustained observation of something that moves or changes.',
  '"See" happens automatically — you see something without trying. "I saw a bird outside my window" means it entered your field of vision. "Look" is deliberate — you choose to direct your eyes somewhere. "Look at this photo" is an instruction to direct your gaze. "Watch" involves sustained, active attention over time, usually of something that moves or changes. You watch a movie, watch a game, watch children playing. You would not normally say "watch this painting" (it does not move), but you might "look at this painting."',
  'Saying "see a movie" vs "watch a movie" — both are used, but "watch" is more precise since viewing a film involves sustained attention over time. "Did you see that game?" is casual and common. "I was looking at a game" would sound strange — you watch games, not look at them.',
  'The same active/passive distinction applies to "listen" (active, focused attention) vs "hear" (passive, involuntary). English has these pairs: see/look/watch for vision, hear/listen for sound. Mastering these pairs significantly improves natural-sounding English.'
);

make_diff(
  'Make vs Do',
  'Make: Usually involves creating or producing something that did not exist before. Do: Usually refers to performing an activity, task, or action.',
  '"Make" creates something new. "Do" performs an action or task.',
  '"Make" is used when the result is something produced or constructed — make a cake, make a decision, make a mistake, make a plan, make noise, make money. "Do" is used for activities, tasks, and general actions — do your homework, do the dishes, do a job, do business, do your best, do damage. There are many fixed expressions that simply must be memorized: you "make" a phone call but "do" someone a favor. You "make" friends but "do" research. You "make" an effort but "do" work.',
  'Saying "do a mistake" instead of "make a mistake." In English, mistakes are made, not done. Similarly, "do a decision" is wrong — you make decisions. Conversely, "make the dishes" is wrong — you do the dishes.',
  'The make/do distinction is one of the hardest things for non-native English speakers to master because many languages use a single verb where English uses two. There is no perfect rule — many expressions simply have to be learned individually. Common "make" expressions: make a call, make a difference, make an effort, make an exception. Common "do" expressions: do a favor, do damage, do research, do business.'
);

make_diff(
  'Bring vs Take',
  'Bring: Moving something toward the speaker or the place being discussed. Take: Moving something away from the speaker or the current location.',
  '"Bring" moves something TO you or your location. "Take" moves something AWAY from you or your location.',
  'The key is perspective and direction. "Bring" implies movement toward the speaker or toward the place being talked about. "Can you bring me a coffee?" means move the coffee to where I am. "I will bring my laptop to the meeting" means the laptop will come to where the meeting is (where we both will be). "Take" implies movement away. "Take this to the post office" means carry it away from here. "Take an umbrella" means carry it with you when you leave.',
  '"Can I bring this to the office?" is correct when you will be going TO the office. "Can I take this to the office?" is also acceptable, but "bring" emphasizes the arrival at the destination. A common error is using "take" when speaking to someone about bringing something to their location: "I will take cookies to your party" could sound like the cookies are going somewhere else — "I will bring cookies to your party" makes it clear they are coming to where you are.',
  'A helpful test: imagine the movement on a map. If something is moving TOWARD the place you are talking about, use "bring." If it is moving AWAY from your current location, use "take." In phone or email conversations, the location being discussed determines the choice: if someone says "come to my office," the appropriate response is "I will bring the documents" (moving toward their office).'
);

make_diff(
  'Since vs For',
  'Since: Used with a point in time — a specific moment when something started. For: Used with a duration — a length of time that something has lasted.',
  '"Since" refers to a starting point in time. "For" refers to a length of time.',
  'Use "since" when you name the moment something began: since Monday, since 2020, since I graduated, since the meeting started. Use "for" when you state how long something has lasted: for three days, for two years, for a long time, for ages. "I have been waiting since 3 PM" (started at 3 PM). "I have been waiting for two hours" (the duration is two hours). Both sentences might refer to the same situation, but one gives the starting point and the other gives the length.',
  'Saying "I have been here since two hours" is incorrect — two hours is a duration, not a point in time, so "for" must be used: "I have been here for two hours." Conversely, "I have been here for Monday" is wrong because Monday is a point in time: "I have been here since Monday."',
  'This distinction is important in English grammar with the present perfect tense. Both "since" and "for" are used with "have been," "has lived," "have worked," etc. In spoken English, native speakers sometimes use "since" informally where grammar requires "for," but in writing and formal speech, maintaining the distinction is important.'
);

make_diff(
  'Say vs Tell',
  'Say: Used for direct speech or general statements. "Say" focuses on the words spoken. Tell: Used when specifying who received the information. "Tell" requires an indirect object — someone must be told.',
  '"Say" focuses on the words themselves. "Tell" requires a listener — you always tell someone something.',
  '"Say" is used to report speech or make statements: "She said hello." "What did he say?" "Say something." "Say" does not require mentioning the listener. "Tell" always involves communicating information TO someone — there must be a recipient: "She told me hello." "Tell him the truth." "Tell us what happened." You cannot just "tell" without saying who you told. A test: can you insert "to someone" after the verb? If yes, "say" works. If the someone is the direct object (not introduced by "to"), "tell" is needed.',
  'Saying "She told hello" is incorrect — "tell" needs a person as the direct object followed by what was communicated: "She told me hello" or more naturally "She said hello to me." Saying "He said me the address" is wrong — use "told": "He told me the address."',
  'Fixed expressions: you "tell the truth," "tell a lie," "tell a story," "tell the time," "tell the difference." You "say a prayer," "say a word," "say your name." These are fixed collocations that must be memorized. "Tell" is also used with instructions: "tell someone to do something" — "She told me to wait."'
);

make_diff(
  'Beside vs Besides',
  'Beside: Next to; at the side of. Besides: In addition to; apart from; also.',
  '"Beside" means physically next to something. "Besides" means in addition to something.',
  '"Beside" is a preposition meaning next to or at the side of: "She sat beside me." "The lamp is beside the bed." "Beside" can also be used figuratively in fixed expressions: "beside the point" (irrelevant), "beside yourself" (extremely upset or excited). "Besides" means in addition to, apart from, or furthermore: "Besides English, she speaks French and Mandarin." "I don\'t want to go — besides, I\'m tired." As an adverb, "besides" means "also" or "moreover."',
  'Using "beside" when "besides" is intended: "Beside the cost, there are other concerns" should be "Besides the cost, there are other concerns." The confusion is understandable — both words share the same root, but the presence or absence of the final "s" completely changes the meaning.',
  '"Beside the point" is a very common fixed expression meaning irrelevant or not related to the main issue. "That\'s beside the point" is widely used in arguments and discussions. "Besides" as a discourse marker (meaning "moreover" or "anyway") is common in casual speech: "I don\'t need it. Besides, it\'s too expensive."'
);

make_diff(
  'Interested vs Interesting',
  'Interested: Describes how a person feels — they want to learn more or are curious. Interesting: Describes a quality of the thing itself — it has the quality of capturing attention.',
  '"Interested" describes the person\'s feeling. "Interesting" describes the thing that causes the feeling.',
  'This is part of a larger pattern in English with participial adjectives. "-ed" adjectives (interested, bored, excited, confused) describe how a person feels. "-ing" adjectives (interesting, boring, exciting, confusing) describe the quality of the thing causing the feeling. "I am interested in history" — the person has the feeling of interest. "History is interesting" — history has the quality that produces interest. "She is bored" — she feels boredom. "The class is boring" — the class produces boredom.',
  'Saying "I am very interesting in your proposal" when you mean you are curious about it — the correct form is "I am very interested in your proposal." "Interesting" would describe you as a fascinating person, not your level of curiosity. This "-ed/-ing" confusion is one of the most common errors for non-native speakers across many language backgrounds.',
  'The same pattern applies to many common adjective pairs: bored/boring, excited/exciting, confused/confusing, tired/tiring, disappointed/disappointing, surprised/surprising, amazed/amazing, annoyed/annoying. A quick test: if you are describing a person\'s feeling, use "-ed." If you are describing a thing\'s quality, use "-ing."'
);

echo "\nAll usage differences created!\n";
