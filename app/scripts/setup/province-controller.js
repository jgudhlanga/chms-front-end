(function(){
    'use strict';
    angular.module('jApp').controller('ProvinceCtrl', ['$scope', '$localStorage', '$routeParams','$filter', '$location', '$uibModal','ProvinceService',
    function($scope, $localStorage, $routeParams, $filter, $location, $uibModal, ProvinceService){
        //UI-GRID START
        var paginationOptions = {
            sort: null
        };
        var getPage = function (curPage, pageSize) {
            var firstRow = (curPage - 1) * pageSize;
            $scope.gridOptions.totalItems = ($localStorage.dataProvinces) ? $localStorage.dataProvinces.length : 100;
            $scope.gridOptions.data = ($localStorage.dataProvinces) ? $localStorage.dataProvinces.slice(firstRow, firstRow + pageSize) : [];
        };
        $scope.gridOptions = {
            paginationPageSizes: [11, 22, 33, ($localStorage.dataProvinces) ? $localStorage.dataProvinces.length : ''],
            paginationPageSize: 11,
            useExternalPagination: true,
            useExternalSorting: false,
            enableGridMenu: true,
            minRowsToShow: 11,
            enableFiltering: true,
            columnDefs: [
                {field: 'name'},
                {field: 'alias', displayName: 'Short Name'},
                {field: 'status', width: 80},
                {
                    field: 'id',
                    displayName: '',
                    enableCellEdit: false,
                    width: 80,
                    enableFiltering: false,
                    cellTemplate: 'views/setup/province-edit-button.html'
                },
                {
                    field: 'id',
                    displayName: '',
                    enableCellEdit: false,
                    width: 80,
                    enableFiltering: false,
                    cellTemplate: 'views/setup/province-delete-button.html'
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

        //list provinces
        if ($localStorage.dataProvinces) {
            $scope.dataProvinces = $localStorage.dataProvinces;
        }

        //get Province from local storage
        function getProvinceFromLocalStorage(id) {
            var obj;
            //avoid querying the database if it has been saved on the local storage
            $localStorage.dataProvinces.map(function (item) {
                if (id.toString() === item.id.toString()) {
                    obj = item;
                }
            });
            return obj;
        }


        $scope.province = {};
        if ($routeParams.provinceId) {
            if ($localStorage.dataProvinces) {
                $scope.province = getProvinceFromLocalStorage($routeParams.provinceId);
            } else {
                $scope.processing = true;
                $scope.province = ProvinceService.getProvince($routeParams.provinceId)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.province = res.data.data;
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
                templateUrl: 'add-edit-province.html',
                controller: 'ProvinceModal',
                resolve: {
                    province: function () {
                        return $scope.province;
                    },
                    gridData: function(){
                        return $scope.gridOptions.data;
                    }
                }
            });
        };

        // Delete Province
        $scope.deleteProvince = function (provinceId) {
            $scope.busyWait = true;
            ProvinceService.deleteProvince(provinceId)
                    .then(function (res) {
                        if (res.status === 200) {
                            $scope.message = res.data.message;
                            $scope.messageClass = 'success';
                            //remove the family from the local storage
                            $localStorage.dataProvinces = $filter('filter')($localStorage.dataProvinces, function (item) {
                                return item.id !== provinceId;
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

        //Activate Deactivate Province
        $scope.activateProvince = function (provinceId, activate) {
            $scope.busyWait = true;
            ProvinceService.activateProvince(provinceId, activate)
                    .then(function (res) {
                        if (res.status === 200) {
                            $scope.message = res.data;
                            $scope.messageClass = 'success';
                            $scope.province.isActive = activate;
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
