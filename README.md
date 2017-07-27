# huoyun-formdata
form data validator in angular project

# Installation
Install package with NPM and add it to your development dependencies:

```
npm install --save-dev huoyun-formdata
```

Usage

```
angular.module('huoyun.project', ['huoyun.formdata']);

angular.module('huoyun.project').controller("LoginController", ["$scope", "FormData", "UserService", "Validators",
  function($scope, FormData, UserService, Validators) {

    $scope.vm = new FormData("email", "password");
    $scope.vm.addValidator("email", Validators.Mandatory, "邮箱不能为空。");
    $scope.vm.addValidator("email", Validators.Email, "邮件格式不正确。");
    $scope.vm.addValidator("password", Validators.Mandatory, "密码不能为空。");

    $scope.login = function() {
      $scope.vm.onValid()
        .then(login)
        .catch(function(ex) {
          $scope.vm.clearErrors();
          $scope.vm.setError(ex.fieldName, ex.errorMessage);
        });
    };

    function login() {
      var model = $scope.vm.getModel();
      UserService.login(model.email, model.password)
        .then(function() {
          window.location.href = "/index.html";
        }).catch(function(err) {
          $scope.vm.clearErrors();
          $scope.vm.setError("email", err.message);
        });
    }
  }
]);
```
