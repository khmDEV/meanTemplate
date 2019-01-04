angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {

    $routeProvider

    // home page
      .when('/', {
        templateUrl: 'views/home/homepage.html',
        controller: 'MainController',
        reloadOnSearch: false
      });


    $locationProvider.html5Mode(true);

  }
]);
