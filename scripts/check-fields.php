<?php
$node = \Drupal\node\Entity\Node::load(116);
foreach ($node->getFields() as $name => $field) {
  if (strpos($name, 'field_') === 0) echo $name . "\n";
}
