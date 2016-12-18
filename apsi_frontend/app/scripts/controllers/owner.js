'use strict';

angular.module('apsiFrontendApp')
	.controller('OwnerCtrl', function($scope, courseCode) {
		$scope.courseData = 
		{
			name : courseCode
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
	});