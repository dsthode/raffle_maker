'use strict';

angular.module('raffle_maker')
.factory('MeetupService', ['$q', '$http', 'CONFIG', function($q, $http, CONFIG) {
	function meetupRequest(path, parameters) {
		return $http.get(CONFIG.BASE_URL + path, {params:parameters});
	};

	function promiseWhile(initial, condition, action, arr) {
		var def = $q.defer();
		var loop = function(data, status, headers, config, statusText) {
			if (!condition(data.meta.next)) {
				def.resolve();
				action(arr);
			}
			return $http.get(url, {params:params}).then(loop).catch(def.reject());
		};
		initial().then(loop);
		return def.promise;
	};

	function getEvents(api_key, group) {
		var events = [];
		var total_events = -1;
		var def = $q.defer();
		var params = {
			'group_urlname': group,
			'page': CONFIG.PAGE_COUNT,
			'key': api_key
		};
		promiseWhile(
			function() { return meetupRequest(CONFIG.EVENTS_URL, params) },
			function(next) { return next && next.size > 0; },
			function(arr) {
				angular.forEach(data.results, function(item) {
					arr.push({
						name: item.name,
						id: item.id
					});
				});
			},
			events
		).then(def.resolve(events));
		return def.promise;
	};

	function getRsvp(api_key, eventId) {
		var rsvp = [];
		var total_rsvp = -1;
		var def = $q.defer();
		var params = {
			'event_id': eventId,
			'order': 'name',
			'fields': 'other_services',
			'rsvp': 'yes',
			'key': api_key
		};
		promiseWhile(
			function() { return meetupRequest(CONFIG.RSVP_URL, params) },
			function(next) { return next && next.size > 0; },
			function(arr) {
				var member = null;
				angular.forEach(data.results, function(item) {
					member = {id: item.member.member_id, name:item.member.name, photo:item.member_photo.photo_link, thumb: item.member_photo.thumb_link};
					if (item.member.other_services && item.member.other_services.twitter && item.member.other_services.twitter.identifier) {
						member.twitter = item.member.other_services.twitter.identifier;
					}
					rsvp.push(member);
				});
			},
			rsvp
		).then(def.resolve(rsvp));
		return def.promise;
	};

	return {
		getEvents: getEvents,
		getRsvp: getRsvp
	};
}]);
