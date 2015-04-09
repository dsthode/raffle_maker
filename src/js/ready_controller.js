'use strict';

angular.module('raffle_maker')
.controller('RaffleController', ['$scope', 'MeetupService', 'RandomService', 'CONFIG', '$log', function($scope, MeetupService, RandomService, CONFIG, $log) {
	$scope.vars = {
		access_token: '',
		group_name: 'MalagaMakers',
		event_id: '',
		winner: {
			name: '',
			twitter: '',
			photo: ''
		}
	};
	$scope.events = [];
	$scope.members = [];

	function shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};

	$scope.fetchEvents = function() {
		if ($scope.vars.group_name.length > 0) {
			MeetupService.getEvents($scope.vars.access_token, $scope.vars.group_name).then(function(events) {
				$scope.events.splice(0, $scope.events.length);
				angular.forEach(events, function(item) {
					$scope.events.push(item);
				});
			});
		} else {
			alert("You must enter the group's URL name");
		}
	};

	$scope.fetchMembers = function() {
		if ($scope.vars.event_id != '') {
			MeetupService.getRsvp($scope.vars.access_token, $scope.vars.event_id).then(function(members) {
				$scope.members.splice(0, $scope.members.length);
				var members_shuffled = shuffle(members);
				angular.forEach(members, function(item) {
					$scope.members.push(item);
				});
			});
		} else {
			alert('You must select an event');
		}
	}

	$scope.raffle = function() {
		if ($scope.members.length > 1) {
			RandomService.getRandom(1, $scope.members.length).then(
				function(result) {
					$scope.vars.winner.name = $scope.members[result.data-1].name;
					$scope.vars.winner.twitter = $scope.members[result.data-1].twitter;
					$scope.vars.winner.photo = $scope.members[result.data-1].photo;
					$log.debug(result.data
						+ $scope.vars.winner.name + '/'
						+ $scope.vars.winner.twitter + '/'
						+ $scope.vars.winner.photo
					);
					$('#winnerModal').modal({backdrop:'static'});
				},
				function() {
					alert("Could't get a random number :(");
				}
			);
		} else {
			if ($scope.members.length == 1) {
				alert("You can't make a raffle with just one member!!");
			} else {
				alert('Cannot raffle if there are no members!!');
			}
		}
	};

	$scope.removeAttendee = function(attendee) {
		var index = -1;
		angular.forEach($scope.members, function(member, idx) {
			if (member.id == attendee.id) {
				index = idx;
			}
		});
		if (index >= 0) {
			$scope.members.splice(index, 1);
		}
	};
}]);
