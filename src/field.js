'use strict';

angular.module('huoyun.formdata').factory("Field", function() {

  function Field(name) {
    this.name = name;
    this.hasError = false;
    this.errorMessage = null;
    this.value = null;
    this.validators = [];
  }

  Field.prototype.setError = function(errorMessage) {
    this.hasError = true;
    this.errorMessage = errorMessage;
  };

  Field.prototype.clearError = function() {
    this.hasError = false;
    this.errorMessage = null;
  };

  Field.prototype.addValidator = function(validator, message, options) {
    this.validators.push(new validator(this.name, message, options));
  };

  Field.prototype.onValid = function() {
    var promises = [];
    this.validators.forEach(function(validator) {
      promises.push(validator.onValid(this.value));
    }.bind(this));
    return Promise.all(promises);
  };

  return Field;
});