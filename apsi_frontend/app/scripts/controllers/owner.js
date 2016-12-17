'use strict';

angular.module('apsiFrontendApp')
	.controller('OwnerCtrl', function($scope, coursename) {
		$scope.courseData = 
		{
			name : coursename
		};

		$scope.teachers = [
			{
				title : 'prof. ',
				name : 'Andrzej',
				lastname : 'Nowicki'
			},
			{
				title : 'dr. ',
				name : 'Robert',
				lastname : 'Błażej'
			},
			{
				title : 'mgr. inż. ',
				name : 'Jan',
				lastname : 'Nowak'
			}
		];
		//$scope.coursename = courseData;
     	// $scope.params = $routeParams;
	});