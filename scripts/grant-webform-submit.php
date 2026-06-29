<?php

// Grant anonymous users permission to submit the webform
$webform = \Drupal\webform\Entity\Webform::load('suggest_a_word');
if ($webform) {
  $access_rules = $webform->getAccessRules();
  $access_rules['create']['roles'][] = 'anonymous';
  $access_rules['create']['roles'][] = 'authenticated';
  $webform->setAccessRules($access_rules);
  $webform->save();
  echo "Access rules updated!\n";
  print_r($webform->getAccessRules()['create']);
}
