YUI.add('utilities', function(Y){
	Y.namespace('Utilities');
	
	Y.Utilities = {
		
		features: [
			{
				selector: '*[data-action="email"][data-type][data-token][data-handlers]',
				module: Y.Emailable
			},
			{
				selector: '*[data-action="save"][data-type][data-token][data-handlers]',
				module: Y.Saveable
			},
			{
				selector: '*[data-action="share"][data-type][data-token][data-handlers]',
				module: Y.Shareable
			},
			{
				selector: '*[data-action="like"][data-type][data-token][data-handlers]',
				module: Y.Likeable
			},
			{
				selector: '*[data-action="comment"][data-type][data-token][data-handlers]',
				module: Y.Commentable
			},
			{
				selector: '*[data-action="follow"][data-type][data-token][data-handlers]',
				module: Y.Followable
			},
			{
				selector: '*[data-action="map"][data-type][data-token][data-handlers]',
				module: Y.Maps,
				override: Y.UpToEvent.map
			},
			{
				selector: '*[data-uploader][data-upload-proxy][data-label][data-target][data-handlers]',
				module: Y.Uploadable
			},
			{
				selector: '*[data-action="upto"][data-handlers]',
				module: Y.Brand
			}
		],

		getCurrentTimeZone: function(){
			if (jstz && typeof jstz != 'undefined' && jstz.determine && typeof jstz.determine != 'undefined') {				
				if (!Y.Cookie.get('client-timezone')) {					
					var loc      = window.location,
						timezone = jstz.determine(),
						tname    = timezone.name() == 'undefined' ? null : timezone.name(),
						action   = '/timezone?tz=' + tname,
						xhr      = new Y.IO({ emitFacade: true, bubbles: true }),
						config   = {
							method: 'GET',
							on: {
								success: function(evFacade) {
									try {
										var response = Y.JSON.parse(evFacade.data.response);
										if (response.success) {
											Y.Cookie.set('client-timezone', timezone.name(), {domain: loc.hostname, secure: 0});
										}
									}
									catch(err) {}
								},
								failure: function(evFacade) { }
							}
						};
					xhr.send(action, config);
				}
			}
		},
		
		embedHistoryTriggers: function(){
			Y.one('body').delegate('click', function(ev){
				ev.preventDefault();
				var newLocation = this.get('href');
				window.top.location.assign(newLocation);
			}, '*[data-embed-history]');
		},

		browserBack: function(){
			Y.one('body').delegate('click', function(ev){
				ev.preventDefault();
				window.history.back()
			}, '*[data-browser-back]');
		},

		externalAnchors: function(){
			var anchors  = Y.all('a'),
				attribution = Y.one('.upto-attribution a');

			anchors.each(function(anchor){
				if (anchor === attribution) {
					Y.Utilities.newWindow(anchor, true);
				}
				Y.Utilities.newWindow(anchor);
			});
			

		},

		newWindow: function(anchor, override){

			Y.one('body').delegate('click', function(ev){
				var hostname     = window.location.hostname,
					href         = this.get('href'),
					hrefHostName = this.getDOMNode().hostname;
				if (!href || !hrefHostName) return;
								
				if (override || hostname != hrefHostName && !href.match(/mailto:/) && !this.getAttribute('data-embed-history')) {
					ev.preventDefault();
					var externalPage = window.open(href, 'external');
					externalPage.focus();
				}
			}, function(target){ if (target === anchor) return true; return false; })
		},
	
		prepareSelectElementCustomization: function(){
			Y.all('select#upto-calendar-toggle').each(function(sel){
				Y.Utilities.customizeSelectElement(sel);
			});
		},
		
		customizeSelectElement: function(select) {
			if (!select) return;
			var proxy             = Y.Node.create('<span class="select-proxy"><span class="text"></span><i class="fa fa-caret-down"></i></span>'),
				optionText        = select.get('options').item(select.get('selectedIndex')).get('text'),
				optionsProxy      = Y.Node.create('<ul class="options-proxy"></ul>');

			proxy.one('.text').set('innerHTML', optionText);
			
			if (select.get('id')) {
				proxy.set('id', select.get('id') + '-proxy');
				optionsProxy.set('id', select.get('id') + '-options-proxy');
			}
			
			select.insert(proxy, 'after');
			proxy.insert(optionsProxy, 'after');
			
			select.setStyles({
				display: 'none'
			});
							
			if (!proxy.get('nextSibling').hasClass('rendered')) {
				select.get('options').each(function(option){
					var className   = option.get('className'),
						label       = option.get('innerHTML'),
						value       = option.get('value'),
						optionProxy = Y.Node.create('<li class="' + className + '" data-value="' + value + '">' + label + '</li>')
					optionsProxy.appendChild(optionProxy);
					if (select.get('value') == option.get('value')) {
						optionProxy.addClass('selected');
					}
				});
				var optionsProxyRegion = optionsProxy.get('region');
				optionsProxy.setStyle('visibility', 'hidden');
			}

			Y.Utilities.prepareProxyBehavior(select, proxy, optionsProxy);
		},

		prepareProxyBehavior: function(select, proxy, optionsProxy) {
			if (!select || !proxy || !optionsProxy) return;

			select.on('change', function(ev){
				var optionText = select.get('options').item(select.get('selectedIndex')).get('text');

				if (ev.target.get('value')) {
					Y.one('form[data-action=email]').setAttribute('data-type', 'source');
					Y.one('form[data-action=email]').setAttribute('data-token', ev.target.get('value'));
					Y.one('a[data-action=share][data-type=source]').setAttribute('data-token', ev.target.get('value'));	
				} else {
					Y.one('form[data-action=email]').setAttribute('data-type', 'plugin');
					Y.one('form[data-action=email]').setAttribute('data-token', select.get('options').item(select.get('selectedIndex')).get('title'));
				}
				proxy.one('.text').set('innerHTML', optionText);
			});
			
			proxy.delegate('click', function(ev) {
				ev.stopPropagation();	
				if (!proxy.get('nextSibling').hasClass('rendered')) {

					optionsProxy.all('li').setStyle('display', 'block');
					var	proxyRegion        = proxy.get('region'),
						optionsProxyRegion = optionsProxy.get('region');
					
					if (proxyRegion.width > optionsProxyRegion.width) {
						optionsProxy.setStyle('width', proxyRegion.width + 'px');
						optionsProxyRegion = optionsProxy.get('region');
					}
					
					if (select.getAttribute('data-options-align') && select.getAttribute('data-options-align') == 'right') {
						optionsProxy.setXY([proxyRegion.right - optionsProxyRegion.width, proxyRegion.bottom]);
					} else {
						optionsProxy.setXY([proxyRegion.left, proxyRegion.bottom]);
					}

					optionsProxy.addClass('rendered');
					var optionsProxyRegion = optionsProxy.get('region');
					optionsProxy.setStyle('visibility', 'visible');

					optionsProxy.delegate('click', function(ev){
						var optionProxy = this;
						optionsProxy.all('li').removeClass('selected');
						select.get('options').each(function(option){								
							if (optionProxy.getAttribute('data-value') == option.get('value')) {
								select.set('value', optionProxy.getAttribute('data-value'));
								select.simulate('change');
								optionProxy.addClass('selected');
							}
						});
						proxy.one('.text').set('innerHTML', optionProxy.get('innerHTML'));
						optionsProxy.setStyle('visibility', 'hidden');
					}, 'li');
				} else {
					var	proxyRegion        = proxy.get('region'),
						optionsProxyRegion = optionsProxy.get('region');

					if (proxyRegion.width > optionsProxyRegion.width) {
						optionsProxy.setStyle('width', proxyRegion.width + 'px');
						optionsProxyRegion = optionsProxy.get('region');
					}

					if (select.getAttribute('data-options-align') && select.getAttribute('data-options-align') == 'right') {
						optionsProxy.setXY([proxyRegion.right - optionsProxyRegion.width, proxyRegion.bottom]);
					} else {
						optionsProxy.setXY([proxyRegion.left, proxyRegion.bottom]);
					}
					if (optionsProxy.getStyle('visibility') === 'visible') {
						optionsProxy.setStyle('visibility', 'hidden');
					} else {
						optionsProxy.setStyle('visibility', 'visible');
					}
				}
			}, 'span,i');
			
			Y.one('body').delegate('click', function(ev){
				ev.stopPropagation();	
				if (this != proxy) { optionsProxy.setStyle('visibility', 'hidden'); }
			}, '*');

		},

		prepareEventAnalytics: function(){
			var delimiter  = ',',
				selector   = '*[data-track-category][data-track-action][data-handlers]',			
				trackables = Y.all(selector);
			
			trackables.each(function(trackable){
				var handlers = trackable.getAttribute('data-handlers').split(delimiter);
				Y.Array.each(handlers, function(handler){
					Y.one('body').delegate(handler, function(ev){
						Y.Trackable.init(trackable);
					}, function(target){ if (target === trackable) return true; return false; });
				});
			});
		},
	
		prepareUpToVerifiedFeatures: function(){
			var delimiter       = ',',
				selector        = '.unverified-user *[data-token][data-type][data-action][data-auth-required][data-handlers]',
				verifiedActions = Y.all(selector);
			
			verifiedActions.each(function(verifiedAction){
				var token  = verifiedAction.getAttribute('data-token'),
					action = verifiedAction.getAttribute('data-action'),
					events = verifiedAction.getAttribute('data-handlers').split(delimiter);
				
				Y.Array.each(events, function(event){
					Y.one('body').delegate(event, function(ev){
						ev.preventDefault();
						ev.stopImmediatePropagation();
						var comment = Y.one('.unverified-user [data-action="comment"] input');
						if (comment && comment.get('value')) {
							var date = new Date(),
								loc  = window.location;
							date.setSeconds(date.getSeconds() + 90);
							Y.Cookie.set('event-comment', comment.get('value'), {path: '/', domain: loc.hostname, secure: 0, expires: date});
							var form = comment.ancestor('form');
							if (form) Y.Trackable.track(form.getAttribute('data-track-action'), form.getAttribute('data-track-category'), { category: form.getAttribute('data-track-category'), label: form.getAttribute('data-track-label') });
						}
						Y.Authentication.init(token, action);
					}, function(target){ if (target === verifiedAction) return true; return false; });
				});
			});	
		},
	
		buildHandlerFromAttributes: function(selectors, module, override) {
			Y.all(selectors).each(function(selector){
				var eventHandlers = selector.getAttribute('data-handlers').split(',');
				Y.Array.each(eventHandlers, function(eventHandler){
					if (eventHandler === 'load') {
						Y.on('domready', function() {
							if (override) {
								override.call(this, selector.getAttribute('data-token'));
							} else {
								if (module) {
									module.init(selector);
								}
							}							
						});
					}
					
					Y.one('body').delegate(eventHandler, function(ev){
						ev.preventDefault();
						ev.stopImmediatePropagation();
						if (override) {
							override.call(this, selector.getAttribute('data-token'));
						} else {
							if (module) {
								module.init(selector);
							}	
						}
					},function(target){ if (target === selector) return true; return false; })
				});
			});
		},
		
		prepareUpToFeatures: function(){
			Y.Tooltip.init();
			Y.Manageable.init();
			Y.Emailable.modal();
			
			Y.Array.each(this.features, function(feature){
				if (feature.override) {
					Y.Utilities.buildHandlerFromAttributes(feature.selector, feature.module, feature.override);
				} else {
					Y.Utilities.buildHandlerFromAttributes(feature.selector, feature.module);
				}
			});
		},
		
		prepareSourceToggler: function() {
			var selector = '.upto-calendar-toggle';
				
			Y.one('body').delegate('change', function(ev){
				Y.Utilities.toggleEventListItems(this.get('value'));
				Y.Utilities.toggleGridTargets(this.get('value'));
				Y.Utilities.toggleGridItems(this.get('value'));	
			}, selector);
		},
		
		toggleEventListItems: function(filter) {
			var	listItems            = '*[data-visual-type="list-item"]',
				listContainers       = '*[data-visual-type="container"][data-containment-type="list-item"]';

			Y.all(listItems).each(function(el){
				var parent = el.ancestor(listContainers);
				el.setStyle('display', 'block');

				if (!parent.hasClass('filtered-by-duration')) {
					parent.setStyle('display', 'block');
				}
			});
			
			if (!filter) {
				Y.all(listItems).each(function(el){
					var parent     = el.ancestor(listContainers);
					el.setStyle('display', 'block');

					if (!parent.hasClass('filtered-by-duration')) {
						parent.setStyle('display', 'block');
					}
				});
			} else {			
				Y.all(listItems + ':not([data-source="' + filter + '"])').each(function(el){

					var parent     = el.ancestor(listContainers),
						numVisible = 0;
					
					el.setStyle('display', 'none');
					
					parent.all(listItems).each(function(container){
						if (container.getStyle('display') && container.getStyle('display') === 'block') {
							numVisible++;
						}
					});
					
					if (numVisible > 0) {
						if (!parent.hasClass('filtered-by-duration')) {
							parent.setStyle('display', 'block');
						}
					} else {
						parent.setStyle('display', 'none');
					}
				});
			}
		},

		toggleGridItems: function(filter) {
			var listItems = '*[data-view-type="calendar"] table ul li';
			Y.all(listItems).each(function(el) {
				el.setStyle('display', 'block');
			});

			if (!filter) {
				Y.all(listItems).each(function(el){
					el.setStyle('display', 'block');
				});
			} else {
				Y.all(listItems + ':not([data-source-token="' + filter + '"])').each(function(el){	
					el.setStyle('display', 'none');
				});
			}
		},
		
		toggleGridTargets: function(filter) {
			var	gridTargets          = '*[data-visual-type="grid-target"]',
				gridTargetContainers = '*[data-visual-type="container"][data-containment-type="grid-target"]';

			Y.all(gridTargets).each(function(gridTarget){
				gridTarget.one('.upto-date-wrapper').addClass('eventful');				
			});

			Y.all(gridTargets).each(function(gridTarget){
				if (gridTarget.getAttribute('data-event-tokens')) {					
					if (gridTarget.getAttribute('data-event-tokens').indexOf(filter) === -1) {
						gridTarget.one('.upto-date-wrapper').removeClass('eventful');
					}					
				}
			});
		},
		
		handleRemoteActions: function(){
			if (Y.Cookie.get('remote-action')) {
				var cookie   = Y.JSON.parse(Y.Cookie.get('remote-action')),
					token    = cookie.token,
					action   = cookie.action,
					hostname = cookie.hostname,
					pathname = cookie.pathname,
					obj      = action === 'follow' ? Y.UpToSource : Y.UpToEvent; // Array of actions for each type in the future? Maybe return with JSON response?;

				if (action === 'comment') {
					var loc  = window.location;
					obj[action](token, Y.Cookie.get('event-comment'));
					Y.Cookie.remove('event-comment', {path: loc.pathname, domain: loc.hostname, secure: 0});
				} else {
					obj[action](token);
				}
				
				Y.Cookie.remove('remote-action', { path: pathname, domain: hostname, secure: 0});
			}
		},
		
		anchorWrappers: function(){
			if (Y.UA.ie > 0 && Y.UA.ie <= 9) {
				var selector = '.anchor-wrapper';
				Y.one('body').delegate('click', function(ev){
					if (this.one(' > a').get('href')) {
						ev.preventDefault();
						ev.stopImmediatePropagation();
						window.location = this.one(' > a').get('href');
					}	
				}, selector);
			}
		},

		hijackPreviewBack: function(selector){
			if (Y.Object.size(window.top) <= 0) return;
			if (window.top.location.pathname && window.top.location.pathname === '/embeds/preview') {
				Y.one(selector).delegate('click', function(ev){
					ev.preventDefault();
					window.history.back();
				}, 'a');
			}
		},
				
		resizeFrame: function(frameId){
			if (Y.Object.size(window.top) <= 0) return;
			var body  = window.document.body,
				frame = window.top.document.getElementById(frameId);
			if (!frame) return;
			frame.style.height = body.offsetHeight + 'px';
		},
		
		loadingModal: function() {
			var syncTriggers = Y.all('a.sync');
			
			if (syncTriggers.size() <= 0) return;
			
			var syncContainer = Y.Node.create('<div id="sync-message"></div>'),
				body          = Y.Node.create('<i class="fa fa-refresh fa-spin"></i><p>This may take a few moments...</p>');
			
			if (!Y.one('#sync-message')) {
				Y.one('body').appendChild(syncContainer);
			}
			
			var panel = new Y.Panel({
							srcNode: Y.one('#sync-message'),
							headerContent: 'Calendar Sync',
							id: 'calendar-sync-panel',
							bodyContent: body,
							modal: true,
							constrain: true,
							centered: true,
							render  : true,
							zIndex: 1000,
							visible: false,
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
			
			Y.one('body').delegate('click', function(ev){
				panel.show();
			}, 'a.sync');			
		}
	};
},'1.0', { requires: ['node', 'event', 'saveable', 'emailable', 'shareable', 'likeable', 'followable', 'commentable', 'upto-event', 'upto-source', 'trackable', 'io', 'node-event-simulate', 'uploadable', 'brand'] });