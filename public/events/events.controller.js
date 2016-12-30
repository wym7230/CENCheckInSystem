(function () {
    angular
        .module("cenApp")
        .controller('eventsController', eventsController);


    eventsController.$inject = ['$scope','$location', 'EventsService'];
    function eventsController($scope, $location, EventsService) {
        var vm = this;

        vm.events = EventsService.query();

        vm.toCheckIn = function (event_id) {
            $location.path('events/' + event_id);
        };

        vm.deleteEvent = function (event) {
            EventsService.delete({event_id: event._id}, function () {
                vm.events = EventsService.query();
            });
        };

        vm.newEvent ={
            name: "",
            start_time: ""
        };

        vm.addEvent = function () {
            EventsService.save(vm.newEvent, function (event) {
                if(event.name) {
                    console.log(event);
                    vm.events = EventsService.query();
                }else{
                    alert("Event already existed");
                }
            })

        }

    }
})();