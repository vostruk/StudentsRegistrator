/**
 * Created by marzuz on 17.12.16.
 */
'use strict';

angular.module('apsiFrontendApp')
	.controller('AddCourseCtrl', function($scope, $state, Restangular) {

    Restangular.oneUrl('courses', 'http://localhost:8000/me/').get()
      .then(function(me) {
        $scope.me = me;
      });

    $scope.addCourse = function () {
        var loginData = {
            code: $scope.coursecode,
            name: $scope.coursename,
            syllabus: $scope.coursesyllabus,
            tutor: $scope.me.id,
            registered: null,
            state: 0
        };
        Restangular.oneUrl('asd','http://localhost:8000/').post('courses/',loginData).then(
            function()
            {
              console.log('Created:  ' +loginData.name +loginData.code);
              $state.go('coursesDispl');
            },
            function()
            {
              console.log('Cannot create course. ' +loginData.name +loginData.code);
            }
        );
    };

    $scope.cancelEdit = function () 
    {
        $state.go('coursesDispl');
    };

	});
