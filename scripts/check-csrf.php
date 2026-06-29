<?php
// Generate a token and see what value it uses
$token = \Drupal::csrfToken()->get('');
echo "Token for '': $token\n";
$token2 = \Drupal::csrfToken()->get('rest');
echo "Token for 'rest': $token2\n";
