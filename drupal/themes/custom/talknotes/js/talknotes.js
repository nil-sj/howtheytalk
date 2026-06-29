(function (Drupal) {
  'use strict';
  Drupal.behaviors.talknotes = {
    attach: function (context, settings) {
      const searchInputs = context.querySelectorAll('.header-search input[type="search"]');
      searchInputs.forEach(function (input) {
        input.addEventListener('focus', function () { this.select(); });
      });
    }
  };
})(Drupal);
