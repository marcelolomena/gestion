'use strict';

// DataTables Demo
// =============================================================

var advanceDataTablesDemo = {
  init: function init() {

    this.bindUIActions();
  },
  bindUIActions: function bindUIActions() {

    // event handlers
    this.table = this.handleDataTables();
    this.handleGlobalSearch();
    this.handleColumnSearch();
    this.handleSelecter();
    this.handleClearSelected();

    // filter columns
    this.addFilterRow();
    this.removeFilterRow();
    this.clearFilter();

    // add buttons
    this.table.buttons().container().appendTo('#dt-buttons').unwrap();
  },
  handleDataTables: function handleDataTables() {
    return $('#myTable').DataTable({
      dom: '<\'text-muted\'Bi>\n        <\'table-responsive\'tr>\n        <\'mt-4\'p>',
      buttons: ['copyHtml5', { extend: 'print', autoPrint: false }],
      language: {
        paginate: {
          previous: '<i class="fa fa-lg fa-angle-left"></i>',
          next: '<i class="fa fa-lg fa-angle-right"></i>'
        }
      },
      autoWidth: false,
      ajax: 'assets/data/products.json',
      deferRender: true,
      order: [1, 'asc'],
      columns: [{ data: 'id', className: 'col-checker align-middle', orderable: false, searchable: false }, { data: { _: 'name', sort: 'name', search: 'name' }, className: 'align-middle' }, { data: 'inventory', className: 'align-middle' }, { data: 'variant', className: 'align-middle' }, { data: 'prices', className: 'align-middle' }, { data: 'sales', className: 'align-middle' }, { data: 'id', className: 'align-middle text-right', orderable: false, searchable: false }],
      columnDefs: [{
        targets: 0,
        render: function render(data, type, row, meta) {
          return '<div class="custom-control custom-control-nolabel custom-checkbox">\n            <input type="checkbox" class="custom-control-input" name="selectedRow[]" id="p' + row.id + '" value="' + row.id + '">\n            <label class="custom-control-label" for="p' + row.id + '"></label>\n          </div>';
        }
      }, {
        targets: 1,
        render: function render(data, type, row, meta) {
          return '<a href="#' + row.id + '" class="tile tile-img mr-1">\n            <img class="img-fluid" src="assets/images/dummy/img-' + row.img + '.jpg" alt="Card image cap">\n          </a>\n          <a href="#' + row.id + '">' + row.name + '</a>';
        }
      }, {
        targets: 6,
        render: function render(data, type, row, meta) {
          return '<a class="btn btn-sm btn-secondary" href="#' + data + '"><i class="fa fa-pencil-alt"></i></a>\n          <a class="btn btn-sm btn-secondary" href="#' + data + '"><i class="far fa-trash-alt"></i></a>';
        }
      }]
    });
  },
  handleGlobalSearch: function handleGlobalSearch() {
    var self = this;

    $('#table-search').on('keyup focus', function (e) {
      var value = $('#table-search').val();

      // clear selected rows
      if (value.length && e.type === 'keyup') {
        self.clearSelectedRows();
      }

      self.table.search(value).draw();
    });
  },
  handleColumnSearch: function handleColumnSearch() {
    var self = this;

    $(document).on('keyup change', '.filter-control', function (e) {
      var filterRow = $(this).parents('.form-row');
      var column = filterRow.find('.filter-column').val();
      var value = filterRow.find('.filter-value').val();
      var operator = value === '' ? 'contain' : filterRow.find('.filter-operator').val();
      var pattern = value;
      var exp = '';

      if (operator === 'notcontain') {
        pattern = '^((?!' + value + ').)*$';
      } else if (operator === 'equal') {
        pattern = '^' + value + '$';
      } else if (operator === 'notequal') {
        pattern = '^(?!' + value + ').*$';
      } else if (operator === 'beginwith') {
        pattern = '^(' + value + '| ' + value + ').*';
      } else if (operator === 'endwith') {
        pattern = '.*' + value + '$';
      } else if (operator === 'greaterthan') {
        var arr = value.split('');

        $.each(arr, function (i, val) {
          exp += '[' + val + '-9]';
        });

        pattern = '^' + exp + '*$';
        console.log(pattern);
      } else if (operator === 'lessthan') {
        (function () {
          var arr = value.split('');
          var lastIndex = arr.length - 1;

          var _loop = function _loop(x) {
            exp += x > 0 ? '|' : '';

            $.each(arr, function (i, val) {
              if (i <= x && x === lastIndex) {
                exp += '[0-' + val + ']';
              }if (i <= x && x < lastIndex) {
                exp += '[0-9]';
              }
            });
          };

          for (var x = 0; x < arr.length; x++) {
            _loop(x);
          }

          pattern = '^(' + exp + ')$';
        })();
      }

      // reset search term
      if (e.type === 'change' && $(e.target).is('select')) {
        filterRow.find('.filter-value').val('').trigger('keyup');
      }

      self.table.column(column).search(pattern, true, true).draw();
    });
  },
  addFilterRow: function addFilterRow() {
    $('#add-filter-row').on('click', function () {
      // get template from #filter-columns
      var rowTmpl = $('#filter-columns').children().first().clone();

      rowTmpl.find('select').prop('selectedIndex', 0);
      rowTmpl.find('input').val('');

      $('#filter-columns').append(rowTmpl);
    });
  },
  removeFilterRow: function removeFilterRow() {
    var self = this;
    $(document).on('click', '.remove-filter-row', function () {
      // get filter row
      var $row = $(this).parents('.filter-row');
      // clear search value
      $row.find('.filter-value').val('').trigger('keyup');
      // remove row
      if (self.isRemovableRow()) {
        $row.remove();
      }
    });
  },
  isRemovableRow: function isRemovableRow() {
    return $('#filter-columns').children().length > 1;
  },
  clearFilter: function clearFilter() {
    var self = this;

    $(document).on('click', '#clear-filter', function () {
      // hide modal
      $('#modalFilterColumns').modal('hide');

      // reset selects and input
      $('#filter-columns').find('select').prop('selectedIndex', 0);
      $('#filter-columns').find('input').val('');

      // reset search term
      self.table.columns().search('').draw();
    });
  },
  handleSelecter: function handleSelecter() {
    var self = this;

    $(document).on('change', '#check-handle', function () {
      var isChecked = $(this).prop('checked');
      $('input[name="selectedRow[]"]').prop('checked', isChecked);

      // get info
      self.getSelectedInfo();
    }).on('change', 'input[name="selectedRow[]"]', function () {
      var $selectors = $('input[name="selectedRow[]"]');
      var $selectedRow = $('input[name="selectedRow[]"]:checked').length;
      var prop = $selectedRow === $selectors.length ? 'checked' : 'indeterminate';

      // reset props
      $('#check-handle').prop('indeterminate', false).prop('checked', false);

      if ($selectedRow) {
        $('#check-handle').prop(prop, true);
      }

      // get info
      self.getSelectedInfo();
    });
  },
  handleClearSelected: function handleClearSelected() {
    var self = this;
    // clear selected rows
    $('#myTable').on('page.dt', function () {
      self.clearSelectedRows();
    });
    $('#clear-search').on('click', function () {
      self.clearSelectedRows();
    });
  },
  getSelectedInfo: function getSelectedInfo() {
    var $selectedRow = $('input[name="selectedRow[]"]:checked').length;
    var $info = $('.thead-btn');
    var $badge = $('<span/>').addClass('selected-row-info text-muted pl-1').text($selectedRow + ' selected');
    // remove existing info
    $('.selected-row-info').remove();
    // add current info
    if ($selectedRow) {
      $info.prepend($badge);
    }
  },
  clearSelectedRows: function clearSelectedRows() {
    $('#check-handle').prop('indeterminate', false).prop('checked', false).trigger('change');
  }
};

advanceDataTablesDemo.init();