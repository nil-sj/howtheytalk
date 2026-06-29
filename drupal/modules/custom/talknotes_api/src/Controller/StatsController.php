<?php

namespace Drupal\talknotes_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class StatsController extends ControllerBase {

  const ADMIN_SECRET = 'talknotes-admin-2026';

  private function checkSecret(Request $request): bool {
    return $request->headers->get('X-Admin-Secret') === self::ADMIN_SECRET;
  }

  private function corsHeaders(): array {
    return [
      'Access-Control-Allow-Origin' => '*',
      'Access-Control-Allow-Methods' => 'GET, OPTIONS',
      'Access-Control-Allow-Headers' => 'Content-Type, Accept, X-Admin-Secret',
    ];
  }

  public function adminStats(Request $request): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->checkSecret($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $published = count($storage->loadByProperties(['type' => 'language_entry', 'status' => 1]));
    $drafts    = count($storage->loadByProperties(['type' => 'language_entry', 'status' => 0]));
    $diffs     = count($storage->loadByProperties(['type' => 'usage_difference', 'status' => 1]));
    $articles  = count($storage->loadByProperties(['type' => 'article', 'status' => 1]));

    return new JsonResponse([
      'publishedEntries' => $published,
      'draftEntries'     => $drafts,
      'usageDifferences' => $diffs,
      'articles'         => $articles,
    ], 200, $this->corsHeaders());
  }

  public function recentDrafts(Request $request): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->checkSecret($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $limit = (int) ($request->query->get('limit') ?? 8);
    $limit = min($limit, 100);

    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery()
      ->condition('type', 'language_entry')
      ->condition('status', 0)
      ->sort('changed', 'DESC')
      ->range(0, $limit)
      ->accessCheck(FALSE);
    $ids = $query->execute();
    $nodes = $storage->loadMultiple($ids);

    $result = [];
    foreach ($nodes as $node) {
      $result[] = [
        'id'            => $node->id(),
        'title'         => $node->getTitle(),
        'changed'       => $node->getChangedTime(),
        'short_meaning' => $node->field_short_meaning->value ?? '',
        'edit_url'      => '/node/' . $node->id() . '/edit',
      ];
    }

    return new JsonResponse(['drafts' => $result], 200, $this->corsHeaders());
  }
}
