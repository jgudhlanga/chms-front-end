(function () {
    'use strict';
    angular.module('jApp').controller('BelieverCtrl', ['$scope', 'MembersService', 'chmsMember', 'believer', '$localStorage', '$uibModalInstance',
        function ($scope, MembersService, chmsMember, believer, $localStorage, $uibModalInstance) {
            $scope.believer = believer;
            $scope.believer.memberId = chmsMember.id;
            //SAVE BELIEVER's DETAILS
            $scope.saveBelieverDetails = function () {
                $scope.saving = true;
                $scope.savingMessage = 'saving...';
                MembersService.saveBelieverDetails($scope.believer)
                        .then(function (res) {
                            if (res.status === 200) {
                                //push the believer to member believers
                                chmsMember.believerInfo.data[0].push(res.data.data);
                                //show the success message
                                $scope.successMessage = true;
                                //clear the fields
                                $scope.believer = {};
                            } else {
                                $scope.error = res.data;
                            }
                        })
                        .finally(function () {
                            $scope.saving = false;
                        });
                };
            //dismiss the modal
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
}());
