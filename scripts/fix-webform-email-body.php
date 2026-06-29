<?php

use Drupal\webform\Entity\Webform;

$webform = Webform::load('suggest_a_word');

foreach ($webform->getHandlers() as $handler) {
  if ($handler->getPluginId() === 'email') {
    $configuration = $handler->getConfiguration();
    $configuration['settings']['from_mail'] = 'niladri123@gmail.com';
    $configuration['settings']['from_name'] = 'TalkNotes';
    $configuration['settings']['body'] = 'New submission from TalkNotes contact form:

Name: [webform_submission:values:your_name]
Email: [webform_submission:values:your_email]
Message type: [webform_submission:values:message_type]
Suggested word: [webform_submission:values:suggested_word]
Message: [webform_submission:values:message]
Source/context: [webform_submission:values:source_context]

View submission: [webform_submission:admin-url]
';
    $configuration['settings']['twig'] = FALSE;
    $handler->setConfiguration($configuration);
    echo "Updated email body\n";
  }
}

$webform->save();
echo "Saved!\n";
