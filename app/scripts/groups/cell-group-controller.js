(function () {
    'use strict';
    angular.module('jApp').controller('GroupsCtrl', ['$scope', 'CellGroupService', '$routeParams', '$location', '$localStorage', '$filter', '$uibModal',
        function ($scope, CellGroupService, $routeParams, $location, $localStorage, $filter, $uibModal) {
            //view class
            $scope.viewClass = 'lumia-view';
            //UI-GRID START
            var paginationOptions = {
                sort: null
            };
            var getPage = function (curPage, pageSize) {
                var firstRow = (curPage - 1) * pageSize;
                $scope.gridOptions.totalItems = $localStorage.chmsGroups.length;
                $scope.gridOptions.data = $localStorage.chmsGroups.slice(firstRow, firstRow + pageSize);
            };
            $scope.gridOptions = {
                paginationPageSizes: [11, 22, 33, $localStorage.chmsGroups.length],
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
                    {field: 'groupZone'},
                    {field: 'membership', width: 110},
                    {field: 'groupLeader'},
                    {field: 'status', width: 80},
                    {
                        field: 'id',
                        displayName: '',
                        enableCellEdit: false,
                        width: 80,
                        enableFiltering: false,
                        cellTemplate: 'views/groups/group-view-button.html'
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
            //list groups
            if ($localStorage.chmsGroups) {
                $scope.chmsGroups = $localStorage.chmsGroups;
            }

            //get Cell Group from local storage
            function getGroupFromLocalStorage(id) {
                var obj;
                //avoid querying the database if it has been saved on the local storage
                $localStorage.chmsGroups.map(function (item) {
                    if (id.toString() === item.id.toString()) {
                        obj = item;
                    }
                });
                return obj;
            }


            $scope.chmsGroup = {};
            if ($routeParams.groupId) {
                if ($localStorage.chmsGroups) {
                    $scope.chmsGroup = getGroupFromLocalStorage($routeParams.groupId);
                } else {
                    $scope.processing = true;
                    $scope.chmsGroup = CellGroupService.getCellGroup($routeParams.groupId)
                            .then(function (res) {
                                if (res.status === 200) {
                                    $scope.chmsGroup = res.data.data;
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
                    templateUrl: 'add-edit-group.html',
                    controller: 'CellGroupModal',
                    resolve: {
                        chmsMembership: function () {
                            return $scope.chmsMembership;
                        },
                        chmsGroup: function () {
                            return $scope.chmsGroup;
                        },
                        gridData: function(){
                            return $scope.gridOptions.data;
                        }
                    }
                });
            };

            // Delete Group
            $scope.deleteGroup = function (groupId) {
                $scope.busyWait = true;
                CellGroupService.deleteGroup(groupId)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.message = res.data.message;
                                $scope.messageClass = 'success';
                                //remove the group from the local storage
                                $localStorage.chmsGroups = $filter('filter')($localStorage.chmsGroups, function (item) {
                                    return item.id !== groupId;
                                });
                                $location.path('/groups');
                            } else {
                                $scope.message = res.data;
                                $scope.messageClass = 'danger';
                            }
                        })
                        .finally(function () {
                            $scope.busyWait = false;
                        });
            };

            //Activate Deactivate Group
            $scope.activateGroup = function (groupId, activate) {
                $scope.busyWait = true;
                CellGroupService.activateGroup(groupId, activate)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.message = res.data;
                                $scope.messageClass = 'success';
                                $scope.chmsGroup.isActive = activate;
                            } else {
                                $scope.error = res.data;
                                $scope.messageClass = 'danger';
                            }
                        })
                        .finally(function () {
                            $scope.busyWait = false;
                        });
            };

            //None Group Members
            //members not cell groups
            $scope.noneGroupMembers = [];
            if ($localStorage.chmsMembers) {

                $localStorage.chmsMembers.map(function (chmsMember) {
                    if (chmsMember.groups.data.length === 0) {
                        $scope.noneGroupMembers.push(chmsMember);
                    }
                });
            }

            //group membership intialize
            $scope.groupMembers = {};
            $scope.saveGroupMembers = function () {
                $scope.savingGroupMembers = true;
                CellGroupService.saveGroupMembers($scope.groupMembers, $routeParams.groupId)
                        .then(function (res) {
                            if (res.status === 200) {
                                var resData = res.data.data;
                                //clear the selected members
                                $scope.groupMembers = {};
                                //update the local storage
                                var i;
                                for (i = 0; i < $localStorage.chmsGroups.length; i++) {
                                    if($localStorage.chmsGroups[i].id === resData.id){
                                        $localStorage.chmsGroups[i] = resData;
                                        //update the current selected group details
                                        $scope.chmsGroup = resData;
                                    }
                                }

                                var count = 0;
                                //remove the added members from the non group members
                                resData.groupMembers.data.map(function (item) {
                                    $localStorage.chmsMembers.map(function (member) {
                                        if (member.id === item.memberId) {
                                            member.groups.data.push(item);
                                            $scope.noneGroupMembers = $filter('filter')($scope.noneGroupMembers, function (notMember) {
                                                return notMember.id !== item.memberId;
                                            });
                                        }
                                    });
                                    count++;
                                });
                                $scope.modalMessage = 'Members successfully added : Total group members - ' + count;
                            } else {
                                $scope.modalError = res;
                            }
                        })
                        .finally(function () {
                            $scope.savingGroupMembers = false;
                        });
            };

            //remove group Membership
            $scope.removeGroupMember = function (id) {
                CellGroupService.deleteGroupMember(id);
                //remove the deleted member from local sessionStorage and add it to noneGroupMembers
                $scope.chmsGroup.groupMembers.data = $filter('filter')
                ($scope.chmsGroup.groupMembers.data, function (notMember) {
                    if (notMember.id === id) {
                        $localStorage.chmsMembers.map(function (chmsMember) {
                            if (notMember.memberId === chmsMember.id) {
                                $scope.noneGroupMembers.push(chmsMember);
                            }
                        });
                    }
                    return notMember.id !== id;
                });

                //update the local storage groups
                var i;
                for (i = 0; i < $localStorage.chmsGroups.length; i++) {
                    if($localStorage.chmsGroups[i].id === $scope.chmsGroup.id){
                        $localStorage.chmsGroups[i].membership = $scope.chmsGroup.groupMembers.data.length;
                    }
                }
            };
        }]);
}());
