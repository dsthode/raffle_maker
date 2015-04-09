'use strict';

angular.module('raffle_maker')
.factory('RandomService', ['$http', 'CONFIG', function($http, CONFIG) {
	function getRandom(min, max) {
		var params = {
			'num': 1,
			'min': min,
			'max': max,
			'base': 10,
			'format': 'plain',
			'rnd': 'new',
			'col': 1
		};
		return $http.get(CONFIG.RANDOM_URL, {params:params});
	};

	return {
		getRandom: getRandom
	};
}]);
