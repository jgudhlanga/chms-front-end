(function () {
    'use strict';
    angular.module('jApp').controller('MembersCtrl', ['$scope', 'MembersService', '$routeParams', '$location', '$localStorage', '$uibModal', '$filter',
        function ($scope, MembersService, $routeParams, $location, $localStorage, $uibModal, $filter) {

            //view class
            $scope.viewClass = 'main-view';
            //UI-GRID START
            var paginationOptions = {
                sort: null
            };
            var getPage = function (curPage, pageSize) {
                var firstRow = (curPage - 1) * pageSize;
                $scope.gridOptions.totalItems = $localStorage.chmsMembers.length;
                $scope.gridOptions.data = $localStorage.chmsMembers.slice(firstRow, firstRow + pageSize);
            };
            $scope.gridOptions = {
                paginationPageSizes: [11, 22, 33, $localStorage.chmsMembers.length],
                paginationPageSize: 11,
                useExternalPagination: true,
                useExternalSorting: false,
                enableGridMenu: true,
                minRowsToShow: 11,
                enableFiltering: true,
                columnDefs: [
                    {field: 'name'},
                    {field: 'gender'},
                    {field: 'mobileNumber', displayName: 'Mobile'},
                    {field: 'email'},
                    {field: 'residentialAddress', displayName: 'Address', cellTooltip: true},
                    {field: 'surbub'},
                    {
                        field: 'id',
                        displayName: '',
                        enableCellEdit: false,
                        width: 80,
                        enableFiltering: false,
                        cellTemplate: 'views/members/member-view-button.html'
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

            //get the cell groups to use on the membership main page
            if ($localStorage.chmsGroups) {
                $scope.chmsGroups = $localStorage.chmsGroups;
            }

            //get the families to use on the membership main page
            if ($localStorage.chmsFamilies) {
                $scope.chmsFamilies = $localStorage.chmsFamilies;
            }

            //get the zones to use on the membership main page
            if ($localStorage.chmsZones) {
                $scope.chmsZones = $localStorage.chmsZones;
            }

            // gender options
            $scope.genderOptions = MembersService.genderOptions;
            // title options
            $scope.titleOptions = MembersService.titleOptions;
            // marital status options
            $scope.maritalStatusOptions = MembersService.maritalStatusOptions;

            //set cities
            if ($localStorage.dataCities) {
                $scope.cities = $localStorage.dataCities;
            }

            //set provinces
            if ($localStorage.dataProvinces) {
                $scope.provinces = $localStorage.dataProvinces;
            }

            //CRUD  MODAL
            function getMemberFromLocalStorage(id) {
                var obj;
                //avoid querying the database if it has been saved on the local storage
                $localStorage.chmsMembers.map(function (item) {
                    if (id.toString() === item.id.toString()) {
                        obj = item;
                    }
                });
                return obj;
            }

            $scope.chmsMember = {};
            if ($routeParams.memberId) {
                if ($localStorage.chmsMembers) {
                    $scope.chmsMember = getMemberFromLocalStorage($routeParams.memberId);
                } else {
                    $scope.processing = true;
                    $scope.chmsMember = MembersService.getMember($routeParams.memberId)
                            .then(function (res) {
                                if (res.status === 200) {
                                    $scope.chmsMember = res.data.data;
                                } else {
                                    $scope.error = res.data;
                                }
                            })
                            .finally(function () {
                                $scope.processing = false;
                            });
                }
            }
            //UPLOAD PROFILE PICTURE
            var formData = new FormData();
            $scope.getTheFiles = function ($files) {
                angular.forEach($files, function (value, key) {
                    formData.append(key, value);
                });
            };
            $scope.uploadFile = function () {
                MembersService.uploadFileToUrl(formData, $routeParams.memberId).then(function(res){
                    console.log(res);
                });
            };

            //ADD EDIT MEMBER MODAL
            $scope.open = function () {
                $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'add-edit-member.html',
                    controller: 'MemberModal',
                    resolve: {
                        chmsMembership: function () {
                            return $scope.chmsMembership;
                        },
                        chmsMember: function () {
                            return $scope.chmsMember;
                        },
                        titleOptions: function () {
                            return $scope.titleOptions;
                        },
                        genderOptions: function () {
                            return $scope.genderOptions;
                        },
                        maritalStatusOptions: function () {
                            return $scope.maritalStatusOptions;
                        },
                        cities: function () {
                            return $scope.cities;
                        },
                        provinces: function () {
                            return $scope.provinces;
                        },
                        gridData: function() {
                            return $scope.gridOptions.data;
                        }
                    }
                });
            };
            //ADD EDIT QUALIFICATION MODAL
            $scope.qualification = {};
            $scope.qualificationOpen = function (id) {
                $uibModal.open({
                    animation: true,
                    size: 'md',
                    templateUrl: 'add-edit-qualification.html',
                    controller: 'QualificationCtrl',
                    resolve: {
                        qualification: function () {
                            if (id > 0) {
                                $scope.chmsMember.qualifications.data.map(function (qual) {
                                    if (qual.id.toString() === id.toString()) {
                                        $scope.qualification = qual;
                                    }
                                });
                            }
                            return $scope.qualification;
                        },
                        chmsMember: function () {
                            return $scope.chmsMember;
                        }
                    }
                });
            };

            //delete Qualification
            $scope.deleting = false;
            $scope.deleteQualification = function (id) {
                $scope.deleting = true;
                MembersService.deleteQualification(id)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.messageSQ = res.data;
                                $scope.messageSQClass = 'success';
                                //filter the deleted qualification from the member qualifications
                                $scope.chmsMember.qualifications.data = $filter('filter')($scope.chmsMember.qualifications.data, function (qual) {
                                    return qual.id !== id;
                                });
                            } else {
                                $scope.messageSQ = res.data;
                                $scope.messageSQClass = 'danger';
                            }
                        })
                        .finally(function () {
                            $scope.deleting = false;
                        });
            };
            //ADD EDIT SKILL MODAL
            $scope.skill = {};
            $scope.skillOpen = function (id) {
                $uibModal.open({
                    animation: true,
                    size: 'md',
                    templateUrl: 'add-edit-skill.html',
                    controller: 'SkillCtrl',
                    resolve: {
                        skill: function () {
                            if (id > 0) {
                                $scope.chmsMember.skills.data.map(function (skill) {
                                    if (skill.id.toString() === id.toString()) {
                                        $scope.skill = skill;
                                    }
                                });
                            }
                            return $scope.skill;
                        },
                        chmsMember: function () {
                            return $scope.chmsMember;
                        }
                    }
                });
            };
            //delete Skill
            $scope.deleteSkill = function (id) {
                $scope.deleting = true;
                MembersService.deleteSkill(id)
                        .then(function (res) {
                            if (res.status === 200) {
                                $scope.messageSQ = res.data;
                                $scope.messageSQClass = 'success';
                                //filter the deleted skill from the member skills
                                $scope.chmsMember.skills.data = $filter('filter')($scope.chmsMember.skills.data, function (skill) {
                                    return skill.id !== id;
                                });
                            } else {
                                $scope.messageSQ = res.data;
                                $scope.messageSQClass = 'danger';
                            }
                        })
                        .finally(function () {
                            $scope.deleting = false;
                        });
            };

            //BELIEVER'S DETAILS MODAL
            if($routeParams.memberId){
                $scope.believer = ($scope.chmsMember.believerInfo) ? $scope.chmsMember.believerInfo : {};
            }else{
                $scope.believer = {};
            }
            $scope.believerDetailsOpen = function () {
                $uibModal.open({
                    animation: true,
                    size: 'md',
                    templateUrl: 'edit-believer-details.html',
                    controller: 'BelieverCtrl',
                    resolve: {
                        believer: function () {
                            return $scope.believer;
                        },
                        chmsMember: function () {
                            return $scope.chmsMember;
                        }
                    }
                });
            };
        }]);
}());
