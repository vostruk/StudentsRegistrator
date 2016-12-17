/**
 * Created by marzuz on 17.12.16.
 */
'use strict';

angular.module('apsiFrontendApp')
	.controller('CoursesCtrl', function($http, $scope) {

		$http.get('http://localhost:8000/courses/',{
      headers: {'Authorization': 'Token token=1887d746a393ab9193712d74b8ae37aacb14c15d'}
    }).success(function (response) {
        console.log(response);
        $scope.records = response.data.records;
      });



    // var c1= {
    //     "code": "apsi",
    //     "name": "Ap SI",
    //     "syllabus": "bardzo fajny opis",
    //     "tutor": 3,
    //     "registered": null,
    //     "state": 0
    // };
    //
    // var c2= {
    //     "code": "MED",
    //     "name": "ME Ddddd",
    //     "syllabus": "asdasdasdasdasdasdasdas",
    //     "tutor": 3,
    //     "registered": null,
    //     "state": 0
    // };
    //
    // $scope.records = [c1,c2];

    $scope.detailClick = function (id) {
      console.log(id+' redirect to detail');
    };

    $scope.editClick = function (id) {
      console.log(id+' redirect to detail');
    };
	});
