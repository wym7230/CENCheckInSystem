(function () {
    angular
        .module('cenApp')
        .factory('OfficerService', OfficerService);

    OfficerService.$inject = ['$resource'];
    function OfficerService($resource) {
            return $resource('api/officers/:id');
    }
})();