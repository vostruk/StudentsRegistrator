'use strict';

angular.module('apsiFrontendApp')
	.controller('CourseCtrl', function($scope, coursename, Restangular) {
		var courseData = {
			name : coursename
		};
		$scope.coursename = coursename;
		$scope.courseData = courseData;
		//$scope.coursename = courseData;
     	// $scope.params = $routeParams;
     	Restangular.allUrl('courses', 'http://localhost:8000/courses/').getList()  // GET: /courses
			.then(function(courses) {
			  // returns a list of users
			  $scope.corusesDesc = courses; // first Restangular obj in list: { id: 123 }
		});

	});