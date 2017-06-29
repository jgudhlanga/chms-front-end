(function () {
    'use strict';
    angular.module('jApp').controller('ZoneModal', ['$scope', '$uibModalInstance', '$location', '$localStorage', 'ZoneService', 'chmsMembership', 'chmsZone', 'gridData',
        function ($scope, $uibModalInstance, $location, $localStorage, ZoneService, chmsMembership, chmsZone, gridData) {
            $scope.chmsZone = chmsZone;
            $scope.chmsMembership = chmsMembership;
            $scope.newZone = {};
            $scope.zoneCrudTitle = ($scope.chmsZone.id) ? 'Edit zone' : 'Create Zone';
            $scope.zoneCrudButton = ($scope.chmsZone.id) ? 'Update Zone' : 'Save Zone';
            if (($scope.chmsZone.id)) {
                //UPDATE A ZONE
                $scope.saveZone = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    ZoneService.updateGroup($scope.chmsZone)
                            .then(function (res) {
                                if (res.status === 200) {
                                    var i;
                                    for (i = 0; i < $localStorage.chmsZones.length; i++) {
                                        if($localStorage.chmsZones[i].id === $scope.chmsZone.id){
                                            $localStorage.chmsZones[i] = res.data.data;
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
                //SAVE NEW ZONE
                $scope.saveZone = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'saving...';
                    $scope.successMessage = false;
                    $scope.newZone = {};
                    ZoneService.saveZone($scope.chmsZone)
                            .then(function (res) {
                                if (res.status === 200) {
                                    //push the saved zone to the local storage
                                    $localStorage.chmsZones.push(res.data.data);
                                    gridData.push(res.data.data);
                                    $scope.newZone = res.data.data;
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.chmsZone = {};
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
                $location.path('/zone-view/' + $scope.newZone.id);
            };
            //dismiss the modal
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());
