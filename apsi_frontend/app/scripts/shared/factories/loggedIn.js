'use strict';

angular.module('apsiFrontendApp').factory('LoggedInRestangular', function(Restangular, $cookieStore, $http) {
	var service = {};
	var instance = null;
	var tokenSaved = null;
	service.set  = function(token) {
		instance = Restangular.withConfig(function() {
		console.log('Start init for ', token);
			tokenSaved = token;
			$cookieStore.put('djangotoken', token);
			$http.defaults.headers.common.Authorization = 'Token ' + token;
		});
	};
 

	service.init = function() {
		var tokenValue = $cookieStore.get('djangotoken');
		if(tokenValue) {
			instance = Restangular.withConfig(function() {

				console.log('Get token from value ', tokenValue);
				
				$http.defaults.headers.common.Authorization = 'Token ' + tokenValue;
			});
		}
	};

	service.get = function() {
		return instance;
	};

	service.init();

	return service;
});