<?php

namespace Drupal\talknotes_api\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class CommentController {

  private $adminSecret = 'talknotes-admin-2026';

  private $badWords = [
    'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap',
    'dick', 'cock', 'pussy', 'whore', 'slut', 'nigger', 'faggot',
    'retard', 'cunt', 'asshole', 'motherfucker', 'bullshit',
    'piss', 'porn', 'sex', 'nude', 'naked', 'viagra', 'cialis',
    'casino', 'lottery', 'bitcoin', 'crypto', 'forex', 'investment opportunity',
    'click here', 'buy now', 'free money', 'make money fast',
    'weight loss', 'diet pills', 'work from home', 'earn money',
  ];

  private function corsHeaders() {
    return [
      'Access-Control-Allow-Origin' => '*',
      'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers' => 'Content-Type, X-Admin-Secret',
    ];
  }

  private function moderateComment($name, $email, $message) {
    $result = ['approved' => TRUE, 'spam_score' => 0, 'reason' => ''];
    $text = strtolower($name . ' ' . $message);

    // Bad word check
    foreach ($this->badWords as $word) {
      if (strpos($text, strtolower($word)) !== FALSE) {
        return ['approved' => FALSE, 'spam_score' => 100, 'reason' => 'Contains inappropriate language'];
      }
    }

    // URL spam check
    $url_count = preg_match_all('/https?:\/\/|www\./i', $message);
    if ($url_count >= 2) {
      return ['approved' => FALSE, 'spam_score' => 90, 'reason' => 'Too many links'];
    }
    if ($url_count === 1) $result['spam_score'] += 30;

    // All caps check
    $letters = preg_replace('/[^a-zA-Z]/', '', $message);
    if (strlen($letters) > 10 && strtoupper($message) === $message) {
      return ['approved' => FALSE, 'spam_score' => 80, 'reason' => 'All caps message'];
    }

    // Too short
    $words = str_word_count(trim($message));
    if ($words < 3) {
      return ['approved' => FALSE, 'spam_score' => 70, 'reason' => 'Message too short'];
    }

    // Repeated characters spam
    if (preg_match('/(.)\1{4,}/', $message)) {
      $result['spam_score'] += 25;
    }

    // Generic spam phrases
    $spam_phrases = ['great post', 'nice post', 'good post', 'awesome post', 'great article', 'nice article'];
    foreach ($spam_phrases as $phrase) {
      if (strtolower(trim($message)) === $phrase || strtolower(trim($message)) === $phrase . '!') {
        $result['spam_score'] += 40;
      }
    }

    // Suspicious email patterns
    if (preg_match('/\d{6,}@/', $email)) {
      $result['spam_score'] += 20;
    }

    // High spam score threshold
    if ($result['spam_score'] >= 60) {
      $result['approved'] = FALSE;
      $result['reason'] = 'Detected as spam';
    }

    return $result;
  }

  public function submitComment(Request $request) {
    $headers = $this->corsHeaders();

    if ($request->getMethod() === 'OPTIONS') {
      return new JsonResponse([], 200, $headers);
    }

    // Honeypot check
    $body = json_decode($request->getContent(), TRUE);
    if (!empty($body['website'])) {
      // Silent reject for bots
      return new JsonResponse(['success' => TRUE, 'message' => 'Comment submitted for review.'], 200, $headers);
    }

    $name    = trim($body['name'] ?? '');
    $email   = trim($body['email'] ?? '');
    $message = trim($body['message'] ?? '');
    $nid     = (int)($body['nid'] ?? 0);

    // Basic validation
    if (!$name || !$email || !$message || !$nid) {
      return new JsonResponse(['success' => FALSE, 'error' => 'All fields are required.'], 400, $headers);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      return new JsonResponse(['success' => FALSE, 'error' => 'Please enter a valid email address.'], 400, $headers);
    }
    if (strlen($name) > 100 || strlen($message) > 2000) {
      return new JsonResponse(['success' => FALSE, 'error' => 'Name or message is too long.'], 400, $headers);
    }

    // Moderation
    $mod = $this->moderateComment($name, $email, $message);

    if (!$mod['approved']) {
      return new JsonResponse([
        'success' => FALSE,
        'error' => $mod['reason'] === 'Contains inappropriate language'
          ? 'Your comment contains inappropriate language and cannot be submitted.'
          : 'Your comment could not be submitted. Please keep it relevant and respectful.',
      ], 400, $headers);
    }

    // Save to database
    $ip = $request->getClientIp();
    \Drupal::database()->insert('howtheytalk_comments')->fields([
      'article_nid'      => $nid,
      'name'             => $name,
      'email'            => $email,
      'message'          => $message,
      'status'           => 'pending',
      'spam_score'       => $mod['spam_score'],
      'rejection_reason' => $mod['reason'],
      'ip_address'       => $ip,
      'created'          => \Drupal::time()->getRequestTime(),
    ])->execute();

    return new JsonResponse([
      'success' => TRUE,
      'message' => 'Thank you! Your comment has been submitted and is awaiting review.',
    ], 200, $headers);
  }

