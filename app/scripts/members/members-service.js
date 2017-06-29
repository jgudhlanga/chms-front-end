(function () {
    'use strict';
    angular.module('jApp').factory('MembersService', ['$http', '$sessionStorage', '$localStorage', '$rootScope', function ($http, $sessionStorage, $localStorage, $rootScope) {
            var service = {};

            service.getMembers = function () {
                return $http.get($rootScope.appDefaults.apiUrl + 'memberservice/members', $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                $localStorage.chmsMembers = res.data.data;
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            //get member
            service.getMember = function (memberId) {
                return $http.get($rootScope.appDefaults.apiUrl + 'memberservice/members/' + memberId, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            //create member
            service.createMember = function (data) {
                return $http.post($rootScope.appDefaults.apiUrl + 'memberservice/members', data, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            //update member
            service.updateMember = function (data) {
                return $http.put($rootScope.appDefaults.apiUrl + 'memberservice/members/' + data.id, data, $sessionStorage.apiAuth)
                    .then(function (res) {
                        if (res.status === 200) {
                            return res;
                        }
                    },
                    function (msg) {
                        return msg;
                    });
            };

            service.uploadFileToUrl = function (formData, id) {
                //FormData, object of key/value pair for form fields and values
                //var fileFormData = new FormData();
                //fileFormData.append('file', file);
                console.log(formData);
                return $http.post($rootScope.appDefaults.apiUrl + 'memberservice/members/' + id + '/profilepicture', formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined, 'Authorization': 'Bearer ' + $sessionStorage.accessToken,}

                }).then(function(res){
                    return res;
                }, function(msg){
                    return msg;
                });

        };

            // titles options
            service.titleOptions = {
                'Dr': 'Doctor', 'Miss': 'Miss', 'Min': 'Minister', 'Mr': 'Mr', 'Mrs': 'Mrs', 'Ps': 'Pastor', 'Prof': 'Professor',
                'Rev': 'Reverend'
            };
            // gender options
            service.genderOptions = {
                'Male': 'Male', 'Female': 'Female'
            };
            // marital status options
            service.maritalStatusOptions = {
                'Single': 'Single', 'Married': 'Married', 'Widowed': 'Widowed', 'Engaged': 'Engaged'
            };

            //save believers details
            service.saveBelieverDetails = function(data){
                return $http.post($rootScope.appDefaults.apiUrl + 'memberservice/members/' + data.memberId + '/believer', data, $sessionStorage.apiAuth).then(function(res){
                    return res;
                },function (msg) {
                    return msg;
                });
            };

            //save Qualification
            service.saveQualification = function (data) {
                return $http.post($rootScope.appDefaults.apiUrl + 'memberservice/members/' + data.memberId + '/qualification', data, $sessionStorage.apiAuth)
                .then(function (res) {
                    if (res.status === 200) {
                        return res;
                    }
                },
                function (msg) {
                    return msg;
                });
            };

            //update Qualification
            service.updateQualification = function (data) {
                return $http.put($rootScope.appDefaults.apiUrl + 'memberservice/members/qualification/' + data.id, data, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            //delete qualification
            service.deleteQualification = function (id) {
                return $http.delete($rootScope.appDefaults.apiUrl + 'memberservice/members/qualification/' + id, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            //save Skill
            service.saveSkill = function (data) {
                return $http.post($rootScope.appDefaults.apiUrl + 'memberservice/members/' + data.memberId + '/skill', data, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            //update Skill
            service.updateSkill = function (data) {
                return $http.put($rootScope.appDefaults.apiUrl + 'memberservice/members/skill/' + data.id, data, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            //delete Skill
            service.deleteSkill = function (id) {
                return $http.delete($rootScope.appDefaults.apiUrl + 'memberservice/members/skill/' + id, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            return service;
        }]);
}());
