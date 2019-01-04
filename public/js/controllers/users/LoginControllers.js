
/*
 * Login Controller
 */
Modulo.controller('LoginController',
  function($scope, $rootScope, $http, $window) {

    $scope.sendActivation= function(usr, pass, mail) {
      showMessage("Enviando correo...");
      var v = {
        user: usr,
        pass: hashing(pass)
      };
      if (mail != undefined) {
        v.mail = mail;
      }
      $http.post('/API/user/sendActivation', v).
      success(function(res, status, headers, config) {
        if (res.err == 0) {
          showMessage("Se le ha enviado el correo de activación");
        } else {
          showMessage("Disculpe las molestias, pero actualmente no se le puede enviar el correo");
        }
        setTimeout(hideMessage, TIME_MESSAGE);
      }).
      error(function(data, status, headers, config) {
        showMessage("Error interno, pruebe más tarde");
      });
    }

    $scope.login = function(usr, pass) {
      showMessage("Entrando...");
      $http.post('/API/user/login', {
        user: usr,
        pass: hashing(pass)
      }).success(function(res, status, headers, config) {
        if (res.err == 0) {
          showMessage("Bienvenido " + usr);
          hideLogin();
          $rootScope.sessionStatus($rootScope, $http);
          setTimeout(hideMessage, TIME_MESSAGE);
        }
      }).
      error(function(data, status, headers, config) {
        if (status == 403) {
          showMessage("Usuario y/o contraseña incorrectos");
        } else if (status == 401) {
          confirm("Cuenta no activada, ¿desea que le volvamos a enviar el correo de activación?", function() {
            $scope.sendActivation(usr, pass, undefined);
            hideConfirm();
          }, hideConfirm);
        }else{
          showMessage("Error interno, pruebe más tarde");
        }
        setTimeout(hideMessage, TIME_MESSAGE);

      });
    }

    $scope.logout = function() {
      showMessage("Saliendo...");
      $http.post('/API/user/logout')
        .success(function(data) {
          if (!data.err) {
            showMessage("¡Hasta otra " + $rootScope.user.name + "!");
            $rootScope.user = undefined;
          } else {
            showMessage("Eing");
          }
        })
        .error(function(err) {
          showMessage("Error interno, pruebe más tarde");
        });
      setTimeout(hideMessage, TIME_MESSAGE);

    }
  });
