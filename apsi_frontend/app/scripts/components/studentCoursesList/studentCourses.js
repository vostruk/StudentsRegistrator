/**
 * Created by marzuz on 24.12.16.
 */

'use strict';

angular.module('apsiFrontendApp')
	.controller('StudentCoursesCtrl', function($http, $scope, $state, $stateParams, Restangular) {

		$http.get('http://localhost:8000/courses/?registered=true').then(function (response) {
        console.log(response.data);
        $scope.records = response.data;
        for (var i = 0; i < response.data.length; i++) {
           if ($scope.records[i].state === 0){
             $scope.records[i].state = "Otwarta";
           } else {
             $scope.records[i].state = "Zamknieta";
           }
        }
      });

    $scope.unregisterClick = function (id) {
      Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+id+'/registration/').remove()
        .then(function() {
          console.log(id+' redirect to unregister');
          $state.reload();
      });
    };

    $scope.detailsClick = function (id) {
      console.log(id+' details');
      $state.go('studentCourse', {courseid:id});
    };

    $scope.registerClick = function () {
      console.log('goto registration');
      $state.go('registerToCourse');
    };

	});
