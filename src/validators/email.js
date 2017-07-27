'use strict';

formdata.factory("EmailValidator", function() {

  const PATTERN = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  function EmailValidator(fieldName, errorMessage) {
    this.errorMessage = errorMessage;
    this.fieldName = fieldName;
  }

  EmailValidator.prototype.onValid = function(value) {
    if (PATTERN.test(value)) {
      return Promise.resolve();
    }

    return Promise.reject(this);
  }

  return EmailValidator;
});