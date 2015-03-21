var source = {
	Y: YUI().use('node','event', 'panel', 'handlebars', 'utilities', 'authentication'),
	hostname: window.location.hostname.match('upto.com') ? '//' + window.location.hostname : '//upto.com',
	pathname: '/source/',
	containerId: {
		saveModal: 'source-saveable-panel',
		shareModal: 'source-shareable-panel'
	},
	panels: {
		saveable: null,
		shareable: null
	},
	markup: {
		modal: '<div id="{{{panelId}}}"></div>',		
		saveOptions:
			'{{#if token}}<ul class="upto-modal-options">' +
				'<li><a href="/s/ics?t={{{token}}}"><span><img alt="iCal" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/logos/ical.png">iCal</span></a></li>' +
				'<li><a href="/s/ics?t={{{token}}}"><span><img alt="Outlook" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/logos/outlook.png">Outlook</span></a></li>' +
			'</ul>{{/if}}',
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
				'<a class="copy-to-clipboard" href="/s/{{{token}}}"><span><img alt="Copy to Clipboard" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/icons/icon-copy.png">Copy Link</span></a>' +
			'</li>' + 			
			/*
				'<li>' +
				'<a href="https://plus.google.com/share?url={{{location}}}">' +
					'Google+' +
				'</a>' +	
				'</li>' +
			*/
			'</ul>',
	}
};

function saveSource(response) {
	if (!response.success) return;

	var Y           = source.Y,
		containerId = source.containerId,
		markup      = source.markup,
		panels      = source.panels;
		
	if (!Y.one('#' + containerId.saveModal) || !panels.saveable) {
		var template = Y.Handlebars.compile(markup.modal),
			panelSrc = Y.Node.create(template({panelId: containerId.saveModal}));
		Y.one('.yui3-skin-sam').append(panelSrc);
	
		var panel = new Y.Panel({
			srcNode : '#' + containerId.saveModal,
			headerContent: 'Save Calendar',
			modal: true,
			constrain: true,
			centered: true,
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
			token: response.data.token
		};
		
	var trigger = Y.one('*[data-action="save"][data-type="source"][data-token="' + encodeURIComponent(response.data.token) + '"]');
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
}

function shareSource(response) {
	if (!response.success) return;

	var Y           = source.Y,
		containerId = source.containerId,
		markup      = source.markup,
		panels      = source.panels;
		
	if (!Y.one('#' + containerId.shareModal) || !panels.shareable) {
		var template = Y.Handlebars.compile(markup.modal),
			panelSrc = Y.Node.create(template({panelId: containerId.shareModal}));
		Y.one('.yui3-skin-sam').append(panelSrc);
	
		var panel = new Y.Panel({
			srcNode : '#' + containerId.shareModal,
			headerContent: 'Share Calendar',
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
			name        : response.data.name ? encodeURIComponent('Follow the ' + response.data.name + ' calendar on UpTo') : null,
			token       : response.data.token ? encodeURIComponent(response.data.token) : null,
			photo       : response.data.photo ? encodeURIComponent(response.data.photo) : null,
		    appId       : response.data.facebook.appId ? encodeURIComponent(response.data.facebook.appId) : null,
			description : response.data.facebook.description ? encodeURIComponent(response.data.facebook.description) : null,
			text        : response.data.name ? encodeURIComponent('Check out the ' + response.data.name + ' calendar on UpTo. Get the free app and follow the stream!') : null,
			location    : response.data.shareUrl ? encodeURIComponent(response.data.shareUrl) : null
		};

	var trigger = Y.one('*[data-action="share"][data-type="source"][data-token="' + response.data.token + '"]');
	panels.shareable.set('bodyContent', template(data));
	
	var triggerRegion = trigger.get('region'),
		wrapperRegion = Y.one('body').get('region'),
		panelWidth    = panels.shareable.get('boundingBox').get('region').width;
	
	if (Y.Object.size(window.top) <= 0) {
		panels.shareable.set('xy', [wrapperRegion.left + ((wrapperRegion.width - panelWidth)/2), triggerRegion.bottom]);
	}

	var cpTrigger = source.Y.one('#' + source.containerId.shareModal + ' .copy-to-clipboard');
	ZeroClipboard.config({swfPath: window.location.protocol + '//' + window.location.hostname + '/clientside-vendors/zeroclipboard/1.3.3/ZeroClipboard.swf', moviePath: window.location.protocol + '//' + window.location.hostname + '/clientside-vendors/zeroclipboard/1.3.3/ZeroClipboard.swf', forceHandCursor: true, trustedDomains: ['*']});
	
	var clipboard = new ZeroClipboard(cpTrigger.getDOMNode());
	clipboard.on('mouseout', function(clipboard) { cpTrigger.setStyle('background-color', '#FFFFFF'); });
	clipboard.on('mouseover', function(clipboard) { cpTrigger.setStyle('background-color', '#'+response.data.lighterColor); });
	clipboard.on('dataRequested', function(clipboard) { 
		clipboard.setText(cpTrigger.get('href'));
		cpTrigger.one('span').set('innerHTML', '<img alt="Copied" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/icons/icon-check.png">Link Copied!');
		setTimeout(function(){
			panels.shareable.hide();
			ZeroClipboard.destroy();
		}, 800);
	});
	clipboard.on('wrongflash noflash', function(){ 
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

function followSource(response) {
	if (!response.success) return;
	var Y          = source.Y,
		followCTAs = Y.all('*[data-action="follow"][data-token="' + response.data.token + '"]');
	
	if (response.data.followed) {
		followCTAs.each(function(cta){
			cta.set('innerHTML', 'Unsubscribe from Calendar');
		});
	} else {
		followCTAs.each(function(cta){
			cta.set('innerHTML', 'Subscribe to Calendar');
		});
	}
}

function emailSource(response) {
	var Y = source.Y;
	
	if (!response.success) {
		if (response.data.container) {
			Y.one('#' + response.data.container).set('innerHTML', '<fieldset><span class="label"><label class="error" for="subscription-email">'+response.data.message+'</label></span><span class="input"><input type="email" id="subscription-email" class="error" placeholder="Email Address" value="'+response.data.email+'"></span><span class="form-button"><button type="submit">Subscribe</button></span></fieldset>');			
		}
	} else {
		if (response.data.container) {
			Y.one('#' + response.data.container).set('innerHTML', '<p><span>Thank you!</span> You are now subscribed.</p>');
		}		
	}
}