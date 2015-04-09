'use strict';

angular.module('raffle_maker')
.factory('AuthService', [function() {
	var access_token = '';
	function getAccessToken() {
		if (access_token.length == 0) {
			var hash = window.location.hash;
			var params = hash.split('&');
			var parts = null;
			angular.forEach(params, function(param) {
				parts = param.split('=');
				if (parts[0].match('access_token')) {
					access_token = parts[1];
				}
			});
		}
		return access_token;
	};
	return {
		getAccessToken: getAccessToken
	};
}]);
