
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
  .config(function ($stateProvider,  $urlRouterProvider, USER_ROLES) {
      var aboutState = {
          name : 'about',
          url : '/about',
          template : '<h2>About</h2>'
      };


    var editTypeState = {
        name : 'typeedit',
        url : '/editType/:courseid/:classid',
        templateUrl: 'scripts/components/editType/editType.html',
        controller: 'EditTypeCtrl as EditTypeCtrl',
        resolve : {
          coursename : function($stateParams) {
            return $stateParams.courseid;
          },
          typeId : function($stateParams) {
            return $stateParams.classid;
          }
        },
        data : {
          authorization : true
        }
    };

    var groupsManagerState = {
        name : 'groupsManager',
        url : '/groupsManager/:courseid/:classid',
        templateUrl: 'scripts/components/groupsManager/groupsManager.html',
        controller: 'GroupsManagerCtrl as GroupsManagerCtrl',
        resolve : {
          courseCode: function($stateParams) {
            return $stateParams.courseid;
          },
          typeId : function($stateParams) {
            return $stateParams.classid;
          }
        },
        data : {
          authorization : true
        }
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
        },
        data : {
          authorization : true
        }
    };

    var AddCourseState = {
        name : 'addcourse',
        url : '/courses/add',
        templateUrl: 'scripts/components/addCourse/addCourse.html',
        controller: 'AddCourseCtrl as managecourse',
        data : {
          authorization : true
        }
    };


    var createTypeState = {
        name : 'createType',
        url : '/createType/{courseid}/',
        templateUrl: 'scripts/components/createType/createType.html',
        controller: 'CreateTypeCtrl as CreateTypeCtrl',
        resolve : {
          coursename : function($stateParams) {
            return $stateParams.courseid;
          }
        },
        data : {
          authorization : true
        }
    };

    var registerToCourseState = {
        name : 'registerToCourse',
        url : '/studentregister',
        templateUrl: 'scripts/components/registerToCourse/registerToCourse.html',
        controller: 'RegisterToCourseCtrl as register',
        data : {
          authorization : true
        }
    };

    var studentCoursesState = {
        name : 'studentCourses',
        url : '/studentcourses',
        templateUrl: 'scripts/components/studentCoursesList/studentCourses.html',
        controller: 'StudentCoursesCtrl as studentcourses',
        data : {
          authorization : true
        }
    };

    var studentCourseState = {
        name : 'studentCourse',
        url : '/studentcourse/{courseid}',
        templateUrl: 'scripts/components/studentCourse/studentCourse.html',
        controller: 'StudentCourseCtrl as StudentCourseCtrl',
        resolve : {
          coursename : function($stateParams) {
            return $stateParams.courseid;
          }
        },
        data : {
          authorization : true
        }
    };

    var coursesDisplayState = {
        name : 'coursesDispl',
        url : '/courses',
        templateUrl: 'scripts/components/coursesList/courses.html',
        controller: 'CoursesCtrl as CoursesCtrl',
        data : {
          authorization : true
        }
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
      data : {
        authorization : true
      },
      resolve : {
          courseCode : function($stateParams) {
            return $stateParams.courseid;
          }
        }
    };



    $stateProvider.state(createTypeState);
    $stateProvider.state(AddCourseState);
    $stateProvider.state(aboutState);
    $stateProvider.state(courseEditState);
    $stateProvider.state(loginState);
    $stateProvider.state(coursesDisplayState);
    $stateProvider.state(studentListState);
    $stateProvider.state(studentCoursesState);
    $stateProvider.state(studentCourseState);
    $stateProvider.state(registerToCourseState);
    $stateProvider.state(editTypeState);
    $stateProvider.state(groupsManagerState);
    $urlRouterProvider.otherwise('/login');


  });

angular.module('apsiFrontendApp').run(function(_, $rootScope, $state, AuthService, $cookieStore, USER_ROLES) {
      $rootScope.token = $cookieStore.get('djangotoken') || {};
      //AuthService.set($rootScope.token);
      if($rootScope.token !== null)
      {
          AuthService.initSession();
      }
      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          if(toState.name == 'login' &&  AuthService.isAuthenticate())
          {
            $state.go('coursesDispl');
          }
          if(toState.data !== undefined)
            if(toState.data.authorization !== undefined && toState.data.authorization === true)
            {
               console.log('Zmiana autoryzacja: ' + AuthService.isAuthenticate() + "Posiada " + toState.data.authorization + ' ' + toState.name);
               if (!AuthService.isAuthenticate() && toState.data.authorization) {
                  $state.go('login');
                }
            }
         
      });
      $rootScope.$on("loginSucces", function() {
        if(AuthService.isAuthorized(USER_ROLES.student))
        {
           $state.go('studentCourses');
        }
        if(AuthService.isAuthorized(USER_ROLES.tutor))
        {
            $state.go('coursesDispl');
        }
        if(AuthService.isAuthorized(USER_ROLES.admin))
        {
            $state.go('coursesDispl');
        }
        
      });
  }
);