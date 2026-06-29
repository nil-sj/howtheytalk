<?php
$em = \Drupal::service('simple_sitemap.entity_manager');
$em->setVariants(['default'])->setBundleSettings('node', 'language_entry', ['index' => TRUE, 'priority' => 0.9, 'changefreq' => 'weekly']);
$em->setVariants(['default'])->setBundleSettings('node', 'usage_difference', ['index' => TRUE, 'priority' => 0.8, 'changefreq' => 'weekly']);
$em->setVariants(['default'])->setBundleSettings('node', 'article', ['index' => TRUE, 'priority' => 0.7, 'changefreq' => 'monthly']);
$em->setVariants(['default'])->setBundleSettings('taxonomy_term', 'main_categories', ['index' => TRUE, 'priority' => 0.6, 'changefreq' => 'monthly']);
echo "Bundle settings done!\n";
\Drupal::service('simple_sitemap.generator')->generate('backend');
echo "Sitemap generated!\n";
