<?php

use Drupal\node\Entity\Node;

function get_cat($name) {
  $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')
    ->loadByProperties(['vid' => 'main_categories', 'name' => $name]);
  return $terms ? reset($terms)->id() : NULL;
}

function make_entry($title, $category, $short, $explanation, $examples, $notes) {
  $existing = \Drupal::entityTypeManager()->getStorage('node')
    ->loadByProperties(['type' => 'language_entry', 'title' => $title]);
  if ($existing) { echo "Skip (exists): $title\n"; return; }
  $cat_id = get_cat($category);
  if (!$cat_id) { echo "Category not found: $category\n"; return; }
  Node::create([
    'type' => 'language_entry',
    'title' => $title,
    'status' => 1,
    'moderation_state' => 'published',
    'field_main_category' => ['target_id' => $cat_id],
    'field_short_meaning' => $short,
    'field_detailed_explanation' => ['value' => $explanation, 'format' => 'basic_html'],
    'field_usage_examples' => ['value' => $examples, 'format' => 'basic_html'],
    'field_notes_background' => ['value' => $notes, 'format' => 'basic_html'],
  ])->save();
  echo "Created: $title\n";
}

// ── Business Lingo ────────────────────────────────────────────────────────────
make_entry(
  'Boilerplate',
  'Business Lingo',
  'Standard, reusable text or language that is used repeatedly without much change.',
  '"Boilerplate" refers to standardized text, clauses, or content that is reused across many documents or communications with little or no modification. In business, boilerplate language appears in contracts, terms and conditions, email signatures, and legal disclaimers. It is reliable and pre-approved, but by definition generic.',
  '"Just use the boilerplate NDA — no need to draft a new one for this vendor." | "The proposal looked impressive but the last three pages were pure boilerplate that they send to everyone."',
  'The term comes from the early printing industry, where "boilerplate" referred to pre-cast metal plates of standard text that could be used repeatedly. Later it was applied to syndicated newspaper content. In law and business, boilerplate language is not necessarily bad — it is often carefully vetted standard language that protects both parties.'
);

make_entry(
  'Drill down',
  'Business Lingo',
  'To examine something in greater detail; to go deeper into the specifics of a topic or data set.',
  '"Drilling down" means moving from a high-level view into greater levels of detail. In data analysis, it means filtering or clicking into more specific subsets. In conversation, it means asking follow-up questions to get to the specifics beneath a general statement.',
  '"The overall numbers look fine, but let\'s drill down into the regional breakdown." | "When we drilled down into the customer complaints, we found that 80% were about the same issue."',
  'Originally from data analysis and database software, where "drill down" described navigating from summary data into detailed records. Now used broadly in any business context to mean examining something more closely. Often used as a gentle prompt to move past surface-level discussion.'
);

make_entry(
  'Scalable',
  'Business Lingo',
  'Able to grow or expand efficiently without proportionally increasing costs or complexity.',
  'In business, "scalable" describes a process, system, or business model that can handle growth — more customers, more volume, more complexity — without breaking down or requiring proportionally more resources. A scalable business can grow profitably. A non-scalable one hits a wall when it tries to expand.',
  '"The manual review process works now, but it\'s not scalable — we can\'t hire a person for every ten new customers." | "The investors loved the idea because the software model is highly scalable."',
  'One of the most important concepts in startup culture and technology businesses. Software is inherently more scalable than services — you can sell the same software to a million customers without a million employees. "Does this scale?" is a common question in product and business strategy discussions.'
);

make_entry(
  'Stakeholder',
  'Business Lingo',
  'Any person or group who has an interest in or is affected by a project, decision, or organization.',
  '"Stakeholders" are everyone who has a stake — an interest, investment, or something to gain or lose — in the outcome of a project or business decision. This includes employees, customers, investors, suppliers, regulators, and the community. "Stakeholder management" means identifying and communicating with all these groups appropriately.',
  '"We need to get stakeholder buy-in before we announce the restructuring." | "The project has a lot of stakeholders — legal, finance, operations, and the customer team all need to be aligned."',
  'The term became widely used in business management in the 1980s as an alternative to the narrower focus on just shareholders (owners). The idea is that businesses affect and are affected by many parties beyond just their owners. "Stakeholder alignment" and "stakeholder communication" are key concepts in project management.'
);

