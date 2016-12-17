'use strict';

angular.module('apsiFrontendApp')
	.controller('CourseCtrl', function($scope, coursename, Restangular) {
		var courseData = {
			code : coursename
		};
		
		$scope.courseData = courseData;
		console.log('Nazwa kursu ' + coursename);
		//$scope.coursename = courseData;
     	// $scope.params = $routeParams;
     	Restangular.oneUrl('courses', 'http://localhost:8000/courses/').get(coursename)  // GET: /courses/{name}
			.then(function(course) {
			  // returns a list of users
			   console.log('Wynik ' + course.code);
			  $scope.courseDesc = course; // first Restangular obj in list: { id: 123 }
     	});

		$scope.saveCourse = function() {
			Restangular.oneUrl('courses', 'http://localhost:8000/courses/').patch(coursename, { name : $scope.courseDesc.name, syllabus : $scope.courseDesc.syllabus })  // POST: /courses/{name}
			.then(function() {
			 /// $state.go('login');
     	});
		};

	});