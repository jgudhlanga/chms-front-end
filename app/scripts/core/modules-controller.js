(function () {
    'use strict';
    angular.module('jApp')
            .controller('ModulesCtrl', ['$scope', 'GlobalService', 'ModuleService', '$routeParams', '$location', '$route', '$window', '$templateCache', '$timeout', '$localStorage', '$filter', function ($scope, GlobalService, ModuleService, $routeParams, $location, $route, $window, $templateCache, $timeout, $localStorage, $filter) {

                    //Get the modules
                    if ($localStorage.chmsModules) {
                        $scope.chmsModules = $localStorage.chmsModules;
                    }

                    var onError = {};
                    //On Request Complete Message
                    var onCompleteMessage = function (message)
                    {
                        $scope.message = message.message;
                    };
                    if ($routeParams.moduleId) {
                        $scope.button = 'Update Module';
                        $scope.title = 'Edit Module';

                        //get the module
                        if ($localStorage.chmsModules) {
                            $localStorage.chmsModules.map(function (module) {
                                if (module.id.toString() === $routeParams.moduleId.toString()) {
                                    $scope.chmsModule = module;
                                }
                            });
                        } else {
                            $scope.loadingModule = true;
                            $scope.chmsModule = ModuleService.getModule($routeParams.moduleId)
                                    .then(function (res) {
                                        if (res.status === 200) {
                                            $scope.chmsModule = res.data.data;
                                        } else {
                                            $scope.error = res.data;
                                        }
                                    })
                                    .finally(function () {
                                        $scope.loadingModule = false;
                                    });
                        }
                        //update module
                        $scope.saveModule = function () {
                            $scope.crudProcessing = true;
                            $scope.crudMessage = 'updating...';
                            ModuleService.updateModule($scope.chmsModule)
                                    .then(function (res) {
                                        if (res.status === 200) {
                                            $location.path('/modulepages/' + $routeParams.moduleId);
                                        } else {
                                            $scope.error = res.data;
                                        }
                                    })
                                    .finally(function () {
                                        $scope.crudProcessing = false;
                                    });
                        };
                    } else
                    {
                        $scope.button = 'Save Module';
                        $scope.title = 'Add Module';
                        $scope.chmsModule = {};
                        $scope.saveModule = function () {
                            $scope.crudProcessing = true;
                            $scope.crudMessage = 'saving...';
                            ModuleService.saveModule($scope.chmsModule)
                                    .then(function (res) {
                                        if (res.status === 200)
                                        {
                                            /*push the latest added module to the modules list*/
                                            $localStorage.chmsModules.push(res.data.data);
                                            $location.path('/setup/modules');
                                        }
                                    })
                                    .finally(function () {
                                        $scope.crudProcessing = false;
                                    });
                        };
                    }

                    //delete module
                    $scope.deleteModule = function (moduleId) {
                        ModuleService.deleteModule(moduleId)
                                .then(function (res) {
                                    if (res.status === 200) {
                                        $scope.message = res.data.message;
                                        //remove the deleted from the module list
                                        $localStorage.chmsModules = $filter('filter')($localStorage.chmsModules, function (item) {
                                            return item.id !== moduleId;
                                        });
                                    } else {
                                        $scope.error = res.data;
                                    }
                                })
                                .finally(function () {
                                    $route.reload();
                                });
                    };

                    //activate - deactivate module
                    $scope.activateModule = function (moduleId, active) {
                        $scope.activatingModule = true;
                        ModuleService.activateModule(moduleId, active)
                                .then(function (res) {
                                    if (res.status === 200) {
                                        $scope.message = res.data.message;
                                    } else {
                                        $scope.error = res.data;
                                    }
                                })
                                .finally(function () {
                                    $scope.activatingModule = false;
                                    $localStorage.chmsModules.map(function (module) {
                                        if (module.id === moduleId) {
                                            module.isActive = active;
                                        }
                                    });
                                });
                    };
                    //order modules
                    $scope.orderModule = function (moduleId, direction) {
                        ModuleService.orderModule(moduleId, direction)
                                .then(function (res) {
                                    if (res.status === 200) {
                                        $scope.message = res.message;
                                    } else {
                                        $scope.error = res.data;
                                    }
                                })
                                .finally(function () {
                                    //position the page according to direction
                                    $localStorage.chmsModules.map(function (module) {
                                        if (module.id === moduleId)
                                        {
                                            if (direction.toLowerCase() === 'up') {
                                                module.position = module.position - 1;
                                            } else {
                                                module.position = module.position + 1;
                                            }
                                        }
                                    });
                                });
                    };

                    /*Module Pages*/
                    //edit page
                    if ($routeParams.pageId) {
                        $scope.pageButton = 'Update Page';
                        $scope.pageTitle = 'Edit Page';
                        var onPageComplete = function (pageData)
                        {
                            $scope.page = pageData.data;
                        };
                        //get the module
                        var pageId = $routeParams.pageId;
                        $scope.page = ModuleService.getPage(pageId)
                                .then(onPageComplete)
                                .finally(function () {
                                });
                        $scope.savePage = function () {
                            $scope.savingPage = true;
                            $scope.savingMessage = 'updating...';
                            ModuleService.updatePage($scope.page)
                                    .then(onCompleteMessage, onError)
                                    .finally(function () {
                                        $location.path('/modulepages/' + $scope.page.moduleId);
                                    });
                        };
                    } else
                    {
                        //create page
                        $scope.pageButton = 'Save Page';
                        $scope.pageTitle = 'Add Page';
                        $scope.moduleId = $routeParams.moduleId;
                        $scope.page = {
                            moduleId: $routeParams.moduleId
                        };
                        $scope.savePage = function () {
                            $scope.savingPage = true;
                            $scope.savingMessage = 'saving...';
                            ModuleService.savePage($scope.page)
                                    .then(onCompleteMessage, onError)
                                    .finally(function () {
                                        $timeout(function () {
                                            $location.path('/modulepages/' + $routeParams.moduleId);
                                        }, 3000, true);
                                    });
                        };
                    }
                    //delete page
                    $scope.deletePage = function (moduleId, pageId)
                    {
                        ModuleService.deletePage(pageId)
                                .then(onCompleteMessage, onError)
                                .finally(function () {
                                    $timeout(function () {
                                        var currentPageTemplate = $route.current.templateUrl;
                                        $templateCache.remove(currentPageTemplate);
                                        $route.reload();
                                    }, 3000, true);
                                });
                    };

                    //activate - deactivate page
                    $scope.activatePage = function (pageId, active) {
                        GlobalService.activatePage(pageId, active).then(onCompleteMessage, onError);
                        for (var i = 0; i < $scope.modules.length; i++) {
                            if ($scope.modules[i].id === $routeParams.moduleId) {
                                $scope.modules[i].isActive = active;
                                break;
                            }
                        }
                    };
                }]);
}());