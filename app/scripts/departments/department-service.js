(function () {
    'use strict';
    angular.module('jApp').factory('DepartmentService',
            ['$http', '$sessionStorage', '$localStorage', '$rootScope',
                function ($http, $sessionStorage, $localStorage, $rootScope) {

                    //initialize the service object to append all the functions
                    var service = {};

                    //Get all the Departments
                    service.getAllDepartments = function () {
                        return $http.get($rootScope.appDefaults.apiUrl + 'departmentservice/departments', $sessionStorage.apiAuth)
                                .then(function (res) {
                                    if (res.status === 200) {
                                        $localStorage.chmsDepartments = res.data.data;
                                        return res;
                                    }
                                },
                                        function (msg) {
                                            return msg;
                                        }
                                );
                    };

                    //get single department
                    service.getDepartment = function (id) {
                        return $http.get($rootScope.appDefaults.apiUrl + 'departmentservice/departments/' + id, $sessionStorage.apiAuth)
                                .then(function (res) {
                                    if (res.status === 200) {
                                        return res;
                                    }
                                }, function (msg) {
                                    return msg;
                                });
                    };
                    //Save Department
                    service.saveDepartment = function (department) {
                        return $http.post($rootScope.appDefaults.apiUrl + 'departmentservice/departments', department, $sessionStorage.apiAuth)
                                .then(function (res) {
                                    if (res.status === 200) {
                                        return res;
                                    }
                                }, function (msg) {
                                    return msg;
                                });
                    };

                    /* Update Department */
                    service.updateDepartment = function (department) {
                        return $http.put($rootScope.appDefaults.apiUrl + 'departmentservice/departments/' + department.id, department, $sessionStorage.apiAuth)
                                .then(function (res) {
                                    if (res.status === 200) {
                                        return res;
                                    }
                                },
                                        function (msg) {
                                            return msg;
                                        });
                    };
                    /* Delete Department */
                    service.deleteDepartment = function (id) {
                        return $http.delete($rootScope.appDefaults.apiUrl + 'departmentservice/department' + id, $sessionStorage.apiAuth)
                                .then(function (res) {
                                    if (res.status === 200) {
                                        return res;
                                    }
                                },
                                        function (msg) {
                                            return msg;
                                        });
                    };

                    /* activate - deactivate  Department */
                    service.activateGroup = function (id, activate) {
                        var data = {
                            activate: activate
                        };
                        return $http.put($rootScope.appDefaults.apiUrl + 'departmentservice/departments/activate/' + id, data, $sessionStorage.apiAuth)
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
