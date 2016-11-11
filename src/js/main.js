/* eslint-disable */

var router; // global

var App = {
	init: function() {
		var routes = {
			'/': function() {
				console.log('index');
			},
			
			'/feedback': function() {
				console.log('feedback');
			},
			
			'/feedback/:user': function(user) {
				console.log('feedback/user', user);
			},
			
			'/search': {
				'\/(.*)': {
					on: function(request) {
						var params = decodeURI(request).split('&');
						console.log(':request:', params);
					}
				}
			}
		};
		
		router = Router(routes).configure({
			html5history: true
		}).init();
	}
}


$(function() {
	App.init();
	
	$('.js-route').on('click', function(event) {
		event.preventDefault();
		var link = $(this).attr('href');
		router.setRoute(link);
	});
	
});