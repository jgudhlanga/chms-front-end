(function () {
    'use strict';
    angular.module('jApp').controller('FamilyCtrl', ['$scope', 'FamilyService', '$routeParams', '$location', '$localStorage', '$filter', '$uibModal',
        function ($scope, FamilyService, $routeParams, $location, $localStorage, $filter, $uibModal) {

            //LOAD ALL FAMILES
            if ($localStorage.chmsFamilies) {
                $scope.chmsFamilies = $localStorage.chmsFamilies;
            }
            else{
                $scope.loading = true;
                FamilyService.getFamilies()
                .then(function (res) {
                    if (res.status !== 200) {
                        $scope.error = res.data;
                    }
                })
                .finally(function(){
                    $scope.loading = false;
                });
            }

            //UI-GRID START
            var paginationOptions = {
                sort: null
            };
            var getPage = function (curPage, pageSize) {
                var firstRow = (curPage - 1) * pageSize;
                $scope.gridOptions.totalItems = ($localStorage.chmsFamilies) ? $localStorage.chmsFamilies.length : 0;
                $scope.gridOptions.data = ($localStorage.chmsFamilies) ? $localStorage.chmsFamilies.slice(firstRow, firstRow + pageSize) : [];
            };
            $scope.gridOptions = {
                paginationPageSizes: [11, 22, 33, ($localStorage.chmsFamilies) ? $localStorage.chmsFamilies.length : ''],
                paginationPageSize: 11,
                useExternalPagination: true,
                useExternalSorting: false,
                enableGridMenu: true,
                minRowsToShow: 11,
                enableFiltering: true,
                columnDefs: [
                    {field: 'name'},
                    {field: 'location', displayName: 'Address',cellTooltip: true},
                    {field: 'membership', width: 110},
                    {field: 'familyHead'},
                    {field: 'status', width: 80},
                    {
                        field: 'id',
                        displayName: '',
                        enableCellEdit: false,
                        width: 80,
                        enableFiltering: false,
                        cellTemplate: 'views/families/family-view-button.html'
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

            //get Family from local storage
            function getFamilyFromLocalStorage(id) {
                var obj;
                //avoid querying the database if it has been saved on the local storage
                $localStorage.chmsFamilies.map(function (item) {
                    if (id.toString() === item.id.toString()) {
                        obj = item;
                    }
                });
                return obj;
            }


            $scope.chmsFamily = {};
            if ($routeParams.familyId) {
                if ($localStorage.chmsFamilies) {
                    $scope.chmsFamily = getFamilyFromLocalStorage($routeParams.familyId);
                } else {
                    $scope.processing = true;
                    $scope.chmsFamily = FamilyService.getFamily($routeParams.familyId)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.chmsFamily = res.data.data;
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
                    templateUrl: 'add-edit-family.html',
                    controller: 'FamilyModal',
                    resolve: {
                        chmsMembership: function () {
                            return $scope.chmsMembership;
                        },
                        chmsFamily: function () {
                            return $scope.chmsFamily;
                        },
                        gridData: function(){
                            return $scope.gridOptions.data;
                        }
                    }
                });
            };

            // Delete Family
            $scope.deleteFamily = function (familyId) {
                $scope.busyWait = true;
                FamilyService.deleteFamily(familyId)
                .then(function (res) {
                    if (res.status === 200) {
                        $scope.message = res.data.message;
                        $scope.messageClass = 'success';
                        //remove the family from the local storage
                        $localStorage.chmsFamilies = $filter('filter')($localStorage.chmsFamilies, function (item) {
                            return item.id !== familyId;
                        });
                        $location.path('/families');
                    } else {
                        $scope.message = res.data;
                        $scope.messageClass = 'danger';
                    }
                })
                .finally(function () {
                    $scope.busyWait = false;
                });
            };

            //Activate Deactivate Family
            $scope.activateFamily = function (familyId, activate) {
                $scope.busyWait = true;
                FamilyService.activateFamily(familyId, activate)
                .then(function (res) {
                    if (res.status === 200) {
                        var message = (activate === 1) ? 'activated' : 'deactivated';
                        $scope.message = 'Family successfully ' + message;
                        $scope.messageClass = 'success';
                        $scope.chmsFamily= res.data.data;
                        //update the Local Storage
                        if($localStorage.chmsFamilies){
                            for (var i = 0; i < $localStorage.chmsFamilies.length; i++) {
                                if($localStorage.chmsFamilies[i].id === familyId){
                                    $localStorage.chmsFamilies[i] = res.data.data;
                                }
                            }
                        }
                    } else {
                        $scope.error = res.data;
                        $scope.messageClass = 'danger';
                    }
                })
                .finally(function () {
                    $scope.busyWait = false;
                });
            };

            //None Family Members
            //members not cell families
            $scope.noneFamilyMembers = [];
            if ($localStorage.chmsMembers) {
                $localStorage.chmsMembers.map(function (chmsMember) {
                    if (chmsMember.families.data.length === 0) {
                        $scope.noneFamilyMembers.push(chmsMember);
                    }
                });
            }

            //family members
            $scope.familyMembers = {
                familyId: ($routeParams.familyId) ? $routeParams.familyId : 0
            };
            $scope.saveFamilyMembers = function () {
                $scope.savingFamilyMembers = true;
                FamilyService.saveFamilyMembers($scope.familyMembers)
                .then(function (res) {
                    if (res.status === 200) {
                        //update the local storage
                        console.log(res);
                        $localStorage.chmsFamilies.map(function (item) {
                            if (res.data.data.id === item.id) {
                                $scope.chmsFamily = res.data.data;
                                //splice it and update with the new one
                                $localStorage.chmsFamilies = $filter('filter')($localStorage.chmsFamilies, function (oldFamily) {
                                    return oldFamily.id !== res.data.data.id;
                                });
                                $localStorage.chmsFamilies.push(res.data.data);
                            }
                        });
                        var count = 0;
                        res.data.data.familyMembers.data.map(function (item) {
                            $localStorage.chmsMembers.map(function (member) {
                                if (member.id === item.memberId) {
                                    member.families.data.push(item);
                                    //remove the added members from the non family members
                                    $scope.noneFamilyMembers = $filter('filter')($scope.noneFamilyMembers, function (notMember) {
                                        return notMember.id !== item.memberId;
                                    });
                                }
                            });
                            count++;
                        });
                        $scope.modalMessage = 'Members successfully added : Total family members - ' + count;
                    } else {
                        $scope.modalError = res;
                    }
                })
                .finally(function () {
                    $scope.savingFamilyMembers = false;
                });
            };

            //remove family Membership
            $scope.removeFamilyMember = function (id) {
            FamilyService.deleteFamilyMember(id);
            //remove the deleted member from local sessionStorage and add it to noneFamilyMembers
            $scope.chmsFamily.familyMembers.data = $filter('filter')($scope.chmsFamily.familyMembers.data, function (notMember) {
                if (notMember.id === id) {
                    $localStorage.chmsMembers.map(function (chmsMember) {
                        if (notMember.memberId === chmsMember.id) {
                            $scope.noneFamilyMembers.push(chmsMember);
                        }
                    });
                }
                return notMember.id !== id;
            });
            };
        }]);
}());
