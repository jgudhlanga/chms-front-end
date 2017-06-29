(function () {
    'use strict';
    angular.module('jApp').controller('CellGroupModal', ['$scope', '$uibModalInstance', '$location', '$localStorage', 'CellGroupService', 'chmsMembership', 'chmsGroup', 'gridData',
        function ($scope, $uibModalInstance, $location, $localStorage, CellGroupService, chmsMembership, chmsGroup, gridData) {
            $scope.chmsGroup = chmsGroup;
            $scope.chmsMembership = chmsMembership;
            $scope.newGroup = {};
            $scope.groupCrudTitle = ($scope.chmsGroup.id) ? 'Edit group' : 'Create Group';
            $scope.groupCrudButton = ($scope.chmsGroup.id) ? 'Update Group' : 'Save Group';
            if (($scope.chmsGroup.id)) {
                //UPDATE A GROUP
                $scope.saveGroup = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    CellGroupService.updateGroup($scope.chmsGroup)
                            .then(function (res) {
                                if (res.status === 200) {
                                    var i;
                                    for (i = 0; i < $localStorage.chmsGroups.length; i++) {
                                        if($localStorage.chmsGroups[i].id === $scope.chmsGroup.id){
                                            $localStorage.chmsGroups[i] = res.data.data;
                                        }
                                    }
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
                //SAVE NEW GROUP
                $scope.saveGroup = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'saving...';
                    $scope.successMessage = false;
                    $scope.newGroup = {};
                    CellGroupService.saveGroup($scope.chmsGroup)
                            .then(function (res) {
                                if (res.status === 200) {
                                    //push the saved group to the local storage
                                    $localStorage.chmsGroups.push(res.data.data);
                                    $scope.newGroup = res.data.data;
                                    gridData.push(res.data.data);
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.chmsGroup = {};
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
                $location.path('/group-view/' + $scope.newGroup.id);
            };
            //dismiss the modal
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());
