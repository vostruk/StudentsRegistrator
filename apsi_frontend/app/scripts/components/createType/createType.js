/**
 * Created by marzuz on 25.12.16.
 */
'use strict';

angular.module('apsiFrontendApp')
	.controller('CreateTypeCtrl', function($scope, $state, coursename, Restangular) {

    $scope.goBack = function() {
      $state.go('courseedit', {courseid: coursename});
    };

    $scope.saveType = function() {
      Restangular.oneUrl('asd','http://localhost:8000/courses/'+coursename).post('class_types/',{name: $scope.typeName})
        .then(
          function() {
          console.log('Created:  ' + $scope.typeName);
          $state.go('courseedit', {courseid: coursename});
          },
          function()
          {
            console.log('Cannot create theme. '+$scope.typeName);
          }
        )};


	});
