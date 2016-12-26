/**
 * Created by marzuz on 26.12.16.
 */
'use strict';

angular.module('apsiFrontendApp')
	.controller('EditTypeCtrl', function($scope, $state, coursename, typeId, Restangular) {
    $scope.setVisibility = 'hidden';

    //TODO pobieranie terminow do typu i wyswietlenie listy
    // Restangular.oneUrl('asd','http://url/').get()
    //     .then( function(termines) {
    //         console.log('Get termines:  ' + termines);
    //         $scope.termines = termines;
    //       }
    //     );

    Restangular.oneUrl('asd','http://localhost:8000/courses/'+coursename+'/class_types/'+typeId+'/').get()
        .then( function(type) {
            console.log('Get:  ' + type.name);
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

    $scope.week = [
      {
        id: 1,
        name: 'Poniedzialek'
      },
      {
        id: 2,
        name: 'Wtorek'
      },
      {
        id: 3,
        name: 'Sroda'
      },
      {
        id: 4,
        name: 'Czwartek'
      },
      {
        id: 5,
        name: 'Piatek'
      }
    ];
    $scope.day = $scope.week[0];

    $scope.addTermine = function() {
      $scope.setVisibility = 'visible';
    };

    $scope.saveTermine = function() {
      var termine = {
        day: $scope.day,
        from: $scope.fromInput,
        to: $scope.toInput
      };
      //TODO zapis terminu
      // Restangular.oneUrl('asd','http://localhost:8000/courses/'+coursename).post('asd/',termine).then(
      //     function() {
      //     console.log('Created new termine.  ');
      //     $scope.reload()
      //     },
      //     function()
      //     {
      //       console.log('Cannot create termine.');
      //     }
      //   )};
      $scope.setVisibility = 'hidden';

    };

    $scope.removeTermine = function(id) {
      //TODO usuwanie terminu
      // Restangular.oneUrl('courses', 'http://localhost:8000/url/').remove()
      //   .then(function() {
      //     console.log(id+' deleted');
      //     $state.reload();
      // });
    };
	});
