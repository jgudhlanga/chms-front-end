(function () {
    'use strict';
    angular.module('jApp').controller('ProvinceModal', ['$scope', '$uibModalInstance', '$localStorage', 'ProvinceService', 'province', 'gridData',
        function ($scope, $uibModalInstance, $localStorage, ProvinceService, province, gridData) {
            $scope.province = province;
            $scope.provinceCrudTitle = ($scope.province.id) ? 'Edit Province' : 'Create Province';
            $scope.provinceCrudButton = ($scope.province.id) ? 'Update Province' : 'Save Province';
            if (($scope.province.id)) {
                //UPDATE A PROVINCE
                $scope.saveProvince = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    ProvinceService.updateProvince($scope.province)
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
                //SAVE NEW PROVINCE
                $scope.saveProvince = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'saving...';
                    $scope.successMessage = false;
                    ProvinceService.saveProvince($scope.province)
                            .then(function (res) {
                                if (res.status === 200) {
                                    //push the saved provice to the local storage
                                    $localStorage.dataProvinces.push(res.data.data);
                                    gridData.push(res.data.data);
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.province = {};
                                } else {
                                    $scope.error = res;
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
