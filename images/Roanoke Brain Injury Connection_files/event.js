var event = {
	Y: YUI().use('node','event', 'panel', 'handlebars', 'maps', 'utilities'),
	clipboard: null,
	hostname: window.location.hostname.match('upto.com') ? '//' + window.location.hostname : '//upto.com',
	pathname: '/detail/',
	containerId: {
		saveModal: 'event-saveable-panel',
		shareModal: 'event-shareable-panel'
	},
	panels: {
		saveable: null,
		shareable: null
	},
	markup: {
		modal: '<div id="{{{panelId}}}"></div>',
		comments: 
			'<h6>Comments</h6>' +
			'<ul class="upto-event-comment-list">' +
			'{{#each comments}}' +
				'<li>' +
					'<div class="upto-event-comment-avatar">' +
						'<img alt="{{{name}}}" src="{{{avatar}}}" title="{{{name}}}">' +
					'</div>' +
					'<div class="upto-event-comment-details">' +
						'<span class="upto-event-comment-name">{{{name}}}</span>' +
						'<p>{{{comment}}}</p>' +
						'<span class="upto-event-comment-time">{{{date}}}</span>' +
					'</div>' +
				'</li>' +
			'{{/each}}' +
			'</ul>',
		likers: 
			'<div class="upto-event-liker-list">' +
				'<ul>' +
				'{{#each likers}}' +
					'<li>' + 
						'<img alt="{{{name}}}" src="{{{avatar}}}" title="{{{name}}}">' +
					'</li>' +
					'{{/each}}' +
				'</ul>' +
			'</div>',
		shareOptions: 
			'<ul class="upto-modal-options">' +
			'{{#if appId}}{{#if token}}{{#if name}}{{#if description}}' +
				'<li>' +
				'<a href="https://www.facebook.com/dialog/feed' +
					'?app_id={{{appId}}}' +
					'&link={{{location}}}' +
					'{{#if photo}}&picture={{{photo}}}{{/if}}' +
					'&name={{{name}}}' +
					'&description={{{description}}}' +
					'&caption=%20' +
					'&redirect_uri=https://upto.com/utility/close">' +
				'<span><img alt="Facebook" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/logos/facebook.png">Facebook</span></a>' +
				'</li>' +
			'{{/if}}{{/if}}{{/if}}{{/if}}' +
			'{{#if token}}{{#if text}}' +
				'<li><a href="https://twitter.com/share' +
				'?url={{{location}}}' + 
				'&text={{{text}}}' + 
				'&counturl={{{location}}}' +
				'&lang=en"' +
				'><span><img alt="Twitter" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/logos/twitter.png">Twitter</span></a></li>' +
			'{{/if}}{{/if}}' +
			'<li>' + 
				'<a class="copy-to-clipboard" href="{{{url}}}"><span><img alt="Copy to Clipboard" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/icons/icon-copy.png">Copy Link</span></a>' +
			'</li>' + 
			/*
				'<li>' +				
				'<a href="https://plus.google.com/share?url={{{location}}}">' +
					'Google+' +
				'</a>' +	
				'</li>' +
			*/
			'</ul>',
		saveOptions: 
			'<ul class="upto-modal-options">' +
				'<li><a class="ical-action" href="/e/ics/{{{eventToken}}}"><span><img alt="iCal" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/logos/ical.png">iCal</span></a></li>' +
				'{{#if name}}{{#if dates}}<li>' +
				 '<a class="google-action" href="' +
					'http://www.google.com/calendar/event?action=TEMPLATE' +
					'&text={{{name}}}' +
					'&dates={{{dates}}}' +
					'{{#if location}}&location={{{location}}}{{/if}}' +
					'&sprop=website:upto.com' +
					'&sprop=name:UpTo' +
					'&details={{#if description}}{{{description}}}%0D%0D{{{url}}}%0D%0DPowered+by+UpTo%0Dhttp%3A%2F%2Fupto.com{{else}}{{{url}}}%0D%0DPowered+by+UpTo%0Dhttp%3A%2F%2Fupto.com{{/if}}' +
				'"><span><img alt="Google" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/logos/google.png">Google</span></a></li>{{/if}}{{/if}}' +
				'<li><a class="outlook-action" href="/e/ics/{{{eventToken}}}"><span><img alt="Outlook" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/logos/outlook.png">Outlook</span></a></li>' +
				'<li>' +
				'{{#if name}}{{#if startTime}}{{#if duration}}' +
				'<a class="yahoo-action" href="' +
					'http://calendar.yahoo.com/?v=60&view=d&type=20' +
					'&title={{{name}}}' +
					'&st={{{startTime}}}' + 
					'&dur={{{duration}}}' +
					'{{#if location}}&in_loc={{{location}}}{{/if}}' +
					'&desc={{#if description}}{{{description}}}%0D%0D{{{url}}}%0D%0DPowered+by+UpTo%0Dhttp%3A%2F%2Fupto.com{{else}}{{{url}}}%0D%0DPowered+by+UpTo%0Dhttp%3A%2F%2Fupto.com{{/if}}' +
				'"><span><img alt="Yahoo!" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/logos/yahoo.png">Yahoo!</span></a></li>{{/if}}{{/if}}{{/if}}' +
			'</ul>'
	}	
};