make_entry(
  'Value proposition',
  'Business Lingo',
  'A clear statement of why a customer should choose your product or service — what unique value it delivers.',
  'A "value proposition" answers the customer\'s question: "Why should I choose you over the alternatives?" It describes the specific benefit the product or service delivers, to whom, and how it is different or better than competing options. A strong value proposition is clear, specific, and customer-focused.',
  '"We need to sharpen our value proposition — right now it sounds just like every other consulting firm." | "The value proposition is simple: we save small businesses three hours a week on bookkeeping at half the cost of an accountant."',
  'A core concept in marketing and business strategy. Many companies struggle to articulate their value proposition clearly — they describe what they do rather than the value they deliver. The best value propositions are written from the customer\'s perspective, not the company\'s.'
);

make_entry(
  'Pain point',
  'Business Lingo',
  'A specific problem or frustration that customers experience, which a product or service aims to solve.',
  '"Pain points" are the problems, frustrations, and inefficiencies that customers face — the things that make their lives or work harder than it needs to be. Identifying customer pain points is the foundation of good product development and sales. A product that solves a real pain point has a built-in reason for people to buy it.',
  '"In our customer interviews, the biggest pain point was the time wasted on manual data entry." | "The sales team is trained to ask questions that uncover the prospect\'s pain points before presenting the solution."',
  'The term comes from sales and marketing methodology. The idea is that solving a real, felt problem ("pain") is more compelling than offering a nice-to-have. Products that address genuine pain points sell more easily because the customer already knows they have the problem.'
);

make_entry(
  'Onboarding',
  'Business Lingo',
  'The process of integrating a new employee, customer, or user and getting them up to speed.',
  '"Onboarding" refers to the structured process of bringing someone new into a system, organization, or product. Employee onboarding covers orientation, training, and getting set up with tools and information. Customer or user onboarding is the process of helping new users get started with a product and realize its value quickly.',
  '"Our employee onboarding process takes two weeks and covers everything from HR paperwork to product training." | "We redesigned the app onboarding and reduced the dropout rate by 40%."',
  'The metaphor is of coming aboard a ship — joining the crew and learning how things work. Good onboarding is considered essential for both employee retention and customer success. "Onboarding experience" is a major focus in product design — the first few minutes a new user spends with an app can determine whether they stay or leave.'
);

make_entry(
  'Turnkey',
  'Business Lingo',
  'A complete solution that is ready to use immediately, without requiring additional setup or customization.',
  'A "turnkey" solution is one that is fully complete and ready to go — the customer just has to "turn the key" and it works. It implies that everything has been taken care of: design, setup, installation, and configuration. The customer receives a finished product, not components they need to assemble.',
  '"We offer a turnkey e-commerce solution — within 48 hours you have a fully functioning online store." | "The client wanted a turnkey system, not a platform they would have to customize themselves."',
  'The metaphor comes from real estate and construction — a "turnkey home" is one that is fully finished and move-in ready. The buyer just turns the key and walks in. In business, "turnkey" signals completeness and ease — everything is included and ready to operate.'
);

// ── Tales and Origins ─────────────────────────────────────────────────────────
make_entry(
  'Deadline',
  'Tales and Origins',
  'A time limit by which something must be completed.',
  'The word "deadline" has a surprisingly grim origin. During the American Civil War, prisoner-of-war camps established a line drawn around the perimeter — if a prisoner crossed this line, guards were authorized to shoot them dead. This "dead line" was later adopted in the printing industry to describe the line on a press beyond which type could not be set, and eventually evolved into a general term for any fixed time limit.',
  '"The deadline for the report is Friday at 5 PM." | "We\'re racing against the deadline — three days left and we\'re only halfway done."',
  'The word\'s journey from Civil War prison camps to modern offices is a striking example of how language evolves. The printing industry played a key role in domesticating the term. Today\'s "deadline" carries none of the mortal threat of the original — though some managers might disagree.'
);

