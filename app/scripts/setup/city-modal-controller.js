(function () {
    'use strict';
    angular.module('jApp').controller('CityModal', ['$scope', '$uibModalInstance', '$localStorage', 'CityService', 'city','provinces','gridData',
        function ($scope, $uibModalInstance, $localStorage, CityService, city,provinces, gridData) {
            $scope.city = city;
            $scope.provinces = provinces;
            $scope.cityCrudTitle = ($scope.city.id) ? 'Edit City' : 'Create City';
            $scope.cityCrudButton = ($scope.city.id) ? 'Update City' : 'Save City';
            if (($scope.city.id)) {
                //UPDATE A CITY
                $scope.saveCity = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    CityService.updateCity($scope.city)
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
                //SAVE NEW CITY
                $scope.saveCity = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'saving...';
                    $scope.successMessage = false;
                    CityService.saveCity($scope.city)
                            .then(function (res) {
                                if (res.status === 200) {
                                    //push the saved city to the local storage
                                    $localStorage.dataProvinces.push(res.data.data);
                                    gridData.push(res.data.data);
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.city = {};
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