function saveEvent(response) {
	if (!response.success) return;

	var Y           = event.Y,
		containerId = event.containerId,
		markup      = event.markup,
		panels      = event.panels;
		
	if (!Y.one('#' + containerId.saveModal) || !panels.saveable) {
		var template = Y.Handlebars.compile(markup.modal),
			panelSrc = Y.Node.create(template({panelId: containerId.saveModal}));
		Y.one('.yui3-skin-sam').append(panelSrc);
	
		var panel = new Y.Panel({
			srcNode : '#' + containerId.saveModal,
			headerContent: 'Save Event',
			modal: true,
			centered: true,
			constrain: true,
			render  : true,
			zIndex: 1000,
			hideOn: [{eventName: 'clickoutside'}, {node: Y.one('doc'), eventName: 'key', keyCode: 'esc'}],
	        buttons: [{
                template: '<i class="fa fa-times"></i>',
                action: function(ev) {
                    ev.preventDefault();
                    panel.hide();
                },
                section: Y.WidgetStdMod.HEADER,
                classNames: ['yui3-button-exit']
			}]
		});
		panels.saveable = panel;
	}

	var template = Y.Handlebars.compile(markup.saveOptions),
	    data = {
			name        : response.data.name ? encodeURIComponent(response.data.name) : null,
			location    : response.data.location ? encodeURIComponent(response.data.location) : null,
			description : response.data.description ? encodeURIComponent(response.data.description) : null,
		    eventToken  : response.data.token ? response.data.token : null,
			sourceToken : response.data.sourceToken ? response.data.sourceToken : null,
			dates       : response.data.google.dates ? response.data.google.dates : null,
			startTime   : response.data.yahoo.startTime ? response.data.yahoo.startTime : null,
			duration    : response.data.yahoo.duration ? response.data.yahoo.duration : null,
			hostname    : event.hostname,
			url         : response.data.shareUrl ? encodeURIComponent(response.data.shareUrl) : null
		};

	var trigger = Y.one('*[data-action="save"][data-type="event"][data-token="' + response.data.token + '"]');
	panels.saveable.set('bodyContent', template(data));	

	var triggerRegion = trigger.get('region'),
		wrapperRegion = Y.one('body').get('region'),
		panelWidth    = panels.saveable.get('boundingBox').get('region').width;

	if (Y.Object.size(window.top) <= 0) {
		panels.saveable.set('xy', [wrapperRegion.left + ((wrapperRegion.width - panelWidth)/2), triggerRegion.bottom]);		
	}
		
	Y.one('#' + containerId.saveModal).delegate('click', function(ev){
		panels.saveable.hide();
		Y.Utilities.newWindow(this);
	}, 'a');

	panels.saveable.show();
};

