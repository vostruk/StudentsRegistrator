'use strict';

angular.module('apsiFrontendApp')
  .controller('CourseCtrl', function($scope, $state, courseCode, Restangular) {
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
  var courseData = {}; // Contatins data which is not allowed to change by user
  $scope.courseDesc = {}; // Contains data which user can change 
  Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+courseCode+'/').get()  // GET: /courses/{name}
    .then(function(course) {
        $scope.courseDesc = course;
        courseData = $scope.courseDesc;
     });


  Restangular.oneUrl('coursesdd', 'http://localhost:8000/tutors/').get()  // GET: /courses/{name}
    .then(function(tutors) {
        console.log('Tutorzy ' + tutors);
        $scope.tutors = tutors;
        $scope.courseDescSelectedTutor = findBySpecField(tutors, courseData.tutor);
        console.log('Znalezione' + $scope.courseDescSelectedTutor.id);
       });

    $scope.saveCourse = function() {
        var loginData = {
            code: courseData.code,
            name: $scope.courseDesc.name,
            syllabus: $scope.courseDesc.syllabus,
            tutor: $scope.courseDescSelectedTutor.id,
            registered: null,
            state: 0
        };
      
        Restangular.oneUrl('asdda','http://localhost:8000/courses/'+courseData.code+'/').patch(loginData).then(
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
  });