(function () {
    'use strict';
    angular.module('jApp').factory('ZoneService', ['$http', '$sessionStorage', '$localStorage', '$rootScope', function ($http, $sessionStorage, $localStorage, $rootScope) {

            var service = {};
            /* Get all Zones */
            service.listZones = function () {
                return $http.get($rootScope.appDefaults.apiUrl + 'zoneservice/zones', $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                $localStorage.chmsZones = res.data.data;
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* Get single Zone */
            service.getZone = function (zoneId) {
                return $http.get($rootScope.appDefaults.apiUrl + 'zoneservice/zones/' + zoneId, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* Save Zone */
            service.saveZone = function (formData) {
                return $http.post($rootScope.appDefaults.apiUrl + 'zoneservice/zones', formData, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            /* Update Zone */
            service.updateGroup = function (formData) {
                return $http.put($rootScope.appDefaults.apiUrl + 'zoneservice/zones/' + formData.id, formData, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            /* Delete Zone */
            service.deleteZone = function (zoneId) {
                return $http.delete($rootScope.appDefaults.apiUrl + 'zoneservice/zones/' + zoneId, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            /* activate - deactivate  Zone */
            service.activateZone = function (zoneId, activate) {
                var data = {
                    activate: activate
                };
                return $http.put($rootScope.appDefaults.apiUrl + 'zoneservice/zones/activate/' + zoneId, data, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            service.saveZoneGroups = function (data) {
                return $http.post($rootScope.appDefaults.apiUrl + 'zoneservice/zoness/groups/' + data.zoneId, data, $sessionStorage.apiAuth)
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
