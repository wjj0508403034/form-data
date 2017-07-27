'use strict';

formdata.factory("MandatoryValidator", function() {

  function MandatoryValidator(fieldName, errorMessage) {
    this.errorMessage = errorMessage;
    this.fieldName = fieldName;
  }

  MandatoryValidator.prototype.onValid = function(value) {
    if (value === null || value === undefined) {
      return Promise.reject(this);
    }

    if (typeof value === "string") {
      if (value.trim() === "") {
        return Promise.reject(this);
      }
    }

    return Promise.resolve();
  }

  return MandatoryValidator;
});