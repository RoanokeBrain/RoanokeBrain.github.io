YUI.add('emailable', function(Y){
	Y.namespace('Emailable');

	Y.Emailable = {
		panel: null,
		attrs: {
			token: 'data-token',
			type: 'data-type'
		},
		init: function(container) {
			if (!Y.one(container) || !container.getAttribute(this.attrs.token) || !container.getAttribute(this.attrs.type) || !container.one('input') || !container.one('input').get('value') || !container.one('input').get('value') || !container.getAttribute('data-view') || !container.getAttribute('data-cal-type')) return;
			Y.Emailable[container.getAttribute(this.attrs.type)](container.getAttribute(this.attrs.token), container.one('input').get('value'), container.get('id'), container.getAttribute('data-view'), container.getAttribute('data-cal-type'));
		},
		modal: function() {
			if (!Y.one('form[data-action=email]')) return;
			var selector = '#email-subscribe-trigger';
			
			if (Y.one('form[data-action=email] .proxy')) {
				Y.one('form[data-action=email] .proxy').setStyle('display', 'none');
			}
			
			Y.one('body').delegate('click', function(ev) {
				if (!Y.Emailable.panel) { 
					var form     = Y.one('form[data-action=email]').cloneNode(true),
						panel    = new Y.Panel({
							srcNode: Y.one('#email-subscribe'),
							headerContent: 'Subscribe to Calendar',
							id: 'email-subscribe-panel',
							modal: true,
							constrain: true,
							render  : true,
							zIndex: 1000,
							visible: false,
							hideOn: [{eventName: 'clickoutside'}, {node: Y.one('doc'), eventName: 'key', keyCode: 'esc'}],
					        buttons: [{
				                template: '<i class="fa fa-times"></i>',
				                action: function(ev) {
				                    ev.preventDefault();
									Y.Emailable.panel.set('bodyContent', form);
				                    Y.Emailable.panel.hide();
				                },
				                section: Y.WidgetStdMod.HEADER,
				                classNames: ['yui3-button-exit']
							}]
						});
					
					Y.Emailable.panel = panel;
					Y.Emailable.panel.set('bodyContent', form);

					Y.Emailable.panel.get('boundingBox').one('form').on('submit', function(ev){
						var target = ev.target;
						ev.preventDefault();
						Y.Emailable.init(target)
					});
				}
				
				var trigger = ev.target,
					region  = trigger.get('region'),
					height  = Y.Emailable.panel.get('boundingBox').get('region').height,
					width   = Y.Emailable.panel.get('boundingBox').ancestor('body').one('#wrapper').get('region').width;

				Y.Emailable.panel.set('xy', [(width-region.width)/2, region.bottom]);
				
				ev.preventDefault();
				Y.Emailable.panel.show();
			}, selector);
		},
		source: function(token, email, container, view, calType) {						
			Y.UpToSource.email(token, email, container, view, calType);
		},
		plugin: function(token, email, container, view, calType) {
			Y.UpToPlugin.email(token, email, container, view, calType);
		}
	};
		
},'1.0', { requires: ['node', 'event', 'panel', 'handlebars', 'upto-source', 'upto-plugin'] });