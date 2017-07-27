'use strict';

angular.module('huoyun.formdata').factory("Validators", ["MandatoryValidator", "EmailValidator", "StringEqualValidator",
  function(MandatoryValidator, EmailValidator, StringEqualValidator) {

    return {
      Mandatory: MandatoryValidator,
      Email: EmailValidator,
      StringEqual: StringEqualValidator
    };
  }
]);