make_entry(
  'Kangaroo court',
  'Tales and Origins',
  'A sham legal proceeding or trial that is predetermined, unfair, or lacking proper authority.',
  'A "kangaroo court" describes a mock tribunal or legal proceeding where the outcome is already decided, the process is unfair, or the authority conducting it has no legitimate standing. The term implies that justice is "jumping" to conclusions — like a kangaroo — rather than following proper procedure.',
  '"The disciplinary hearing felt like a kangaroo court — the decision had clearly been made before anyone heard the evidence." | "They called it an investigation, but it was a kangaroo court designed to justify what they had already decided."',
  'The origin of this phrase is disputed. One theory connects it to the gold rush era in the American West and Australia, where makeshift courts would be hastily assembled to deal with criminal claims. The "jumping" to conclusions (like a kangaroo) is the most commonly cited explanation for the name. The phrase appeared in American writing by the 1850s.'
);

make_entry(
  'Red herring',
  'Tales and Origins',
  'Something that misleads or distracts from the real issue or question.',
  'A "red herring" is a misleading clue, argument, or piece of information that diverts attention away from the real issue. In mystery fiction, a red herring is a false clue planted to mislead the detective and the reader. In arguments and debates, a red herring is an irrelevant point raised to distract from the main issue.',
  '"The lawyer\'s questions about the defendant\'s past were a red herring — completely irrelevant to the charges." | "Don\'t be distracted by that — it\'s a red herring designed to take the focus off the real problem."',
  'The origin involves the practice of using a strong-smelling smoked herring (which turns red during the smoking process) to train hunting dogs by dragging it across a trail to see if the dogs could stay on the original scent. Later, fugitives reportedly used red herrings to throw pursuing bloodhounds off their trail. The logical fallacy meaning developed from this idea of leading pursuers astray.'
);

make_entry(
  'Bury the hatchet',
  'Tales and Origins',
  'To end a conflict or disagreement and make peace with someone.',
  '"Burying the hatchet" means setting aside hostilities and making peace — ending a feud, argument, or period of conflict. It implies a genuine, mutual decision to move forward rather than continuing to fight.',
  '"After years of legal disputes, the two companies finally buried the hatchet and agreed to a partnership." | "It\'s time to bury the hatchet — this argument has gone on long enough."',
  'This phrase has a genuine Native American origin. Several Indigenous nations of North America had ceremonies in which weapons — including hatchets and tomahawks — were literally buried in the ground as a symbolic act of ending hostilities between tribes or groups. Early European settlers documented this practice, and the metaphor entered the English language from their accounts. It is one of the clearer cases where an idiom has a well-documented, specific cultural origin.'
);

make_entry(
  'By and large',
  'Tales and Origins',
  'On the whole; generally speaking; in most cases.',
  '"By and large" is used to introduce a general statement that is true in most cases, even if not in every specific instance. It is a way of summarizing or generalizing without claiming absolute truth.',
  '"By and large, the project went well — a few hiccups, but nothing major." | "By and large, Americans prefer informal communication in the workplace."',
  'This phrase comes directly from nautical sailing terminology. "By" and "large" were two different sailing conditions relative to the wind. "By" meant sailing close to the wind (into it), while "large" meant sailing with the wind behind you. A ship that could sail well "by and large" — in both wind conditions — was a reliable, versatile vessel. By the 1700s, the phrase had evolved into its modern general meaning of "on the whole."'
);

make_entry(
  'Bite the dust',
  'Tales and Origins',
  'To fail, be defeated, or die.',
  '"Biting the dust" means failing completely, being defeated, or dying. It is used for people, products, companies, and plans alike. It often carries a slightly dramatic or humorous tone.',
  '"Three of our competitors have bitten the dust in the past year." | "My old laptop finally bit the dust — I had to buy a new one."',
  'The phrase likely originates from ancient battle imagery — a fallen warrior or horse collapsing face-down in the dust of the battlefield, literally biting the ground. It appears in the Bible (Psalm 72) and in Homer\'s Iliad. It was later popularized in Western novels and films depicting cowboys and gunfighters. The rock band Queen\'s 1980 song "Another One Bites the Dust" brought the phrase to global pop culture awareness.'
);

