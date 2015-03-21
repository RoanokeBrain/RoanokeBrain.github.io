YUI.add('uploadable', function(Y){
	Y.namespace('Uploadable');

	Y.Uploadable = {
		postKeys: {
			'user-avatar'   : 'avatar',
			'user-cover'    : 'cover',
			'source-cover'  : 'cover',
			'source-avatar' : 'avatar',
			'event-avatar'  : 'event_photo'
		},
		proxies: {
			'user-avatar'   : '/sources/uploadImage/users',
			'user-cover'    : '/sources/uploadImage/users',
			'source-cover'  : '/sources/uploadImage/sources',
			'source-avatar' : '/sources/uploadImage/sources',
			'event-avatar'  : '/sources/uploadImage/events'
		},
		successMethods: {
			'user-avatar'   : function(imgUri){
				Y.all('input[name="avatar"]').set('value', imgUri);
			},
			'user-cover'    : function(imgUri){
				Y.all('input[name="cover"]').set('value', imgUri);
			},
			'source-cover'  : function(imgUri){
				Y.all('input[name="cover"]').set('value', imgUri);
			},
			'source-avatar' : function(imgUri){
				Y.all('input[name="avatar"]').set('value', imgUri);
			},
			'event-avatar'  : function(imgUri){
				Y.one('#event-photo').set('value', imgUri);			
			}
		},				
		init: function(container) {
			if (!Y.one(container)) return;
		
			if (Y.Uploader.TYPE != 'none' && !Y.UA.ios) {
				var uploaderTrigger = Y.one(container),
					uploaderTarget = Y.one('*[data-uploader-target][data-target-id="' + uploaderTrigger.getAttribute('data-target') + '"]'),
					uploaderType = uploaderTrigger.getAttribute('data-upload-proxy'),
					uploadDone = false,
					uploader = new Y.Uploader({
						swfURL: '/clientside-vendors/yui/swf/flashuploader.swf?t=' + Math.random(),
						simLimit: 1,
						withCredentials: false,
						buttonClassNames: { hover: null, active: null, disabled: null, focus: null }
					});
			
				uploader.set('selectFilesButton', Y.Node.create('<button class="web-button default small" type="button">' + uploaderTrigger.getAttribute('data-label') + '</button>'));
				uploader.set('uploadURL', Y.Uploadable.proxies[uploaderType]);
				uploader.set('fileFieldName', Y.Uploadable.postKeys[uploaderType]);			
				uploader.set('fileFilters', [{description:'Images', extensions:'*.jpg;*jpeg;*.png;*.gif'}]);
				uploader.render(uploaderTrigger);

				uploader.after('fileselect', function(upload) {
					var files = upload.fileList;
					if (files.length <= 0) return;
					uploader.upload(files[0]);
				});

				uploader.on('fileuploadstart', function(event) {
					uploader.set('enabled', false);
					if (uploaderTarget.getStyle('display') && uploaderTarget.getStyle('display') !== 'table-cell') {
						uploaderTarget.setStyle('display', 'table-cell');
					}
					
					var region    = uploaderTarget.get('region'),
						marginTop = (region.height - 32)/2;

					uploaderTarget.set('innerHTML', '<img alt="Uploading" src="https://940a788b2455456535af-35b1f818a197e9d975a9082ca28ba967.ssl.cf2.rackcdn.com/utilities/loader.gif" height="32px" width="32px" style="height: 32px; width: 32px; margin-top: ' + marginTop + 'px;">');
				});
				
				uploader.on('uploaderror', function(event){
					uploaderTarget.set('innerHTML', '<span class="error">Upload failed. Please try again.</span>');
					if (!uploaderTarget.hasClass('error')) {
						uploaderTarget.addClass('error');
					}
					uploader.set('enabled', true);
					uploader.set('fileList', []);					
				});
				
				uploader.on('uploadcomplete', function(event) {
					var response = Y.JSON.parse(event.data);					
					if (!response.success) {
						if (response.message) {
							uploaderTarget.set('innerHTML', '<span class="error">' + response.message + '</span>');
						} else {
							uploaderTarget.set('innerHTML', '<span class="error">Please try again.</span>');
						}
						if (!uploaderTarget.hasClass('error')) {
							uploaderTarget.addClass('error');
						}
						
						uploader.set('selectFilesButton', uploaderTarget);
						
					} else {
						if (uploaderTarget.getStyle('display') && uploaderTarget.getStyle('display') === 'table-cell') {
							uploaderTarget.setStyle('display', 'block');
						}
						if (uploaderTarget.hasClass('error')) {
							uploaderTarget.removeClass('error');
						}
						uploaderTarget.set('innerHTML', '<img alt="" src="' + response.message + '">');
						Y.Uploadable.successMethods[uploaderType](response.message);						
					}
					uploader.set('enabled', true);
					uploader.set('fileList', []);
				});
				
			} else {
				// REMOVE THE TRIGGER/TARGET ELEMENTS IN THE EVENT UPLOADING IS IMPOSSIBRU
				var uploaderTrigger = Y.one(container),
					uploaderTarget  = Y.one('*[data-uploader-target][data-target-id="' + uploaderTrigger.getAttribute('data-target') + '"]');
				uploaderTrigger.remove(true);
				uploaderTarget.remove(true);
			}
		}
	};
		
},'1.0', { requires: ['node', 'event', 'uploader', 'json-parse'] });