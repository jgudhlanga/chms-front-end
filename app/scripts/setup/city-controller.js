(function(){
    'use strict';
    angular.module('jApp').controller('CityCtrl', ['$scope', '$localStorage', '$routeParams','$filter', '$location', '$uibModal','CityService',
    function($scope, $localStorage, $routeParams, $filter, $location, $uibModal, CityService){
        //UI-GRID START
        var paginationOptions = {
            sort: null
        };
        var getPage = function (curPage, pageSize) {
            var firstRow = (curPage - 1) * pageSize;
            $scope.gridOptions.totalItems = ($localStorage.dataCities) ? $localStorage.dataCities.length: 0;
            $scope.gridOptions.data = ($localStorage.dataCities) ? $localStorage.dataCities.slice(firstRow, firstRow + pageSize): [];
        };
        $scope.gridOptions = {
            paginationPageSizes: [11, 22, 33, ($localStorage.dataCities) ? $localStorage.dataCities.length : 100],
            paginationPageSize: 11,
            useExternalPagination: true,
            useExternalSorting: false,
            enableGridMenu: true,
            minRowsToShow: 11,
            enableFiltering: true,
            columnDefs: [
                {field: 'name'},
                {field: 'shortName'},
                {field: 'province'},
                {field: 'status', width: 80},
                {
                    field: 'id',
                    displayName: '',
                    enableCellEdit: false,
                    width: 80,
                    enableFiltering: false,
                    cellTemplate: 'views/setup/city-edit-button.html'
                },
                {
                    field: 'id',
                    displayName: '',
                    enableCellEdit: false,
                    width: 80,
                    enableFiltering: false,
                    cellTemplate: 'views/setup/city-delete-button.html'
                }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (getPage) {
                        if (sortColumns.length > 0) {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        } else {
                            paginationOptions.sort = null;
                        }
                        getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize);
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if (getPage) {
                        getPage(newPage, pageSize);
                    }
                });
            }
        };

        getPage(1, $scope.gridOptions.paginationPageSize);
        //UI-GRID END

        //list cities
        if ($localStorage.dataCities) {
            $scope.dataCities = $localStorage.dataCities;
        }

        //list provinces
        if ($localStorage.dataProvinces) {
            $scope.provinces = $localStorage.dataProvinces;
        }

        //get City from local storage
        function getCityFromLocalStorage(id) {
            var obj;
            //avoid querying the database if it has been saved on the local storage
            $localStorage.dataCities.map(function (item) {
                if (id.toString() === item.id.toString()) {
                    obj = item;
                }
            });
            return obj;
        }


        $scope.city = {};
        if ($routeParams.cityId) {
            if ($localStorage.dataCities) {
                $scope.city = getCityFromLocalStorage($routeParams.cityId);
            } else {
                $scope.processing = true;
                $scope.city = CityService.getCity($routeParams.cityId)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.city = res.data.data;
                            } else {
                                $scope.error = res.data;
                            }
                        })
                        .finally(function () {
                            $scope.processing = false;
                        });
            }
        }

        //CRUD MODAL
        $scope.open = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'add-edit-city.html',
                controller: 'CityModal',
                resolve: {
                    city: function () {
                        return $scope.city;
                    },
                    provinces: function () {
                        return $scope.provinces;
                    },
                    gridData: function(){
                        return $scope.gridOptions.data;
                    }
                }
            });
        };

        // Delete City
        $scope.deleteCity = function (cityId) {
            $scope.busyWait = true;
            CityService.deleteCity(cityId)
                    .then(function (res) {
                        if (res.status === 200) {
                            $scope.message = res.data.message;
                            $scope.messageClass = 'success';
                            //remove the city from the local storage
                            $localStorage.dataCities = $filter('filter')($localStorage.dataCities, function (item) {
                                return item.id !== cityId;
                            });
                            $location.path('/setup/data');
                        } else {
                            $scope.message = res.data;
                            $scope.messageClass = 'danger';
                        }
                    })
                    .finally(function () {
                        $scope.busyWait = false;
                    });
        };

        //Activate Deactivate City
        $scope.activateCity = function (cityId, activate) {
            $scope.busyWait = true;
            CityService.activateCity(cityId, activate)
                    .then(function (res) {
                        if (res.status === 200) {
                            $scope.message = res.data;
                            $scope.messageClass = 'success';
                            $scope.city.isActive = activate;
                        } else {
                            $scope.error = res.data;
                            $scope.messageClass = 'danger';
                        }
                    })
                    .finally(function () {
                        $scope.busyWait = false;
                    });
        };
    }]);
}());
