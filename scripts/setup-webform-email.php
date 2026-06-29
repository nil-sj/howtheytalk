<?php

use Drupal\webform\Entity\Webform;

$webform = Webform::load('suggest_a_word');
if (!$webform) {
  echo "Webform not found!\n";
  return;
}

$handlers = $webform->getHandlers();

// Add email handler
$webform->addWebformHandler(\Drupal::service('plugin.manager.webform.handler')->createInstance('email', [
  'id' => 'email',
  'label' => 'Email notification',
  'handler_id' => 'email_notification',
  'status' => TRUE,
  'weight' => 0,
  'settings' => [
    'to_mail' => 'niladri123@gmail.com',
    'to_options' => [],
    'cc_mail' => '',
    'cc_options' => [],
    'bcc_mail' => '',
    'bcc_options' => [],
    'from_mail' => 'default',
    'from_options' => [],
    'from_name' => 'default',
    'reply_to' => '[webform_submission:values:your_email:raw]',
    'return_path' => '',
    'sender_mail' => '',
    'sender_name' => '',
    'subject' => 'TalkNotes: New [webform_submission:values:message_type:raw] from [webform_submission:values:your_name:raw]',
    'body' => 'default',
    'excluded_elements' => ['honeypot' => 'honeypot'],
    'ignore_access' => FALSE,
    'exclude_empty' => TRUE,
    'exclude_empty_checkbox' => FALSE,
    'exclude_attachments' => FALSE,
    'html' => TRUE,
    'attachments' => FALSE,
    'twig' => FALSE,
    'theme_name' => '',
    'parameters' => [],
    'debug' => FALSE,
  ],
]));

$webform->save();
echo "Email handler added! Notifications will go to: niladri123@gmail.com\n";
