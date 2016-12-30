(function () {

    angular
        .module('cenApp')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['$location','Authentication'];
    function navigationCtrl($location, Authentication) {
        var vm = this;

        vm.isLoggedIn = Authentication.isLoggedIn();

        vm.currentUser = Authentication.currentUser();

        vm.logout = Authentication.logout();

    }

})();