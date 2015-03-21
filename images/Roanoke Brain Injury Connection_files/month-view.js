YUI.add('month-view', function(Y){
	Y.namespace('MonthView');

	Y.MonthView = {
		overlay: '<div id="event-overlay" class="yui3-overlay-loading"><div class="yui3-widget-hd"></div><div class="yui3-widget-bd"></div></div>',

		init: function(calendar) {
			if (!Y.one(calendar)) return;

			Y.MonthView.squareOffDays(calendar);
			Y.MonthView.prepareWeeklyContractions(calendar);
			Y.MonthView.syncAnchorEvents(calendar);			
			Y.MonthView.preparePanels(calendar);
			Y.MonthView.selectToday(calendar);
		},
		
		squareOffDays: function(calendar) {
			if (!Y.one(calendar)) return;
			
			var days = Y.one(calendar).all('tbody tr td div');

			days.each(function(day){
				var events        = day.all('.events li'),
					dayRegion     = day.get('region'),
					verticalLimit = dayRegion.top + dayRegion.width,
					count         = 0;
					
				events.each(function(event){
					var eventRegion = event.get('region');
		
					if (eventRegion.bottom >= verticalLimit) {
						event.addClass('overflow');
						if (!event.hasClass('placeholder') && event.getStyle('display') != 'none') {
							count++;	
						}			
						event.setStyle('display', 'none');
					}
					
				});
				
				day.setStyle('height', dayRegion.width + 'px');
				
				if (count) {
					if (!day.ancestor('td').one('.hidden-events')) {
						var extrasNotice = Y.Node.create('<span class="hidden-events" data-default-text="+' + count + ' event' + (count > 1 ? 's' : '') + '">+' + count + ' event' + (count > 1 ? 's' : '') + '</span>'),
							container    = events.item(0).ancestor('div');
						container.insert(extrasNotice, 'after');
					} else {
						var extrasNotice = day.ancestor('td').one('.hidden-events');
						extrasNotice.setAttribute('data-default-text', '+' + count + ' event' + (count > 1 ? 's' : ''));
						extrasNotice.set('innerHTML', '+' + count + ' event' + (count > 1 ? 's' : ''));
						extrasNotice.setStyle('display', 'block');
						extrasNotice.removeClass('expanded');
					}
				} else {
					if (day.ancestor('td').one('.hidden-events')) {
						var extrasNotice = day.ancestor('td').one('.hidden-events');
						extrasNotice.setStyle('display', 'none');
						extrasNotice.removeClass('expanded');
					}
				}
			});
			Y.one(calendar).setStyle('visibility', 'visible');
		},
		
		prepareWeeklyContractions: function(calendar) {
			if (!Y.one(calendar)) return;
			var fullEventListTriggers = 'tbody tr td .hidden-events';

			Y.one(calendar).delegate('click', function(ev){
				var hiddenEvents = this.ancestor('tr').all('td div .events .overflow'),
					triggers     = this.ancestor('tr').all('td .hidden-events'),
					containers   = this.ancestor('tr').all('td div');
		
				if (this.hasClass('expanded')) {
					triggers.removeClass('expanded');
					triggers.each(function(trigger){
						trigger.set('innerHTML', trigger.getAttribute('data-default-text'));	
					});
					hiddenEvents.setStyle('display', 'none');
				} else {
					triggers.addClass('expanded');
					triggers.set('innerHTML', 'Collapse');
					hiddenEvents.setStyle('display', 'block');
				}
				
				containers.setStyle('height', 'auto');
				
			}, fullEventListTriggers);
		},

		syncAnchorEvents: function(calendar) {
			if (!Y.one(calendar)) return;
			var daysEventsLinks = '.events li[data-multiple-days=true] a';

			Y.one(calendar).delegate('mousedown', function(ev){
				var token  		= this.ancestor('li').getAttribute('data-event-token'),
					daysOfEvent = Y.all('.events li[data-event-token=' + token + '] a');
				
				daysOfEvent.addClass('active');		
			}, daysEventsLinks);

			Y.one(calendar).delegate('mouseup', function(ev){
				var token  		= this.ancestor('li').getAttribute('data-event-token'),
					daysOfEvent = Y.all('.events li[data-event-token=' + token + '] a');
				
				daysOfEvent.removeClass('active');		
			}, daysEventsLinks);
		
			Y.one(calendar).delegate('mouseover', function(ev){
				var token  		= this.ancestor('li').getAttribute('data-event-token'),
					daysOfEvent = Y.all('.events li[data-event-token=' + token + '] a');
				
				daysOfEvent.addClass('hover');		
			}, daysEventsLinks);
		
			Y.one(calendar).delegate('mouseout', function(ev){
				var token  		= this.ancestor('li').getAttribute('data-event-token'),
					daysOfEvent = Y.all('.events li[data-event-token=' + token + '] a');
				
				daysOfEvent.removeClass('hover');		
			}, daysEventsLinks);
		},
		
		preparePanels: function(calendar) {
			if (!Y.one(calendar)) return;

			var events  = 'tbody tr td .events li',
				overlay = Y.Node.create(Y.MonthView.overlay);
			
			Y.one(calendar).insert(overlay, 'after');

			var overlay = new Y.Overlay({
				constrain: '.upto-wrapper',
			    srcNode: '#event-overlay',
				visible: false,
			    render : true
			});
			
			Y.one(calendar).delegate('mouseover', function(ev){

				if (this.getAttribute('data-event-avatar') && this.getAttribute('data-duration') && this.getAttribute('data-event-name')) {
					var className = this.one('a') ? this.one('a').get('className') : null;
					overlay.setStdModContent('header', '<span class="' + className + '">' + this.getAttribute('data-duration') + '</span>');
					overlay.setStdModContent('body', '<a href="' + this.one('a').get('href') + '"><img alt="" src="' + this.getAttribute('data-event-avatar') + '"><span class="wrapper"><span class="name">' + this.getAttribute('data-event-name') + '</span><span class="location">' + this.getAttribute('data-event-location') + '</span></span></a>');
					overlay.set('align', {
						node: this,
						points: [Y.WidgetPositionAlign.BC, Y.WidgetPositionAlign.TC]
					});
					overlay.show();
				}
			}, events);

			Y.one(calendar).delegate('mouseout', function(ev){
				overlay.hide();
			}, events);
		},
		
		selectToday: function(calendar) {
			if (!Y.one(calendar)) return;

			var date  = new Date(),
				year  = date.getFullYear(),
				month = (date.getMonth() + 1).toString(),
				day   = (date.getDate()).toString(),
				month = month.length > 1 ? month : '0' + month,
				day   = day.length > 1 ? day : '0' + day,
				today = calendar.one('td[data-day="' + day + '"][data-month="' + month + '"][data-year="' + year + '"]');
			
			if (today) {
				today.addClass('today');
			}
		}
	}	
},'1.0', { requires: ['node', 'overlay'] });