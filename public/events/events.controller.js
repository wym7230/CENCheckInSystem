(function () {
    angular
        .module("cenApp")
        .controller('eventsController', eventsController);


    eventsController.$inject = ['$scope','$location', 'EventsService','$moment'];
    function eventsController($scope, $location, EventsService, $moment) {
        var vm = this;

        vm.events = updateEventsList();

        vm.toCheckIn = function (event_id) {
            $location.path('events/' + event_id);
        };

        vm.deleteEvent = function (event) {
            EventsService.delete({event_id: event._id}, function () {
                vm.events = updateEventsList();
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
                    vm.events = updateEventsList();
                }else{
                    alert("Event already existed");
                }
            })

        }


        function updateEventsList () {
            var events = EventsService.query(function (events) {
                for(var i = 0, len = events.length; i < len; i++) {
                    var event = events[i];
                    event.start_time = $moment(event.start_time)

                }
            });
            return events;
        }

    }
})();