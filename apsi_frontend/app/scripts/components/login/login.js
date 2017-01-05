'use strict';

angular.module('apsiFrontendApp')
	.controller('LoginCtrl', function($scope, $state, Restangular, AuthService) {
        $scope.out = '';
        $scope.getCred = function() {

            var loginData = {
                username : $scope.username,
                password :$scope.password
            };
            Restangular.oneUrl('login', 'http://localhost:8000/').post('login/', loginData).then(
            function(response)
            {
                console.log('You are logged your tokes is :', response.token);
                AuthService.set(response.token);
                /*Restangular.oneUrl('courses', 'http://localhost:8000/me/').get()
                .then(function(me) {
                if(me.type === 1){
                   $state.go('coursesDispl');
                }
                if(me.type === 0){
                   $state.go('studentCourses');
                }*/
                console.log('I gowno :', response.token);
                AuthService.initSession();
            },
            function() {
                AuthService.logout();
                console.log('Cannot log into system');
            });
  		};
	});
