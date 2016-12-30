(function () {
    angular
        .module('cenApp')
        .service('Authentication', Authentication);

    Authentication.$inject = ['$http', '$window'];
    function Authentication($http, $window) {
        
        // var register = function (user) {
        //     $http.post('auth/signup', user).success(function (data) {
        //        saveToken(data.token);
        //     });
        // };

        var login = function (admin) {
            return $http.post('/auth/login', admin).then(function (data) {
                console.log(data);
                console.log(data.data.token);
                saveToken(data.data.token);
            });
        };
        
        var saveToken = function (token) {
            // console.log(data);
            $window.localStorage['access-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['access-token'];
        };

        var logout = function () {
            $window.localStorage.removeItem('access-token');
        };

        var isLoggedIn = function () {
            var token = getToken();
            var payload;

            if (token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return payload.exp > Date.now() /1000;
            }else{
                return false
            }
        };

        var currentUser = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    username: payload.username,
                    name : payload.name
                };
            }
        };

        return {
            //register: register,
            login: login,
            saveToken: saveToken,
            getToken: getToken,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };
    }
})();