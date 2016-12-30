(function () {
    angular
        .module("cenApp")
        .controller('eventController', eventController);


    eventController.$inject = ['$scope','$location', 'EventsService', '$routeParams','EventOperation'];
    function eventController($scope, $location, EventsService, $routeParams, EventOperation) {
        var vm = this;
        var eventID = $routeParams.event_id;
        vm.event = EventsService.get({event_id: eventID});

        vm.checkin = function (user_id) {
            EventOperation.checkin(eventID, user_id)
                .then(function successCallback(response) {
                    vm.event = EventsService.get({event_id: eventID});
                }, function errorCallback(response) {
                    console.log(response);
                });
        };


        vm.uncheckin = function (user_id) {
            EventOperation.uncheckin(eventID, user_id)
                .then(function successCallback(response) {
                    vm.event = EventsService.get({event_id: eventID});
                }, function errorCallback(response) {
                    console.log(response);
                });
        };

        vm.vacate = function (user_id) {
            EventOperation.vacate(eventID, user_id)
                .then(function successCallback(response) {
                    vm.event = EventsService.get({event_id: eventID});
                }, function errorCallback(response) {
                    console.log(response);
                });
        };

        vm.unvacate = function (user_id) {
            EventOperation.unvacate(eventID, user_id)
                .then(function successCallback(response) {
                    vm.event = EventsService.get({event_id: eventID});
                }, function errorCallback(response) {
                    console.log(response);
                });
        };
    }
})();