'use strict';

// Summernote Demo
// =============================================================

var summernoteDemo = {
  init: function init() {

    this.bindUIActions();
  },
  bindUIActions: function bindUIActions() {

    // event handlers
    this.handleSummernotes();
  },
  handleSummernotes: function handleSummernotes() {
    // basic
    $('#summernote-basic').summernote({
      placeholder: 'Write here...',
      height: 200,
      callbacks: {
        // fix broken checkbox on link modal
        onInit: function onInit(e) {
          var editor = $(e.editor);
          editor.find('.custom-control-description').addClass('custom-control-label d-block').parent().removeAttr('for');
        }
      }
    });

    // air mode on
    $('#summernote-airmode').summernote({
      airMode: true,
      callbacks: {
        // fix broken checkbox on link modal
        onInit: function onInit(e) {
          var editor = $(e.editor);
          editor.find('.custom-control-description').addClass('custom-control-label d-block').parent().removeAttr('for');
        }
      }
    });

    // click to edit
    var edit = function edit() {
      $('#summernote-click2edit').summernote({
        focus: true,
        callbacks: {
          // fix broken checkbox on link modal
          onInit: function onInit(e) {
            var editor = $(e.editor);
            editor.find('.custom-control-description').addClass('custom-control-label d-block').parent().removeAttr('for');
          }
        }
      });
    };
    var save = function save() {
      var makrup = $('#summernote-click2edit').summernote('code');
      $('#summernote-click2edit').summernote('destroy');
    };

    $('#summernote-edit').on('click', function () {
      edit();
      // toggle buttons
      $(this).hide();
      $('#summernote-save').show();
    });
    $('#summernote-save').on('click', function () {
      save();
      // toggle buttons
      $(this).hide();
      $('#summernote-edit').show();
    });
  }
};

summernoteDemo.init();