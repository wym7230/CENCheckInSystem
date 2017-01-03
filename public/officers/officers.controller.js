(function () {
    angular
        .module("cenApp")
        .controller('officersController', officersController);


    officersController.$inject = ['$scope','$location', 'OfficerService', '$moment'];
    function officersController($scope, $location, OfficerService, $moment) {
        var vm = this;

        vm.officers = OfficerService.query()


        //     function (officers) {
        //     for(var i = 0, len = officers.length; i < len; i++) {
        //         var officer = officers[i];
        //         var ms = officer.total_late_time;
        //         console.log(ms);
        //         var d = $moment.duration(ms);
        //         console.log(d);
        //         var lateTime = Math.floor(d.asHours()) + $moment.utc(ms).format(":mm:ss");
        //         console.log(lateTime);
        //         officer.total_late_time = lateTime;
        //         //officer.attended_numbers = "hi";
        //         console.log("db1 ", officer.total_late_time);
        //
        //     }
        // };

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
              
        };
        
        vm.editOfficer = function (officer) {
            $location.path('officers/edit/' + officer._id);
        };

    }
})();