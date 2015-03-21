YUI.add('followable', function(Y){
	Y.namespace('Followable');

	Y.Followable = {
		attrs: {
			token: 'data-token',
			type: 'data-type'
		},
		init: function(container) {
			if (!Y.one(container) || !container.getAttribute(this.attrs.token) || !container.getAttribute(this.attrs.type)) return;
			Y.Followable[container.getAttribute(this.attrs.type)](container.getAttribute(this.attrs.token));				
		},
		source: function(token) {
			Y.UpToSource.follow(token);
		}
	};
		
},'1.0', { requires: ['node', 'event', 'panel', 'handlebars', 'upto-source'] });