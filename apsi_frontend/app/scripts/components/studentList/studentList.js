'use strict';

angular.module('apsiFrontendApp')
  .controller('StudentListCtrl', function ($scope, $state, Restangular, courseCode) {
   	$scope.students = [{
   		id : 2,
   		username : 'fooname',
   		full_name : 'Robert Nowak'
   	}];
   	$scope.closingButtonText = 'Open list';
   	$scope.listIsOpen = false;
    $scope.refresh = function() {
    	Restangular.oneUrl('asd','http://localhost:8000/').get('courses/',courseCode).then(
    		function(response)
    		{	
    			$scope.listIsOpen = response.state == 0;
    			if($scope.listIsOpen)
    			{
					$scope.closingButtonText = 'Close list';
    			}
    			else
    			{
					$scope.closingButtonText = 'Open list';
    			}
    		},
    		function()
    		{

    		}
    	);

    };

    $scope.back = function() {
    	$state.go('courseedit', {courseid : courseCode});
    };

    $scope.close = function() {
    	Restangular.oneUrl('asd','http://localhost:8000/courses/' + courseCode + '/').patch({state : Number(!$scope.listIsOpen)}).then(
    	function() 
    	{
    		$scope.refresh();
    	},
    	function()
    	{

    	});    	
    };

    $scope.refresh();
  });
