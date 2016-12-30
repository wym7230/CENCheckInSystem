(function () {
    angular
        .module('cenApp')
        .service('EventOperation', EventOperation);

    EventOperation.$inject = ['$http', '$window'];
    function EventOperation($http, $window) {

        var checkin = function (event_id, officer_id) {
            return $http.put('/api/events/' + event_id + '/checkin/' + officer_id);
        };

        var uncheckin = function (event_id, officer_id) {
            return $http.put('/api/events/' + event_id + '/uncheckin/' + officer_id)
        };

        var vacate = function (event_id, officer_id) {
            return $http.put('/api/events/' + event_id + '/vacate/' + officer_id)
        };

        var unvacate = function (event_id, officer_id) {
            return $http.put('/api/events/' + event_id + '/unvacate/' + officer_id)
        };

        var remove = function (event_id, officer_id) {
            return $http.put('/api/events/' + event_id + '/rm/' + officer_id)
        };

        return {
            checkin: checkin,
            uncheckin: uncheckin,
            vacate: vacate,
            unvacate: unvacate,
            remove: remove
        };
    }
})();