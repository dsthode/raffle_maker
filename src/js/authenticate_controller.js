'use strict';

angular.module('raffle_maker')
.controller('AuthenticationController', ['$window', 'CONFIG', function($window, CONFIG) {
	$scope.vars = {
		api_key: ''
	};

	$scope.authenticate = function() {
		if ($scope.vars.api_key.length > 0) {
			$window.$location(CONFIG.AUTH_URL + '&client_id=' + $scope.vars.api_key);
		} else {
			alert('You must enter your Meetup API key');
		}
	};
}]);
