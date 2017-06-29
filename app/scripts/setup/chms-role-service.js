/* globals AppConfig*/
(function(){
    'use strict';
    var config = new AppConfig();
    angular.module(config.appModuleName).factory('ChmsRoleService', ['$http','$rootScope', '$sessionStorage',
     function($http, $rootScope, $sessionStorage){
        var service = {};
        service.getRoles = function(){
            return $http.get($rootScope.appDefaults.apiUrl + 'securityservice/roles', $sessionStorage.apiAuth)
            .then(function(res){
                if(res.status === 200){
                    return res;
                }
            },
            function(msg){
                return msg;
            });
        };

        /* Get single Role */
        service.getRole = function (id) {
            return $http.get($rootScope.appDefaults.apiUrl + 'securityservice/roles/' + id, $sessionStorage.apiAuth)
                .then(function (res) {
                    if (res.status === 200) {
                        return res;
                    }
                },
                function (msg) {
                    return msg;
                });
        };

        /* Save Role */
        service.saveRole = function (formData) {
            return $http.post($rootScope.appDefaults.apiUrl + 'securityservice/roles', formData, $sessionStorage.apiAuth)
                .then(function (res) {
                    if (res.status === 200) {
                        return res;
                    }
                },
                function (msg) {
                    return msg;
                });
        };

        /* Update Role */
        service.updateRole = function (formData) {
            return $http.put($rootScope.appDefaults.apiUrl + 'securityservice/roles/' + formData.id, formData, $sessionStorage.apiAuth)
                .then(function (res) {
                    if (res.status === 200) {
                        return res;
                    }
                },
                function (msg) {
                    return msg;
                });
        };
        /* Delete Role */
        service.deleteRole = function (id) {
            return $http.delete($rootScope.appDefaults.apiUrl + 'securityservice/roles/' + id, $sessionStorage.apiAuth)
                .then(function (res) {
                    if (res.status === 200) {
                        return res;
                    }
                },
                function (msg) {
                    return msg;
                });
        };

        /* activate - deactivate  Role */
        service.activateRole = function (id, activate) {
            var data = {
                activate: activate
            };
            return $http.put($rootScope.appDefaults.apiUrl + 'secuiservice/roles/activate/' + id, data, $sessionStorage.apiAuth)
                .then(function (res) {
                    if (res.status === 200) {
                        return res;
                    }
                },
                function (msg) {
                    return msg;
                });
        };

        return service;
    }]);
}());
