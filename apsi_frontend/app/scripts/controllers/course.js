'use strict';

angular.module('apsiFrontendApp')
	.controller('CourseCtrl', function($scope, $state, coursename, Restangular) {



		console.log('Nazwa kursu ' + coursename);
    Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+coursename+'/').get(coursename)  // GET: /courses/{name}
			.then(function(course) {
        console.log('Wynik ' + course.code);
			  $scope.courseDesc = course; // first Restangular obj in list: { id: 123 }
        $scope.courseData = $scope.courseDesc;
     	});


    Restangular.oneUrl('courses', 'http://localhost:8000/tutors/').get()  // GET: /courses/{name}
			.then(function(tutors) {
        console.log('Tutorzy ' + tutors);
			  $scope.tutors = tutors;
        $scope.courseDescSelectedTutor = tutors[0];

     	});

		$scope.saveCourse = function() {

      var loginData = {
            code: $scope.courseData.code,
            name: $scope.courseDesc.name,
            syllabus: $scope.courseDesc.syllabus,
            tutor: 7,
            registered: $scope.courseData.registered,
            state: $scope.courseData.state
        };
        console.log(loginData.code);
        Restangular.oneUrl('asdd','http://localhost:8000/courses/'+$scope.courseData.code+'/').patch(loginData).then(
            function()
            {
              console.log('Updated:  ' +loginData.name +loginData.code);
              $state.go('coursesDispl');
            },
            function()
            {
              console.log('Cannot update course. ' +loginData.name +loginData.code);
            }
        );
			// Restangular.oneUrl('courses', 'http://localhost:8000/courses/').patch(coursename, { name : $scope.courseDesc.name, syllabus : $scope.courseDesc.syllabus })  // POST: /courses/{name}
			// .then(function() {
			 /// $state.go('login');
     	};


	});
