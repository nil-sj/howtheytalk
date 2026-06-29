<?php

namespace Drupal\talknotes_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ContactController extends ControllerBase {

  public function submit(Request $request): JsonResponse {
    if ($request->getMethod() === 'OPTIONS') {
      return new JsonResponse(NULL, 204, $this->corsHeaders());
    }

    $data = json_decode($request->getContent(), TRUE);

    if (empty($data['your_name']) || empty($data['your_email']) || empty($data['message'])) {
      return new JsonResponse(['error' => 'Missing required fields'], 400, $this->corsHeaders());
    }

    if (!empty($data['honeypot'])) {
      return new JsonResponse(['success' => TRUE], 200, $this->corsHeaders());
    }

    try {
      $webform = \Drupal\webform\Entity\Webform::load('suggest_a_word');
      if (!$webform) {
        return new JsonResponse(['error' => 'Form not found'], 404, $this->corsHeaders());
      }

      $submission = \Drupal\webform\Entity\WebformSubmission::create([
        'webform_id' => 'suggest_a_word',
        'data' => [
          'your_name'      => $data['your_name'] ?? '',
          'your_email'     => $data['your_email'] ?? '',
          'message_type'   => $data['message_type'] ?? 'general',
          'suggested_word' => $data['suggested_word'] ?? '',
          'message'        => $data['message'] ?? '',
          'source_context' => $data['source_context'] ?? '',
        ],
      ]);
      $submission->save();

      return new JsonResponse(['success' => TRUE, 'sid' => $submission->id()], 200, $this->corsHeaders());
    }
    catch (\Exception $e) {
      return new JsonResponse(['error' => $e->getMessage()], 500, $this->corsHeaders());
    }
  }

  private function corsHeaders(): array {
    return [
      'Access-Control-Allow-Origin' => '*',
      'Access-Control-Allow-Methods' => 'POST, OPTIONS',
      'Access-Control-Allow-Headers' => 'Content-Type, Accept',
    ];
  }
}
