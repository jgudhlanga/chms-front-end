/* globals AppConfig */
(function () {
    'use strict';
    var config = new AppConfig();
    angular.module(config.appModuleName).controller('ChmsRoleModal', ['$scope', '$uibModalInstance', 'roles','ChmsRoleService','$filter',
        function ($scope, $uibModalInstance, roles, ChmsRoleService, $filter) {
            $scope.roles = roles;
            $scope.role = {};
            $scope.buttonValue = 'Save';
            $scope.editRole = function(id){
                for (var i = 0; i < $scope.roles.length; i++) {
                    if($scope.roles[i].id.toString() === id.toString()){
                        $scope.role = $scope.roles[i];
                        $scope.buttonValue = 'Update';
                        break;
                    }
                }
            };

            $scope.saveRole = function(){
                $scope.savingMessage = 'saving...';
                $scope.saving = true;
                ChmsRoleService.saveRole($scope.role).then(function(res){
                    if(res.status === 200){
                        $scope.message = 'Role successfuly saved';
                        $scope.roles.push(res.data);
                        $scope.messageClass = 'success';
                    }
                    else{
                        $scope.message = res.data;
                        $scope.messageClass = 'danger';
                    }
                })
                .finally(function(){
                    $scope.saving = false;
                });
            };

            $scope.deleteRole = function(id){
                ChmsRoleService.deleteRole(id).then(function(res){
                    if(res.status === 200){
                        $scope.messageClass = 'success';
                        $scope.message = res.data;
                        $scope.roles = $filter('filter')($scope.roles, function (item) {
                            return item.id !== id;
                        });
                    }else{
                        $scope.messageClass = 'danger';
                        $scope.message = res.data;
                    }
                });
            };
            //dismiss the modal
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());