make_entry(
  'Caught red-handed',
  'Tales and Origins',
  'Caught in the act of doing something wrong, with clear evidence of guilt.',
  '"Caught red-handed" means being caught at the moment of committing an offense, with undeniable proof — the evidence is as obvious as having blood still on your hands.',
  '"The shoplifter was caught red-handed by the security camera." | "They caught him red-handed accessing files he was not authorized to view."',
  'This phrase comes directly from Scottish law. Early Scottish legal statutes stated that a person could only be convicted of butchering another\'s animal if they were caught with blood still on their hands — literally "red-handed." The phrase appears in Scottish writing as early as the 15th century and spread into broader English usage to mean being caught with clear, immediate evidence of wrongdoing.'
);

make_entry(
  'The whole nine yards',
  'Tales and Origins',
  'Everything; the full amount; the complete extent of something.',
  '"The whole nine yards" means everything, the complete package, the full extent — holding nothing back. It implies total commitment or completeness.',
  '"They threw her a going-away party with cake, speeches, balloons — the whole nine yards." | "We went for the whole nine yards — custom design, premium materials, white-glove installation."',
  'This phrase has one of the most debated origins in American English. No one has definitively proven where the "nine yards" comes from. Popular theories include: the length of ammunition belts in WWII fighter planes (giving a pilot who fired everything "the whole nine yards"), the capacity of a cement mixer drum, the length of fabric in a Scottish kilt or burial shroud, and the length of a hangman\'s noose. The phrase first appears in writing only in the 1960s, which casts doubt on the WWII theories. The true origin remains genuinely unknown.'
);

make_entry(
  'Blackmail',
  'Tales and Origins',
  'Demanding money or favors from someone by threatening to reveal damaging information about them.',
  '"Blackmail" is the practice of threatening to expose damaging, embarrassing, or incriminating information about someone unless they pay money or provide something of value. It is a serious crime in most jurisdictions.',
  '"He was arrested for blackmail after threatening to release the private photos." | "The company was a victim of corporate blackmail — pay up or we release your trade secrets to competitors."',
  'The word "mail" in blackmail comes from an old Scottish and Northern English word meaning "rent" or "tribute payment." In the Scottish Highlands, powerful clans would demand payments from farmers in exchange for protection from raiding — these payments were called "mail." Payments made in silver coins were called "white mail" (silver = white). Payments made in goods, labor, or other non-cash forms were called "black mail." Over time, "blackmail" came to mean any coerced payment obtained through threats.'
);

make_entry(
  'Diehard',
  'Tales and Origins',
  'A person who is stubbornly devoted to a cause, belief, or team and refuses to give up or change.',
  'A "diehard" is someone who holds on firmly to their position, loyalty, or beliefs — even in the face of overwhelming opposition or evidence to the contrary. It can be used admiringly (a diehard fan) or critically (a diehard opponent of change).',
  '"She is a diehard Red Sox fan — she\'s been going to games since she was five years old." | "The proposal had some diehard opponents who refused to consider any compromise."',
  'The term "die-hard" originated in the Napoleonic Wars. At the Battle of Albuera in 1811, a British regiment suffered catastrophic casualties but refused to retreat. Their commander, Colonel William Inglis, reportedly urged his men to "die hard" — to fight to the last. The regiment became known as the "Die Hards," and the term came to mean anyone who refuses to give up under extreme pressure. The 1988 Bruce Willis action film "Die Hard" brought the word to a new generation.'
);

$count = \Drupal::entityTypeManager()->getStorage('node')
  ->getQuery()->condition('type', 'language_entry')->count()->execute();
echo "\nTotal language entries now: $count\n";
