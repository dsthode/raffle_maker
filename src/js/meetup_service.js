'use strict';

angular.module('raffle_maker')
.factory('MeetupService', ['$q', '$http', 'CONFIG', 'AuthService', function($q, $http, CONFIG, AuthService) {
	function meetupRequest(path, parameters) {
		return $http.get(CONFIG.BASE_URL + path, {params:parameters});
	};

	function promiseWhile(initial, condition, action, arr, params) {
		var def = $q.defer();
		var loop = function(data, status, headers, config, statusText) {
			if (!condition(data.data.meta.next)) {
				action(arr, data);
				return def.resolve(arr);
			}
			return $http.get(data.data.meta.next, {params:params}).then(loop).catch(def.reject());
		};
		initial().then(loop);
		return def.promise;
	};

	function getEvents(access_token, group) {
		var events = [];
		var total_events = -1;
		var def = $q.defer();
		var params = {
			'group_urlname': group,
			'page': CONFIG.PAGE_COUNT,
			'access_token': AuthService.getAccessToken()
		};
		promiseWhile(
			function() { return meetupRequest(CONFIG.EVENTS_URL, params) },
			function(next) { return next && next.size > 0; },
			function(arr, data) {
				angular.forEach(data.data.results, function(item) {
					arr.push({
						name: item.name,
						id: item.id,
						sel: false
					});
				});
			},
			events,
			params
		).then(function(events) {def.resolve(events)});
		return def.promise;
	};

	function getRsvp(access_token, eventId) {
		var rsvp = [];
		var total_rsvp = -1;
		var def = $q.defer();
		var params = {
			'event_id': eventId,
			'fields': 'other_services',
			'rsvp': 'yes',
			'access_token': AuthService.getAccessToken()
		};
		promiseWhile(
			function() { return meetupRequest(CONFIG.RSVP_URL, params) },
			function(next) { return next && next.size > 0; },
			function(arr, data) {
				var member = null;
				angular.forEach(data.data.results, function(item) {
					member = {id: item.member.member_id, name:item.member.name};
					if (item.member_photo) {
						member.photo = item.member_photo.photo_link;
						member.thumb = item.member_photo.thumb_link;
					}
					if (item.member.other_services && item.member.other_services.twitter && item.member.other_services.twitter.identifier) {
						member.twitter = item.member.other_services.twitter.identifier;
					}
					rsvp.push(member);
				});
			},
			rsvp,
			params
		).then(function(rsvp) {def.resolve(rsvp)});
		return def.promise;
	};

	return {
		getEvents: getEvents,
		getRsvp: getRsvp
	};
}]);
