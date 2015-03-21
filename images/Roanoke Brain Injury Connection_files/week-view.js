YUI.add('week-view', function(Y){
	Y.namespace('WeekView');

	Y.WeekView = {
		init: function(calendar) {
			if (!Y.one(calendar)) return;
			Y.WeekView.squareOffDays(calendar);
			Y.on('windowresize', function(ev){
				Y.WeekView.squareOffDays(calendar);
			});
		},
		
		squareOffDays: function(calendar) {
			if (!Y.one(calendar)) return;

			var days = Y.one(calendar).all('thead tr th span.day');
			
			days.each(function(day){
				var region = day.get('region');
				day.setStyles({
					'height': region.width + 'px',
					'line-height': (region.width - parseInt(day.getStyle('borderTopWidth'))) + 'px'
				});
			});
			
			Y.one(calendar).setStyle('visibility', 'visible');
		}
	}	
},'1.0', { requires: ['node'] });