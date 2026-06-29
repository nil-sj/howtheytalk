<?php

use Drupal\views\Entity\View;

// Delete if exists
if ($existing = View::load('language_entries')) {
  $existing->delete();
}

View::create([
  'id' => 'language_entries',
  'label' => 'Language Entries',
  'module' => 'views',
  'description' => 'Lists all published language entries with filters.',
  'tag' => 'talknotes',
  'base_table' => 'node_field_data',
  'base_field' => 'nid',
  'display' => [
    'default' => [
      'display_plugin' => 'default',
      'id' => 'default',
      'display_title' => 'Default',
      'position' => 0,
      'display_options' => [
        'title' => 'All Entries',
        'use_more_always' => FALSE,
        'access' => ['type' => 'perm', 'options' => ['perm' => 'access content']],
        'cache' => ['type' => 'tag', 'options' => []],
        'query' => ['type' => 'views_query', 'options' => ['distinct' => FALSE]],
        'exposed_form' => ['type' => 'basic', 'options' => ['submit_button' => 'Search', 'reset_button' => TRUE, 'reset_button_label' => 'Reset']],
        'pager' => ['type' => 'full', 'options' => ['items_per_page' => 24, 'offset' => 0, 'id' => 0, 'total_pages' => NULL]],
        'style' => ['type' => 'default', 'options' => []],
        'row' => ['type' => 'fields', 'options' => []],
        'fields' => [
          'title' => [
            'id' => 'title',
            'table' => 'node_field_data',
            'field' => 'title',
            'label' => '',
            'alter' => ['alter_text' => FALSE],
            'link_to_entity' => TRUE,
          ],
          'field_short_meaning' => [
            'id' => 'field_short_meaning',
            'table' => 'node__field_short_meaning',
            'field' => 'field_short_meaning',
            'label' => '',
          ],
          'field_main_category' => [
            'id' => 'field_main_category',
            'table' => 'node__field_main_category',
            'field' => 'field_main_category',
            'label' => '',
            'type' => 'entity_reference_label',
            'settings' => ['link' => TRUE],
          ],
          'created' => [
            'id' => 'created',
            'table' => 'node_field_data',
            'field' => 'created',
            'label' => '',
            'date_format' => 'custom',
            'custom_date_format' => 'M j, Y',
          ],
        ],
        'filters' => [
          'status' => [
            'id' => 'status',
            'table' => 'node_field_data',
            'field' => 'status',
            'value' => '1',
            'group' => 1,
            'expose' => ['operator' => FALSE],
          ],
          'type' => [
            'id' => 'type',
            'table' => 'node_field_data',
            'field' => 'type',
            'value' => ['language_entry' => 'language_entry'],
          ],
          'moderation_state' => [
            'id' => 'moderation_state',
            'table' => 'content_moderation_state_field_data',
            'field' => 'moderation_state',
            'value' => ['published' => 'published'],
          ],
          'title' => [
            'id' => 'title',
            'table' => 'node_field_data',
            'field' => 'title',
            'operator' => 'contains',
            'value' => '',
            'expose' => [
              'operator_id' => 'title_op',
              'label' => 'Search',
              'operator' => 'title_op',
              'identifier' => 'title',
              'required' => FALSE,
              'remember' => FALSE,
              'multiple' => FALSE,
              'remember_roles' => ['authenticated' => 'authenticated'],
              'placeholder' => 'Search entries...',
            ],
            'exposed' => TRUE,
          ],
          'field_main_category_target_id' => [
            'id' => 'field_main_category_target_id',
            'table' => 'node__field_main_category',
            'field' => 'field_main_category_target_id',
            'value' => [],
            'expose' => [
              'operator_id' => 'field_main_category_target_id_op',
              'label' => 'Category',
              'operator' => 'field_main_category_target_id_op',
              'identifier' => 'field_main_category_target_id',
              'required' => FALSE,
              'remember' => FALSE,
              'multiple' => FALSE,
            ],
            'exposed' => TRUE,
            'type' => 'select',
            'limit' => TRUE,
            'vocabulary' => 'main_categories',
          ],
        ],
        'sorts' => [
          'created' => [
            'id' => 'created',
            'table' => 'node_field_data',
            'field' => 'created',
            'order' => 'DESC',
          ],
        ],
        'header' => [],
        'footer' => [],
        'empty' => [
          'area_text_custom' => [
            'id' => 'area_text_custom',
            'table' => 'views',
            'field' => 'area_text_custom',
            'content' => 'No entries found. Try a different search or category.',
            'format' => 'plain_text',
          ],
        ],
        'relationships' => [],
        'arguments' => [],
      ],
    ],
    'page_1' => [
      'display_plugin' => 'page',
      'id' => 'page_1',
      'display_title' => 'All Entries Page',
      'position' => 1,
      'display_options' => [
        'path' => 'entries',
        'menu' => [
          'type' => 'normal',
          'title' => 'Entries',
          'description' => 'Browse all language entries',
          'weight' => 0,
          'menu_name' => 'main',
        ],
      ],
    ],
  ],
])->save();

echo "View 'Language Entries' created at /entries\n";
echo "Done!\n";
