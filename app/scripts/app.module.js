/* globals AppConfig */
'use strict';
/**
 * @ngdoc overview
 * @name jApp
 * @description
 * # jApp
 *
 * Main module of the application.
 */
 var config = new AppConfig();
angular.module(config.appModuleName, config.appModuleDependencies)
        .run(['$rootScope', function ($rootScope) {
                $rootScope.appDefaults = {
                    appVersion: config.appVersion, appTitle: config.appTitle,
                    appCopyright: config.appCopyright, apiUrl: config.apiServerUrl,
                };
            }])
        .config(['$routeProvider', '$locationProvider', '$compileProvider', function ($routeProvider, $locationProvider, $compileProvider) {

                /* PROTECT ROUTES FROM UNAUTHORISED USERS */
                var onlyLoggedIn = function ($location, $q, AuthService) {
                    var deferred = $q.defer();
                    if (AuthService.isLoggedIn) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                        $location.url('/');
                        return deferred.promise;
                    }
                };
                /* ONCE THE USER IS LOGGED REJECT LOGIN ROUTE for firefox behaviour*/
                var loggedIn = function ($location, $q, AuthService) {
                    var deferred = $q.defer();
                    if (AuthService.isLoggedIn) {
                        deferred.reject();
                        $location.url('/');
                        return deferred.promise;
                    } else {
                        deferred.resolve();
                    }
                };
                $routeProvider
                        .when('/', {
                            templateUrl: 'views/main.html',
                            controller: 'GlobalCtrl',
                            controllerAs: 'GLC'
                        })
                        /* Calendar Routes  */
                        .when('/calendar', {
                            templateUrl: 'views/calendar/index.html',
                            controller: 'CalendarCtrl',
                            controllerAs: 'CC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Dashboard Routes  */
                        .when('/dashboard', {
                            templateUrl: 'views/dashboard/index.html',
                            controller: 'DashboardCtrl',
                            controllerAs: 'DAC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Departments Routes  */
                        .when('/departments', {
                            templateUrl: 'views/departments/index.html',
                            controller: 'DepartmentsCtrl',
                            controllerAs: 'DC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/department-view/:departmentId', {
                            templateUrl: 'views/departments/department-view.html',
                            controller: 'DepartmentsCtrl',
                            controllerAs: 'DC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Families Routes  */
                        .when('/families', {
                            templateUrl: 'views/families/index.html',
                            controller: 'FamilyCtrl',
                            controllerAs: 'FC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/family-view/:familyId', {
                            templateUrl: 'views/families/family-view.html',
                            controller: 'FamilyCtrl',
                            controllerAs: 'FC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Groups Routes  */
                        .when('/groups', {
                            templateUrl: 'views/groups/index.html',
                            controller: 'GroupsCtrl',
                            controllerAs: 'GC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/group-view/:groupId', {
                            templateUrl: 'views/groups/group-view.html',
                            controller: 'GroupsCtrl',
                            controllerAs: 'GC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Help Routes  */
                        .when('/help', {
                            templateUrl: 'views/help/index.html',
                            controller: 'HelpCtrl',
                            controllerAs: 'HC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Library Routes  */
                        .when('/library', {
                            templateUrl: 'views/library/index.html',
                            controller: 'LibraryCtrl',
                            controllerAs: 'LC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Login Logout Routes  */
                        .when('/login', {
                            templateUrl: 'views/login/login.html',
                            controller: 'GlobalCtrl',
                            controllerAs: 'GLC',
                            resolve: {
                                loggedIn: loggedIn
                            }
                        })
                        /* Membership Primary Route  */
                        .when('/members', {
                            templateUrl: 'views/members/index.html',
                            controller: 'MembersCtrl',
                            controllerAs: 'MC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Members Routes  */
                        .when('/members/members', {
                            templateUrl: 'views/members/members.html',
                            controller: 'MembersCtrl',
                            controllerAs: 'MC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/members/profile/:memberId', {
                            templateUrl: 'views/members/profile.html',
                            controller: 'MembersCtrl',
                            controllerAs: 'MC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/members/youth', {
                            templateUrl: 'views/members/youth.html',
                            controller: 'MembersCtrl',
                            controllerAs: 'MC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/members/sunday-school', {
                            templateUrl: 'views/members/sunday-school.html',
                            controller: 'MembersCtrl',
                            controllerAs: 'MC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Ministries Routes  */
                        .when('/ministries', {
                            templateUrl: 'views/ministries/index.html',
                            controller: 'MinistriesCtrl',
                            controllerAs: 'MC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Projects Routes  */
                        .when('/projects', {
                            templateUrl: 'views/projects/index.html',
                            controller: 'ProjectsCtrl',
                            controllerAs: 'PC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Reports Routes  */
                        .when('/reports', {
                            templateUrl: 'views/reports/index.html',
                            controller: 'ReportsCtrl',
                            controllerAs: 'RC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* setup Routes */
                        .when('/setup', {
                            templateUrl: 'views/setup/index.html',
                            controller: 'ModulesCtrl',
                            controllerAs: 'MLC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/setup/modules', {
                            templateUrl: 'views/setup/modules.html',
                            controller: 'ModulesCtrl',
                            controllerAs: 'MLC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/module/edit/:moduleId', {
                            templateUrl: 'views/setup/module.html',
                            controller: 'ModulesCtrl',
                            controllerAs: 'MLC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/module/add', {
                            templateUrl: 'views/setup/module.html',
                            controller: 'ModulesCtrl',
                            controllerAs: 'MLC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/modulepages/:moduleId', {
                            templateUrl: 'views/setup/modulepages.html',
                            controller: 'ModulesCtrl',
                            controllerAs: 'MLC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/page/add/:moduleId', {
                            templateUrl: 'views/setup/page.html',
                            controller: 'ModulesCtrl',
                            controllerAs: 'MLC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/page/:moduleId/:pageId', {
                            templateUrl: 'views/setup/page.html',
                            controller: 'ModulesCtrl',
                            controllerAs: 'MLC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/setup/data', {
                            templateUrl: 'views/setup/data.html',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/setup/security', {
                            templateUrl: 'views/setup/security.html',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Visitors Routes  */
                        .when('/visitors', {
                            templateUrl: 'views/visitors/index.html',
                            controller: 'VisitorsCtrl',
                            controllerAs: 'VC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        /* Zones Routes  */
                        .when('/zones', {
                            templateUrl: 'views/zones/index.html',
                            controller: 'ZonesCtrl',
                            controllerAs: 'ZC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .when('/zone-view/:zoneId', {
                            templateUrl: 'views/zones/zone-view.html',
                            controller: 'ZonesCtrl',
                            controllerAs: 'ZC',
                            resolve: {
                                loggedIn: onlyLoggedIn
                            }
                        })
                        .otherwise({
                            templateUrl: '404.html',
                        });
                $compileProvider.debugInfoEnabled(false);
                $locationProvider.html5Mode(true);
            }]);
