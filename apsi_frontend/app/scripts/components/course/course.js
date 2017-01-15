'use strict';

angular.module('apsiFrontendApp')
	.controller('CourseCtrl', function($scope, $state, courseCode, Restangular) {
    $scope.week = [
      {
        id: 0,
        name: 'Poniedzialek'
      },
      {
        id: 1,
        name: 'Wtorek'
      },
      {
        id: 2,
        name: 'Sroda'
      },
      {
        id: 3,
        name: 'Czwartek'
      },
      {
        id: 4,
        name: 'Piatek'
      }
    ];
    $scope.i = 0;

    function findDay(day_id) {
        for (var i=0; i<$scope.week.length; i++) {
          if($scope.week[i].id === day_id){
            return $scope.week[i].name;
          }
        }
    }

    function dayFormat(termines) {
        for (var i=0; i<termines.length; i++) {
          termines[i].day = findDay(termines[i].day)
        }
        return termines;
    }

    Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+courseCode+'/class_types/').get()
			.then(function(classType) {
        console.log('types: '+classType);
        $scope.classType = classType;
        for (var i=0; i < classType.length; i++) {
          $scope.classType[i].time_slots = dayFormat($scope.classType[i].time_slots);
        }
	 	});


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
        if (course.state == 0) {
          $scope.isOpened = true;
        }
        courseData = $scope.courseDesc;
        Restangular.oneUrl('coursesdd', 'http://localhost:8000/tutors/').get()  // GET: /courses/{name}
          .then(function(tutors) {
            console.log('Tutorzy ' + tutors);
            $scope.tutors = tutors;
            $scope.courseDescSelectedTutor = findBySpecField(tutors, $scope.courseDesc.tutor);
            console.log('Znalezione' + $scope.courseDescSelectedTutor.id);
          });
      });



     $scope.saveCourse = function(state) {
       state = typeof state !== 'undefined' ? state : $scope.courseDesc.state;
  		var loginData = {
            code: $scope.courseDesc.code,
            name: $scope.courseDesc.name,
            syllabus: $scope.courseDesc.syllabus,
            tutor: $scope.courseDescSelectedTutor.id,
            registered: null,
            state: state
      };

        Restangular.oneUrl('asdda','http://localhost:8000/courses/'+$scope.courseDesc.code+'/').patch(loginData).then(
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

 	  $scope.clearData = function () {
 	    Restangular.oneUrl('clearData', 'http://localhost:8000/courses/'+$scope.courseDesc.code+'/clear_all_data').put().then(
            function() {
                console.log('Cleared course data');
                $state.go('coursesDispl');
            },
            function() {
                console.log('Cannot clear course data with opened registration');
            }
        );
    };

    $scope.goBack = function() {
      $state.go('coursesDispl');
    };

    $scope.acceptTimeSlot = function(typeId, slotId) {
 	    Restangular.oneUrl('acceptTimeSlot', 'http://localhost:8000/courses/'+$scope.courseDesc.code+'/class_types/'+typeId+'/time_slots/close').put().then(
            function() {
                console.log('Accepted time slot');
                $state.reload()
            },
            function() {
                console.log('Cannot accept time slot');
            }
        );
    };

    $scope.createType = function() {
      $state.go('createType', {courseid: courseCode});
    };

    $scope.editType = function(typeid) {
      $state.go('typeedit', {courseid: courseCode, classid: typeid});
    };

    $scope.removeType = function(typeid) {
      Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+courseCode+'/class_types/'+typeid+'/').remove().then(
          function()
          {
            console.log(typeid+' deleted');
            $state.reload();
          },
          function ()
          {
            console.log('remove fail.');
          }
      );
    };


	});
