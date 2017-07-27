'use strict';

angular.module('huoyun.formdata').factory("StringEqualValidator", function() {

  function StringEqualValidator(fieldName, errorMessage, options) {
    this.errorMessage = errorMessage;
    this.fieldName = fieldName;
    this.options = options;
  }

  StringEqualValidator.prototype.onValid = function(value) {
    if (typeof this.options.equals === "function") {
      let equals = this.options.equals.apply(null, [value]);

      if (equals instanceof Promise) {
        return equals;
      }

      if (typeof equals === "boolean") {
        if (equals) {
          return Promise.resolve();
        }

        return Promise.reject(this);
      }
    }
    throw new Error("StringEqualValidator onValid Error");
  }

  return StringEqualValidator;
});