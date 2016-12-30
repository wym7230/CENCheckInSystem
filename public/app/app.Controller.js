(function () {
    angular
        .module("cenApp")
        .controller('appController', loginController);


    loginController.$inject = ['$location', 'Authentication'];
    function loginController($location, Authentication) {
        var vm = this;

        vm.toOfficers = function() {
            $location.path('officers');
        };
        vm.toEvents = function () {
            $location.path('events')
        };
    }
})();