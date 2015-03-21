YUI.add('likeable', function(Y){
	Y.namespace('Likeable');

	Y.Likeable = {
		attrs: {
			token: 'data-token',
			type: 'data-type'
		},
		init: function(container) {
			if (!Y.one(container) || !container.getAttribute(this.attrs.token) || !container.getAttribute(this.attrs.type)) return;
			Y.Likeable[container.getAttribute(this.attrs.type)](container.getAttribute(this.attrs.token));				
		},
		event: function(token) {
			Y.UpToEvent.like(token);
		}
	};
		
},'1.0', { requires: ['node', 'event', 'panel', 'handlebars', 'upto-event'] });