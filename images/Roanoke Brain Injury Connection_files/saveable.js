YUI.add('saveable', function(Y){
	Y.namespace('Saveable');

	Y.Saveable = {
		attrs: {
			type: 'data-type',
			token: 'data-token'
		},
		init: function(container) {
			if (!Y.one(container) || !container.getAttribute(this.attrs.token) || !container.getAttribute(this.attrs.type)) return;			
			Y.Saveable[container.getAttribute(this.attrs.type)](container.getAttribute(this.attrs.token));
		},
		event: function(token) {
			Y.UpToEvent.save(token);
		},
		source: function(token) {
			Y.UpToSource.save(token);			
		}
	};
		
},'1.0', { requires: ['node', 'event', 'panel', 'handlebars', 'upto-event', 'upto-source'] });