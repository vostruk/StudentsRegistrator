'use strict';

angular.module('apsiFrontendApp')
	.controller('LoginCtrl', function($scope, $state, Restangular, LoggedInRestangular, AuthService) {
		  $scope.out = '';
		  $scope.getCred = function() {
		  	 var loginData = {
		  	 	username : $scope.username,
		  	 	password : $scope.password
		  	 };
		  	 Restangular.oneUrl('login', 'http://localhost:8000/').post('login/', loginData).then(
		  	  function(response)
		  	  {
		  	  	console.log('You are logged your tokes is :', response.token);
		  	  	$scope.out = 'Yoy are logged as ' + $scope.username;
		  	  	LoggedInRestangular.set(response.token);
            Restangular.oneUrl('courses', 'http://localhost:8000/me/').get()
              .then(function(me) {
                if(me.type === 1){
                   $state.go('coursesDispl');
                }
                if(me.type === 0){
                   $state.go('studentCourses');
                }
            });
			  },
			  function() {
			  	$scope.out = 'Cannot log';
			    console.log('Cannot log into system');
			  });

    	//	$scope.quantityResult = calculateService.calculate($scope.quantity, 10);
  		};
	});
