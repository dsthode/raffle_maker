'use strict';

angular.module('raffle_maker')
.controller('RaffleController', ['$scope', 'MeetupService', function($scope, MeetupService) {
	$scope.vars = {
		api_key: '',
		group_name: ''
	};
	$scope.events = [];
	$scope.members = [];

	$scope.fetchEvents = function() {
		if ($scope.vars.api_key.length > 0 && $scope.vars.group_name.length > 0) {
			MeetupService.getEvents($scope.vars.api_key, $scope.vars.group_name).then(function(events) {
				$scope.events.splice(0, $scope.events.length);
				angular.forEach(events, function(item) {
					$scope.events.push(item);
				});
			});
		} else {
			alert('You must enter your Meetup API key and the group name');
		}
	};

	$scope.fetchMembers = function() {
	};
}]);
