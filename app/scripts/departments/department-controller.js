(function () {
    'use strict';
    angular.module('jApp').controller('DepartmentsCtrl', ['$scope', 'DepartmentService', '$routeParams', '$location', '$localStorage', '$filter', '$uibModal',
        function ($scope, DepartmentService, $routeParams, $location, $localStorage, $filter, $uibModal) {
            //UI-GRID START
            var paginationOptions = {
                sort: null
            };
            var getPage = function (curPage, pageSize) {
                var firstRow = (curPage - 1) * pageSize;
                $scope.gridOptions.totalItems = $localStorage.chmsDepartments.length;
                $scope.gridOptions.data = $localStorage.chmsDepartments.slice(firstRow, firstRow + pageSize);
            };
            $scope.gridOptions = {
                paginationPageSizes: [11, 22, 33, $localStorage.chmsDepartments.length],
                paginationPageSize: 11,
                useExternalPagination: true,
                useExternalSorting: false,
                enableGridMenu: true,
                minRowsToShow: 11,
                enableFiltering: true,
                columnDefs: [
                    {field: 'name'},
                    {field: 'dateFormed'},
                    {field: 'membership', width: 110},
                    {field: 'hodNames', displayName: 'HOD'},
                    {field: 'status', width: 80},
                    {
                        field: 'id',
                        displayName: '',
                        enableEdit: false,
                        width: 80,
                        enableFiltering: false,
                        cellTemplate: 'views/departments/department-view-button.html'
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
            //list departments
            if ($localStorage.chmsDepartments) {
                $scope.chmsDepartments = $localStorage.chmsDepartments;
            }

            //get Department from local storage
            function getDepartmentFromLocalStorage(id) {
                var obj;
                //avoid querying the database if it has been saved on the local storage
                $localStorage.chmsDepartments.map(function (item) {
                    if (id.toString() === item.id.toString()) {
                        obj = item;
                    }
                });
                return obj;
            }


            $scope.chmsDepartment = {};
            if ($routeParams.departmentId) {
                if ($localStorage.chmsDepartments) {
                    $scope.chmsDepartment = getDepartmentFromLocalStorage($routeParams.departmentId);
                } else {
                    $scope.processing = true;
                    $scope.chmsDepartment = DepartmentService.getDepartment($routeParams.departmentId)
                            .then(function (res) {
                                if (res.status === 200) {
                                    $scope.chmsDepartment = res.data.data;
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
                    templateUrl: 'add-edit-department.html',
                    controller: 'DepartmentModal',
                    resolve: {
                        chmsMembership: function () {
                            return $scope.chmsMembership;
                        },
                        department: function () {
                            return $scope.chmsDepartment;
                        },
                        gridData: function(){
                            return $scope.gridOptions.data;
                        }
                    }
                });
            };

            // Delete Department
            $scope.deleteDepartment = function (departmentId) {
                $scope.busyWait = true;
                DepartmentService.deleteDepartment(departmentId)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.message = res.data.message;
                                $scope.messageClass = 'success';
                                //remove the department from the local storage
                                $localStorage.chmsDepartments = $filter('filter')($localStorage.chmsDepartments, function (item) {
                                    return item.id !== departmentId;
                                });
                                $location.path('/departments');
                            } else {
                                $scope.message = res.data;
                                $scope.messageClass = 'danger';
                            }
                        })
                        .finally(function () {
                            $scope.busyWait = false;
                        });
            };

            //Activate Deactivate Department
            $scope.activateDepartment = function (departmentId, activate) {
                $scope.busyWait = true;
                DepartmentService.activateDepartment(departmentId, activate)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.message = res.data;
                                $scope.messageClass = 'success';
                                $scope.chmsDepartment.isActive = activate;
                            } else {
                                $scope.error = res.data;
                                $scope.messageClass = 'danger';
                            }
                        })
                        .finally(function () {
                            $scope.busyWait = false;
                        });
            };

            //None Department Members
            //members not in departments
            $scope.noneDepartmentMembers = [];
            if ($localStorage.chmsMembers) {

                $localStorage.chmsMembers.map(function (chmsMember) {
                    if (chmsMember.departments.data.length === 0) {
                        $scope.noneDepartmentMembers.push(chmsMember);
                    }
                });
            }

            //department membership intialize
            $scope.departmentMembers = {};
            $scope.saveDepartmentMembers = function () {
                $scope.savingDepartmentMembers = true;
                DepartmentService.saveDepartmentMembers($scope.departmentMembers, $routeParams.departmentId)
                        .then(function (res) {
                            if (res.status === 200) {
                                var resData = res.data.data;
                                //clear the selected members
                                $scope.departmentMembers = {};
                                //update the local storage
                                var i;
                                for (i = 0; i < $localStorage.chmsDepartments.length; i++) {
                                    if($localStorage.chmsDepartments[i].id === resData.id){
                                        $localStorage.chmsDepartments[i] = resData;
                                        //update the current selected department details
                                        $scope.chmsDepartment = resData;
                                    }
                                }

                                var count = 0;
                                //remove the added members from the non department members
                                resData.departmentMembers.data.map(function (item) {
                                    $localStorage.chmsMembers.map(function (member) {
                                        if (member.id === item.memberId) {
                                            member.departments.data.push(item);
                                            $scope.noneDepartmentMembers = $filter('filter')($scope.noneDepartmentMembers, function (notMember) {
                                                return notMember.id !== item.memberId;
                                            });
                                        }
                                    });
                                    count++;
                                });
                                $scope.modalMessage = 'Members successfully added : Total department members - ' + count;
                            } else {
                                $scope.modalError = res;
                            }
                        })
                        .finally(function () {
                            $scope.savingDepartmentMembers = false;
                        });
            };

            //remove department Membership
            $scope.removeDepartmentMember = function (id) {
                DepartmentService.deleteDepartmentMember(id);
                //remove the deleted member from local sessionStorage and add it to noneDepartmentMembers
                $scope.chmsDepartment.departmentMembers.data = $filter('filter')
                ($scope.chmsDepartment.departmentMembers.data, function (notMember) {
                    if (notMember.id === id) {
                        $localStorage.chmsMembers.map(function (chmsMember) {
                            if (notMember.memberId === chmsMember.id) {
                                $scope.noneDepartmentMembers.push(chmsMember);
                            }
                        });
                    }
                    return notMember.id !== id;
                });

                //update the local storage departments
                var i;
                for (i = 0; i < $localStorage.chmsDepartments.length; i++) {
                    if($localStorage.chmsDepartments[i].id === $scope.chmsDepartment.id){
                        $localStorage.chmsDepartments[i].membership = $scope.chmsDepartment.departmentMembers.data.length;
                    }
                }
            };
        }]);
}());
