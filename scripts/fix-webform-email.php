<?php

use Drupal\webform\Entity\Webform;

$webform = Webform::load('suggest_a_word');
$handlers = $webform->getHandlers();

foreach ($handlers as $handler) {
  if ($handler->getPluginId() === 'email') {
    $configuration = $handler->getConfiguration();
    $configuration['settings']['from_mail'] = 'niladri123@gmail.com';
    $configuration['settings']['from_name'] = 'TalkNotes';
    $handler->setConfiguration($configuration);
    echo "Updated handler: " . $handler->label() . "\n";
    echo "From: " . $configuration['settings']['from_mail'] . "\n";
  }
}

$webform->save();
echo "Saved!\n";
