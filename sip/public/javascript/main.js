'use strict';

/*!
 * main.js
 *
 * author: Beni Arisandi
 */

var App = {
  init: function init() {

    this.bindUIActions();

    return this;
  },
  bindUIActions: function bindUIActions() {
    var self = this;

    // settings
    // =============================================================
    // Turn off the transform placement on Popper
    Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;

    // event handlers
    // =============================================================

    $('body').on('click', '.stop-propagation', function (e) {
      e.stopPropagation();
    }).on('click', '.prevent-default', function (e) {
      e.preventDefault();
    });

    // polyfill
    // =============================================================

    this.handlePlaceholderShown();

    // bootstrap components
    // =============================================================

    this.initTooltips();
    this.initPopovers();
    this.handleInputGroup();
    this.handleCustomFileInput();
    this.handlePasswordVisibility();
    this.handleIndeterminateCheckboxes();
    this.handleFormValidation();
    this.handleCardExpansion();
    this.handleModalOverflow();

    // theme components
    // =============================================================

    this.initBackdrop();
    this.topBarSearch();
    this.toggleHamburgerMenu();
    this.handleAside();
    this.handleScrollable();
    this.handleStackedMenu();
    this.handleSidebar();
    this.handlePublisher();
    this.handleMasonryLayout();
    this.handleSmoothScroll();

    // handle window load & resize
    // =============================================================

    $(window).on('load', function () {
      var $target = $('.stacked-menu .menu > li.has-active');
      if ($target.length) {
        $('#aside-menu').animate({
          scrollTop: $target.position().top
        });
      }
    }).on('resize', function () {
      // force close aside on toggle screen up
      if (self.isToggleScreenUp() && $('.app-aside').hasClass('has-open') && !$('.app').hasClass('has-fullwidth')) {
        self.closeAside();
      }

      // disable transition temporary
      $('.app-aside, .page-sidebar').addClass('notransition');
      setTimeout(function () {
        $('.app-aside, .page-sidebar').removeClass('notransition');
      }, 1);
    });
  },


  // Polyfill for :placeholder-shown
  // =============================================================

  handlePlaceholderShown: function handlePlaceholderShown() {
    $(document).on('load keyup change', '[placeholder]', function () {
      this.classList[this.value ? 'remove' : 'add']('placeholder-shown');
    });
  },


  // Handle Bootstrap components
  // =============================================================

  initTooltips: function initTooltips() {
    $('[data-toggle="tooltip"]').tooltip();
  },
  initPopovers: function initPopovers() {
    $('[data-toggle="popover"]').popover();
  },
  handleInputClearable: function handleInputClearable(target) {
    var isEmpty = !$(target).val();
    var clearable = $(target).parent().children('.close');

    clearable.toggleClass('show', !isEmpty);
  },
  handleInputGroup: function handleInputGroup() {
    var self = this;

    // initialize events
    $('.has-clearable > .form-control').each(function () {
      self.handleInputClearable(this);
    });

    // handle input group event
    $(document).on('focus', '.input-group:not(.input-group-alt) .form-control', function () {
      var hasInputGroup = $(this).parent().has('.input-group');
      if (hasInputGroup) {
        $(this).parent().addClass('focus');
      }
    }).on('blur', '.input-group:not(.input-group-alt) .form-control', function () {
      var hasInputGroup = $(this).parent().has('.input-group');
      if (hasInputGroup) {
        $(this).parent().removeClass('focus');
      }
    })
    // input has clearable
    .on('keyup', '.has-clearable > .form-control', function () {
      self.handleInputClearable(this);
    }).on('click', '.has-clearable > .close', function () {
      var input = $(this).parent().children('.form-control');

      input.val('').focus();
      self.handleInputClearable(input);
    });
  },
  handleCustomFileInput: function handleCustomFileInput() {
    // custom file input behavior
    $('.custom-file > .custom-file-label').each(function () {
      var label = $(this).text();
      $(this).data('label', label);
    });

    $(document).on('change', '.custom-file > .custom-file-input', function () {
      var files = this.files;
      var $fileLabel = $(this).next('.custom-file-label');
      var $originLabel = $fileLabel.data('label');

      $fileLabel.text(files.length + ' files selected');
      if (files.length <= 2) {
        var fileNames = [];
        for (var i = 0; i < files.length; i++) {
          fileNames.push(files[i].name);
        }
        $fileLabel.text(fileNames.join(', '));
      }
      if (!files.length) {
        $fileLabel.text($originLabel);
      }
    });
  },
  handlePasswordVisibility: function handlePasswordVisibility() {
    $(document).on('click', '[data-toggle="password"]', function (e) {
      e.preventDefault();
      var target = $(this).attr('href');
      var $target = $(target);

      if ($(this).has('.fa')) $(this).children('.fa, .far').toggleClass('fa-eye fa-eye-slash');

      if ($target.is('[type="password"]')) {
        $target.prop('type', 'text');
        $(this).children().last().text('Hide');
      } else {
        $target.prop('type', 'password');
        $(this).children().last().text('Show');
      }
    });
  },
  handleIndeterminateCheckboxes: function handleIndeterminateCheckboxes() {
    $('input[type="checkbox"][indeterminate]').prop('indeterminate', true);
  },
  handleFormValidation: function handleFormValidation() {
    $(window).on('load', function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = $('.needs-validation');
      // Loop over them and prevent submission
      forms.each(function (i, form) {
        $(form).on('submit', function (e) {
          if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
          }
          $(form).addClass('was-validated');
        });
      });
    });
  },
  handleCardExpansion: function handleCardExpansion() {
    $(document).on('show.bs.collapse hide.bs.collapse', '.card-expansion-item > .collapse', function (e) {
      var $item = $(this).parent();
      var isShown = e.type === 'show';

      $item.toggleClass('expanded', isShown);
    });
  },
  handleModalOverflow: function handleModalOverflow() {
    $('.modal').on('shown.bs.modal', function () {
      $(this).addClass('has-shown').find('.modal-body').trigger('scroll');
    });

    $('.modal-dialog-overflow .modal-body').on('scroll', function () {
      var $elem = $(this);
      var elem = $elem[0];
      var isTop = $elem.scrollTop() === 0;
      var isBottom = elem.scrollHeight - $elem.scrollTop() === $elem.outerHeight();

      $elem.prev().toggleClass('modal-body-scrolled', isTop);
      $elem.next().toggleClass('modal-body-scrolled', isBottom);
    });
  },


  // Handle Theme components
  // =============================================================

  isToggleScreenUp: function isToggleScreenUp() {
    return window.matchMedia('(min-width: 768px)').matches;
  },
  isToggleScreenDown: function isToggleScreenDown() {
    return window.matchMedia('(max-width: 767.98px)').matches;
  },
  initBackdrop: function initBackdrop() {
    $('.app').append('<div class="app-backdrop"/>');
  },
  openBackdrop: function openBackdrop() {
    $('.app-backdrop').addClass('show');
    return $('.app-backdrop');
  },
  closeBackdrop: function closeBackdrop() {
    $('.app-backdrop').removeClass('show');
    return $('.app-backdrop');
  },
  topBarSearch: function topBarSearch() {
    $(document).on('blur', '.top-bar-search > .form-control', function () {
      var $input = $(this).children('.form-control');
      var isEmpty = $input.val().length === 0;

      if (!isEmpty) {
        $input.val('');
      }
    });
  },
  toggleHamburgerMenu: function toggleHamburgerMenu() {
    $(document).on('click', '.js-hamburger', function () {
      $(this).toggleClass('has-active');
    });
  },
  openAside: function openAside() {
    var self = this;

    var backdrop = this.openBackdrop();

    $('.app-aside').addClass('has-open');
    $('[data-toggle="aside"]').addClass('has-active');

    backdrop.one('click', function () {
      self.closeAside();
    });
  },
  closeAside: function closeAside() {
    this.closeBackdrop();
    $('.app-aside').removeClass('has-open');
    $('[data-toggle="aside"]').removeClass('has-active');
  },
  handleAside: function handleAside() {
    var self = this;
    var $trigger = $('[data-toggle="aside"]');

    $trigger.on('click', function () {
      var isOpen = $('.app-aside').hasClass('has-open');

      $trigger.toggleClass('has-active', !isOpen);

      if (isOpen) self.closeAside();else self.openAside();
    });
  },
  handleScrollable: function handleScrollable() {
    if (window.PerfectScrollbar && $('.has-scrollable').length) {
      $('.has-scrollable').each(function () {
        return new PerfectScrollbar(this, {
          suppressScrollX: true
        });
      });
    }
  },
  handleStackedMenu: function handleStackedMenu() {
    if (window.StackedMenu && $('#stacked-menu').length) {
      return new StackedMenu();
    }
  },
  toggleSidebar: function toggleSidebar() {
    var self = this;
    var $page = $('.page.has-sidebar');
    var isOpen = $page.hasClass('has-sidebar-open');

    if ($page.length) {
      $page.toggleClass('has-sidebar-open', !isOpen);
    }
  },
  handleSidebar: function handleSidebar() {
    var self = this;

    // add sidebar backdrop
    if ($('.has-sidebar').length) {
      $('.page').prepend('<div class="sidebar-backdrop" />');
    }

    $(document).on('click', '[data-toggle="sidebar"], .sidebar-backdrop', function (e) {
      e.preventDefault();
      self.toggleSidebar();
    });
  },
  handlePublisher: function handlePublisher() {
    $(document).on('focusin', '.publisher .form-control', function () {
      var $publisher = $(this).parents('.publisher');

      // normalize all empty publisher
      $('.publisher').each(function () {
        var hasEmpty = !$(this).find('.form-control').val();

        if (hasEmpty) {
          $(this).removeClass('active');
          $(this).not('.keep-focus').removeClass('focus');
        }
      });

      // add state classes
      $publisher.addClass('focus active');
    }).on('click', 'html', function () {
      var $publisher = $('.publisher.active');
      var isEmpty = !$publisher.find('.form-control').val();

      // always remove active state
      $publisher.removeClass('active');

      // remove focus if input is empty
      if (isEmpty) {
        $publisher.not('.keep-focus').removeClass('focus');
      }
    }).on('click', '.publisher.active', function (e) {
      e.stopPropagation();
    });
  },
  handleMasonryLayout: function handleMasonryLayout() {
    $(window).on('load', function () {
      if (window.Masonry) {
        $('.masonry-layout').masonry({
          itemSelector: '.masonry-item',
          columnWidth: '.masonry-item:first-child',
          percentPosition: true
        });
      }
    });
  },
  handleSmoothScroll: function handleSmoothScroll() {
    $(document).on('click', 'a.smooth-scroll[href^="#"]', function (e) {
      var hash = $(this).attr('href');
      var target = $(hash);
      if (!target.length) {
        return;
      }

      e.preventDefault();

      var headerHeight = $('.app-header').height() + 20;
      var offset = target.offset().top - headerHeight;

      $('html, body').animate({
        scrollTop: offset < 0 ? 0 : offset
      }, 700);
    });
  },


  // Utils

  debounce: function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;
      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
};

var Looper = App.init();