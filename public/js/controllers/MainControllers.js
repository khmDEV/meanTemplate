var MAXLINES = 2;

var Modulo = angular.module('Controllers', []);
var TIME_MESSAGE = 2000;

/*
 * Auxiliar function
 */
function hashing(val) {
  return CryptoJS.SHA256(val).toString(CryptoJS.enc.Hex);
}

Modulo.controller('MainController', function($scope, $rootScope, $http) {
  $rootScope.TitleName = "khmDEV";
  $rootScope.TitleName = $rootScope.PageName;

  /*
   * Main Controller
   */
   $rootScope.sessionStatus=function($scope, $http) {
        $http.get('/API/user/sessionStatus')
          .success(function(data) {
            if (data.userid != undefined) {
              $scope.user = {};
              $scope.user.name = data.name;
              $scope.user._id = data.userid;
              $scope.user.avatar = data.avatar;
              $scope.user.ghid = data.ghid;
            } else {
              $scope.user = undefined;
            }
          })
          .error(function(err) {
            $scope.user = undefined;
          });
       }
   $rootScope.sessionStatus($rootScope, $http);
});
