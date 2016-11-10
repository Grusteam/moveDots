$(function() {
	/*page.base('/');
	
	page('/', function() {
		console.log('index');
	});
	
	page('/route1', function() {
		console.log('route1');
	});
	
	page('/route/:type', function(event) {
		console.log('route/type', 'type');
	});
	
	page();*/
	
	var routes = {
		// a route which assigns the function `bark`.
		'/': function() {
			console.log('index');
		},
		'/route1': function() {
			console.log('r1');
		},
		'/route/:type': function(type) {
			console.log('r, type', type);
		}
	};
	
	var router = Router(routes).configure({
		html5history: true
	});
	
	router.init();
	
	
	
	$('.js-route').on('click', function(event) {
		event.preventDefault();
		var link = $(this).attr('href');
		router.setRoute(link);
	});
	
});