(function () {
    'use strict';
    angular.module('jApp').factory('CellGroupService', ['$http', '$sessionStorage', '$localStorage', '$rootScope', function ($http, $sessionStorage, $localStorage, $rootScope) {

            var service = {};
            /* Get all Cell Groups */
            service.listCellGroups = function () {
                return $http.get($rootScope.appDefaults.apiUrl + 'groupservice/groups', $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                $localStorage.chmsGroups = res.data.data;
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* Get single Cell Group */
            service.getCellGroup = function (groupId) {
                return $http.get($rootScope.appDefaults.apiUrl + 'groupservice/groups/' + groupId, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* Save Cell Group */
            service.saveGroup = function (formData) {
                return $http.post($rootScope.appDefaults.apiUrl + 'groupservice/groups', formData, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            /* Update Cell Group */
            service.updateGroup = function (formData) {
                return $http.put($rootScope.appDefaults.apiUrl + 'groupservice/groups/' + formData.id, formData, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            /* Delete Cell Group */
            service.deleteGroup = function (groupId) {
                return $http.delete($rootScope.appDefaults.apiUrl + 'groupservice/groups/' + groupId, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* activate - deactivate  Cell Group */
            service.activateGroup = function (groupId, activate) {
                var data = {
                    activate: activate
                };
                return $http.put($rootScope.appDefaults.apiUrl + 'groupservice/groups/activate/' + groupId, data, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            service.saveGroupMembers = function (data, groupId) {
                return $http.post($rootScope.appDefaults.apiUrl + 'groupservice/groups/membership/' + groupId, data, $sessionStorage.apiAuth)
                    .then(function (res) {
                        if (res.status === 200) {
                                return res;
                        }
                    },
                    function (msg) {
                        return msg;
                    });
            };

            /* Delete Group Member */
            service.deleteGroupMember = function (id) {
                return $http.delete($rootScope.appDefaults.apiUrl + 'groupservice/groups/membership/' + id, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        }),
                        function (msg) {
                            return msg;
                        };
            };

            return service;
        }]);
}());
