
'use strict';

/**
 * @ngdoc overview
 * @name apsiFrontendApp
 * @description
 * # apsiFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('apsiFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'restangular'
  ])
  .config(function ($stateProvider,  $urlRouterProvider) {
<<<<<<< HEAD
=======
    var mainState = {
        name : 'main' ,
        url :'/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    };
>>>>>>> 9c5081716c1dab91dc28a9de30b2d255dbfe5b09

    var aboutState = {
      name : 'about',
      url : '/about',
      template : '<h2>About</h2>'
    };


    var courseEditState = {
        name : 'courseedit',
        url : '/course/{courseid}',
        templateUrl: 'views/course.html',
        controller: 'CourseCtrl as course',
        resolve : {
          coursename : function($stateParams) {
            return $stateParams.courseid;
          }
        }
    };

    var coursesDisplayState = {
        name : 'coursesDispl',
        url : '/courses/',
        templateUrl: 'views/courses.html',
        controller: 'CoursesCtrl as course'
    };

    var ownerCourseEditState = {
        name : 'ownerChange',
        url : '/course/{courseid}/owner',
        templateUrl: 'views/owner.html',
        controller: 'OwnerCtrl as owner',
        resolve : {
          coursename : function($stateParams) {
            return $stateParams.courseid;
          }
        }
    };

<<<<<<< HEAD
    var loginState = {
      name : 'login',
      url : '/login',
      templateUrl : 'views/login.html',
      controller : 'LoginCtrl'
    };
    

    $stateProvider.state(aboutState);
    $stateProvider.state(courseEditState);
    $stateProvider.state(ownerCourseEditState);
    $stateProvider.state(loginState);
    $stateProvider.state(coursesDisplayState);

    $urlRouterProvider.otherwise('/login');
  });