  public function getComments(Request $request) {
    $headers = $this->corsHeaders();
    if ($request->getMethod() === 'OPTIONS') {
      return new JsonResponse([], 200, $headers);
    }

    $nid = (int)$request->query->get('nid');
    if (!$nid) {
      return new JsonResponse(['comments' => []], 200, $headers);
    }

    $rows = \Drupal::database()->select('howtheytalk_comments', 'c')
      ->fields('c', ['id', 'name', 'message', 'created'])
      ->condition('c.article_nid', $nid)
      ->condition('c.status', 'approved')
      ->orderBy('c.created', 'ASC')
      ->execute()->fetchAll();

    $comments = array_map(fn($r) => [
      'id'      => (int)$r->id,
      'name'    => $r->name,
      'message' => $r->message,
      'created' => (int)$r->created,
    ], $rows);

    return new JsonResponse(['comments' => $comments], 200, $headers);
  }

  public function adminGetComments(Request $request) {
    $headers = $this->corsHeaders();
    if ($request->getMethod() === 'OPTIONS') {
      return new JsonResponse([], 200, $headers);
    }
    if ($request->headers->get('X-Admin-Secret') !== $this->adminSecret) {
      return new JsonResponse(['error' => 'Unauthorized'], 401, $headers);
    }

    $status = $request->query->get('status', 'pending');
    $query  = \Drupal::database()->select('howtheytalk_comments', 'c')
      ->fields('c')
      ->orderBy('c.created', 'DESC');

    if ($status !== 'all') $query->condition('c.status', $status);

    $rows = $query->execute()->fetchAll();

    // Get article titles
    $nids = array_unique(array_column($rows, 'article_nid'));
    $titles = [];
    if ($nids) {
      $nodes = \Drupal::entityTypeManager()->getStorage('node')->loadMultiple($nids);
      foreach ($nodes as $node) {
        $titles[$node->id()] = $node->getTitle();
      }
    }

    $comments = array_map(fn($r) => [
      'id'               => (int)$r->id,
      'article_nid'      => (int)$r->article_nid,
      'article_title'    => $titles[$r->article_nid] ?? 'Unknown',
      'name'             => $r->name,
      'email'            => $r->email,
      'message'          => $r->message,
      'status'           => $r->status,
      'spam_score'       => (int)$r->spam_score,
      'rejection_reason' => $r->rejection_reason,
      'ip_address'       => $r->ip_address,
      'created'          => (int)$r->created,
    ], $rows);

    return new JsonResponse(['comments' => $comments], 200, $headers);
  }

  public function adminUpdateComment(Request $request) {
    $headers = $this->corsHeaders();
    if ($request->getMethod() === 'OPTIONS') {
      return new JsonResponse([], 200, $headers);
    }
    if ($request->headers->get('X-Admin-Secret') !== $this->adminSecret) {
      return new JsonResponse(['error' => 'Unauthorized'], 401, $headers);
    }

    $body   = json_decode($request->getContent(), TRUE);
    $id     = (int)($body['id'] ?? 0);
    $status = $body['status'] ?? '';

    if (!$id || !in_array($status, ['approved', 'rejected', 'pending'])) {
      return new JsonResponse(['error' => 'Invalid request'], 400, $headers);
    }

    \Drupal::database()->update('howtheytalk_comments')
      ->fields(['status' => $status])
      ->condition('id', $id)
      ->execute();

    return new JsonResponse(['success' => TRUE, 'id' => $id, 'status' => $status], 200, $headers);
  }

  public function adminDeleteComment(Request $request) {
    $headers = $this->corsHeaders();
    if ($request->getMethod() === 'OPTIONS') {
      return new JsonResponse([], 200, $headers);
    }
    if ($request->headers->get('X-Admin-Secret') !== $this->adminSecret) {
      return new JsonResponse(['error' => 'Unauthorized'], 401, $headers);
    }

    $body = json_decode($request->getContent(), TRUE);
    $id   = (int)($body['id'] ?? 0);

    if (!$id) {
      return new JsonResponse(['error' => 'Invalid id'], 400, $headers);
    }

    \Drupal::database()->delete('howtheytalk_comments')->condition('id', $id)->execute();
    return new JsonResponse(['success' => TRUE], 200, $headers);
  }
}
