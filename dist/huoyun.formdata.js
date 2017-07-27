'use strict';

const formdata = angular.module('huoyun.formdata');
'use strict';

formdata.factory("Field", function() {

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
'use strict';

formdata.factory("FormData", ["Field", "$q",
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
'use strict';

formdata.factory("Validators", ["MandatoryValidator", "EmailValidator", "StringEqualValidator",
  function(MandatoryValidator, EmailValidator, StringEqualValidator) {

    return {
      Mandatory: MandatoryValidator,
      Email: EmailValidator,
      StringEqual: StringEqualValidator
    };
  }
]);
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
'use strict';

formdata.factory("StringEqualValidator", function() {

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