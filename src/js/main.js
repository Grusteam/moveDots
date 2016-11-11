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
						App.parseParams(request);
					}
				}
			}
		};
		
		router = Router(routes).configure({
			html5history: true
		}).init();
	},
	
	parseParams: function(request) {
		var 
			params = decodeURI(request).split('&'),
			query  = {};
			
		for (var i = 0; i < params.length; i++) {
			var arr = params[i].split('=');
			query[arr[0]] = arr[1];
		}
		
		return query;
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