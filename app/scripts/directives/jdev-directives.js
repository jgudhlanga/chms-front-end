(function () {
    'use strict';
    //member min tile
    angular.module('jApp').directive('memberMinTile', function () {
        return {
            restrict: 'AE',
            scope: {
                member: '=',
                removeMember: '&',
            },
            templateUrl: '../templates/member-min-tile.html',
            replace: true,
        };
    })
        //  family Tile Generator Directive
        .directive('familyTile', function () {
            return {
                restrict: 'AE',
                scope: {
                    data: '='
                },
                templateUrl: '../templates/family-tile.html',
                replace: true,
                link: function (scope) {
                    scope.hi = function () {
                        return scope.data.name;
                    };
                }
            };
        })
        //  Department Tile Generator Directive
        .directive('departmentTile', function () {
            return {
                restrict: 'AE',
                scope: {
                    data: '='
                },
                templateUrl: '../templates/department-tile.html',
                replace: true,
            };
        })
        //  Zone Tile Generator Directive
        .directive('zoneTile', function () {
            return {
                restrict: 'AE',
                scope: {
                    data: '='
                },
                templateUrl: '../templates/zone-tile.html',
                replace: true,
            };
        })
        //loading
        .directive('loading', function () {
            return {
                restrict: 'AE',
                scope: {
                    loadingMessage: '@',
                    loadingClass: '@',
                },
                templateUrl: '../templates/loading.html',
                replace: true
            };
        })
        //messages
        .directive('message', function () {
            return {
                restrict: 'AE',
                scope: {
                    alert: '@',
                    messageClass: '@'
                },
                templateUrl: '../templates/message.html',
                transclude: true,
                replace: true
            };
        })
        //upload files
        .directive('ngFiles', ['$parse', function ($parse) {

            function fnLink(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            }

            return {
                link: fnLink
            };
        } ])
        //page header
        .directive('pageHeader', function () {
            return {
                restrict: 'AE',
                scope: {
                    pageTitle: '@',
                    links: '@',
                    link1: '@',
                    linkUrl1: '@',
                    linkTitle1: '@',
                    linkClass1: '@',
                    linkIcon1: '@',
                    link2: '@',
                    linkUrl2: '@',
                    linkTitle2: '@',
                    linkClass2: '@',
                    linkIcon2: '@',
                    link3: '@',
                    linkUrl3: '@',
                    linkTitle3: '@',
                    linkClass3: '@',
                    linkIcon3: '@',
                    modalBtn1: '@',
                    modalBtn1Title: '@',
                    modalBtn1Target: '@',
                    modalBtn1Toggle: '@',
                    modalBtn1Class: '@',
                    modalBtnClick: '&',
                    modalBtn1Icon: '@'
                },
                templateUrl: '../templates/page-header.html',
                replace: true
            };
        });

}());
