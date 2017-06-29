(function () {
    'use strict';
    angular.module('jApp').factory('FamilyService', ['$http', '$sessionStorage', '$localStorage', '$rootScope', function ($http, $sessionStorage, $localStorage, $rootScope) {

            var service = {};
            //List all families
            service.getFamilies = function () {
                return $http.get($rootScope.appDefaults.apiUrl + 'familyservice/families', $sessionStorage.apiAuth)
                .then(function (res) {
                    if (res.status === 200) {
                        $localStorage.chmsFamilies = res.data.data;
                        return res;
                    }
                },
                function (msg) {
                    return msg;
                });
            };

            /* Get single Family */
            service.getFamily = function (familyId) {
                return $http.get($rootScope.appDefaults.apiUrl + 'familyservice/families/' + familyId, $sessionStorage.apiAuth)
                    .then(function (res) {
                        if (res.status === 200) {
                            return res;
                        }
                    },
                    function (msg) {
                        return msg;
                    });
            };

            /* Save a Family to the database*/
            service.saveFamily = function (familyData) {
                return $http.post($rootScope.appDefaults.apiUrl + 'familyservice/families', familyData, $sessionStorage.apiAuth)
                    .then(function (res) {
                        if (res.status === 200) {
                            return res;
                        }
                    },
                    function (msg) {
                        return msg;
                    });
            };

            /* update family */
            service.updateFamily = function (familyData) {
                return $http.put($rootScope.appDefaults.apiUrl + 'familyservice/families/' + familyData.id, familyData, $sessionStorage.apiAuth)
                    .then(function (res) {
                        if (res.status === 200) {
                            return res;
                        }
                    }, function (msg) {
                        return msg;
                    });
            };

            /* Delete Family */
            service.deleteFamily = function (familyId) {
                return $http.delete($rootScope.appDefaults.apiUrl + 'familyservice/families/' + familyId, $sessionStorage.apiAuth)
                    .then(function (res) {
                        if (res.status === 200) {
                            return res;
                        }
                    },
                    function (msg) {
                        return msg;
                    });
            };
            /* activate - deactivate  family */
            service.activateFamily = function (familyId, activate) {
                var data = {
                    activate: activate
                };
                return $http.put($rootScope.appDefaults.apiUrl + 'familyservice/families/activate/' + familyId, data, $sessionStorage.apiAuth)
                    .then(function (res) {
                        if (res.status === 200) {
                            return res;
                        }
                    },
                    function (msg) {
                        return msg;
                    });
            };
            /*Save family members */
            service.saveFamilyMembers = function (data) {
                return $http.post($rootScope.appDefaults.apiUrl + 'familyservice/families/membership/' + data.familyId, data, $sessionStorage.apiAuth)
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
})();