function shareEvent(response) {
	if (!response.success) return;
	var Y           = event.Y,
		containerId = event.containerId,
		markup      = event.markup,
		panels      = event.panels;
		
	if (!Y.one('#' + containerId.shareModal) || !panels.shareable) {
		var template = Y.Handlebars.compile(markup.modal),
			panelSrc = Y.Node.create(template({panelId: containerId.shareModal}));
		Y.one('.yui3-skin-sam').append(panelSrc);
	
		var panel = new Y.Panel({
			srcNode : '#' + containerId.shareModal,
			headerContent: 'Share Event',
			modal: true,
			centered: true,
			constrain: true,
			render  : true,
			zIndex: 1000,
			hideOn: [{eventName: 'clickoutside'}, {node: Y.one('doc'), eventName: 'key', keyCode: 'esc'}],
	        buttons: [{
                template: '<i class="fa fa-times"></i>',
                action: function(ev) {
                    ev.preventDefault();
                    panel.hide();
                },
                section: Y.WidgetStdMod.HEADER,
                classNames: ['yui3-button-exit']
			}]
		});				
		panels.shareable = panel;
	}

	var template = Y.Handlebars.compile(markup.shareOptions),
	    data = {
			name        : response.data.name ? encodeURIComponent(response.data.name) : null,
			token       : response.data.token ? encodeURIComponent(response.data.token) : null,
			photo       : response.data.photo ? encodeURIComponent(response.data.photo) : null,
		    appId       : response.data.facebook.appId ? encodeURIComponent(response.data.facebook.appId) : null,
			description : response.data.facebook.description ? encodeURIComponent(response.data.facebook.description) : null,
			text        : response.data.twitter.description ? encodeURIComponent(response.data.twitter.description) : null,
			hostname    : event.hostname,
			location    : response.data.shareUrl ? encodeURIComponent(response.data.shareUrl) : null,
			url         : response.data.shareUrl ? response.data.shareUrl : null
		};

	var trigger = Y.one('*[data-action="share"][data-type="event"][data-token="' + response.data.token + '"]');
	panels.shareable.set('bodyContent', template(data));

	var triggerRegion = trigger.get('region'),
		wrapperRegion = Y.one('body').get('region'),
		panelWidth    = panels.shareable.get('boundingBox').get('region').width;
	
	if (Y.Object.size(window.top) <= 0) {
		panels.shareable.set('xy', [wrapperRegion.left + ((wrapperRegion.width - panelWidth)/2), triggerRegion.bottom]);
	}
		
	var cpTrigger = event.Y.one('#' + event.containerId.shareModal + ' .copy-to-clipboard');
	ZeroClipboard.config({swfPath: window.location.protocol + '//' + window.location.hostname + '/clientside-vendors/zeroclipboard/1.3.3/ZeroClipboard.swf', moviePath: window.location.protocol + '//' + window.location.hostname + '/clientside-vendors/zeroclipboard/1.3.3/ZeroClipboard.swf', forceHandCursor: true, trustedDomains: ['*']});
	event.clipboard = new ZeroClipboard(cpTrigger.getDOMNode());	
	event.clipboard.on('mouseout', function(clipboard) { cpTrigger.setStyle('background-color', '#FFFFFF'); });
	event.clipboard.on('mouseover', function(clipboard) { cpTrigger.setStyle('background-color', '#'+response.data.lighterColor); });
	event.clipboard.on('dataRequested', function(clipboard) { 
		clipboard.setText(cpTrigger.get('href'));		
		cpTrigger.one('span').set('innerHTML', '<img alt="Copied" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/icons/icon-check.png">Link Copied!');
		setTimeout(function(){
			panels.shareable.hide();
			ZeroClipboard.destroy();
		}, 800);
	});
	event.clipboard.on('wrongflash noflash', function(){ 
		cpTrigger.get('parentNode').remove(true);
		ZeroClipboard.destroy();
	});
	
	Y.one('#' + containerId.shareModal).delegate('click', function(ev){	
		if (this.hasClass('copy-to-clipboard')) {
			ev.preventDefault();
			panels.shareable.hide();
		} else {
			panels.shareable.hide();
			Y.Utilities.newWindow(this);			
		}
	}, 'a');

	panels.shareable.show();
};

function mapEvent(response) {
	if (!response.success) return;
	var mapContainers = event.Y.all('[data-action="map"][data-token="' + response.data.token + '"]');
	mapContainers.each(function(mapContainer){
		mapContainer.setAttribute('data-place-name', response.data.Place.name ? response.data.Place.name : '');
		mapContainer.setAttribute('data-place-address', response.data.Place.address ? response.data.Place.address : '');
		mapContainer.setAttribute('data-place-city', response.data.Place.city ? response.data.Place.city : '');
		mapContainer.setAttribute('data-place-state', response.data.Place.state ? response.data.Place.state : '');
		mapContainer.setAttribute('data-place-zip', response.data.Place.zip ? response.data.Place.zip : '');
		mapContainer.setAttribute('data-place-latitude', response.data.Place.latitude ? response.data.Place.latitude : '');
		mapContainer.setAttribute('data-place-longitude', response.data.Place.longitude ? response.data.Place.longitude : '');
		event.Y.Maps.init(mapContainer);		
	});
};

function likeEvent(response) {
	if (!response.success) return;
	var Y        = event.Y,
		markup   = event.markup,
		liked    = response.data.liked,
		likers   = new Array(),
		template = Y.Handlebars.compile(markup.likers),
		img      = liked ? 'https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/treatments/buttons/icon-thumb.png' : 'https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/treatments/buttons/icon-thumb-inactive.png',
		count    = 0;

	for (var liker in response.data.likers) {
		count++;
		var likerObj = response.data.likers[liker];
		likers.push({ avatar: likerObj.avatar, name: likerObj.firstName + ' ' + likerObj.lastName.substr(0, 1) + '.'})
	}
	
	if (liked) {
		if (count - 1 == 0) var label = 'You like this event.';
		if (count - 1 == 1) var label = 'You and one other person like this event.';
		if (count-1 > 1) var label = 'You and ' + (count-1) + ' others like this event.';
	} else {
		if (count == 0) var label = 'Be the first to like this event.';
		if (count == 1) var label = 'One person likes this event.';
		if (count > 1) var label = count + ' people like this event.';
	}

	Y.one('.upto-event-likes .upto-event-likes-button img').set('src', img);
	Y.one('.upto-event-likes .upto-event-likes-label p').set('innerHTML', label);
	Y.one('.upto-event-likers').set('innerHTML', template({likers:likers}));
}

function commentOnEvent(response) {
	if (!response.success) return;
	var Y        = event.Y,
		markup   = event.markup,
		template = Y.Handlebars.compile(markup.comments);

	Y.one('.upto-event-comments').set('innerHTML', template({comments:response.data.comments}));
	Y.one('.upto-event-comment-form h6').set('innerHTML', 'Leave a comment on this event');
}