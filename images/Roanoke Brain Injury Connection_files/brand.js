YUI.add('brand', function(Y){
	Y.namespace('Brand');

	Y.Brand = {
		panel: null,
		container: '<div id="upto-modal" class="large font-helneuethin text-center"></div>',
		body: '<div class="pvl"><h2>Follow this calendar on UpTo</h2><a data-handlers="click"  data-track-category="UpTo Options" data-track-action="Follow" target="_top" href="https://upto.com?utm_source=webcalendartop&utm_medium=referral&utm_campaign=powered+by+upto+referral" class="web-button suggested large-font mtm">Learn More</a></div>' +
			  '<div class="pvm side-bar"><h3><a data-handlers="click" data-track-category="UpTo Options" data-track-action="Create" target="_top" href="https://upto.com/embed-calendar">Create your own UpTo calendar</a></h3></div>',
		init: function(container) {
			if (!Y.one(container)) return;
			this.prepareModal();
		},
		prepareModal: function() {
			if (!Y.one('#upto-modal') || !this.panel) {
				var panelSrc = Y.Node.create(this.container);
				Y.one('.yui3-skin-sam').append(panelSrc);
			
				var panel = new Y.Panel({
					srcNode : '#upto-modal',
					modal: true,
					headerContent: '<img src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/promo/u-popup-bg.png" width="100%">',
					constrain: true,
					render  : true,
					zIndex: 1000,
					hideOn: [{eventName: 'clickoutside'}, {node: Y.one('doc'), eventName: 'key', keyCode: 'esc'}],
			        buttons: [{
						template: '<i class="fa fa-times"></i>',
		                action: function(ev) {
		                    ev.preventDefault();
		                    panel.hide();
		                },
		                section: Y.WidgetStdMod.HEADER,
		                classNames: ['yui3-button-exit']
					}]
				});				
				this.panel = panel;
			}

			var trigger = Y.one('*[data-action="upto"]');
			this.panel.set('bodyContent', this.body);
			Y.all('#upto-modal [data-track-category]').each(function(trackable){
				var handlers = trackable.getAttribute('data-handlers').split(',');
				Y.Array.each(handlers, function(handler){
					Y.one('body').delegate(handler, function(ev){
						Y.Trackable.init(trackable);
					}, function(target){ if (target === trackable) return true; return false; });
				});
			});
			
			var triggerRegion = trigger.get('region'),
				wrapper = Y.one('.upto-wrapper'),
				panelRegion = this.panel.get('boundingBox').get('region');

			// Have to hardcode 410 here instead of doing panelRegion.height
			// because the img in the panel header has not yet loaded and it will make the panel seem half as tall
			if(wrapper.get('region') && wrapper.get('region').height < 410){
				wrapper.setStyle('min-height', 410 + triggerRegion.bottom);
			}

			var wrapperRegion = wrapper.get('region');

			this.panel.set('xy', [wrapperRegion.left + ((wrapperRegion.width - panelRegion.width)/2), triggerRegion.bottom]);
			
			Y.one('#upto-modal').delegate('click', function(ev){
				Y.Brand.panel.hide();
				Y.Utilities.newWindow(this);
			}, 'a');

			this.panel.after('visibleChange', function(e){
				if(e.newVal === false){
					wrapper.setStyle('min-height', 0);
				}
			})

			this.panel.show();
		}
	};
		
},'1.0', { requires: ['node', 'event', 'panel'] });