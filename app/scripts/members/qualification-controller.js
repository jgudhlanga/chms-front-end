(function () {
    'use strict';
    angular.module('jApp').controller('QualificationCtrl', ['$scope', 'MembersService', 'chmsMember', 'qualification', '$localStorage', '$uibModalInstance',
        function ($scope, MembersService, chmsMember, qualification, $localStorage, $uibModalInstance) {
            $scope.qualification = qualification;
            $scope.qualification.memberId = chmsMember.id;
            $scope.qualificationCrudTitle = ($scope.qualification.id) ? 'Edit Qualification' : 'Add Qualification';
            $scope.qualificationCrudButton = ($scope.qualification.id) ? 'Update' : 'Save';
            if (($scope.qualification.id)) {
                //UPDATE A QUALIFICATION
                $scope.saveQualification = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    MembersService.updateQualification($scope.qualification)
                            .then(function (res) {
                                if (res.status === 200) {
                                    $scope.cancel();
                                } else {
                                    $scope.error = res.data;
                                }
                            })
                            .finally(function () {
                                $scope.saving = false;
                            });
                };
            } else {
                //SAVE NEW QUALIFICATION
                $scope.saveQualification = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'saving...';
                    MembersService.saveQualification($scope.qualification)
                            .then(function (res) {
                                if (res.status === 200) {
                                    //push the qualication to member qualications
                                    chmsMember.qualifications.data.push(res.data.data);
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.qualification = {};
                                    $scope.qualification.memberId = chmsMember.id;
                                } else {
                                    $scope.error = res.data;
                                }
                            })
                            .finally(function () {
                                $scope.saving = false;
                            });
                };
            }
            //dismiss the modal
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());
