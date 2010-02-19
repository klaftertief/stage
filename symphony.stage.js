/*-----------------------------------------------------------------------------
	Language strings
-----------------------------------------------------------------------------*/
 
	Symphony.Language.add({
		'Add item': false,
		'Remove item': false
	});
 
/*-----------------------------------------------------------------------------
	Stage plugin
-----------------------------------------------------------------------------*/
	
	jQuery.fn.symphonyStage = function(custom_settings) {
		var objects = this;
		var settings = {
			instances:			'> li:not(.template)',	// What children do we use as instances?
			templates:			'> li.template',		// What children do we use as templates?
			headers:			'> :first-child',		// What part of an instance is the header?
			orderable:			true,					// Can instances be ordered?
			collapsible:		true,					// Can instances be collapsed?
			constructable:		true,					// Allow construction of new instances?
			destructable:		true,					// Allow destruction of instances?
			minimum:			0,						// Do not allow instances to be removed below this limit.
			maximum:			1000,					// Do not allow instances to be added above this limit.
			speed:				'fast',					// Control the speed of any animations
			delay_initialize:	false
		};
			
		jQuery.extend(settings, custom_settings);
		
	/*-------------------------------------------------------------------------
		Collapsible
	-------------------------------------------------------------------------*/
		
		if (settings.collapsible) objects = objects.symphonyCollapsible({
			items:			'.instance',
			handles:		'.handle'
		});
		
	/*-------------------------------------------------------------------------
		Orderable
	-------------------------------------------------------------------------*/
		
		if (settings.orderable) objects = objects.symphonyOrderable({
			items:			'.instance',
			handles:		'.handle'
		});
		
	/*-------------------------------------------------------------------------
		Stage
	-------------------------------------------------------------------------*/
		
		objects = objects.map(function() {
			var object = this;
			
		/*-------------------------------------------------------------------*/
			
			if (object instanceof jQuery === false) {
				object = jQuery(object);
			}
			
			object.stage = {

			};
			
			if (settings.delay_initialize !== true) {
				//object.stage.initialize();
			}
			
			return object;
		});
		
		return objects;
	};
	