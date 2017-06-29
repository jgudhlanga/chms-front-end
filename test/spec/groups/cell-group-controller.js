/* global*/
(function(){
	'use strict';
	describe('Controller: GroupsCtrl', function(){

		var GroupsCtrl, $rootScope, $scope;
		//instantiate the controller and a mock scope
		beforeEach(function(){
			module('jApp');
			inject(function($injector){
				$rootScope = $injector.get('$rootScope');
				$scope = $rootScope.$new();
				GroupsCtrl = $injector.get('$controller')('GroupsCtrl', {$scope: $scope});
			});
		});


		//Initialization
		describe('Initialization', function(){
			it('exists', function(){
				expect(GroupsCtrl).toBeDefined();
				expect(GroupsCtrl).not.toBeNull();
				expect(typeof GroupsCtrl).toBe('object');
			});

			it('has a list of Groups', function(){
				expect($scope.chmsGroups).not.toBeNull();
				//expect(typeof $scope.chmsGroups).toBe('object');
			});
		});

		//Action Handlers
		describe('Action Handlers', function(){
			it('creates a group', function(){

			});
			it('has a single group', function(){

			});
			it('update a group', function(){

			});
			it('delete a group', function(){

			});
			it('activate a group', function(){

			});
		});
	});
}());
