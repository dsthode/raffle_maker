'use strict';

angular.module('raffle_maker')
.controller('AuthenticationController', ['$scope', '$window', 'CONFIG', function($scope, $window, CONFIG) {
	$scope.vars = {
		api_key: ''
	};

	$scope.authenticate = function() {
		$window.location.assign(CONFIG.AUTH_URL);
	};
}]);
