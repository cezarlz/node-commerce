'use strict';

if (flashes) {
  for (var i in flashes) {
    var error = flashes[i];
    var element = error.name
      ? $('input[name="' + error.name + '"]')
      : error.target
        ? $(error.target)
        : false;
    var type = error.type || 'help-block';

    if (element) {
      switch (type) {
        case 'alert-danger':
        case 'alert-error':
          element
            .prepend('<div class="alert alert-danger" role="alert">' + error.message + '</div>');

          break;

        case 'alert-success':
          element
            .prepend('<div class="alert alert-success" role="alert">' + error.message + '</div>');

          break;

        case 'alert-warning':
          element
            .prepend('<div class="alert alert-warning" role="alert">' + error.message + '</div>');
          break;

        case 'alert-info':
          element
            .prepend('<div class="alert alert-info" role="alert">' + error.message + '</div>');
          break;
        case 'help-block':
          if (element.parent('div').hasClass('input-group')) {
            element
              .parent('div')
              .after('<p class="help-block text-danger">' + error.message + '</p>')
              .end()
              .parent()
              .addClass('has-error');
          }
          else {
            element
              .parent('div')
              .append('<p class="help-block text-danger">' + error.message + '</p>')
              .end()
              .parent()
              .addClass('has-error');
          }

          break;
      }
    }
  }
}