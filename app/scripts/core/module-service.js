(function () {
    'use strict';
    angular.module('jApp').factory('ModuleService', ['$http', '$sessionStorage', '$localStorage', '$rootScope', function ($http, $sessionStorage, $localStorage, $rootScope) {

            var service = {};

            /*get a module */

            service.getModule = function (moduleId) {
                return $http.get($rootScope.appDefaults.apiUrl + 'moduleservice/modules/' + moduleId + '', $sessionStorage.apiAuth).then(
                        function (res)
                        {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                        function (msg) {
                            return msg;
                        }
                );
            };

            /* save module */
            service.saveModule = function (formData)
            {
                return $http.post($rootScope.appDefaults.apiUrl + 'moduleservice/modules', formData, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            /* update module */
            service.updateModule = function (formData)
            {
                return $http.put($rootScope.appDefaults.apiUrl + 'moduleservice/modules/' + formData.id, formData, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };
            /* activate - deactivate  module */
            service.activateModule = function (moduleId, active)
            {
                var data = {
                    activate: active
                };
                return $http.put($rootScope.appDefaults.apiUrl + 'moduleservice/modules/activate/' + moduleId, data, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* activate - deactivate  module */
            service.orderModule = function (moduleId, direction)
            {
                var data = {
                    direction: direction
                };
                return $http.put($rootScope.appDefaults.apiUrl + 'moduleservice/modules/order/' + moduleId, data, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* delete module */
            service.deleteModule = function (module)
            {
                return $http.delete($rootScope.appDefaults.apiUrl + 'moduleservice/modules/' + module, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* Module Pages */
            /* save Page */

            service.savePage = function (formData)
            {
                // delete $httpProvider.defaults.headers.post['Content-type']
                return $http.post($rootScope.appDefaults.apiUrl + 'moduleservice/modules/page', formData, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }

                        },
                                function (msg) {
                                    return msg;
                                });
            };
            /* update Page */
            service.updatePage = function (formData)
            {
                return $http.put($rootScope.appDefaults.apiUrl + 'moduleservice/modules/page/' + formData.id, formData, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* get page */
            service.getPage = function (pageId) {
                return $http.get($rootScope.appDefaults.apiUrl + 'moduleservice/modules/page/' + pageId, $sessionStorage.apiAuth)
                        .then(function (res) {
                            if (res.status === 200) {
                                return res;
                            }
                        },
                                function (msg) {
                                    return msg;
                                });
            };

            /* delete page */
            service.deletePage = function (pageId) {
                return $http.delete($rootScope.appDefaults.apiUrl + 'moduleservice/modules/page/' + pageId, $sessionStorage.apiAuth)
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
