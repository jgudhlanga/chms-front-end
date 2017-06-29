(function () {
    'use strict';
    angular.module('jApp').controller('ZonesCtrl', ['$scope', 'ZoneService', '$routeParams', '$location', '$localStorage', '$filter', '$uibModal',
        function ($scope, ZoneService, $routeParams, $location, $localStorage, $filter, $uibModal) {
            //UI-GRID START
            var paginationOptions = {
                sort: null
            };
            var getPage = function (curPage, pageSize) {
                var firstRow = (curPage - 1) * pageSize;
                $scope.gridOptions.totalItems = $localStorage.chmsZones.length;
                $scope.gridOptions.data = $localStorage.chmsZones.slice(firstRow, firstRow + pageSize);
            };
            $scope.gridOptions = {
                paginationPageSizes: [11, 22, 33, $localStorage.chmsZones.length],
                paginationPageSize: 11,
                useExternalPagination: true,
                useExternalSorting: false,
                enableGridMenu: true,
                minRowsToShow: 11,
                enableFiltering: true,
                columnDefs: [
                    {field: 'name'},
                    {field: 'meetingLocation', cellTooltip: true},
                    {field: 'dateFormed'},
                    {field: 'groups', width: 110},
                    {field: 'zoneLeader'},
                    {field: 'status', width: 80},
                    {
                        field: 'id',
                        displayName: '',
                        enableCellEdit: false,
                        width: 80,
                        enableFiltering: false,
                        cellTemplate: 'views/zones/zone-view-button.html'
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

            $scope.getTableHeight = function () {
                var rowHeight = 10; // your row height
                var headerHeight = 30; // your header height
                return {
                    height: ($scope.gridOptions.paginationPageSize * (rowHeight + headerHeight)) + 'px'
                };
            };
            //UI-GRID END

            //Get the chms members
            if ($localStorage.chmsMembers) {
                $scope.chmsMembership = $localStorage.chmsMembers;
            }
            //list zones
            if ($localStorage.chmsZones) {
                $scope.chmsZones = $localStorage.chmsZones;
            }

            //list groups
            if ($localStorage.chmsGroups) {
                $scope.chmsGroups = $localStorage.chmsGroups;
            }

            //get Zone from local storage
            function getZoneFromLocalStorage(id) {
                var obj;
                //avoid querying the database if it has been saved on the local storage
                $localStorage.chmsZones.map(function (item) {
                    if (id.toString() === item.id.toString()) {
                        obj = item;
                    }
                });
                return obj;
            }


            $scope.chmsZone = {};
            if ($routeParams.zoneId) {
                if ($localStorage.chmsZones) {
                    $scope.chmsZone = getZoneFromLocalStorage($routeParams.zoneId);
                } else {
                    $scope.processing = true;
                    $scope.chmsZone = ZoneService.getZone($routeParams.zoneId)
                            .then(function (res) {
                                if (res.status === 200) {
                                    $scope.chmsZone = res.data.data;
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
                    templateUrl: 'add-edit-zone.html',
                    controller: 'ZoneModal',
                    resolve: {
                        chmsMembership: function () {
                            return $scope.chmsMembership;
                        },
                        chmsZone: function () {
                            return $scope.chmsZone;
                        },
                        gridData: function(){
                            return $scope.gridOptions.data;
                        }
                    }
                });
            };

            // Delete Zone
            $scope.deleteZone = function (zoneId) {
                $scope.busyWait = true;
                ZoneService.deleteZone(zoneId)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.message = res.data.message;
                                $scope.messageClass = 'success';
                                //remove the zone from the local storage
                                $localStorage.chmsZones = $filter('filter')($localStorage.chmsZones, function (item) {
                                    return item.id !== zoneId;
                                });
                                $location.path('/zones');
                            } else {
                                $scope.message = res.data;
                                $scope.messageClass = 'danger';
                            }
                        })
                        .finally(function () {
                            $scope.busyWait = false;
                        });
            };

            //Activate Deactivate Zone
            $scope.activateZone = function (zoneId, activate) {
                $scope.busyWait = true;
                ZoneService.activateZone(zoneId, activate)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.message = res.data;
                                $scope.messageClass = 'success';
                                $scope.chmsZone.isActive = activate;
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
