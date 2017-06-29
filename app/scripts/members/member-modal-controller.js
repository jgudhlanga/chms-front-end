(function () {
    'use strict';
    /*MODAL CONTROLLER */
    angular.module('jApp').controller('MemberModal', ['$scope', '$uibModalInstance', 'MembersService', '$localStorage', '$location', 'chmsMember', 'titleOptions', 'genderOptions', 'maritalStatusOptions','cities', 'provinces','gridData',
        function ($scope, $uibModalInstance, MembersService, $localStorage, $location, chmsMember, titleOptions, genderOptions, maritalStatusOptions, cities, provinces, gridData) {
            $scope.chmsMember = chmsMember;
            $scope.newMember = {};
            $scope.memberCrudTitle = ($scope.chmsMember.id) ? 'Edit Member' : 'Create Member';
            $scope.memberCrudButton = ($scope.chmsMember.id) ? 'Update Member' : 'Save Member';
            $scope.titleOptions = titleOptions;
            $scope.genderOptions = genderOptions;
            $scope.cities = cities;
            $scope.provinces = provinces;
            $scope.maritalStatusOptions = maritalStatusOptions;
            if (($scope.chmsMember.id)) {
                //UPDATE A MEMBER
                $scope.postMember = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    MembersService.updateMember($scope.chmsMember)
                            .then(function (res) {
                                if (res.status === 200) {
                                    $scope.cancel();
                                    $location.path('/members/profile/' + $scope.chmsMember.id);
                                } else {
                                    $scope.error = res.data;
                                }
                            })
                            .finally(function () {
                                $scope.saving = false;
                            });
                };
            } else {
                //SAVE NEW MEMBER
                $scope.postMember = function () {
                    $scope.saving = true;
                    $scope.newMember = {};
                    $scope.savingMessage = 'saving...';
                    MembersService.createMember($scope.chmsMember)
                            .then(function (res) {
                                if (res.status === 200) {
                                    $localStorage.chmsMembers.push(res.data.data);
                                    $scope.newMember = res.data.data;
                                    gridData.push(res.data.data);
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.chmsMember = {};
                                } else {
                                    $scope.error = res.data;
                                }
                            })
                            .finally(function () {
                                $scope.saving = false;
                            });
                };
            }
            //redirect to the view page
            $scope.view = function () {
                $uibModalInstance.close();
                $location.path('/members/profile/' + $scope.newMember.id);
            };
            //dismiss the modal
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());
