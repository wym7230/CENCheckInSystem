(function () {

    angular
        .module('cenApp')
        .controller('navbarController', navbarController);

    navbarController.$inject = ['$scope','$location','Authentication'];
    function navbarController($scope, $location, Authentication) {
        //var vm = this;

        $scope.isLoggedIn = Authentication.isLoggedIn()

        $scope.currentUser = Authentication.currentUser();

        $scope.logout = function () {
            $scope.isLoggedIn = false
            $scope.currentUser = ""
            Authentication.logout();
        }
    }

})();