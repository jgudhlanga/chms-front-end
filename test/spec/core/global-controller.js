'use strict';
describe('Controller: GlobalCtrl', function () {

    // load the module
    beforeEach(module('jApp'));

    var GlobalCtrl,scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        GlobalCtrl = $controller('GlobalCtrl', {
            $scope: scope
            // place here mocked dependencies
        });
    }));

    it('exists', function () {
        expect(GlobalCtrl).toBeDefined();
        expect(GlobalCtrl).not.toBeNull();
        expect(typeof GlobalCtrl).toBe('object');
    });

    it('has a list of modules', function(){
       // expect(scope.chmsModules).toBeDefined();
        expect(scope.chmsModules).not.toBeNull();
    });
});