'use strict';

angular.module('apsiFrontendApp').service('AuthService', function(Restangular, $cookieStore, $http, Restangular ) {

    this.set  = function(token) {
        instance = Restangular.withConfig(function() {
        console.log('Start init for ', token);
            $cookieStore.put('djangotoken', token);
            $http.defaults.headers.common.Authorization = 'Token ' + token;
        });
    };
 
    var userData = {};

    this.isAuthenticate = function() {
        var tokenValue = $cookieStore.get('djangotoken');
        
        if(tokenValue) {
            instance = Restangular.withConfig(function() {        
                $http.defaults.headers.common.Authorization = 'Token ' + tokenValue;
            });
        }
        var connect = false;
        stangular.oneUrl('courses', 'http://localhost:8000/me/').get()  // GET: /me/
        .then(function(response) {
            connect = true;
            userData = response;
        },
        function() 
        { 
            userData = {} 
        }
        );
        return connect;
    };

    this.getUserData = function() {
        return userData;
    };

    this.isStudent = function() {
        return userData.type === 1;
    };
    this.isTutor = function() {
        return userData.type === 0;
    };
    this.isAdmin = function() {
        return userData.type === 2;
    };
});