(function () {
    'use strict';

    angular
        .module('cenApp', ['ngRoute', 'ngResource', 'angular-momentjs'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$momentProvider'];
    function config ($routeProvider, $locationProvider, $momentProvider) {
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
            .when('/officers/edit/:officer_id', {
                templateUrl: '/officers/edit.view.html',
                controller: 'officersUpdateController',
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

        // MomentJS setup
        $momentProvider
            .asyncLoading(false)
            .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');
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