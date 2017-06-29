/* globals AppConfig*/
(function(){
    'use strict';
    var config = new AppConfig();
    angular.module(config.appModuleName).factory('CityService',['$http', '$sessionStorage', '$localStorage', '$rootScope',
    function($http, $sessionStorage, $localStorage, $rootScope){
        //initialize the service
        var service = {};

        //get all the cities
        service.getAllCities = function(){
            return $http.get($rootScope.appDefaults.apiUrl + 'dataservice/cities', $sessionStorage.apiAuth)
            .then(function(res){
                if(res.status === 200){
                    $localStorage.dataCities = res.data.data;
                    return res;
                }
            },
            function(msg){
                return msg;
            });
        };
        //get city
        service.getCity = function(id){
            return $http.get($rootScope.appDefaults.apiUrl + 'dataservice/cities' + id, $sessionStorage.apiAuth)
            .then(function(res){
                if(res.status === 200){
                    return res;
                }
            },
            function(msg){
                return msg;
            });
        };
        //create a city
        service.saveCity = function(data){
            return $http.post($rootScope.appDefaults.apiUrl + 'dataservice/cities' , data , $sessionStorage.apiAuth)
            .then(function(res){
                return res;
            },
            function(msg){
                return msg;
            });
        };

        /* update city */
        service.updateCity = function (formData, id)
        {
            return $http.put($rootScope.appDefaults.apiUrl + 'dataservice/cities/' + id, formData, $sessionStorage.apiAuth)
            .then(function (res) {
                if (res.status === 200) {
                    return res;
                }
            },
            function (msg) {
                return msg;
            });
        };
        /* activate - deactivate  city */
        service.activateCity = function (id, active)
        {
            var data = {
                activate: active
            };
            return $http.put($rootScope.appDefaults.apiUrl + 'dataservice/cities/activate/' + id, data, $sessionStorage.apiAuth)
            .then(function (res) {
                if (res.status === 200) {
                    return res;
                }
            },
            function (msg) {
                return msg;
            });
        };

        /* delete city */
        service.deleteCity = function (id){
            return $http.delete($rootScope.appDefaults.apiUrl + 'dataservice/cities/' + id, $sessionStorage.apiAuth)
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
