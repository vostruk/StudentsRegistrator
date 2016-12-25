'use strict';

angular.module('apsiFrontendApp')
	.controller('CourseCtrl', function($scope, $state, coursename, Restangular) {

    function findBySpecField(data, value) {
      var container = data;
      for (var i = 0; i < container.length; i++) {
          console.log('    '+container[i].id);
            if (container[i].id === value) {
                console.log('+++'+container[i].full_name);
              return(container[i]);
            }
      }
      return '';
    }



	  Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+coursename+'/').get()  // GET: /courses/{name}
			.then(function(course) {
			  $scope.courseDesc = course;
	    	  $scope.courseData = $scope.courseDesc;
	 	});

    Restangular.oneUrl('coursesdd', 'http://localhost:8000/tutors/').get()  // GET: /courses/{name}
		  .then(function(tutors) {
        console.log('Tutorzy ' + tutors);
			  $scope.tutors = tutors;
        $scope.courseDescSelectedTutor = findBySpecField(tutors, $scope.courseData.tutor);
        console.log('Znalezione' + $scope.courseDescSelectedTutor.id);
      });

    Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+coursename+'/class_types/').get()  // GET: /courses/{name}
			.then(function(classType) {
			  $scope.classType = classType;
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

 	  };

    $scope.goBack = function() {
      $state.go('coursesDispl');
    };

    $scope.createType = function() {
      $state.go('createType', {courseid: coursename});
    };


	});
