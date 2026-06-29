<?php

use Drupal\node\Entity\Node;

$differences = [
  [
    'title' => 'Rock vs Stone',
    'terms' => 'Rock: A large, naturally occurring solid mineral material, often in its raw or unmoved state. Stone: Usually a smaller, shaped, or purposefully used piece of rock — often cut, carved, or handled by people.',
    'quick_difference' => 'A rock is the raw natural material; a stone is often rock that has been used, shaped, or given a purpose by humans.',
    'detailed_explanation' => 'While "rock" and "stone" are often used interchangeably in casual speech, there are meaningful differences. "Rock" tends to refer to the large, natural, unworked material — a rock formation, a rock face, or a rock you might trip over. "Stone" often implies something smaller, shaped, or used intentionally — a stepping stone, a tombstone, a stone wall, or a precious stone. In construction, you build with stone. In geology, you study rock. In music, you play rock (never stone music). A gemstone is a stone, not a rock. You skip stones on water, not rocks (though both are used casually).',
    'common_mistake' => 'Using "rock" when "stone" is more appropriate in formal or construction contexts. Saying "the building is made of rock" sounds unusual — "made of stone" is more natural.',
    'notes' => 'The distinction is not always strict in casual American speech — people say both "throw a rock" and "throw a stone." But in formal writing, architecture, and jewelry, "stone" is almost always preferred.',
  ],
  [
    'title' => 'House vs Home',
    'terms' => 'House: A physical structure — a building where people live. Home: A place of emotional belonging, comfort, and personal connection — where you feel you belong.',
    'quick_difference' => 'A house is the physical building; a home is the emotional experience of belonging to a place.',
    'detailed_explanation' => 'A "house" is the physical structure — walls, roof, rooms. A "home" carries emotional meaning — it is where you feel safe, loved, and comfortable. You can live in a house that does not feel like home. You can also call a childhood apartment or a grandparent\'s house your "home" even if you do not live there. Real estate agents sell houses; people make homes. The phrase "home sweet home" would sound wrong as "house sweet house." When someone says "I\'m going home," they mean to their place of comfort and belonging, not just the building.',
    'common_mistake' => 'Using "house" when describing an emotional or personal connection. "I miss my house" sounds clinical; "I miss my home" carries the emotional weight that is usually intended.',
    'notes' => 'This distinction is deeply felt in American English. "Make yourself at home" is a warm invitation. "Make yourself in this house" would be meaningless. In Indian English, "house" and "home" are often used more interchangeably.',
  ],
  [
    'title' => 'Job vs Work vs Career',
    'terms' => 'Job: A specific position you are paid for. Work: The activity of doing tasks, whether paid or not. Career: The long-term professional journey across jobs over many years.',
    'quick_difference' => 'A job is a specific paid position; work is the activity itself; a career is the bigger life-long professional story.',
    'detailed_explanation' => 'These three words are often confused. A "job" is a specific role at a specific place — "I have a job at a bank." "Work" is the broader activity — "I have a lot of work to do" or "I am going to work." Work does not have to be paid — volunteer work, homework, and housework are all work. A "career" is the long arc of your professional life — the pattern of jobs, skills, and growth over time. You might have many jobs during one career. "Job" can sometimes sound temporary or low-status, while "career" suggests a professional path with direction.',
    'common_mistake' => 'Saying "I am looking for work" when you mean a specific job, or saying "my career" for a single job you just started.',
    'notes' => 'In casual American speech, "job" and "work" are often interchangeable. "I am going to work" and "I am going to my job" mean the same thing in daily conversation.',
  ],
  [
    'title' => 'Listen vs Hear',
    'terms' => 'Hear: To passively receive sounds through your ears without necessarily paying attention. Listen: To actively and intentionally pay attention to sounds.',
    'quick_difference' => 'Hearing is passive — it just happens. Listening is active — you choose to focus.',
    'detailed_explanation' => '"Hear" describes the physical, involuntary act of sound reaching your ears. You can hear something without trying — you hear a car horn while walking down the street. "Listen" describes intentional, focused attention to sound. You listen to music, you listen to a friend\'s problem, you listen carefully in a meeting. You cannot listen accidentally, but you can hear accidentally. "I hear you" can also mean "I understand your point," while "I\'m listening" signals active attention.',
    'common_mistake' => 'Saying "I was listening to a strange noise last night" when you mean you heard it unexpectedly. If you were not focusing on it, you "heard" it, not "listened to" it.',
    'notes' => 'The same distinction exists with "look" (active) vs "see" (passive). You look at something on purpose; you see something incidentally. These pairs are very useful for precise communication.',
  ],
  [
    'title' => 'Borrow vs Lend',
    'terms' => 'Borrow: To take something temporarily from someone, with the intention of returning it. Lend: To give something temporarily to someone, expecting it back.',
    'quick_difference' => 'You borrow FROM someone; you lend TO someone. The direction is opposite.',
    'detailed_explanation' => '"Borrow" is from the receiver\'s perspective — you are the one taking the item. "Lend" is from the giver\'s perspective — you are the one giving it temporarily. "Can I borrow your pen?" means "I want to take your pen temporarily." "Can you lend me your pen?" means "Will you give me your pen temporarily?" Both sentences ask for the same thing, just from different perspectives. A very common mistake is saying "Can you borrow me your pen?" — this is incorrect. The correct form is "Can you lend me your pen?" or "Can I borrow your pen?"',
    'common_mistake' => 'Saying "Can you borrow me...?" This is a very common error. "Borrow" is always used by the person receiving, never by the person giving.',
    'notes' => 'This confusion is extremely common in Indian English — "can you borrow me your notes?" is widely used in India but is grammatically incorrect in standard English. Banks lend money; customers borrow it.',
  ],
  [
    'title' => 'Street vs Road vs Avenue vs Boulevard',
    'terms' => 'Street: A paved road in a town or city, usually with buildings on both sides. Road: A general term for any route, urban or rural. Avenue: Typically a wider, more formal road, often lined with trees. Boulevard: A very wide road, often divided, usually grand or scenic.',
    'quick_difference' => 'Road is the most general term; street is urban; avenue is wider and formal; boulevard is the grandest and widest.',
    'detailed_explanation' => 'These words are sometimes used interchangeably in informal speech, but they have technical and cultural distinctions. A "road" is the most generic — any route for travel. A "street" is typically in an urban or suburban area with buildings on either side. An "avenue" traditionally ran perpendicular to streets and was often tree-lined and more formal. A "boulevard" is the grandest — a wide, often divided road with decorative elements, designed to impress (think Sunset Boulevard in Hollywood or a Parisian boulevard). In American city grid systems, streets and avenues often run in different directions.',
    'common_mistake' => 'Thinking all these words mean exactly the same thing when addressing mail or giving directions — the specific word is part of the official address.',
    'notes' => 'When writing an address, you must use the exact word that is part of the official street name. "123 Main Street" and "123 Main Road" are different addresses. In everyday speech, calling a boulevard a "road" is fine, but in addresses, precision matters.',
  ],
  [
    'title' => 'Speak vs Talk',
    'terms' => 'Speak: More formal; often one person addressing others, or emphasizing the act of using language. Talk: More casual and conversational; implies a back-and-forth exchange between people.',
    'quick_difference' => 'Speak is more formal and one-directional; talk is more casual and implies conversation.',
    'detailed_explanation' => '"Speak" carries a more formal tone and is often used when one person addresses a group, or when the ability to use a language is being discussed. "Talk" is more casual and implies dialogue and conversation. You speak at a conference. You talk with a friend. You speak English (language ability). You talk to your boss about a problem (conversation). "May I speak with the manager?" is formal. "Can I talk to the manager?" is more casual. Both are natural, but the register differs.',
    'common_mistake' => 'Using "speak" in casual conversational contexts can sound overly stiff. "I need to speak to you" sounds more serious than "I need to talk to you."',
    'notes' => 'In Indian English, "speak" is often preferred in contexts where Americans would naturally use "talk." This can make communication sound more formal than intended.',
  ],
];

$created = 0;
foreach ($differences as $diff) {
  $node = Node::create([
    'type' => 'usage_difference',
    'title' => $diff['title'],
    'status' => 1,
    'moderation_state' => 'published',
    'field_terms_compared' => $diff['terms'],
    'field_quick_difference' => $diff['quick_difference'],
    'field_detailed_explanation' => ['value' => $diff['detailed_explanation'], 'format' => 'basic_html'],
    'field_common_mistake' => ['value' => $diff['common_mistake'], 'format' => 'basic_html'],
    'field_notes_background' => ['value' => $diff['notes'], 'format' => 'basic_html'],
  ]);
  $node->save();
  $created++;
  echo "Created: {$diff['title']}\n";
}
echo "\n$created usage differences created!\n";
