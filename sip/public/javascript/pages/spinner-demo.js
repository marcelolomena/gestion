'use strict';

// noUiSlider Demo
// =============================================================

var spinnerDemo = {
  init: function init() {

    this.bindUIActions();
  },
  bindUIActions: function bindUIActions() {

    // event handlers
    this.handleSpinners();
  },
  handleSpinners: function handleSpinners() {
    // basic spinner
    $('#spinner1').TouchSpin({
      buttondown_class: 'btn btn-secondary',
      buttonup_class: 'btn btn-secondary'
    });

    // With postfix
    $('#spinner2').TouchSpin({
      buttondown_class: 'btn btn-secondary',
      buttonup_class: 'btn btn-secondary',
      min: 0,
      max: 100,
      step: 0.1,
      decimals: 2,
      boostat: 5,
      maxboostedstep: 10,
      postfix: '%'
    });

    // With prefix
    $('#spinner3').TouchSpin({
      buttondown_class: 'btn btn-secondary',
      buttonup_class: 'btn btn-secondary',
      min: -1000000000,
      max: 1000000000,
      stepinterval: 50,
      maxboostedstep: 10000000,
      prefix: '$'
    });

    // Vertical button alignment
    $('#spinner4').TouchSpin({
      verticalbuttons: true,
      buttondown_class: 'btn btn-secondary',
      buttonup_class: 'btn btn-secondary'
    });

    // Vertical buttons with custom icons
    $('#spinner5').TouchSpin({
      verticalbuttons: true,
      buttondown_class: 'btn btn-secondary',
      buttonup_class: 'btn btn-secondary',
      verticalup: '',
      verticaldown: '',
      verticalupclass: 'fa fa-chevron-up',
      verticaldownclass: 'fa fa-chevron-down'
    });
  }
};

spinnerDemo.init();