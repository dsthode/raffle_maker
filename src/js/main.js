'use strict';

angular.module('raffle_maker', ['ngRoute'])
.constant('CONFIG', {
	PAGE_COUNT: 20,
	BASE_URL: 'https://api.meetup.com',
	EVENTS_URL: '/2/events',
	RSVP_URL: '/2/rsvps',
	AUTH_URL: 'https://secure.meetup.com/oauth2/authorize?client_id=e4hnr7sjcou7phhnb3bj0i7foc&response_type=token&redirect_uri=https://dsthode.info/raffle_maker/src/ready.html'
});
