'use strict';

angular.module('apsiFrontendApp').factory('AuthService', function(Restangular, $cookieStore, $http,$state,$rootScope, Session, USER_ROLES) {
    var instance = {};
    var logout = function() {
        Session.clear();
        $cookieStore.remove('djangotoken');
        $http.defaults.headers.common.Authorization = '';
    
    };
   
    instance.set  = function(token) {
        Restangular.withConfig(function() {
            console.log('Start init for ', token);
            $cookieStore.put('djangotoken', token);
            $http.defaults.headers.common.Authorization = 'Token ' + token;
        });
    };
 
    var userData = {};

    instance.initSession = function( ) {
        var tokenValue = $cookieStore.get('djangotoken');
        
        console.log('Init session');
        if(tokenValue) {
            Restangular.withConfig(function() {        
                $http.defaults.headers.common.Authorization = 'Token ' + tokenValue;
            });
        }

        Restangular.oneUrl('courses', 'http://localhost:8000/me/').get()  // GET: /me/
        .then(function(response) {

            userData = response;

            var role = USER_ROLES.public;
            switch(response.type)
            {
                case 0:
                role = USER_ROLES.student;
                break;
                case 1:
                role = USER_ROLES.tutor;
                break;
                case 2:
                role = USER_ROLES.admin;
                break;
            }
               console.log('Get info for user',response);
            Session.create(tokenValue, response.id, role, response.username);

            

            $rootScope.$broadcast("loginSucces");

        },
        function() 
        { 
            //logout();
        }
        );
    };
    
    instance.isAuthenticate = function() {
        return !!Session.userId;
    };
    
    instance.isAuthorized = function(authorizedRoles) 
    {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (!!Session.userId &&
            authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    instance.logout = function() {
        Session.destroy();
        $cookieStore.remove('djangotoken');
        $http.defaults.headers.common.Authorization = '';
        $state.go('login');
    
    };
    instance.getUserData = function() {
        return userData;
    };

    instance.isStudent = function() {
        return userData.type === 1;
    };
    instance.isTutor = function() {
        return userData.type === 0;
    };
    instance.isAdmin = function() {
        return userData.type === 2;
    };


    return instance;
});