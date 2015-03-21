YUI.add('upto-event', function(Y){
	Y.namespace('UpToEvent');
	
	var hostname = window.location.hostname,
		path     = '/event-interface/',
		proxyUrl = '//' + hostname + path;

	Y.UpToEvent = {		
		save: function(token) {
			if (!token) return;

			var proxy = proxyUrl + 'jsonForSave/' + token;
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: saveEvent,
						failure: saveEvent,
						timeout: saveEvent
					}
				});
			service.send();			
		},
		share: function(token) {
			if (!token) return;

			var proxy = proxyUrl + 'jsonForShare/' + token;
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: shareEvent,
						failure: shareEvent,
						timeout: shareEvent
					}
				});
			service.send();
		},
		map: function(token) {
			if (!token) return;

			var proxy = proxyUrl + 'jsonForMap/' + token;
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: mapEvent,
						failure: mapEvent,
						timeout: mapEvent
					}
				});
			service.send();
		},
		like: function(token) {
			if (!token) return;

			var proxy = proxyUrl + 'jsonForLike/' + token;
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: likeEvent,
						failure: likeEvent,
						timeout: likeEvent
					}
				});
			service.send();
		},
		comment: function(token, comment) {
			if (!token) return;
			var proxy = proxyUrl + 'jsonForComment/' + token + '?comment=' + encodeURIComponent(comment);
				service = new Y.JSONPRequest(proxy, {
					on: {
						success: commentOnEvent,
						failure: commentOnEvent,
						timeout: commentOnEvent
					}
				});
			service.send();
		}
	};
		
},'1.0', { requires: ['node', 'event', 'jsonp', 'jsonp-url'] });