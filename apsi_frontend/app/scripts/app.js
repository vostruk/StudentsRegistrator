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
    'ui.router'
  ])
  .config(function ($stateProvider,  $urlRouterProvider) {
    var mainState = {
        name : 'main' ,
        url :'/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    };

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

    $stateProvider.state(aboutState);
    $stateProvider.state(courseEditState);
    $stateProvider.state(mainState);
    $stateProvider.state(ownerCourseEditState);
    $stateProvider.state(coursesDisplayState);

    $urlRouterProvider.otherwise('/');
  });
