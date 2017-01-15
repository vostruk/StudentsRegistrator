'use strict';

angular.module('apsiFrontendApp')
  .controller('StudentListCtrl', function ($scope, $state, Restangular, courseCode) {
      $scope.students = [];
      $scope.closingButtonText = 'Open list';
     
      $scope.refresh = function() {
      
      Restangular.oneUrl('asd','http://localhost:8000/courses/' + courseCode + '/registered_students/').get().then(
          function(response)
          {    
              $scope.students = response;
          },
          function()
          {

          }
      );
    };

    $scope.back = function() {
        $state.go('courseedit', {courseid : courseCode});
    };


    $scope.remove = function(studentUsername) {
        console.log("removing " + studentUsername);
        var resId = -1;
        for (var index = 0; index < $scope.students.length; ++index) {
          if($scope.students[index].username == studentUsername)
            resId = $scope.students[index].id;
        }
        if(resId != -1) {
          var toRemove = {students : [resId] };
          Restangular.oneUrl('deleteStudent','http://localhost:8000/courses/' + courseCode + '/registered_students/' + resId + '/').remove().then(
          function(response)
          {    
              $state.reload();
          },
          function()
          {

          }
          );
        }
    };
    $scope.refresh();
  });
