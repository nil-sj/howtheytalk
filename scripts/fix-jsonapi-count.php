<?php
\Drupal::configFactory()->getEditable('jsonapi.settings')
  ->set('include_count', TRUE)
  ->save();
echo "include_count set to boolean TRUE\n";
echo "Value: ";
var_dump(\Drupal::config('jsonapi.settings')->get('include_count'));
