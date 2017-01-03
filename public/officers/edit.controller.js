(function () {
    angular
        .module("cenApp")
        .controller('officersUpdateController', officersUpdateController);


    officersUpdateController.$inject = ['$location', '$routeParams', 'OfficerService', '$http'];
    function officersUpdateController($location,$routeParams, OfficerService, $http) {
        var vm = this;
        vm.errorMessage = "";
        var officerID = $routeParams.officer_id;


        vm.currentOfficer = OfficerService.get({id: officerID});

        var url = "/api/officers/" + officerID;

        vm.update = function () {
            vm.errorMessage = "";
            $http.put(url, vm.currentOfficer)
                .then(function successCallback(response){
                        $location.path('officers');
                        console.log(response);
                    }, function errorCallback(response) {
                        vm.errorMessage = response.data;
                        console.log(response);
                });
        };


        vm.delete = function () {
            OfficerService.delete({id: officerID}, function (data) {
                console.log(data);
                if(!data.active){
                    $location.path('officers')
                }
            });
        }

    }
})();