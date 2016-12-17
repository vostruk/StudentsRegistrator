'use strict';

angular.module('apsiFrontendApp').factory('LoggedInRestangular', function(Restangular, $cookieStore, $http) {
  var service = {};
  var instance = null;
  var tokenSaved = null;
  service.init = function(token) {
    instance = Restangular.withConfig(function() {
    	console.log('Start init for ', token);
    	tokenSaved = token;
    	$cookieStore.put('djangotoken', token);
    	$http.defaults.headers.common.Authorization = 'Token ' + token;
    });
  };

  service.get = function() {
    return instance;
  };

  return service;
});