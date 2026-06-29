<?php

// Test SMTP by sending via the configured mailer
$mailManager = \Drupal::service('plugin.manager.mail');
$params = [
  'subject' => 'TalkNotes SMTP Test',
  'message' => 'If you receive this, SMTP is working correctly.',
  'body' => ['If you receive this, SMTP is working correctly.'],
];

$result = $mailManager->mail('smtp', 'test', 'niladri123@gmail.com', 'en', $params, NULL, TRUE);

if ($result['result']) {
  echo "Email sent successfully!\n";
} else {
  echo "Email failed!\n";
}

// Also check SMTP config
$config = \Drupal::config('smtp.settings');
echo "SMTP on: " . ($config->get('smtp_on') ? 'YES' : 'NO') . "\n";
echo "SMTP host: " . $config->get('smtp_host') . "\n";
echo "SMTP port: " . $config->get('smtp_port') . "\n";
echo "SMTP user: " . $config->get('smtp_username') . "\n";
echo "SMTP pass set: " . ($config->get('smtp_password') ? 'YES' : 'NO') . "\n";
