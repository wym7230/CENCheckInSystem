(function () {

    angular
        .module('cenApp')
        .directive('navbarDirective', function () {
            return {
                templateUrl: "./javascripts/directives/navbar/navbar.template.html",
                controller: "navbarController"
            }
        });

})();