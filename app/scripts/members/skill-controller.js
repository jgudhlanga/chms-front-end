(function () {
    'use strict';
    angular.module('jApp').controller('SkillCtrl', ['$scope', 'MembersService', 'chmsMember', 'skill', '$localStorage', '$uibModalInstance',
        function ($scope, MembersService, chmsMember, skill, $localStorage, $uibModalInstance) {
            $scope.skill = skill;
            $scope.skill.memberId = chmsMember.id;
            $scope.skillCrudTitle = ($scope.skill.id) ? 'Edit Skill' : 'Add Skill';
            $scope.skillCrudButton = ($scope.skill.id) ? 'Update' : 'Save';
            if (($scope.skill.id)) {
                //UPDATE A SKILL
                $scope.saveSkill = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'updating...';
                    MembersService.updateSkill($scope.skill)
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
                //SAVE NEW SKILL
                $scope.saveSkill = function () {
                    $scope.saving = true;
                    $scope.savingMessage = 'saving...';
                    MembersService.saveSkill($scope.skill)
                            .then(function (res) {
                                if (res.status === 200) {
                                    //push the skill to member skills
                                    chmsMember.skills.data.push(res.data.data);
                                    //show the success message
                                    $scope.successMessage = true;
                                    //clear the fields
                                    $scope.skill = {};
                                    $scope.skill.memberId = chmsMember.id;
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
