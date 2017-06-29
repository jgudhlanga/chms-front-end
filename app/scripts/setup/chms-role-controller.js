/* globals AppConfig */
(function(){
    'use strict';
    var config = new AppConfig();
    angular.module(config.appModuleName).controller('ChmsRoleCtrl', ['$scope', '$localStorage', '$routeParams','$location', '$uibModal','ChmsRoleService',
    function($scope, $localStorage, $routeParams, $location, $uibModal, ChmsRoleService){

        //get the roles
        $scope.loadingRoals = true;
        $scope.roles = ChmsRoleService.getRoles().then(function(res){
            if(res.status === 200){
                $scope.roles = res.data;
            }else{
                $scope.error = res;
            }
        })
        .finally(function(){
            $scope.loadingRoals = false;
        });

        //CRUD MODAL
        $scope.openRolesModal = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'chms-roles.html',
                controller: 'ChmsRoleModal',
                size:'lg',
                resolve: {
                    roles: function(){
                        return $scope.roles;
                    }
                }
            });
        };

        // Delete Role
        $scope.deleteRole = function (roleId) {
            $scope.busyWait = true;
            ChmsRoleService.deleteRole(roleId)
                    .then(function (res) {
                        if (res.status === 200) {
                            $scope.message = res.data.message;
                            $scope.messageClass = 'success';
                            //remove the role from the local storage
                            $localStorage.dataCities = $filter('filter')($localStorage.dataCities, function (item) {
                                return item.id !== roleId;
                            });
                            $location.path('/setup/data');
                        } else {
                            $scope.message = res.data;
                            $scope.messageClass = 'danger';
                        }
                    })
                    .finally(function () {
                        $scope.busyWait = false;
                    });
        };

        //Activate Deactivate Role
        $scope.activateRole = function (roleId, activate) {
            $scope.busyWait = true;
            ChmsRoleService.activateRole(roleId, activate)
                    .then(function (res) {
                        if (res.status === 200) {
                            $scope.message = res.data;
                            $scope.messageClass = 'success';
                            $scope.role.isActive = activate;
                        } else {
                            $scope.error = res.data;
                            $scope.messageClass = 'danger';
                        }
                    })
                    .finally(function () {
                        $scope.busyWait = false;
                    });
        };
    }]);
}());
