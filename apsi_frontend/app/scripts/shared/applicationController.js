'use strict';

angular.module('apsiFrontendApp')
	.controller('ApplicationController', function($scope, USER_ROLES, AuthService, Session) {
 
		$scope.currentUser = '';
		$scope.userRoles = USER_ROLES;
		$scope.isAuthorized = AuthService.isAuthorized;
		$scope.isAuthenticate = AuthService.isAuthenticate;
		$scope.logout = AuthService.logout;
		$scope.setCurrentUser = function(user)
		{
			$scope.currentUser = user;
  		};
  		$scope.getUserName = function() 
  		{
  			return Session.userName;
  		}

	});
