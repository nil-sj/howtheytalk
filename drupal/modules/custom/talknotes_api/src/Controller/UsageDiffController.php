<?php

namespace Drupal\talknotes_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\node\Entity\Node;

class UsageDiffController extends ControllerBase {

  const ADMIN_SECRET = 'talknotes-admin-2026';

  private function auth(Request $request): bool {
    return $request->headers->get('X-Admin-Secret') === self::ADMIN_SECRET;
  }

  private function corsHeaders(): array {
    return [
      'Access-Control-Allow-Origin' => '*',
      'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers' => 'Content-Type, Accept, X-Admin-Secret',
    ];
  }

  private function nodeToArray(Node $node): array {
    return [
      'nid'                 => $node->id(),
      'title'               => $node->getTitle(),
      'status'              => $node->isPublished() ? 'published' : 'draft',
      'changed'             => $node->getChangedTime(),
      'quick_summary'       => $node->field_quick_difference->value ?? '',
      'detailed_explanation'=> $node->field_detailed_explanation->value ?? '',
      'common_mistake'      => $node->field_common_mistake->value ?? '',
      'notes'               => $node->field_notes_background->value ?? '',
    ];
  }

  public function listEntries(Request $request): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->auth($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $status = $request->query->get('status', 'all');
    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery()
      ->condition('type', 'usage_difference')
      ->sort('changed', 'DESC')
      ->range(0, 50)
      ->accessCheck(FALSE);

    if ($status === 'published') $query->condition('status', 1);
    if ($status === 'draft') $query->condition('status', 0);

    $ids = $query->execute();
    $nodes = $storage->loadMultiple($ids);

    $result = [];
    foreach ($nodes as $node) {
      $result[] = [
        'nid'     => $node->id(),
        'title'   => $node->getTitle(),
        'status'  => $node->isPublished() ? 'published' : 'draft',
        'changed' => $node->getChangedTime(),
        'quick_summary' => $node->field_quick_difference->value ?? '',
      ];
    }

    return new JsonResponse(['entries' => $result], 200, $this->corsHeaders());
  }

  public function getEntry(Request $request, $nid): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->auth($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $node = Node::load($nid);
    if (!$node || $node->bundle() !== 'usage_difference') return new JsonResponse(['error' => 'Not found'], 404, $this->corsHeaders());

    return new JsonResponse($this->nodeToArray($node), 200, $this->corsHeaders());
  }

  public function createEntry(Request $request): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->auth($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $data = json_decode($request->getContent(), TRUE);
    if (empty($data['title'])) return new JsonResponse(['error' => 'Title is required'], 400, $this->corsHeaders());

    try {
      $node_data = [
        'type'             => 'usage_difference',
        'title'            => $data['title'],
        'moderation_state' => 'draft',
        'status'           => 0,
      ];
      if (!empty($data['quick_summary'])) $node_data['field_quick_difference'] = $data['quick_summary'];
      if (!empty($data['detailed_explanation'])) $node_data['field_detailed_explanation'] = ['value' => $data['detailed_explanation'], 'format' => 'basic_html'];
      if (!empty($data['common_mistake'])) $node_data['field_common_mistake'] = ['value' => $data['common_mistake'], 'format' => 'basic_html'];
      if (!empty($data['notes'])) $node_data['field_notes_background'] = ['value' => $data['notes'], 'format' => 'basic_html'];

      $node = Node::create($node_data);
      $node->save();

      return new JsonResponse(['success' => TRUE, 'nid' => $node->id(), 'title' => $node->getTitle()], 200, $this->corsHeaders());
    } catch (\Exception $e) {
      return new JsonResponse(['error' => $e->getMessage()], 500, $this->corsHeaders());
    }
  }

  public function updateEntry(Request $request, $nid): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->auth($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $data = json_decode($request->getContent(), TRUE);

    try {
      $node = Node::load($nid);
      if (!$node || $node->bundle() !== 'usage_difference') return new JsonResponse(['error' => 'Not found'], 404, $this->corsHeaders());

      if (!empty($data['title'])) $node->setTitle($data['title']);
      if (isset($data['quick_summary'])) $node->set('field_quick_difference', $data['quick_summary']);
      if (isset($data['detailed_explanation'])) $node->set('field_detailed_explanation', ['value' => $data['detailed_explanation'], 'format' => 'basic_html']);
      if (isset($data['common_mistake'])) $node->set('field_common_mistake', ['value' => $data['common_mistake'], 'format' => 'basic_html']);
      if (isset($data['notes'])) $node->set('field_notes_background', ['value' => $data['notes'], 'format' => 'basic_html']);

      if (isset($data['action'])) {
        if ($data['action'] === 'publish') { $node->set('moderation_state', 'published'); $node->setPublished(); }
        elseif ($data['action'] === 'unpublish') { $node->set('moderation_state', 'draft'); $node->setUnpublished(); }
      }

      $node->save();
      return new JsonResponse(['success' => TRUE, 'nid' => $node->id(), 'status' => $node->isPublished() ? 'published' : 'draft'], 200, $this->corsHeaders());
    } catch (\Exception $e) {
      return new JsonResponse(['error' => $e->getMessage()], 500, $this->corsHeaders());
    }
  }
}
