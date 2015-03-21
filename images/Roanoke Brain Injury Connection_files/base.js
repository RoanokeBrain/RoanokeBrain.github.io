var filter = window.location.hostname == 'upto.com' ? 'min' : 'raw';
YUI_config = {
	allowRollup: true,
	base:   '/clientside-vendors/yui/3.14.1/',
	filter: 'min',
	groups: {
		yuimodules: {
			allowRollup: true,
			base: '/js/modules/',
			filter: 'raw',
			modules: {
				'authentication': {
					requires: ['node', 'event', 'panel', 'handlebars', 'upto-source', 'upto-event']
				},			
				'utilities': {
					requires: ['node', 'event', 'saveable', 'shareable', 'likeable', 'followable', 'commentable', 'emailable', 'maps', 'trackable', 'io', 'node-event-simulate']
				},
				'upto-source': {
					requires: ['node', 'event', 'jsonp', 'jsonp-url']
				},
				'upto-event': {
					requires: ['node', 'event', 'jsonp', 'jsonp-url']
				},
				'upto-plugin': {
					requires: ['node', 'event', 'jsonp', 'jsonp-url']
				},				
				'maps': {
					requires: ['node', 'event', 'get', 'upto-event']
				},
				'authentication': {
					requires: ['node', 'event', 'panel', 'handlebars', 'upto-source', 'upto-event']
				},
				'saveable': {
					requires: ['node', 'event', 'panel', 'handlebars', 'upto-source', 'upto-event']
				},
				'shareable': {
					requires: ['node', 'event', 'panel', 'handlebars', 'upto-source', 'upto-event']
				},
				'emailable': {
					requires: ['node', 'event', 'panel', 'handlebars', 'upto-source', 'upto-plugin']
				},				
				'likeable': {
					requires: ['node', 'event', 'panel', 'handlebars', 'upto-event']
				},
				'followable': {
					requires: ['node', 'event', 'panel', 'handlebars', 'upto-source']
				},
				'commentable': {
					requires: ['node', 'event', 'panel', 'handlebars', 'upto-event', 'cookie']
				},
				'trackable': {
					requires: ['node', 'event']
				},
				'month-view': {
					requires: ['node', 'overlay']
				},
				'week-view': {
					requires: ['node']
				},
				'uploadable': {
					requires: ['node', 'event', 'uploader', 'json-parse']
				},
				'brand': {
					requires: ['node', 'event', 'panel']
				},
				'manageable': {
					requires: ['node', 'event', 'panel', 'handlebars']
				},
				'tooltip': {
					requires: ['node', 'overlay', 'widget-anim', 'handlebars']
				}
			}
		}
	},
	root:   '/clientside-vendors/yui/3.14.1/'
};

