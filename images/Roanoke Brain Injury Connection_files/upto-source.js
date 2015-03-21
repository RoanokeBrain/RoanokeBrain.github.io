YUI.add('upto-source', function(Y){
	Y.namespace('UpToSource');
	
	var hostname = window.location.hostname,
		path     = '/source-interface/',
		proxyUrl = '//' + hostname + path;

	Y.UpToSource = {		
		save: function(token) {
			if (!token) return;

			var proxy = proxyUrl + 'jsonForSave/' + token,
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: saveSource,
						failure: saveSource,
						timeout: saveSource
					}
				});
			service.send();			
		},
		share: function(token) {
			if (!token) return;

			var proxy = proxyUrl + 'jsonForShare/' + token,
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: shareSource,
						failure: shareSource,
						timeout: shareSource
					}
				});
			service.send();
		},
		follow: function(token) {
			if (!token) return;
			var proxy = proxyUrl + 'jsonForFollow/' + token,
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: followSource,
						failure: followSource,
						timeout: followSource
					}
				});
			service.send();
		},
		email: function(token, email, container, view, calType){
			if (!token || !email || !container) return;
			Y.one('#' + container).set('innerHTML', '<p class="subscribing">Subscribing...</p>');
			var timezone = '',
				context  = Y.UA.mobile ? 'mobile' : 'web';
			if (jstz && typeof jstz != 'undefined' && jstz.determine && typeof jstz.determine != 'undefined') {
				var timezone = jstz.determine(),
					timezone = timezone.name() == 'undefined' ? '' : timezone.name();
			}
			var proxy = proxyUrl + 'jsonForEmail/' + token + '?callback={callback}&email=' + encodeURIComponent(email) + '&container=' + encodeURIComponent(container) + '&timezone=' + encodeURIComponent(timezone) + '&from=discover' + '&on=' + encodeURIComponent(view) + '&type=' + encodeURIComponent(calType) + '&context=' + encodeURIComponent(context),
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