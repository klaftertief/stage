
(function($) {

	// Language strings
	Symphony.Language.add({
		'Browse': false,
		'Create New': false,
		'Remove Item': false,
		'There are currently no items available. Perhaps you want create one first?': false,
		'Click here to create a new item.': false,
		'Load items': false,
		'No items found.': false
	});

	/**
	 * Stage is a JavaScript utility for Symphony 
	 * which adds a multiselect interface to the backend.
	 *
	 * @author: Nils Hörrmann, post@nilshoerrmann.de
	 * @source: http://github.com/nilshoerrmann/stage
	 */
	$.fn.symphonyStage = function(custom_settings) {
		var objects = this;
		
		// Get settings
		var settings = {
			items:				'li:not(.template):not(.empty)',	// Currently selected items
			selection:			'ul.selection',
			source:				false,								// A stage source, e. g. a select box 
			queue: {
				constructor:		'<div class="queue" />',		// Queue markup
				handle: 			'div.queue input',				// Handle for queue
				ajax:				false,							// AJAX options for queue
				speed:				'normal'						// Speed for queue animations
			},
			dragclick:			$.noop(),						// Click function for draggable items
			speed:				'fast',								// Control the speed of any animations
			delay_initialize:	false								// Delay initialization
		};
		$.extend(settings, custom_settings);
		
	/*-----------------------------------------------------------------------*/
	
		objects = objects.map(function() {
			var object = this;
			
			// Construct a new item
			var construct = function(item) {
			
				object.trigger('constructstart', [item]);
				object.stage.selection.addClass('constructing');

				// Current value
				var value = item.attr('value');
				
				// Remove empty selection message
				object.stage.empty.slideUp('fast');
				
				// Elements
				var queued = object.stage.queue.find('li[value=' + value + ']');
				var selected = queued.clone().hide();
				
				// Add selections
				queued.addClass('selected');
				object.stage.addDestructor(selected);
				selected.insertBefore(object.stage.empty).slideDown(settings.speed, function() {
					object.stage.selection.removeClass('constructing');
				});

				object.trigger('constructstop', [item]);
				
			};
			
			// Destruct an item
			var destruct = function(item) {
				
				object.trigger('destructstart', [item]);
				object.stage.selection.addClass('destructing');

				// Current value
				var value = item.attr('value');

				// Remove selections
				object.stage.selection.find('li[value=' + value + ']').slideUp(settings.speed, function() {
					$(this).remove();
				});
				object.stage.queue.find('li[value=' + value + ']').removeClass('selected');
				
				// Check stage size
				var selected = object.stage.selection.find(settings.items);
				
					console.log(selected.size(), object.stage.selection.attr('class'));
				
				if((selected.size() == 0 && object.stage.selection.not('.constructing'))) {
					object.stage.empty.slideDown(settings.speed);
				}

				object.trigger('destructstop', [item]);

			};
			
			// Make selection clickable
			var select = function(item) {
			
				var item = $(item);
				
				// Deselect
				if(item.hasClass('selected')) {
				
					// Destruct item
					if(object.is('.destructable')) {
						destruct(item);
					}
					
				}
				
				// Select
				else {		
					if(object.is('.constructable')) {
						
						// Construct item
						construct(item);											
					
						// Single selects
						if(object.not('.multiple')) {
							var old = object.find(settings.items).filter('[value!=' + item.attr('value') + ']');
							destruct(old);
						}
						
					}
				}
				
			}
			
		/*-------------------------------------------------------------------*/
			
			if(object instanceof $ === false) {
				object = $(object);
			}
			
			object.stage = {

				// Get stage elements
				selection: object.find(settings.selection),
				empty: object.find('li.empty'),
				queue: $(settings.queue.constructor),

				// Initialize Stage
				initialize: function() {
				
					// Get items
					var items = object.find(settings.items);
					
					// Stage size
					if(items.size() > 0) {
						object.stage.empty.hide();
					}
					
					// Add queue
					if(object.is('.searchable') || object.is('.constructable')) {
						if(object.is('.searchable')) {
							$('<input type="search" placeholder="' + Symphony.Language.get('Browse') + ' &#8230;" class="browser" value="" />').appendTo(object.stage.queue);
						}
						if(object.is('.constructable')) {
							$('<button class="create">' + Symphony.Language.get('Create New') + '</button>').appendTo(object.stage.queue);
						}
						object.stage.selection.after(object.stage.queue);
					}
					
					// Prevent clicks on layout anchors
					object.find('a.file, a.image').live('click', function(event) {
						event.preventDefault();
					});
					
					// Add destructors
					object.stage.addDestructor(items);

					// Open queue on click
					object.find(settings.queue.handle).bind('click', function(event) {
						event.preventDefault();
						event.stopPropagation();
						object.stage.showQueue();
					});
					
					// Search
					if(object.is('.searchable')) {
						object.stage.queue.find('.browser').bind('click keyup', object.stage.search);
					}
					
					// Events
					object.bind('construct', function(event, item) {
						construct(item);
					});
					object.bind('destruct', function(event, item) {
						destruct(item);
					});
					object.bind('sync', function(event, item) {
						sync(item);
					});
					
					object.find('div.queue li:not(.message)').live('click', function(event) {
						event.preventDefault();
						event.stopPropagation();
						select(event.currentTarget);
					});
					
				},
				
				addDestructor: function(items) {
					if(object.is('.destructable')) {
						$('<a class="destructor">' + Symphony.Language.get('Remove Item') + '</a>').appendTo(items).click(function(event) {
							var item = $(event.target).parent('li');
							destruct(item);
						});
					}
				},
				
				showQueue: function(event) {
					
					// Append queue if it's not present yet
					if(object.stage.queue.find('ul li').size() == 0) {
						
						// Append queue
						object.stage.queue.find('ul').remove();
						var list = $('<ul class="queue" />').css('min-height', 50).appendTo(object.stage.queue).slideDown('fast');
						
						// Get queue content
						if(settings.queue.ajax) {
							$.ajax($.extend({
								async: false,
								type: 'GET',
								dataType: 'html',
								success: function(result) {

									list.find('li.loading').remove();
									
									if(result != '') {	
										list.append($(result));
										
										// Highlight items, add events
										list.find('li').each(function(index, element) {
											element = $(element);
																				
											// Odd
											if(index % 2 != 0) element.addClass('odd')
											
											// Selected
											var value = $(element).attr('value');
											if(object.find('ul:first li[value=' + value + ']').size() > 0) element.addClass('selected');
											
											// Prevent clicks on layout anchors
//											element.find('a.file, a.image').click(function(event) {
//												event.preventDefault();
//											});
											
										});
										
										// Slide queue
										list.slideDown(settings.queue.speed);
									}
								}
							}, settings.queue.ajax));
						} 
						
						// Empty queue information
						if(object.stage.queue.find('li').size() == 0) {
							list.append($('<li class="message"><span>' + Symphony.Language.get('There are currently no items available. Perhaps you want create one first?') + ' <a class="create">' + Symphony.Language.get('Click here to create a new item.') + '</a></span></li>')).slideDown(settings.queue.speed);
						}
						
						// Reset minimum height
						list.css('min-height', 0);
						
					}

					// Slide queue
					else {
						object.stage.queue.find('ul').slideDown(settings.queue.speed);
					}					

					// Automatically hide queue later
					$('body').bind('click', function(event) {
						object.stage.hideQueue();
						$('body').unbind('click');
					});
				},
				
				hideQueue: function() {
					if(object.stage.queue.find('ul').size() > 0) {
						object.stage.queue.find('ul').slideUp(settings.queue.speed);
						object.stage.queue.find('.browser').val('');
					}
				},
				
				search: function(event) {

					var search = $.trim($(event.target).val()).toLowerCase().split(' ');

					// Build search index
					if(!this.search_index) {
						this.search_index = object.stage.queue.find('li').map(function() {
							return this.textContent.toLowerCase();
						});
					}
					
					// Searching
					var items = object.stage.queue.find('li');
					if(search.length > 0 && search[0] != '') {					
						this.search_index.each(function(index, content) {
						
							var found = true;
							var item = items.filter(':nth(' + index + ')');

							// Items have to match all search strings
							$.each(search, function(index, string) {
								if(content.search(string) == -1) found = false;
							});
						
							// Show matching items
							if(found) {
								item.addClass('found').slideDown(settings.speed);
								item.parent().find('li.none').slideUp(settings.speed, function(event) {
									$(this).remove();
								});
							}
	
							// Hide other items
							else {
								item.slideUp(settings.speed);
							}
							
						});

						// Found items
						var found = items.removeClass('odd').filter('.found');
						
						// None found
						if(found.size() == 0 && items.parent().find('li.none').size() == 0) {
							var none = $('<li class="none"><span>' + Symphony.Language.get('No items found.') + '</span></li>');
							items.parent().append(none).slideDown(settings.speed);
						}
												
						// Reset zebra style
						found.each(function(index, item) {
							item = $(item).removeClass('found');
							if(index % 2 != 0) item.addClass('odd');
						});

					}
					
					// Not searching 
					else {
						items.removeClass('odd').filter(':odd').addClass('odd');
						items.slideDown(settings.speed);
						items.parent().find('li.none').slideUp(settings.speed, function(event) {
							$(this).remove();
						});
					}
					
				}
				
			};
			
			if(settings.delay_initialize !== true) {
				object.stage.initialize();
			}
			
			return object;
		});
		
		return objects;
	};

	// Initialize Stage	
	$(document).ready(function() {
		$('.stage').symphonyStage();
	});
	
})(jQuery.noConflict());
