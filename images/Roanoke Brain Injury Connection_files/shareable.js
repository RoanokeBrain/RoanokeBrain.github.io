YUI.add('shareable', function(Y){
	Y.namespace('Shareable');

	Y.Shareable = {
		attrs: {
			token: 'data-token',
			type: 'data-type'
		},
		init: function(container) {
			if (!Y.one(container) || !container.getAttribute(this.attrs.token) && !container.getAttribute(this.attrs.type)) return;
			Y.Shareable[container.getAttribute(this.attrs.type)](container.getAttribute(this.attrs.token));
		},
		event: function(token) {
			Y.UpToEvent.share(token);
		},
		source: function(token) {
			Y.UpToSource.share(token);			
		}
	};
		
},'1.0', { requires: ['node', 'event', 'panel', 'handlebars', 'upto-event', 'upto-source'] });