; (function ($) {

  'use strict';

  // Initialize all tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // Initialize all wyswyg editors
  if ($.fn.summernote) {
    $('.wyswyg').summernote({
      height: 200,
      callbacks: {
        onInit: function () {
          var self = $(this);
          var name = self.attr('data-name');

          self.append('<textarea name="' + name + '" class="hidden"></textarea>');
        },
        onChange: function (contents) {
          var self = $(this);
          var textarea = self.find('textarea');

          textarea.text(contents);
        }
      }
    });
  }

  // Initialize all multiselect components
  if ($.fn.multiselect) {
    $('select[multiple]').multiselect();
  }

  // Initialize fileuploader
  if ($.fn.fileuploader) {
    $('.image-upload').fileuploader({
      extensions: ['jpg', 'jpeg', 'png', 'gif'],
      listInput: false
    });

    $('.file-upload').fileuploader({
      listInput: false
    });
  }

})(jQuery);