YUI.add('upto-plugin', function(Y){
	Y.namespace('UpToPlugin');
	
	var hostname = window.location.hostname,
		path     = '/plugin-interface/',
		proxyUrl = '//' + hostname + path;

	Y.UpToPlugin = {		
		email: function(token, email, container, view, calType){
			if (!token || !email || !container) return;
			Y.one('#' + container).set('innerHTML', '<p class="subscribing">Subscribing...</p>');
			var timezone = '',
				context  = Y.UA.mobile ? 'mobile' : 'web';
			if (jstz && typeof jstz != 'undefined' && jstz.determine && typeof jstz.determine != 'undefined') {
				var timezone = jstz.determine(),
					timezone = timezone.name() == 'undefined' ? '' : timezone.name();
			}
			var proxy = proxyUrl + 'jsonForEmail/' + token + '?callback={callback}&email=' + encodeURIComponent(email) + '&container=' + encodeURIComponent(container) + '&timezone=' + encodeURIComponent(timezone)+ '&from=embed' + '&on=' + encodeURIComponent(view) + '&type=' + encodeURIComponent(calType) + '&context=' + encodeURIComponent(context),
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: emailSource,
						failure: emailSource,
						timeout: emailSource,
					}
				});
			service.send();
		}
	};
		
},'1.0', { requires: ['node', 'event', 'jsonp', 'jsonp-url'] });