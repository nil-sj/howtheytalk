<?php

use Drupal\webform\Entity\Webform;
use Drupal\webform\Entity\WebformOptions;

if (Webform::load('suggest_a_word')) {
  Webform::load('suggest_a_word')->delete();
}

$webform = Webform::create(['id' => 'suggest_a_word', 'title' => 'Suggest a word or contact us']);
$webform->setElements([
  'your_name' => [
    '#type' => 'textfield',
    '#title' => 'Your name',
    '#required' => TRUE,
  ],
  'your_email' => [
    '#type' => 'email',
    '#title' => 'Your email',
    '#required' => TRUE,
  ],
  'message_type' => [
    '#type' => 'select',
    '#title' => 'Message type',
    '#required' => TRUE,
    '#options' => [
      'suggest' => 'Suggest a word or phrase',
      'correction' => 'Suggest a correction',
      'issue' => 'Report an issue',
      'general' => 'General message',
      'other' => 'Other',
    ],
  ],
  'suggested_word' => [
    '#type' => 'textfield',
    '#title' => 'Suggested word or phrase',
    '#required' => FALSE,
    '#states' => [
      'visible' => [
        ':input[name="message_type"]' => ['value' => 'suggest'],
      ],
    ],
  ],
  'message' => [
    '#type' => 'textarea',
    '#title' => 'Message',
    '#required' => TRUE,
    '#rows' => 5,
  ],
  'source_context' => [
    '#type' => 'textfield',
    '#title' => 'Source or context (optional)',
    '#required' => FALSE,
    '#description' => 'Where did you hear or read this? (optional)',
  ],
  'honeypot' => [
    '#type' => 'honeypot',
  ],
]);

$webform->setSetting('confirmation_type', 'inline');
$webform->setSetting('confirmation_message', 'Thank you for your message! I read every suggestion and will consider adding it to TalkNotes.');
$webform->save();

echo "Contact form created!\n";
echo "Access it at: /webform/suggest_a_word\n";
