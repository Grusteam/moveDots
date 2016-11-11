/* eslint-disable */

$(function() {
	var routes = {
		'/': function() {
			console.log('index');
		},
		'/feedback': function() {
			console.log('feedback');
		},
		'/feedback/user': function() {
			console.log('/feedback/user');
		},
		'/route/:type': function(type) {
			console.log('param:', type);
		}
	};
	
	var router = Router(routes).configure({
		html5history: true
	}).init();
	
	
	$('.js-route').on('click', function(event) {
		event.preventDefault();
		var link = $(this).attr('href');
		router.setRoute(link);
	});
	
});