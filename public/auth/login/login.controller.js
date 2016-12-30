(function () {
    angular
        .module("cenApp")
        .controller('loginController', loginController);


    loginController.$inject = ['$location', 'Authentication'];
    function loginController($location, Authentication) {
        var vm = this;
        vm.credentials = {
            username: "",
            password: ""
        };

        vm.errorMessage = "";

        vm.login = function() {
            vm.errorMessage = "";
            Authentication
                .login(vm.credentials)
                .then(function successCallback(response) {
                        $location.path('app');
                    }, function errorCallback(err) {
                        vm.errorMessage = err.data.message;
                    });
        }
    }
})();