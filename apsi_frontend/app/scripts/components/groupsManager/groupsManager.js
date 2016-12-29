/**
 * Created by marzuz on 29.12.16.
 */
'use strict';

angular.module('apsiFrontendApp')
	.controller('GroupsManagerCtrl', function($scope, $state, courseCode, typeId, Restangular) {
    $scope.courseCode = courseCode;
    $scope.newGroupVisible = 'hidden';
    $scope.groupName = null;

    Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+courseCode+'/class_types/'+typeId+'/groups/').get()  // Dawaj Grupy dla zajec
			.then(function(classGroups) {
			  $scope.classGroups = classGroups;
        $scope.isMyGroup = false;
          Restangular.oneUrl('coursesdd', 'http://localhost:8000/me/').get()  // Pobierz MNIE (usera)
            .then(function(me) {
              $scope.me = me;
              for (var i = 0; i < classGroups.length; i++) {
                if ($scope.classGroups[i].creator.id === me.id) {
                  $scope.isMyGroup = true;
                  $scope.myGroup = $scope.classGroups[i];
                  break;
                }
              }
          });
	 	});

    $scope.createGroup = function () {
      $scope.newGroupVisible = 'visible';
    };

    $scope.submitGrupe = function (name) {
      console.log(name);
      var newGroup = {
        name: name
      };
      Restangular.oneUrl('asd','http://localhost:8000/courses/'+courseCode+'/class_types/'+typeId+'/').post('groups/',newGroup).then(
        function() {
          console.log('Created new Group.  ');
          $scope.newGroupVisible = 'hidden';
          $state.reload();
        },
        function()
        {
          console.log('Cannot create Group.');
        }
      );
    };

    $scope.signToGroup = function (groupId) {
      Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+courseCode+'/class_types/'+typeId+'/groups/'+groupId+'/register/').put()
        .then(function() {
          console.log(groupId+' register');
          $state.reload();
      });
    };

    $scope.removeGroup = function () {
      Restangular.oneUrl('courses', 'http://localhost:8000/courses/'+courseCode+'/class_types/'+typeId+'/groups/'+$scope.myGroup.id+'/').remove().then(
          function()
          {
            console.log('Group deleted');
            $state.reload();
          },
          function ()
          {
            console.log('remove fail.');
          }
      );
    };

	});
