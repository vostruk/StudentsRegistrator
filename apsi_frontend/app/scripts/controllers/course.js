'use strict';

angular.module('apsiFrontendApp')
	.controller('CourseCtrl', function($scope, coursename) {
		var courseData = {
			name : coursename
		};
		$scope.coursename = coursename;
		$scope.courseData = courseData;
		//$scope.coursename = courseData;
     	// $scope.params = $routeParams;
	});