/* eslint-disable */

$(function() {
	$.ajax('/data/data.json', {
		type: 'GET',
		success: function(res) {
			console.log('GET', arguments);
		}
	});
	
	$('#send-data').on('click', function(event) {
		var data = {
			name: 'Elon',
			surname: 'Musk',
			owner: [
				'Tesla',
				'SpaceX'
			]
		};
		
		$.ajax('/api', {
			data: JSON.stringify(data),
			type: 'POST',
			success: function(res) {
				console.log('POST', arguments);
			}
		});
	});
});