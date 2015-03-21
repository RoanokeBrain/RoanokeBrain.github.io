YUI.add('maps', function(Y){
	Y.namespace('Maps');

	Y.Maps = {
		mapboxInstance: null,
		requiredAttrs: {
			latitude: 'data-place-latitude',
			longitude: 'data-place-longitude',
			name: 'data-place-name',
			address: 'data-place-address',
			city: 'data-place-city',
			state: 'data-place-state',
			zip: 'data-place-zip',
			tileStyle: 'rockcityapps.map-nb2h9pym',
			zoomLevel: 14
		},
		optionalAttrs: {
			scrollWheelZoom: false,
			zoomControl: false,
			attributionControl: false
		},
		resources: {
			css: '//api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.css',
			js: '//api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.js'
		},
	
		init: function(container, cfgObj) {			
			if (!Y.one(container)) return;

			var	latitude     = container.getAttribute(this.requiredAttrs.latitude),
				longitude    = container.getAttribute(this.requiredAttrs.longitude);

			if (!latitude || !longitude) { return; }

			var domReference       = container.getDOMNode(),
				attributionControl = cfgObj && cfgObj.attributionControl ? cfgObj.attributionControl : Y.Maps.optionalAttrs.attributionControl,
				scrollWheelZoom    = cfgObj && cfgObj.scrollWheelZoom ? cfgObj.scrollWheelZoom : Y.Maps.optionalAttrs.scrollWheelZoom,
				tileStyle	       = cfgObj && cfgObj.tileStyle ? cfgObj.tileStyle : Y.Maps.requiredAttrs.tileStyle,
				zoomControl        = cfgObj && cfgObj.zoomControl ? cfgObj.zoomControl : Y.Maps.optionalAttrs.zoomControl,
				zoomLevel          = cfgObj && cfgObj.zoomLevel ? cfgObj.zoomLevel : Y.Maps.requiredAttrs.zoomLevel;

			Y.Get.load([this.resources.css,this.resources.js], function (err) {
				if (err) { 
					Y.log('Error loading file: ' + err[0].error, 'error'); 
					return; 
				}
				
				if (!Y.Maps.mapboxInstance) {
					L.mapbox.accessToken = 'pk.eyJ1Ijoicm9ja2NpdHlhcHBzIiwiYSI6ImRoaEpnSG8ifQ.4yliXnXNhv8vP7wgCdGQtA';
					Y.Maps.mapboxInstance = L.mapbox.map(domReference, tileStyle, {scrollWheelZoom: scrollWheelZoom, zoomControl: zoomControl, attributionControl: attributionControl});					
				}
				
				Y.Maps.handleMarker(Y.Maps.mapboxInstance);
				Y.Maps.mapboxInstance.setView([latitude, longitude], zoomLevel);
			});
		},
		
		handleMarker: function(map) {
			var container   = Y.one(map._container),
				name        = container.getAttribute(Y.Maps.requiredAttrs.name) ? container.getAttribute(Y.Maps.requiredAttrs.name) : null,
				address     = container.getAttribute(Y.Maps.requiredAttrs.address) ? container.getAttribute(Y.Maps.requiredAttrs.address) : null,
				city        = container.getAttribute(Y.Maps.requiredAttrs.city) ? container.getAttribute(Y.Maps.requiredAttrs.city) : null,
				state       = container.getAttribute(Y.Maps.requiredAttrs.state) ? container.getAttribute(Y.Maps.requiredAttrs.state) : null,
				zip         = container.getAttribute(Y.Maps.requiredAttrs.zip) ? container.getAttribute(Y.Maps.requiredAttrs.zip) : null,
				latitude    = container.getAttribute(Y.Maps.requiredAttrs.latitude) ? container.getAttribute(Y.Maps.requiredAttrs.latitude) : null,
				longitude   = container.getAttribute(Y.Maps.requiredAttrs.longitude) ? container.getAttribute(Y.Maps.requiredAttrs.longitude) : null,
				description = null;

			if (city && state) {
				description = city +', ' + state;
			}

			if (address && city && state) {
				description = address + '<br>' + city +', ' + state;
			}
						
			if ( address && city && state && zip) {
				description = address + '<br>' + city +', ' + state + ' ' + zip;
			}
			
			var geoJSON = {
						  	type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: [longitude, latitude]
							},
							properties: { 
								'title': name, 
								'description': description, 
								'marker-size': 'small', 
								'icon': {
						            'iconUrl': 'https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/utilities/transparent-pixel.png',
						            'iconSize': [1, 1],
						            'iconAnchor': [1, 1],
						            'popupAnchor': [0, -1],
						            'className': 'dot'
								} 
							}
						  };

			var myMarkers = L.mapbox.featureLayer(geoJSON).addTo(map);

			map.on('ready', function(ev){
				myMarkers.eachLayer(function(layer){
					layer.openPopup();
					layer.setIcon(L.icon(layer.feature.properties.icon));					
				});
								
			    myMarkers.on('click', function(ev) {
			        map.panTo(ev.layer.getLatLng());
			    });
			});
		}
	};
		
},'1.0', { requires: ['node', 'event', 'get'] });