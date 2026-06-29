<?php

namespace Drupal\talknotes_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\node\Entity\Node;

class EntryController extends ControllerBase {

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

  public function createEntry(Request $request): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->auth($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $data = json_decode($request->getContent(), TRUE);
    if (empty($data['title'])) return new JsonResponse(['error' => 'Title is required'], 400, $this->corsHeaders());

    try {
      $node_data = ['type' => 'language_entry', 'title' => $data['title'], 'moderation_state' => 'draft', 'status' => 0];
      if (!empty($data['short_meaning'])) $node_data['field_short_meaning'] = $data['short_meaning'];
      if (!empty($data['detailed_explanation'])) $node_data['field_detailed_explanation'] = ['value' => $data['detailed_explanation'], 'format' => 'basic_html'];
      if (!empty($data['usage_examples'])) $node_data['field_usage_examples'] = [['value' => $data['usage_examples'], 'format' => 'basic_html']];
      if (!empty($data['notes'])) $node_data['field_notes_background'] = ['value' => $data['notes'], 'format' => 'basic_html'];
      if (!empty($data['ai_draft'])) $node_data['field_ai_draft'] = $data['ai_draft'];
      if (!empty($data['category_id'])) {
        foreach (\Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => 'main_categories']) as $term) {
          if ($term->uuid() === $data['category_id']) { $node_data['field_main_category'] = ['target_id' => $term->id()]; break; }
        }
      }
      $node = Node::create($node_data);
      $node->save();
      return new JsonResponse(['success' => TRUE, 'nid' => $node->id(), 'uuid' => $node->uuid(), 'title' => $node->getTitle()], 200, $this->corsHeaders());
    } catch (\Exception $e) {
      return new JsonResponse(['error' => $e->getMessage()], 500, $this->corsHeaders());
    }
  }

  public function getEntry(Request $request, $nid): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->auth($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $node = Node::load($nid);
    if (!$node || $node->bundle() !== 'language_entry') return new JsonResponse(['error' => 'Not found'], 404, $this->corsHeaders());

    $cat_id = '';
    if ($node->field_main_category->entity) {
      $cat_id = $node->field_main_category->entity->uuid();
    }

    $examples = '';
    if (!$node->field_usage_examples->isEmpty()) {
      $examples = $node->field_usage_examples->value;
    }

    return new JsonResponse([
      'nid'                  => $node->id(),
      'title'                => $node->getTitle(),
      'status'               => $node->isPublished() ? 'published' : 'draft',
      'moderation_state'     => $node->moderation_state->value,
      'category_id'          => $cat_id,
      'short_meaning'        => $node->field_short_meaning->value ?? '',
      'detailed_explanation' => $node->field_detailed_explanation->value ?? '',
      'usage_examples'       => $examples,
      'notes'                => $node->field_notes_background->value ?? '',
    ], 200, $this->corsHeaders());
  }

  public function updateEntry(Request $request, $nid): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') return new JsonResponse(NULL, 204, $this->corsHeaders());
    if (!$this->auth($request)) return new JsonResponse(['error' => 'Unauthorized'], 403, $this->corsHeaders());

    $data = json_decode($request->getContent(), TRUE);

    try {
      $node = Node::load($nid);
      if (!$node || $node->bundle() !== 'language_entry') return new JsonResponse(['error' => 'Entry not found'], 404, $this->corsHeaders());

      if (!empty($data['title'])) $node->setTitle($data['title']);
      if (isset($data['short_meaning'])) $node->set('field_short_meaning', $data['short_meaning']);
      if (isset($data['detailed_explanation'])) $node->set('field_detailed_explanation', ['value' => $data['detailed_explanation'], 'format' => 'basic_html']);
      if (isset($data['usage_examples'])) $node->set('field_usage_examples', [['value' => $data['usage_examples'], 'format' => 'basic_html']]);
      if (isset($data['notes'])) $node->set('field_notes_background', ['value' => $data['notes'], 'format' => 'basic_html']);
      if (!empty($data['category_id'])) {
        foreach (\Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['vid' => 'main_categories']) as $term) {
          if ($term->uuid() === $data['category_id']) { $node->set('field_main_category', ['target_id' => $term->id()]); break; }
        }
      }
      if (isset($data['action'])) {
        if ($data['action'] === 'publish') { $node->set('moderation_state', 'published'); $node->setPublished(); }
        elseif ($data['action'] === 'unpublish') { $node->set('moderation_state', 'draft'); $node->setUnpublished(); }
      }
      $node->save();
      return new JsonResponse(['success' => TRUE, 'nid' => $node->id(), 'title' => $node->getTitle(), 'status' => $node->isPublished() ? 'published' : 'draft'], 200, $this->corsHeaders());
    } catch (\Exception $e) {
      return new JsonResponse(['error' => $e->getMessage()], 500, $this->corsHeaders());
    }
  }
}
