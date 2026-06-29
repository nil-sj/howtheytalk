<?php

use Drupal\webform\Entity\Webform;

$webform = Webform::load('suggest_a_word');

foreach ($webform->getHandlers() as $handler) {
  if ($handler->getPluginId() === 'email') {
    $configuration = $handler->getConfiguration();
    $configuration['settings']['from_mail'] = 'niladri123@gmail.com';
    $configuration['settings']['from_name'] = 'TalkNotes';
    $configuration['settings']['body'] = '[webform_submission:values]';
    $configuration['settings']['html'] = FALSE;
    $configuration['settings']['twig'] = FALSE;
    $handler->setConfiguration($configuration);
    echo "Updated!\n";
  }
}

$webform->save();
echo "Saved!\n";
