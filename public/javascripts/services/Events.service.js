(function () {
    angular
        .module('cenApp')
        .factory('EventsService', EventsService);

    EventsService.$inject = ['$resource'];
    function EventsService($resource) {
        return $resource('api/events/:event_id');
    }
})();