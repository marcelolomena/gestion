'use strict';

// Treeview Demo
// =============================================================

var treeviewDemo = {
  init: function init() {

    this.bindUIActions();
  },
  bindUIActions: function bindUIActions() {

    // event handlers
    this.handleTreeview();
  },
  types: function types() {
    // jstree common types
    return {
      '#': {
        max_children: 1,
        max_depth: 4,
        valid_children: ['root']
      },
      'root': {
        icon: 'fa fa-hdd text-yellow',
        valid_children: ['default', 'file']
      },
      default: {
        icon: 'fa fa-folder text-yellow',
        valid_children: ['default', 'file']
      },
      file: {
        icon: 'fa fa-file',
        valid_children: []
      },
      text: {
        icon: 'far fa-file-alt',
        valid_children: []
      },
      word: {
        icon: 'far fa-file-word',
        valid_children: []
      },
      excel: {
        icon: 'far fa-file-excel',
        valid_children: []
      },
      ppt: {
        icon: 'far fa-file-powerpoint',
        valid_children: []
      },
      pdf: {
        icon: 'far fa-file-pdf',
        valid_children: []
      },
      archive: {
        icon: 'far fa-file-archive',
        valid_children: []
      },
      image: {
        icon: 'far fa-file-image',
        valid_children: []
      },
      audio: {
        icon: 'far fa-file-audio',
        valid_children: []
      },
      video: {
        icon: 'far fa-file-video',
        valid_children: []
      }
    };
  },
  handleTreeview: function handleTreeview() {
    var self = this;

    // jstree1
    $('#jstree1').jstree({
      plugins: ['types'],
      types: self.types()
    });

    // jstree2 - json data
    $('#jstree2').jstree({
      core: {
        data: [{
          text: 'Root',
          icon: 'fa fa-hdd text-teal',
          state: { opened: true },
          children: [{
            text: 'Directory',
            icon: 'fa fa-folder text-teal'
          }, {
            text: 'File unread',
            icon: 'far fa-file'
          }, {
            text: 'Another directory',
            icon: 'fa fa-folder text-teal',
            state: { opened: true },
            children: [{
              text: 'File text',
              icon: 'far fa-file-alt'
            }, {
              text: 'File word',
              icon: 'far fa-file-alt'
            }, {
              text: 'File excel',
              icon: 'far fa-file-excel'
            }, {
              text: 'File powerpoint',
              icon: 'far fa-file-powerpoint',
              state: { disabled: true }
            }, {
              text: 'File pdf',
              icon: 'far fa-file-pdf'
            }, {
              text: 'File archive',
              icon: 'far fa-file-archive'
            }, {
              text: 'File image',
              icon: 'far fa-file-image'
            }, {
              text: 'File audio',
              icon: 'far fa-file-audio'
            }, {
              text: 'File video',
              icon: 'far fa-file-video'
            }]
          }, {
            text: 'Something else',
            icon: 'fa fa-folder text-teal'
          }, {
            text: 'File unread',
            icon: 'far fa-file'
          }]
        }]
      }
    });

    // jstree3 - ajax data
    $('#jstree3').jstree({
      core: {
        data: {
          url: 'assets/data/jstree1.json',
          data: function data(node) {
            return { id: node.id };
          }
        }
      }
    });

    // jstree4 - event
    $('#jstree4').on('changed.jstree', function (e, data) {
      toastr.options = {
        'positionClass': 'toast-bottom-right'
      };
      toastr.info('The selected id is: ' + data.selected);
    }).jstree({
      core: {
        data: {
          url: 'assets/data/jstree1.json',
          data: function data(node) {
            return { id: node.id };
          }
        }
      }
    });

    // jstree5 - checkbox
    $('#jstree5').jstree({
      plugins: ['checkbox'],
      checkbox: {
        'keep_selected_style': false
      },
      core: {
        data: {
          url: 'assets/data/jstree2.json',
          data: function data(node) {
            return { id: node.id };
          }
        }
      }
    });

    // jstree6 - contextmenu
    $('#jstree6').jstree({
      plugins: ['types', 'contextmenu'],
      core: {
        data: {
          url: 'assets/data/jstree3.json',
          data: function data(node) {
            return { id: node.id };
          }
        },
        check_callback: true
      },
      types: self.types()
    });

    // jstree7 - dnd
    $('#jstree7').jstree({
      plugins: ['types', 'dnd'],
      core: {
        data: {
          url: 'assets/data/jstree3.json',
          data: function data(node) {
            return { id: node.id };
          }
        },
        check_callback: true
      },
      types: self.types()
    });

    // jstree8 - massload
    $('#jstree8').jstree({
      plugins: ['massload', 'state'],
      massload: {
        url: 'assets/data/jstree2.json',
        data: function data(nodes) {
          return { ids: nodes.join(',') };
        }
      },
      core: {
        data: {
          url: 'assets/data/jstree2.json',
          data: function data(node) {
            return { id: node.id };
          }
        }
      }
    });

    // jstree9 - search
    $('#jstree9').jstree({
      plugins: ['search'],
      core: {
        data: {
          url: 'assets/data/jstree2.json',
          data: function data(node) {
            return { id: node.id };
          }
        }
      }
    });
    var to = false;
    $('#jstree9_q').on('keyup', function () {
      if (to) {
        clearTimeout(to);
      }
      to = setTimeout(function () {
        var v = $('#jstree9_q').val();
        $('#jstree9').jstree(true).search(v);
      }, 250);
    });

    // jstree10 - sort
    $('#jstree10').jstree({
      plugins: ['sort'],
      core: {
        data: {
          url: 'assets/data/jstree2.json',
          data: function data(node) {
            return { id: node.id };
          }
        }
      }
    });

    // jstree11 - wholerow
    $('#jstree11').jstree({
      plugins: ['wholerow'],
      core: {
        data: {
          url: 'assets/data/jstree2.json',
          data: function data(node) {
            return { id: node.id };
          }
        }
      }
    });
  }
};

treeviewDemo.init();