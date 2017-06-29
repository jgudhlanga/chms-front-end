(function(){
    'use strict';
    angular.module('jApp').factory('ProvinceService',['$http', '$sessionStorage', '$localStorage', '$rootScope',
    function($http, $sessionStorage, $localStorage, $rootScope){
        //initialize the service
        var service = {};

        //get all the provinces
        service.getAllProvinces = function(){
            return $http.get($rootScope.appDefaults.apiUrl + 'dataservice/provinces', $sessionStorage.apiAuth)
            .then(function(res){
                if(res.status === 200){
                    $localStorage.dataProvinces = res.data.data;
                    return res;
                }
            },
            function(msg){
                return msg;
            });
        };
        //get province
        service.getProvince = function(id){
            return $http.get($rootScope.appDefaults.apiUrl + 'dataservice/provinces/' + id, $sessionStorage.apiAuth)
            .then(function(res){
                if(res.status === 200){
                    return res;
                }
            },
            function(msg){
                return msg;
            });
        };
        //create a province
        service.saveProvince = function(data){
            return $http.post($rootScope.appDefaults.apiUrl + 'dataservice/provinces', data, $sessionStorage.apiAuth)
            .then(function(res){
                return res;
            },
            function(msg){
                return msg;
            });
        };

        /* update province */
        service.updateProvince = function (formData, id)
        {
            return $http.put($rootScope.appDefaults.apiUrl + 'dataservice/provinces/' + id, formData, $sessionStorage.apiAuth)
            .then(function (res) {
                if (res.status === 200) {
                    return res;
                }
            },
            function (msg) {
                return msg;
            });
        };
        /* activate - deactivate  province */
        service.activateProvince = function (id, active)
        {
            var data = {
                activate: active
            };
            return $http.put($rootScope.appDefaults.apiUrl + 'dataservice/provinces/activate/' + id, data, $sessionStorage.apiAuth)
            .then(function (res) {
                if (res.status === 200) {
                    return res;
                }
            },
            function (msg) {
                return msg;
            });
        };

        /* delete province */
        service.deleteProvince = function (id){
            return $http.delete($rootScope.appDefaults.apiUrl + 'dataservice/provinces/' + id, $sessionStorage.apiAuth)
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
