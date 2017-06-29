(function () {
    'use strict';
    angular.module('jApp').controller('FamilyModal', ['$scope', '$uibModalInstance', '$location', '$localStorage', 'FamilyService', 'chmsMembership', 'chmsFamily', 'gridData',
        function ($scope, $uibModalInstance, $location, $localStorage, FamilyService, chmsMembership, chmsFamily, gridData) {
            $scope.chmsFamily = chmsFamily;
            $scope.chmsMembership = chmsMembership;
            $scope.newFamily = {};
            $scope.familyCrudTitle = ($scope.chmsFamily.id) ? 'Edit family' : 'Create Family';
            $scope.familyCrudButton = ($scope.chmsFamily.id) ? 'Update Family' : 'Save Family';
            if (($scope.chmsFamily.id)) {
                //UPDATE A FAMILY
                $scope.saveFamily = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    FamilyService.updateFamily($scope.chmsFamily)
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
                //SAVE NEW FAMILY
                $scope.saveFamily = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'saving...';
                    $scope.successMessage = false;
                    $scope.newFamily = {};
                    FamilyService.saveFamily($scope.chmsFamily)
                            .then(function (res) {
                                if (res.status === 200) {
                                    //push the saved family to the local storage
                                    $localStorage.chmsFamilies.push(res.data.data);
                                    $scope.newFamily = res.data.data;
                                    gridData.push(res.data.data);
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.chmsFamily = {};
                                } else {
                                    $scope.error = res;
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
                $location.path('/family-view/' + $scope.newFamily.id);
            };
            //dismiss the modal
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());
