<?php
$result = \Drupal::service('plugin.manager.mail')->mail(
  'system',
  'test',
  'niladri123@gmail.com',
  'en',
  ['subject' => 'TalkNotes email test', 'body' => ['This is a test email from TalkNotes.']],
  NULL,
  TRUE
);
echo "Result: " . ($result['result'] ? 'SUCCESS' : 'FAILED') . "\n";
if (!$result['result']) {
  echo "Check SMTP settings at: /admin/config/system/smtp\n";
}