YUI().use('authentication', 'month-view', 'week-view', 'utilities', 'overlay', function(Y) {

	var emailables  = '*[data-action="email"][data-type][data-token][data-handlers]',
		shareables  = '*[data-action="share"][data-type][data-token][data-handlers]',
		followables = '*[data-action="upto"][data-handlers]';

	var customSelects = '.upto-custom-select',
		calendar      = '.upto-calendar.month';
		selectOverlay = Y.Node.create('<div id="select-overlay" class="yui3-overlay-loading"><div class="yui3-widget-bd"></div>'),
		eventList     = '.event-list';
	
	Y.one('body').appendChild(selectOverlay);
	
	var	overlay = new Y.Overlay({
			id: 'calendar-selector',
			constrain: '.upto-wrapper',
			srcNode: '#select-overlay',
			visible: false,
			render : true
		});
	
	if (Y.one('.upto-custom-select')) {
		Y.one('.upto-custom-select').on('clickoutside', function(ev) {
			if (overlay.get('visible')) {
				overlay.hide();
			}
		});
	}

	Y.one('body').delegate('click', function(ev) {
		overlay.setStdModContent('body', this.one('.options-proxy').cloneNode(true));
		overlay.set('align', {
			node: this,
			points: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]
		});
		overlay.show();

		var select  = this.one('.select-proxy'),
			options = overlay.get('bodyContent'),
			options = options.item(0);
				
		options.delegate('click', function(ev){
			// Month toggling... SOMEWHERE ELSE
			if (Y.one(calendar)) {
				if (this.getAttribute('data-value') == 'all') {
					var eventsToShow = Y.one(calendar).all('li'),
						eventsToHide = null;
				} else {
					var eventsToShow = Y.one(calendar).all('li[data-source-token="' + this.getAttribute('data-value') + '"]'),
						eventsToHide = Y.one(calendar).all('li[data-source-token]');
				}
	
				if (eventsToHide) {
					eventsToHide.setStyle('display', 'none');
				}
				if (eventsToShow) {
					eventsToShow.setStyle('display', 'block');
				}
			
				Y.MonthView.squareOffDays(Y.one(calendar));
			}
			
			// List toggling... somewhere ELSE
			if (Y.all(eventList)) {
				var value = this.getAttribute('data-value');
				
				if (value == 'all') {
					var eventsToShow = Y.all(eventList + ' li[data-source-token]'),
						eventsToHide = null;					
				} else {
					var eventsToShow = Y.all(eventList + ' li[data-source-token="' + this.getAttribute('data-value') + '"]'),
						eventsToHide = Y.all(eventList + ' li[data-source-token]');					
				}
				
				if (eventsToHide) {
					eventsToHide.setStyle('display', 'none');
				}
				
				if (eventsToShow) {
					eventsToShow.setStyle('display', 'block');
				}
			}
			
			// Weekday Toggling
			if (Y.one(eventList)) {
				var days    = Y.all(eventList + ' > li'),
					headers = Y.all('.upto-calendar-header[data-month][data-year]');
				days.each(function(day){
					var events = day.all('li[data-source-token]'),
						date   = day.getAttribute('data-date'),
						hide   = true;

					events.each(function(event){
						if (event.getStyle('display') != 'none') {
							hide = false;
						}
					});
					
					if (!hide) {
						Y.all('*[data-date="' + date + '"] .day').addClass('active');
						day.setStyle('display', 'table-row');
					} else {
						Y.all('*[data-date="' + date + '"] .day').removeClass('active');
						day.setStyle('display', 'none');
					}
				});
				
				headers.each(function(header){
					var month  = header.getAttribute('data-month'),
						year   = header.getAttribute('data-year'),
						events = Y.all('.event-list[data-month="' + month + '"][data-year="' + year + '"] li'),
						hide   = true;
					
					events.each(function(event){
						if (event.getStyle('display') != 'none') {
							hide = false;
						}
					});
					
					if (!hide) {
						header.one('.upto-calendar-navigation').setStyle('display', 'block');
					} else {
						header.one('.upto-calendar-navigation').setStyle('display', 'none');						
					}
				});
			}
						
			// Swapping plugins/sources for subscriptions SOMEWHERE ELSE
			var emailSubscriptionElement = Y.one(emailables);
			if (emailSubscriptionElement) {
				if (emailSubscriptionElement.getAttribute('data-type') && emailSubscriptionElement.getAttribute('data-token')) {
					if (this.getAttribute('data-value') != 'all') {
						emailSubscriptionElement.setAttribute('data-type', 'source');
						emailSubscriptionElement.setAttribute('data-token', this.getAttribute('data-value'));						
					} else {
						emailSubscriptionElement.setAttribute('data-type', 'plugin');
						emailSubscriptionElement.setAttribute('data-token', emailSubscriptionElement.getAttribute('data-plugin-token'));
					}
				}
			}
						
			// Actual overlay
			select.one('.value').set('innerHTML', this.one('.name').get('innerHTML'));
			overlay.hide();
		}, 'li');		
	}, customSelects);


	Y.one('.upto-wrapper').delegate('click', function(){
		var anchor = this.one('a');
		if (!anchor || !anchor.get('href')) return;
		window.location = anchor.get('href');
		
	}, '.days-events .event');

	Y.on('domready', function() {
		// Prepare basic features
		Y.Utilities.getCurrentTimeZone();
		Y.Utilities.externalAnchors();
		
		if (Y.one('.upto-attribution a')) {
			Y.Utilities.newWindow(Y.one('.upto-attribution a'), true);
		}

		// Prepare Monthly View Features
		Y.MonthView.init(Y.one('.upto-calendar.month'));
		
		// Prepare Weekly View Features
		Y.WeekView.init(Y.one('.upto-calendar.week'));
			
		// Prepare Email Subscriptions 
		Y.Emailable.modal();
		Y.Utilities.buildHandlerFromAttributes(emailables, Y.Emailable);
		
		// Prepare Shares
		Y.Utilities.buildHandlerFromAttributes(shareables, Y.Shareable);
		
		// Prepare Follows
		Y.Utilities.buildHandlerFromAttributes(followables, Y.Brand);
		
		// Prepare Tracks
		Y.Utilities.prepareEventAnalytics();
	});
});