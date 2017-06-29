(function () {
    'use strict';
    angular.module('jApp').controller('DepartmentModal', ['$scope', '$uibModalInstance', '$localStorage', 'DepartmentService', 'department','chmsMembership','gridData',
        function ($scope, $uibModalInstance, $localStorage, DepartmentService, department, chmsMembership, gridData) {
            $scope.department = department;
            $scope.chmsMembership = chmsMembership;
            $scope.departmentCrudTitle = ($scope.department.id) ? 'Edit Department' : 'Create Department';
            $scope.departmentCrudButton = ($scope.department.id) ? 'Update Department' : 'Save Department';
            if (($scope.department.id)) {
                //UPDATE A DEPARTMENT
                $scope.saveDepartment = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    DepartmentService.updateDepartment($scope.department)
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
                //SAVE NEW DEPARTMENT
                $scope.saveDepartment = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'saving...';
                    $scope.successMessage = false;
                    DepartmentService.saveDepartment($scope.department)
                            .then(function (res) {
                                if (res.status === 200) {
                                    //push the saved department to the local storage
                                    $localStorage.chmsDepartments.push(res.data.data);
                                    gridData.push(res.data.data);
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.department = {};
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
                $scope.department = {};
            };
        }]);
}());
