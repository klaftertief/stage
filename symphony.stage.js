/**
 * STAGE for Symphony
 *
 * @author: Nils Hörrmann, post@nilshoerrmann.de
 * @date: January 2010
 */


	jQuery.fn.symphonyStage = function() {

		var objects = this;
		var settings = {
			dublicatable = true,
			draggable = true,
			sortable = true
			queue = false,
			search = false
		};
 
		jQuery.extend(settings, custom_settings);

		return objects.each(function() {
		
		});

	};
