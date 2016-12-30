(function () {
    'use strict';

    angular
        .module('cenApp', ['ngRoute', 'ngResource'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: '/auth/login/login.view.html',
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .when('/app', {
                templateUrl: '/app/app.view.html',
                controller: 'appController',
                controllerAs: 'vm'
            })
            .when('/officers', {
                templateUrl: '/officers/officers.view.html',
                controller: 'officersController',
                controllerAs: 'vm'
            })
            .when('/officers/analysis', {
                templateUrl: '/officers/analysis.view.html',
                controller: 'officersController',
                controllerAs: 'vm'
            })
            .when('/events', {
                templateUrl: '/events/events.view.html',
                controller: 'eventsController',
                controllerAs: 'vm'
            })
            .when('/events/:event_id', {
                templateUrl: '/events/event.view.html',
                controller: 'eventController',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

    run.$inject= ['$rootScope', '$location', 'Authentication'];
    function run($rootScope, $location, Authentication) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
            if ($location.path() === '/app' && !Authentication.isLoggedIn()) {
                $location.path('/');
            }
        });
    }

})();