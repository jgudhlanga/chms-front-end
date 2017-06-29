(function () {
    'use strict';
    angular.module('jApp').factory('GlobalService', ['$http', '$sessionStorage', '$localStorage', '$rootScope', function ($http, $sessionStorage, $localStorage, $rootScope) {

            var service = {};
            //1 get the all modules
            service.listModules = function ()
            {
                return $http.get($rootScope.appDefaults.apiUrl + 'moduleservice/modules', $sessionStorage.apiAuth)
                        .then(function (res)
                        {
                            if (res.status === 200) {
                                $localStorage.chmsModules = res.data.data;
                                return res;
                            }
                        },
                        function (msg) {
                            return msg;
                        });
            };

            //get the user who is logged in
            service.getUser = function () {
                return $http.get($rootScope.appDefaults.apiUrl + 'authservice/user', $sessionStorage.apiAuth).then(
                        function (res)
                        {
                            if (res.status === 200) {
                                $sessionStorage.loggedUser = res.data;
                                return res;
                            }
                        },
                        function (msg) {
                            return msg;
                        }
                );
            };

            //menu icons object
            service.jdevMenuIcons = {
                'fa fa-gears': 'fa fa-gears', 'fa fa-database': 'fa fa-database', 'fa fa-calendar': 'fa fa-calendar',
                'fa fa-dashboard': 'fa fa-dashboard', 'fa fa-question-circle': 'fa fa-question-circle', 'fa fa-home': 'fa fa-home',
                'fa fa-group': 'fa fa-group', 'fa fa-folder': 'fa fa-folder', 'fa fa-bar-chart': 'fa fa-line-chart',
                'fa fa-wrench': 'fa fa-wrench'
            };
            return service;
        }]);
}());
