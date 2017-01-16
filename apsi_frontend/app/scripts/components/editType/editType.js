/**
 * Created by marzuz on 26.12.16.
 */
'use strict';

angular.module('apsiFrontendApp')
	.controller('EditTypeCtrl', function($scope, $state, coursename, typeId, Restangular) {
    $scope.setVisibility = 'hidden';
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
    Restangular.oneUrl('asd','http://localhost:8000/courses/'+coursename+'/class_types/'+typeId+'/time_slots/').get()
        .then( function(termines) {
            console.log('Get termines:  ' + termines);
            $scope.termines = dayFormat(termines);
          }
        );

    Restangular.oneUrl('asd','http://localhost:8000/courses/'+coursename+'/class_types/'+typeId+'/').get()
        .then( function(type) {
            console.log('Get:  ' + type.name);
            console.log('Groups:  ' + type.group_open);
            $scope.classType = type;
          }
        );

    $scope.goBack = function() {
      $state.go('courseedit', {courseid: coursename});
    };

    $scope.editType = function() {
      Restangular.oneUrl('asd','http://localhost:8000/courses/'+coursename+'/class_types/'+typeId+'/').patch($scope.classType).then(
            function()
            {
              console.log('Updated:  ' +$scope.classType.name);
              $state.go('courseedit', {courseid:coursename});
            },
            function()
            {
              console.log('Cannot update type. ' );
            }
        );
    };


    $scope.day = $scope.week[0];

    $scope.addTermine = function() {
      $scope.setVisibility = 'visible';
    };

    $scope.saveTermine = function() {
      var termine = {
        day: $scope.day.id,
        time_start: $scope.fromInput,
        time_end: $scope.toInput,
        max_students_enrolled: $scope.maxStudents
      };
      Restangular.oneUrl('asd','http://localhost:8000/courses/'+coursename+'/class_types/'+typeId+'/').post('time_slots/',termine).then(
          function() {
            console.log('Created new termine.  ');
            $scope.setVisibility = 'hidden';
            $state.reload();
          },
          function()
          {
            console.log('Cannot create termine.');
          }
        );


    };

    $scope.removeTermine = function(id) {
      Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+coursename+'/class_types/'+typeId+'/time_slots/'+id+'/').remove()
        .then(function() {
          console.log(id+' deleted');
          $state.reload();
      });
    };

    $scope.acceptGroups = function () {
      Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+coursename+'/class_types/'+typeId+'/groups/open/').put()
        .then(function() {
          console.log('groups open.');
          $state.reload();
      });
    };

    $scope.rejectGroups = function () {
      Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+coursename+'/class_types/'+typeId+'/groups/close/').put()
        .then(function() {
          console.log('groups close.');
          $state.reload();
      });
    };
	});
