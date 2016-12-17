'use strict';

angular.module('apsiFrontendApp')
	.controller('CourseCtrl', function($scope, $state, coursename, Restangular,$filter) {

    function findBySpecField(data, value) {
    var container = data;

    for (var i = 0; i < container.length; i++) {
      console.log('    '+container[i].id);
        if (container[i].id == value) {
            console.log('+++'+container[i].full_name);
            return(container[i]);
        }
    }
    return '';
}

		console.log('Nazwa kursu ' + coursename);
    Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+coursename+'/').get()  // GET: /courses/{name}
			.then(function(course) {
        console.log('Wynik ' + course.code);
			  $scope.courseDesc = course;
        $scope.courseData = $scope.courseDesc;
        console.log('Wynikk ' + $scope.courseDesc.tutor);
     	});


    Restangular.oneUrl('coursesdd', 'http://localhost:8000/tutors/').get()  // GET: /courses/{name}
			.then(function(tutors) {
        console.log('Tutorzy ' + tutors);
			  $scope.tutors = tutors;
        $scope.courseDescSelectedTutor = findBySpecField(tutors, $scope.courseData.tutor);
        console.log('Znalezione' + $scope.courseDescSelectedTutor.id);
     	});

		$scope.saveCourse = function() {
      var loginData = {
            code: $scope.courseData.code,
            name: $scope.courseDesc.name,
            syllabus: $scope.courseDesc.syllabus,
            tutor: $scope.courseDescSelectedTutor.id,
            registered: null,
            state: 0
        };
      console.log(loginData.code);
      console.log(loginData.name);
      console.log(loginData.syllabus);
      console.log($scope.courseDesc.registered);
        Restangular.oneUrl('asdda','http://localhost:8000/courses/'+$scope.courseData.code+'/').patch(loginData).then(
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
