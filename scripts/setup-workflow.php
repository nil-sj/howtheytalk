<?php

use Drupal\workflows\Entity\Workflow;

// Create Draft → Published workflow
if (!Workflow::load('talknotes_workflow')) {
  Workflow::create([
    'id' => 'talknotes_workflow',
    'label' => 'TalkNotes Workflow',
    'type' => 'content_moderation',
    'type_settings' => [
      'states' => [
        'draft' => ['label' => 'Draft', 'published' => FALSE, 'default_revision' => FALSE, 'weight' => 0],
        'published' => ['label' => 'Published', 'published' => TRUE, 'default_revision' => TRUE, 'weight' => 1],
        'archived' => ['label' => 'Archived', 'published' => FALSE, 'default_revision' => FALSE, 'weight' => 2],
      ],
      'transitions' => [
        'create_new_draft' => ['label' => 'Save as draft', 'from' => ['draft', 'archived'], 'to' => 'draft', 'weight' => 0],
        'publish' => ['label' => 'Publish', 'from' => ['draft'], 'to' => 'published', 'weight' => 1],
        'unpublish' => ['label' => 'Unpublish', 'from' => ['published'], 'to' => 'archived', 'weight' => 2],
        'restore' => ['label' => 'Restore to draft', 'from' => ['archived'], 'to' => 'draft', 'weight' => 3],
      ],
      'entity_types' => [
        'node' => ['language_entry', 'usage_difference', 'article'],
      ],
    ],
  ])->save();
  echo "Created workflow: TalkNotes Workflow\n";
} else {
  echo "Already exists: TalkNotes Workflow\n";
}

echo "Workflow setup complete!\n";
