YUI.add('commentable', function(Y){
	Y.namespace('Commentable');

	Y.Commentable = {
		attrs: {
			token: 'data-token',
			type: 'data-type'
		},
		init: function(container) {
			if (!Y.one(container) || !container.getAttribute(this.attrs.token) || !container.getAttribute(this.attrs.type) || !container.one('input') || !container.one('input').get('value') || !container.one('input').get('value')) return;
			Y.Commentable[container.getAttribute(this.attrs.type)](container.getAttribute(this.attrs.token), container.one('input').get('value'));
			container.one('input').set('value', '');
		},
		event: function(token, comment) {
			Y.UpToEvent.comment(token, comment);
		}
	};
		
},'1.0', { requires: ['node', 'event', 'panel', 'handlebars', 'upto-event'] });