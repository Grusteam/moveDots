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
		var 
			link = $(this).attr('href');
		router.setRoute(link);
	});
	
	
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	
	var start = Date.now();
	var 
		t = 0,
		a = 1;
	
	function step(timestamp) {
		var progress = timestamp - start;
			// d.style.left = Math.min(progress/10, 200) + "px";
		
		$('#arc1').attr('d', describeArc(92, 92, 80, t += a));
		
		console.log('t', t);
		
		if (t >= 100) {
			a = -1;
		} 
		
		if (t == 0) {
			a = 1;
		}

		requestAnimationFrame(step);
	}

	requestAnimationFrame(step);
	
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		var
			angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		};
	}

	function describeArc(x, y, radius, progress) {
		var
			endProgress  = 359 / 100 * progress,
			start        = polarToCartesian(x, y, radius, endProgress),
			end          = polarToCartesian(x, y, radius, 0),
			largeArcFlag = endProgress - 0 <= 180 ? '0' : '1';

		var d = [
			"M", start.x, start.y,
			"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
		].join(" ");

		return d;
	}
	
	$('#arc1').attr('d', describeArc(92, 92, 80, 100));
	
	
});