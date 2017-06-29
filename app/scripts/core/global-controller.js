(function () {
    'use strict';
    angular.module('jApp')
            .controller('GlobalCtrl', ['$scope', 'GlobalService', 'AuthService', 'MembersService', 'CellGroupService', 'FamilyService', 'ZoneService', 'DepartmentService','CityService', 'ProvinceService','$location', '$sessionStorage', '$localStorage', '$window',
                function ($scope, GlobalService, AuthService, MembersService, CellGroupService, FamilyService, ZoneService, DepartmentService, CityService, ProvinceService, $location, $sessionStorage, $localStorage, $window) {

                    //Animate view class
                    $scope.viewClass = 'main-view';
                    //login
                    $scope.credentials = {};
                    $scope.login = function () {
                        $scope.processing = true;
                        if (!AuthService.isLoggedIn) {
                            AuthService.login($scope.credentials)
                                    .then(function (res) {
                                        if (res.status === 200) {
                                            $window.location.reload();
                                        } else {
                                            $scope.error = res.data;
                                        }
                                    })
                                    .finally(function () {
                                        $scope.processing = false;
                                    });
                        }
                    };
                    //logout
                    $scope.logout = function () {
                        AuthService.logout();
                        $location.path('/');
                        $window.location.reload();
                    };

                    $scope.isLoggedIn = false;
                    if ($sessionStorage.accessToken) {

                        $scope.isLoggedIn = true;

                        /* LOAD CHMS DATA */

                        //get the logged in user
                        if ($sessionStorage.loggedUser) {
                            $scope.loggedUser = $sessionStorage.loggedUser;
                        } else {
                            $scope.loadingUser = true;
                            $scope.loggedUser = GlobalService.getUser()
                            .then(function (res) {
                                if (res.status === 200) {
                                    $scope.loggedUser = res.data;
                                } else {
                                    $scope.error = res.data;
                                }
                            })
                            .finally(function () {
                                $scope.loadingUser = false;
                            });
                        }

                        // the modules
                        if ($localStorage.chmsModules) {
                            $scope.chmsModules = $localStorage.chmsModules;
                        } else {
                            $scope.loadingModules = true;
                            $scope.chmsModules = GlobalService.listModules()
                            .then(function (res) {
                                if (res.status === 200) {
                                    $scope.chmsModules = res.data.data;
                                } else {
                                    $scope.error = res.data;
                                }
                            })
                            .finally(function () {
                                $scope.loadingModules = false;
                            });
                        }

                        // chms members
                        if (!$localStorage.chmsMembers) {
                            MembersService.getMembers()
                            .then(function (res) {
                                if (res.status !== 200) {
                                    $scope.error = (res.data) ? res.data : '';
                                }
                            });
                        }
                        //cell groups
                        if (!$localStorage.chmsGroups) {
                            CellGroupService.listCellGroups()
                                    .then(function (res) {
                                        if (res.status !== 200) {
                                            $scope.error = (res.data) ? res.data : '';
                                        }
                                    });
                        }

                        //families
                        if (!$localStorage.chmsFamilies) {
                            FamilyService.getFamilies()
                                    .then(function (res) {
                                        if (res.status !== 200) {
                                            $scope.error = res.data;
                                        }
                                    });
                        }

                        //zones
                        if (!$localStorage.chmsZones) {
                            ZoneService.listZones()
                                    .then(function (res) {
                                        if (res.status !== 200) {
                                            $scope.error = res.data;
                                        }
                                    });
                        }
                        //Departments
                        if (!localStorage.chmsDepartments) {
                            DepartmentService.getAllDepartments()
                            .then(function (res) {
                                if (res.status !== 200) {
                                    $scope.error = res.data;
                                }
                            });
                        }
                        //Province
                        if (!localStorage.dataProvinces) {
                            ProvinceService.getAllProvinces()
                            .then(function (res) {
                                if (res.status !== 200) {
                                    $scope.error = res.data;
                                }
                            });
                        }
                        //Cities
                        if (!localStorage.dataCities) {
                            CityService.getAllCities()
                            .then(function (res) {
                                if (res.status !== 200) {
                                    $scope.error = res.data;
                                }
                            });
                        }
                    }

                    //Menu Icons
                    $scope.menuIcons = GlobalService.jdevMenuIcons;
                }]);
}());
