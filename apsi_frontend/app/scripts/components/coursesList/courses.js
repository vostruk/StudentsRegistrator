/**
 * Created by marzuz on 17.12.16.
 */
'use strict';

angular.module('apsiFrontendApp')
  .controller('CoursesCtrl', function($http, $scope, $state, $stateParams) {

    $http.get('http://localhost:8000/courses/?tutored=true').then(function (response) {
        console.log(response.data);
        $scope.records = response.data;
    });

<<<<<<< HEAD

    $scope.detailClick = function (id) {
        console.log(id+' redirect to detail');
    };

=======
>>>>>>> 171ccdb8ffd48c74477388f40493d509163ca30a
    $scope.editClick = function (id) {
        console.log(id+' redirect to edit');
        $state.go('courseedit', {courseid:id});
    };

    $scope.addClick = function () {
        console.log(' redirect to add');
        $state.go('addcourse');
    };
    $scope.deleteClick = function (id) {
        console.log(id+' redirect to delete');
        $http.delete('http://localhost:8000/courses/'+id+'/').then(function () {
        $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });
      });
    };
  });
