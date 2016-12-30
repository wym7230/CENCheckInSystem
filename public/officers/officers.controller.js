(function () {
    angular
        .module("cenApp")
        .controller('officersController', officersController);


    officersController.$inject = ['$scope','$location', 'OfficerService'];
    function officersController($scope, $location, OfficerService) {
        var vm = this;

        vm.officers = OfficerService.query();

        vm.newOfficer ={
            name: ""
        };

        vm.addOfficer = function () {
            OfficerService.save(vm.newOfficer, function (user) {
                if(user.name) {
                    console.log(user);
                    vm.officers.push(user);
                }else{
                    alert("Officer already existed")
                }
            })
              
        }

    }
})();