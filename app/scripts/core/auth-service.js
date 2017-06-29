(function () {
    'use strict';
    angular.module('jApp').factory('AuthService', ['$http', '$sessionStorage', '$localStorage', '$rootScope', function ($http, $sessionStorage, $localStorage, $rootScope) {

            //declare the service variable
            var service = {};

            //login
            service.login = function (credentials) {
                return $http.post($rootScope.appDefaults.apiUrl + 'auth', credentials)
                        .then(function (res) {
                            if (res.status === 200)
                            {
                                $sessionStorage.accessToken = res.data.accessToken;
                                $sessionStorage.apiAuth = {
                                    headers: {
                                        'Authorization': 'Bearer ' + res.data.accessToken,
                                        'Accept': 'application/json',
                                    }
                                };

                                return res;
                            }
                        },
                                function (msg) {
                                    return  msg.data.message;
                                });
            };


            //logout the user out of the system, clear the storage
            service.logout = function () {
                //clear the local storage now
                $localStorage.$reset();
                $sessionStorage.$reset();

                this.isLoggedIn = false;
            };

            service.isLoggedIn = ($sessionStorage.accessToken) ? true : false;

            return service;
        }]);
}());
