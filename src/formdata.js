'use strict';

angular.module('huoyun.formdata').factory("FormData", ["Field", "$q",
  function(Field, $q) {

    function FormData(...names) {
      names.forEach(function(fieldName) {
        this[fieldName] = new Field(fieldName);
      }.bind(this));
    }

    FormData.prototype.getModel = function() {
      var model = {};
      Object.keys(this).forEach(function(fieldName) {
        if (this.isField(fieldName)) {
          model[fieldName] = this[fieldName].value;
        }
      }.bind(this));
      return model;
    };

    FormData.prototype.setError = function(fieldName, errorMessage) {
      if (this.isField(fieldName)) {
        this[fieldName].setError(errorMessage);
      }
    };

    FormData.prototype.clearErrors = function() {
      Object.keys(this).forEach(function(fieldName) {
        if (this.isField(fieldName)) {
          this[fieldName].clearError();
        }
      }.bind(this));
    };

    FormData.prototype.isField = function(fieldName) {
      return this[fieldName] instanceof Field;
    };

    FormData.prototype.addValidator = function(fieldName, validator, message, options) {
      if (this.isField(fieldName)) {
        this[fieldName].addValidator(validator, message, options);
      }
    };

    FormData.prototype.onValid = function() {
      var promises = [];
      Object.keys(this).forEach(function(fieldName) {
        if (this.isField(fieldName)) {
          promises.push(this[fieldName].onValid());
        }
      }.bind(this));

      var dtd = $q.defer();
      Promise.all(promises)
        .then(function() {
          dtd.resolve();
        })
        .catch(function(ex) {
          dtd.reject(ex);
        });

      return dtd.promise;
    };

    return FormData;
  }
]);