(function () {
    'use strict';
    /* My Custom filter */
    angular.module('jApp')
            .filter('objectLength', [function () {
                    return function (object) {
                        var count = 0;
                        for (var i in object) {
                            if (i !== '') {
                                count++;
                            }
                        }
                        return count;
                    };
                }])
            /* Filter an object */
            .filter('orderObjectBy', function () {
                return function (items, field, reverse) {
                    var filtered = [];
                    angular.forEach(items, function (item) {
                        filtered.push(item);
                    });
                    filtered.sort(function (a, b) {
                        return (a[field] > b[field] ? 1 : -1);
                    });
                    if (reverse) {
                        filtered.reverse();
                    }
                    return filtered;
                };
            })
            /* Search  */
            .filter('filterGroups', function () {
                return function (arr, searchString) {
                    if (!searchString) {
                        return arr;
                    }
                    var result = [];
                    searchString = searchString.toLowerCase();
                    angular.forEach(arr, function (item) {
                        if (item.name.toLowerCase().indexOf(searchString) !== -1) {
                            result.push(item);
                        }
                    });
                    return result;
                };
            });
}());