YUI.add('authentication', function(Y){
	Y.namespace('Authentication');

	Y.Authentication = {
		protocol: window.location.protocol,
		hostname: window.location.hostname.match('upto.com') ? '//' + window.location.hostname : '//upto.com',
		containerId: 'upto-authentication-panel',
		contentId: 'authentication-content',
		panels: {
			authentication: null
		},
		markup: {
			modal: '<div id="{{{panelId}}}"></div>',
			bodyContent: '<div id="{{{contentId}}}" class="upto-modal-content"></div>' +
						 '<ul class="upto-modal-options">' +
							 '<li class="action-sign-up"><a href="{{{hostname}}}/sign-up">New to UpTo? Sign Up.</a></li>' + 
							 '<li class="action-sign-in"><a href="{{{hostname}}}/sign-in">Have an account? Sign In.</a></li>' +
						 '</ul>',
			promoContent: '<img alt="UpTo" src="{{{hostname}}}/assets/img/base/iconography/logo.png" title="UpTo">' +
						  '<p>UpTo is a social calendar that lets people discover, join, like and comment on events. Join thousands of others and keep up to date with your family and friends and follow all your favorite sports teams, concerts, movie and music releases and more.</p>' +
						  '<ul>' +
							  '<li><a href="{{{hostname}}}/embed-calendar">Learn More about UpTo</a></li>' +
							  '<li><a href="{{{hostname}}}/terms-and-conditions">Terms and Conditions</a></li>' +
						  '</ul>',
			iframeSrc: '{{{protocol}}}//{{{hostname}}}/intermediary?clean=true&token={{{token}}}&action={{{action}}}&protocol={{{protocol}}}&hostname={{{hostname}}}&pathname={{{pathname}}}{{#if origin}}&eo={{{origin}}}{{/if}}{{#if search}}&search={{{search}}}{{/if}}{{#if hash}}&hash={{{hash}}}{{/if}}{{#if src}}&url={{{src}}}{{/if}}',
			newLocation: '{{{protocol}}}//{{{hostname}}}/sign-up?clean=true&token={{{token}}}&action={{{action}}}&protocol={{{protocol}}}&hostname={{{hostname}}}&pathname={{{pathname}}}{{#if origin}}&eo={{{origin}}}{{/if}}{{#if search}}&search={{{search}}}{{/if}}{{#if hash}}&hash={{{hash}}}{{/if}}{{#if src}}&url={{{src}}}{{/if}}'
		},
		init: function(token, action) {

			var trigger         = Y.one('*[data-auth-required="true"][data-token="' + token + '"]') ? Y.one('*[data-auth-required="true"][data-token="' + token + '"]') : null,
				url             = window.location,
				protocol 	    = url.protocol,
				hostname  	    = url.hostname,
				pathname        = url.pathname,
				search          = url.search.replace(/&/g, '_amp_'),
				hash            = url.hash.substr(1, url.hash.length),
				origin  		= Y.one('meta[name="embed-url"]') ? Y.one('meta[name="embed-url"]').getAttribute('content') : null,
				contentTemplate = Y.Handlebars.compile(this.markup.bodyContent),
				promoContent    = Y.Handlebars.compile(this.markup.promoContent),
				template        = Y.Handlebars.compile(Y.Authentication.markup.newLocation);

			var pUWidth  = 435,
				pUHeight = 350,
				region   = trigger.get('viewportRegion'),
				top      = region.top + 250,
				left     = (region.width)/2;
			
			var href     = template({src: protocol + '//' + hostname + '/sign-up', token: token, action: action, protocol: protocol, origin: origin, hostname: hostname, pathname: pathname, search: search, hash: hash, destinationHostname: Y.Authentication.hostname}),
			    authPage = window.open(href, 'external', 'width=' + pUWidth + ',height=' + pUHeight + ',toolbar=0,menubar=0,channelmode=0,fullscreen=0,location=0,resizable=0,scrollbars=0,status=0,titlebar=0,left=' + left + ',top=' + top);
			authPage.focus();
		}
	};
		
},'1.0', { requires: ['node', 'event', 'panel', 'handlebars'] });