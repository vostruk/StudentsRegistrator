
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
      var aboutState = {
          name : 'about',
          url : '/about',
          template : '<h2>About</h2>'
      };


      var courseEditState = {
          name : 'courseedit',
          url : '/courses/{courseid}',
          templateUrl: 'scripts/components/course/course.html',
          controller: 'CourseCtrl as course',
          resolve : {
              courseCode : function($stateParams) {
                  return $stateParams.courseid;
              }
          }
      };
      
      var AddCourseState = {
          name : 'addcourse',
          url : '/courses/add',
          templateUrl: 'scripts/components/addCourse/addCourse.html',
          controller: 'AddCourseCtrl as managecourse'
      };

      var coursesDisplayState = {
          name : 'coursesDispl',
          url : '/courses',
          templateUrl: 'scripts/components/coursesList/courses.html',
          controller: 'CoursesCtrl as courses'
      };

      var loginState = {
          name : 'login',
          url : '/login',
          templateUrl : 'scripts/components/login/login.html',
          controller : 'LoginCtrl'
      };

      var studentListState = {
          name : 'studentList',
          url : '/courses/{courseid}/students',
          templateUrl : 'scripts/components/studentList/studentList.html',
          controller : 'StudentListCtrl',
          resolve : {
              courseCode : function($stateParams) {
                return $stateParams.courseid;
              }
            }
      };

      $stateProvider.state(AddCourseState);
      $stateProvider.state(aboutState);
      $stateProvider.state(courseEditState);
      $stateProvider.state(loginState);
      $stateProvider.state(coursesDisplayState);
      $stateProvider.state(studentListState);


      $urlRouterProvider.otherwise('/login');


  });
