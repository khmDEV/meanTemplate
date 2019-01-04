/*
 * Register Controller
 */
Modulo.controller('RegisterController',
  function($scope, $rootScope, $http, $window) {
    var clientID = "3e6d7f6573ee5e8ee8a3";

    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})(\.([a-z]{2,6}(?:\.[a-z]{2})?))?$/i;
      return re.test(email);
    }
    $scope.register = function(usr, mail, pass, pass2) {
      if (!validateEmail(mail)) {
        showMessage("Direción de correo no valido");
      } else if (pass != pass2) {
        showMessage("La contraseña y su confirmacion no son iguales");
      } else if (pass.length < 6) {
        showMessage("La contraseña debe tener una longitud mayor a 6 caracteres");
      } else if (usr.length < 3) {
        showMessage("El nombre de usuario debe contener al menos 3 caracteres");
      } else {
        showMessage("Registrando usuario...");
        $http.post('/API/user/register', {
          user: usr,
          mail: mail,
          pass: hashing(pass)
        }).success(function(res, status, headers, config) {
          if (res.err == 0) {
            if(res.activated){
              showMessage("Bienvenido " + usr);
              hideRegister();
              $rootScope.sessionStatus($rootScope, $http);
            } else {
              showMessage("Gracias por registrarse. Debera activar su cuenta mediante el correo que se le ha enviado.");
            }
            hideRegister();
          }
        }).
        error(function(data, status, headers, config) {
          if (status == 452) {
            showMessage("Nombre de usuario ya registrado");
          } else if (status == 453) {
            showMessage("Direción de correo ya registrada");
          } else if (status == 400) {
            showMessage("Datos erroneos");
          } else if (status == 500) {
            showMessage("Error interno, no se ha podido enviar el correo de activación");
          }else{
            showMessage("Error interno, pruebe más tarde");
          }
        });
      }
      setTimeout(hideMessage, TIME_MESSAGE);
    }
  });

Modulo.controller('ActivateController', function($scope, $routeParams, $rootScope, $http, $location) {
  if ($routeParams.userid) {
    $http.post('/API/activate', {
      userid: $routeParams.userid,
      secret: $routeParams.secret
    }).
    success(function(res, status, headers, config) {
      if (res.err == 0) {
        $scope.msg = "Se ha activado su cuenta";
        $rootScope.sessionStatus($rootScope, $http);
      } else if (res.err == 1) {
        $scope.msg = "La cuenta ya estaba activada";
      } else {
        $scope.msg = "Codigo de activación erroneo";
      }
    }).
    error(function(data, status, headers, config) {
      $scope.msg = "Error interno, pruebe más tarde";
    });
  } else if ($routeParams.code) {
    $http.post('/API/loginGitHub', {
      code: $routeParams.code
    }).
    success(function(res, status, headers, config) {
      if (res.err == 0) {
        $rootScope.sessionStatus($rootScope, $http);
        $location.path("/");
      }
    }).
    error(function(data, status, headers, config) {
      if (status==403) {
        $scope.msg = "No te has podido loguear";
      }else{
        $scope.msg = "Error interno, pruebe más tarde";
      }
    });
    setTimeout(hideMessage, TIME_MESSAGE);

  }
});
