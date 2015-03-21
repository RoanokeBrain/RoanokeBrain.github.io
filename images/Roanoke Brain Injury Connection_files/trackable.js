YUI.add('trackable', function(Y){
	Y.namespace('Trackable');

	Y.Trackable = {
		// Attrs represent data available via GA API
		attrs: {
			category: 'data-track-category',             // REQUIRED
			action: 'data-track-action',                 // REQUIRED
			label: 'data-track-label',                   // THIS IS A STRING AND OPTIONAL
			value: 'data-track-value',                   // THIS IS AN INTEGER AND OPTIONAL
			noninteraction: 'data-track-noninteraction', // THIS IS A BOOL AND OPTIONAL
		},
		init: function(element) {
			var category       = element.getAttribute(Y.Trackable.attrs.category) ? element.getAttribute(Y.Trackable.attrs.category) : null,
				action         = element.getAttribute(Y.Trackable.attrs.action) ? element.getAttribute(Y.Trackable.attrs.action) : null,
				label    	   = element.getAttribute(Y.Trackable.attrs.label) ? element.getAttribute(Y.Trackable.attrs.label) : null,
				value          = element.getAttribute(Y.Trackable.attrs.value) ? element.getAttribute(Y.Trackable.attrs.value) : null,
				noninteraction = element.getAttribute(Y.Trackable.attrs.noninteraction) ? element.getAttribute(Y.Trackable.attrs.noninteraction) : null;

			Y.Trackable.track(category, action, {
				category: category,
				label: label,
				value: value,
				noninteraction: noninteraction
			});
		},
		track: function(category, action, properties) {
			_gaq.push(['_trackEvent', category, action, properties.label, properties.value, properties.noninteraction]);			
		}
	};
		
},'1.0', { requires: ['node', 'event'] });