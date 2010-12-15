<?php

	/**
	 * @package stage
	 */
	/**
	 * The Stage class offers function to display and save 
	 * Stage settings in the section editor. 
	 */
	class Stage {

		/**
		 * Display settings in the section editor.
		 *
		 * @param number $field_id
		 *  ID of the field linked to the Stage instance
		 * @param number $position
		 *  Field position in section editor
		 * @param string $title
		 *  Title of the settings fieldset
		 * @return XMLElement
		 *  Returns the settings fieldset
		 */
		public static function displaySettings($field_id, $position, $title) {
		
			// Create settings fieldset
			$fieldset = new XMLElement('fieldset', '<legend>' . $title . '</legend>', array('class' => 'settings group compact'));
			
			// Get stage settings
			$stage = Administration::instance()->Database->fetchRow(0, 
				"SELECT * FROM tbl_fields_stage WHERE field_id = '" . $field_id . "' LIMIT 1"
			);
			
			// Handle missing stage settings
			if(empty($stage)) {
				$stage = array(
					'constructable' => 1,
					'destructable' => 1,
					'searchable' => 1,
					'droppable' => 0,
					'draggable' => 1
				);
			}
			
			// Constructable
			$setting = new XMLElement('label', '<input name="fields[' . $position . '][stage][constructable]" value="1" type="checkbox"' . ($stage['constructable'] == 0 ? '' : ' checked="checked"') . '/> ' . __('Allow creation of new items') . ' <i>' . __('This will add a <code>Create New</code> button to the interface') . '</i>');
			$fieldset->appendChild($setting);
			
			// Destructable		
			$setting = new XMLElement('label', '<input name="fields[' . $position . '][stage][destructable]" value="1" type="checkbox"' . ($stage['destructable'] == 0 ? '' : ' checked="checked"') . '/> ' . __('Allow deselection of items') . ' <i>' . __('This will add a <code>Remove</code> button to the interface') . '</i>');
			$fieldset->appendChild($setting);
			
			// Searchable
			$setting = new XMLElement('label', '<input name="fields[' . $position . '][stage][searchable]" value="1" type="checkbox"' . ($stage['searchable'] == 0 ? '' : ' checked="checked"') . '/> ' . __('Allow selection of items from a list of existing items') . ' <i>' . __('This will add a search field to the interface') . '</i>');
			$fieldset->appendChild($setting);
			
			// Droppable
			$setting = new XMLElement('label', '<input name="fields[' . $position . '][stage][droppable]" value="1" type="checkbox"' . ($stage['droppable'] == 0 ? '' : ' checked="checked"') . '/> ' . __('Allow dropping of items') . ' <i>' . __('This will enable item dropping on textareas') . '</i>');
			$fieldset->appendChild($setting);
			
			// Draggable
			$setting = new XMLElement('label', '<input name="fields[' . $position . '][stage][draggable]" value="1" type="checkbox"' . ($stage['draggable'] == 0 ? '' : ' checked="checked"') . '/> ' . __('Allow sorting of items') . ' <i>' . __('This will enable item dragging and reordering') . '</i>');
			$fieldset->appendChild($setting);
			
			// Return stage settings
			return $fieldset;
			
		}
		
		/**
		 * Save setting in the section editor.
		 *
		 * @param number $field_id
		 *  ID of the field linked to this Stage instance
		 * @param array $data
		 *  Data to be stored
		 * @param string $context
		 *  Context of the Stage instance		 
		 */
		public static function saveSettings($field_id, $data, $context) {
		
		}
		
	}
	