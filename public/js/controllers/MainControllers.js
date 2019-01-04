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
  $rootScope.titleName = "khmDEV";

  /*
   * Main Controller
   */

});
