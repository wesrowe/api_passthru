$(document).ready( function() {
	
	// Papers -- HTML template cloner for papers
	var sg_section_counter = 0;
		
	for (var section_name in axesData ) { // 
	 	//sg_section_counter++; // sections start at 1
		// clone template and add ids
		var new_section = $('#main_paper_container .section_container.template')
			.clone()
			.removeClass( 'template' )
			.addClass( 'live' ); // so we don't attach listeners to hidden markup
		new_section.find( '.paper' ).attr('id','canvas_container'+sg_section_counter);
		new_section.find( '.expander' ).attr( 'id', 'section'+sg_section_counter+'_toggle' );
		new_section.find( '.section_title' ).html( section_name );
		/* // draggable spread adjust, broken at the moment
		new_section.find( '.spread_handle' )
			.draggable({
				grid: [ 0, 20 ], // the 60 should be calculated from axesAll[ sg_section_counter ].length
				axis: 'y'
			});
		 */
		new_section
			.appendTo('#main_paper_container')
			.show();
		sg_section_counter++; // moved here from above for all-array-logic revision
	}
	
	// LOCAL STORAGE PARSING
	// initialize local storage keys
	next_ls_key = 1;
		// BUGGY CODE -- this method would eventually break, as it leaves gaps behind, eventually user's LS keys would reach 100 (or any number) and it would stop finding newly stored cars.  BETTER: cruise LS keys looking for gaps, and find next open spot when incrementing (order not a big deal, I'm planning to sort alphabetically anyway).
	
	function loadDemoCar( demoStyleObject ) 
	{
		var newCar = {};
		newCar['styleObject'] = demoStyleObject;
		newCar['color'] = colors[next_color_index]; // see raph_settings
		next_color_index++; // increment for next time a color is called for
		//console.log( newCar );
		cars.push( newCar );
		var newcar_index = cars.length - 1;
		// call addCarData(car_object, car_counter_index) to display data
		addCarData( cars[ newcar_index ].styleObject, newcar_index );
		// Add car to UI
		addCarToUI( newcar_index, /* remembered_car_obj.trimName */ newCar.styleObject.name );
	
	}
		
	function loadLocalStorageCars() 
	{
		var storage_empty = true;
		for ( var i = 1; i < 100; i++ ){
			if ( localStorage.getItem( '' + i ) !== null ) {
				next_ls_key = i + 1; // basically remember highest occupied key + 1
				//console.log("incremented next_ls_key");
				//console.log( JSON.parse( localStorage.getItem ( '' + i ) ) );
				var remembered_car_obj = JSON.parse( localStorage.getItem ( '' + i ) );
				// CLONE and populate template div.template.remembered_car
				var new_li = $('.remembered_car.template')
					.clone()
					.removeClass( 'template' )
					.addClass( 'live' ); // so we don't attach listeners to hidden markup
				new_li.attr( 'data-styleID', remembered_car_obj.styleID );
				new_li.find( '.car_name_rem' ).html( remembered_car_obj.carName );
				new_li.find( '.trim_level_rem' ).html( remembered_car_obj.trimName );
				// ADD REMEMBERED CAR Listener
				new_li.find( '.add_remembered_car_btn' ).click( function () {
					// loading gif over UI
					$( '#remembered_cars_container .loading_mask' ).show();
					// prevent reloading same car
					$( this ).attr( 'disabled', 'disabled' );
					// the real action
					var styleID_to_get = $(this).parent().attr( 'data-styleID' );
					//console.log( styleID_to_get );
					$.getJSON( 
						'http://api.edmunds.com/v1/api/vehicle/stylerepository/findbyid?id=' +
						styleID_to_get +
						'&api_key=sbzh2xtvh99h73pzr398c2fc&fmt=json&callback=?', 
						function ( data ) {  // callback: populate trim_select
							//console.log( new_style_object );
							// Create object to hold chosen style object and color, and add to cars[]
							var newCar = {};
							newCar['styleObject'] = data.styleHolder[0];
							newCar['color'] = getNextColor(); 
							cars.push( newCar );
							// call addCarData(car_object, car_counter_index)
							var newcar_index = cars.length - 1; // what's array index of car just added
							addCarData( cars[ newcar_index ].styleObject, newcar_index );
							// Add car to UI
							addCarToUI( newcar_index, remembered_car_obj.trimName );
							// store newcar_index as data-newcar_index in new_li
							new_li.attr( 'data-newcar_index', newcar_index );
							// hide loading gif
							$( '#remembered_cars_container .loading_mask' ).hide();
						} // end getJSON callback
					);
				}); // end .click()
				// add listing plus buttons to Rememberd Cars List
				new_li
					.appendTo( '#remembered_cars_list' )
					.show();
				storage_empty = false;
			}
		}
		if ( storage_empty ) { // UI Changes for first-time visitors
			var LS_helpful_tip = 'The next time you come to this site, cars you\'ve looked at previously will be waiting for you here.'
			$( '<li>' + LS_helpful_tip + '</li>' )
				.appendTo( '#remembered_cars_list' )
				.show();
			//DEMO STUFF
			// display car picker briefly
			setTimeout( function() {
				$( '#dynamic_picker .picker_title' ).click(); 
			}, 3500); 
			setTimeout( function() {
				$( '#dynamic_picker .picker_title' ).click(); 
			}, 4500); // keep it out of the way for DEMO
			setTimeout( function() {
				$( '#demo_x_flasher' ).fadeIn(); 
			}, 5500);
			setTimeout( function() {
				$( '#demo_x_flasher' ).fadeOut(); 
			}, 6000);
			setTimeout( function() {
				$( '#demo_x_flasher' ).fadeIn(); 
			}, 6500);
			setTimeout( function() {
				$( '#demo_x_flasher' ).fadeOut(); 
			}, 7000);
			
			// show then hide the Demo annoucement
			setTimeout( function() {
				$( '#demo_announcement' ).fadeIn( 'slow' );
			}, 500);
			setTimeout( function() {
				$( '#demo_announcement' ).fadeOut( 'slow' ); 
			}, 3000); 
			
			// Expand a section for DEMO
			setTimeout( function() {
				$( '#section0_toggle' ).click(); 
			}, 1000); 
			// show hints to new users
			setTimeout( function() { $( '#hints_btn' ).click(); }, 7000 ); 
			// CALL loadDemoCar for DEMO
				loadDemoCar( odyssey_styles.styleHolder[0] );
				
				loadDemoCar( sienna_styles.styleHolder[0] );
				
				loadDemoCar( quest_styles.styleHolder[0] );
				
				loadDemoCar( mazda5_styles.styleHolder[0] );
				
				loadDemoCar( grandcaravan_styles.styleHolder[0] );
		
		} else { // default if they've been here before
			// display local storage cars
			setTimeout( function() {
				$( '#remembered_cars_container .picker_title' ).click();
			}, 500);
		}
	}
/* ****************************************************
   ********** THE REAL ACTION -- INITIALIZATION ****** 
   ****************************************************
*/
	// papers def
	papers = {}; // object literal will hold papers, indexed by section 
	
	axesAll = []; // object literal holds Axes, with a layer of organization for sections
	
	isExpanded = [] // array, indexed by section (starting at 0), holding true for expanded; initialized with all true in papersInit(), maintained by collapse() and expand()
	
	// initialize papers and axes
	papersInit();
	// create Axis and render them to screen
	axesInit();
	
	
	// CARS
	// add data to Axes and render
	cars = [];
	// call load local storage cars
	loadLocalStorageCars(); 
	
	
	function containerShow()
	{
		/* $( '#remembered_cars_mask' ).show(); */
		$( '#remembered_cars_container' ).animate(
			{
				'left': '0px'
			}, 300);
	}
	function containerHide()
	{
		$( '#remembered_cars_container' ).animate(
			{
				'left': '-350px'
			}, 300, function() {
				/* $( '#remembered_cars_mask' ).hide(); */
			});
	}
	$( '#remembered_cars_container .picker_title' ).toggle( 
		containerShow, 
		containerHide 
	);
		
	// picker_expander
	function pickerShow() 
	{
		/* $( '#picker_mask' ).show(); */
		$( '#dynamic_picker' ).animate(
			{
				'left': '0px'
			}, 300);
		if ( $( '#remembered_cars_container' ).css( 'left' ) == '0px' ) {
			$( '#remembered_cars_container .picker_title' ).click();
		}
	}
	function pickerHide()
	{
		$( '#dynamic_picker' ).animate(
			{
				'left': '-350px' //'' + (-1 * $( '#dynamic_picker' ).width ) + 'px'
			}, 300, function() {
				/* $( '#picker_mask' ).hide(); */
			});
	}

	$( '#dynamic_picker .picker_title' ).toggle( pickerShow, pickerHide );
	
	// click elsewhere should close picker.  I got all this code from StackOverflow, don't really understand it.
	(function($){  // this is the plugin part
		$.fn.outside = function(ename, cb){
			return this.each(function(){
				var $this = $(this),
					self = this;
				$(document).bind(ename, function tempo(e){
					if(e.target !== self && !$.contains(self, e.target)){
						cb.apply(self, [e]);
						if(!self.parentNode) $(document.body).unbind(ename, tempo);
					}
				});
			});
		};
	}(jQuery));
	// use plugin
	$('#dynamic_picker').outside('click', function() {
		$( '#dynamic_picker' ).stop(true, true);
		if ( $( '#dynamic_picker' ).css( 'left' ) == '0px' ) {
			$( '#dynamic_picker .picker_title' ).click();
		}
	});
	$('#remembered_cars_list').outside('click', function() {
		$( '#remembered_cars_list' ).stop(true, true);
		if ( $( '#remembered_cars_container' ).css( 'left' ) == '0px' ) {
			$( '#remembered_cars_container .picker_title' ).click();
		}
	});
	// Helpful hints controls
	$( '#hints_btn' ).toggle( 
		function() {
			$( '#hints' ).slideDown();
		}, function() {
			$( '#hints' ).slideUp();
	});
	
	$( '#hints .close_x' ).click( function() {
		$( '#hints_btn' ).click();
	});
	// spread adjusters ( aka "zoom" )
	$( '.bigger' ).click( function() {
		if ( slider_value < 1 ) { slider_value += .2; }
		for ( var section_index = 0; section_index < axesAll.length; section_index++ ) {
			// loop thru sections (maybe skip ones that are collapsed, i can't recall right now whether that would screw anything up... but last I considered it I think I decided that I don't have to track any y-values in collapsed states b/c the changeSpread() fn is RESTful that way, it just sends whatever's visible to the new location... Wait, but if you transform collapsed axes they'll transform, and then animation later won't work. So... YES, SKIP COLLAPSED SECTIONS
			if ( isExpanded[ section_index ] ) {
				changeSpread( section_index, slider_value, 100 ); 
			}
		}
	});
	$( '.smaller' ).click( function() {
		if (slider_value > .4 ) { slider_value -= .2; }
		for ( var section_index = 0; section_index < axesAll.length; section_index++ ) {
			if ( isExpanded[ section_index ] ) {
				changeSpread( section_index, slider_value, 100 ); 
			}
		}
	});
	// range slider version of spread adjust
	/* $( '#spread_slider' ).change( function() {
		slider_value = $( '#spread_slider' ).val();
		for ( var section_index = 0; section_index < axesAll.length; section_index++ ) {
			// loop thru sections (maybe skip ones that are collapsed, i can't recall right now whether that would screw anything up... but last I considered it I think I decided that I don't have to track any y-values in collapsed states b/c the changeSpread() fn is RESTful that way, it just sends whatever's visible to the new location... Wait, but if you transform collapsed axes they'll transform, and then animation later won't work. So... YES, SKIP COLLAPSED SECTIONS
			if ( isExpanded[ section_index ] ) {
				changeSpread( section_index, slider_value, 100 );
			}
		}
	});
	 */
	// NEW collapse-button listeners // doesn't need to be here, could live in paper-cloner at top of file.
	$( '.live .expander' ).each( function(index) {
		// .live tests excludes the hidden template!
		$( '#section'+index+'_toggle' )
			.toggle(
				function() { // expand
					isExpanded[ index ] = true;
					hideshowAllInSection( index, "show", 300 );
					changeSpread( index, slider_value, 300, false ); // section id, new spread, timing
					$(this).parent().parent().find( '.spread_adjust_container' ).fadeIn();
					$(this).parent().find( '.expand_indicator' ).html( '&ndash;' );
				},
				function() {  // collapse
					isExpanded[ index ] = false;
					hideshowAllInSection( index, "hide", 300); 
					changeSpread( index, 0, 300, true ); // section id, new spread, timing
					$(this).parent().parent().find( '.spread_adjust_container' ).hide();
					$(this).parent().find( '.expand_indicator' ).html( '+' );
				}
				
			); 
		});

	/* DYNAMIC CAR CHOOSER */
	pickerInit(); // populates make <select> pulldown; made it independent to 
	
	//  MAKE
	function pickerInit() 
	{
		// reset downstream pickers
			// remove options except first
			resetMake();
			resetModel();
			resetYear();
			resetTrim();
			
		// look up years
		/* API version would load all makes&models into make_model_obj */
		for ( var i in make_model_obj.makeHolder ) {  // counting thru array
			$('#make_select').append(
				$('<option></option>')
					.val( make_model_obj.makeHolder[i].niceName )
					.html( make_model_obj.makeHolder[i].name )
			);
		}
	}
	/* // more basic SORT function from SatckOverflow, "VerizonW"
	// arr is the array of objects, prop is the property to sort by
	var sort = function (prop, arr) {
		arr.sort(function (a, b) {
			if (a[prop] < b[prop]) {
				return -1;
			} else if (a[prop] > b[prop]) {
				return 1;
			} else {
				return 0;
			}
		});
	}; */
	// SORT function from SatckOverflow user113716 -- allows to sort objects based on a nested property (not easy!)
	var sort = function (prop, arr) 
	{
		prop = prop.split('.');
		var len = prop.length;

		arr.sort(function (a, b) {
			var i = 0;
			while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			} else {
				return 0;
			}
		});
		return arr;
	};
	//  MODEL options dropdown generator
	var make_index = null; // will hold index of chosen make in array
	var model_object_global = {}; // will hold model object in larger scope
	var chosen_make = null; // will hold niceName of make
	var chosen_model = null; // will hold niceName of model
	var chosen_year = null;
	$( '#make_select' ).change( function() {
		$( '#dynamic_picker .loading_mask' ).show(); // cover picker with loading mask
		make_index = $( '#make_select option:selected' ).val();  // holds array location of make for later
		// reset downstream pickers
			// remove options except first
			resetModel();
			resetYear();
			resetTrim();
			// set to disabled
		
		// THE NICE-NAME ISSUE means I have to make an API call here to get model niceNames.
		chosen_make = $( '#make_select option:selected' ).val(); //this is a niceName for Make
		// make API request for models
		$.getJSON( 
			'http://api.edmunds.com/v1/api/vehicle/modelrepository/findmodelsbymake?make=' + chosen_make + '&api_key=sbzh2xtvh99h73pzr398c2fc&fmt=json&callback=?', 
			function( models ) {
				 
				model_object_global = models.modelHolder; // store model object for access later (declared earlier)
				
				// SORT -- model_object_global is an array of objects
				// call sort function I got from SO (above)
				sort( 'name', model_object_global );
				
				// Populate dropdown select
				for ( var i in model_object_global ) { //array, each i corresponds to single model
					$( '#model_select' ).append(
						$('<option></option>')
							.val( i /* model_object_global[ i ].niceName */ ) // array position helps lookup when retrieving years
							.html( model_object_global[ i ].name )
					);
				}
				// enable model_select
				$( '#dynamic_picker .loading_mask' ).hide();
				$( '#model_select' ).removeAttr( 'disabled' );
			}
		);
	});
	function resetMake() { // instead of removing options, just change selected to first option "select make"
		//remove all options that may have been previously generated
		$( '#make_select option' ).each( function (i) {
			if ( i > 0 ) { $(this).remove(); }
		});
	}
	function resetModel() {
		//remove all options that may have been previously generated
		$( '#model_select option' ).each( function (i) {
			if ( i > 0 ) { $(this).remove(); }
		});
		// set picker to 'disabled'
		$( '#model_select' ).attr( 'disabled', 'disabled' );
	}
	function resetYear() {
		//remove all options that may have been previously generated
		$( '#year_select option' ).each( function (i) {
			if ( i > 0 ) { $(this).remove(); }
		});
		// set picker to 'disabled'
		$( '#year_select' ).attr( 'disabled', 'disabled' );
	}
	function resetTrim() {
		//remove all options that may have been previously generated
		$( '#trim_select option' ).each( function (i) {
			if ( i > 0 ) { $(this).remove(); }
		});
		// set picker to 'disabled'
		$( '#trim_select' ).attr( 'disabled', 'disabled' );
	}
		
	// YEAR -- CHANGE: NOW GETTING YEAR FROM GLOBAL_MODEL_OBJECT
	$( '#model_select' ).change( function() {
		// reset downstream pickers
		resetYear();
		resetTrim();
			
		// look up years
		chosen_model_index = $( '#model_select option:selected' ).val(); // index in model_object_global
		chosen_model = model_object_global[ chosen_model_index ].niceName;
		
		//console.log("checking years for "+chosen_make+" and "+chosen_model+". Make index: "+make_index);
		
		var years_for_model = []; // need to store so I can sort it
		// traverse model_object_global to build array of years
		for ( var i in model_object_global[ chosen_model_index ].modelYears ) { //array, each i corresponds to single model
			//console.log("inside years loop");
			years_for_model.push ( model_object_global[ chosen_model_index ].modelYears[ i ].year );
		}
		// sort years_for_model array
		years_for_model.sort( function(a,b) { return b-a; } ); // got from web, don't understand

		// build options for year_select
		for ( var i in years_for_model ) {
			$( '#year_select' ).append(
				$('<option></option>')
					.val( years_for_model[ i ] ) // array position helps lookup when retrieving years
					.html( years_for_model[ i ] )
			);
		}
		
		// enable year_select
		$( '#year_select' ).removeAttr( 'disabled' );
	});
	
	// TRIM (and downloading the coveted STYLE OBJECT)
	var new_style_object = {}; // will hold main style object temporarily, until it gets pushed into cars[].
	
	$( '#year_select' ).change( function() {
		// loading gif
		$( '#dynamic_picker .loading_mask' ).show();
		// store chosen year
		chosen_year = $( '#year_select option:selected' ).val(); 
		// reset downstream pickers
		resetTrim();
		// request style object from api
		$.getJSON( 
			'http://api.edmunds.com/v1/api/vehicle/stylerepository/findstylesbymakemodelyear?make=' + 
				chosen_make + 
				'&model=' + 
				chosen_model +
				'&year=' +
				chosen_year +
				'&api_key=sbzh2xtvh99h73pzr398c2fc&fmt=json&callback=?', 
			function ( styles ) {  // callback: populate trim_select
				new_style_object = styles.styleHolder;
				console.log( new_style_object );
				// SORT trims using SO function, as I did with models -- test for baseMSRP listing, and then sort by it if it exists:
				// test all style objects for msrp, not just [0].
				var msrp_safe = true;
				for ( var z in new_style_object ) {
					if ( new_style_object[z].price == null ) {
						msrp_safe = false;
					} else if ( new_style_object[z].price.baseMSRP == null ) { 
						msrp_safe = false; 
					}
				}
				if ( msrp_safe ) {
					sort( 'price.baseMSRP', new_style_object );
				} else {
					sort( 'name', new_style_object );
				}
				for ( var i in new_style_object ) {  // counting thru array
					//console.log("inside trim loop");
					var opt_txt = new_style_object[ i ].name;
					if  ( msrp_safe ) {
						opt_txt += ' - from $' + delimitNumbers( new_style_object[ i ].price.baseMSRP );
					}
					$('#trim_select').append(
					
						$('<option></option>')
							.val( i )
							.html( opt_txt )
						);
				}
				// remove 'disabled' attr for Add Car button
				$( '#dynamic_picker .loading_mask' ).hide();
				$( '#trim_select' ).removeAttr( 'disabled' );
			}
		);
	
	});
	$( '#trim_select' ).change( function () {
		if ( $(this).val() >= 0 ) { $( '#add_car_btn' ).removeAttr( 'disabled' ); }
	});
	// ADD CAR button
	$( '#add_car_btn' ).click( function() {
		var chosen_trim_index = $( '#trim_select option:selected' ).val(); // index of chosen style within styleHolder[] array.
		// Create object to hold chosen style object and color, and add to cars[]
		var newCar = {};
		newCar['styleObject'] = new_style_object[ chosen_trim_index ];
		newCar['color'] = getNextColor(); 
		cars.push( newCar );
		// call addCarData(car_object, car_counter_index)
		var newcar_index = cars.length - 1; // what's array index of car just added
		addCarData( cars[ newcar_index ].styleObject, newcar_index );
		// Add car to UI
		var trim_name = $( '#trim_select option:selected' ).html();
		addCarToUI( newcar_index, trim_name );
		//BEGIN REUSABLE CODE -- moved to addCarToUI
		/* // CLONE AND POPULATE CAR INFO BOX
		var new_section = $('#dynamic_car_display .template')
			.clone()
			.removeClass( 'template' )
			.addClass( 'live' ) // so we don't attach listeners to hidden markup, test for .live when attaching listeners
			.attr( 'data-carindex', newcar_index) // store index in cars[] for reference, removal.
			.hover( 
				function() {
					highlightCar( newcar_index );
					$(this).css( 'backgroundColor', '#666666' );
				}, function() { 
					unHighlightCar( newcar_index );
					$(this).css( 'backgroundColor', '#000000' );
				}
			);
		// add car name and trim name
		new_section.find( '.car_name' )
			.html( newCar.styleObject.makeName + ' ' + newCar.styleObject.modelName + '<br/>' + newCar.styleObject.year );
		new_section.find( '.edmunds_link' )
			.html( $( '#trim_select option:selected' ).html() ); // places same trim text user selected on dropdown, including price
		// Build and add EDMUNDS LINK --  sample url: http://www.edmunds.com/bmw/1-series-m/2011/features-specs.html?style=101351633
		var edmunds_url = 'http://www.edmunds.com/' + 
			newCar.styleObject.makeNiceName +
			'/' + newCar.styleObject.modelNiceName +
			'/' + newCar.styleObject.year +
			'/features-specs.html?style=' +
			newCar.styleObject.id;
		new_section.find( '.edmunds_link' )
			.attr( 'href', edmunds_url );
		// add click listener for REMOVE button
		new_section.find( '.delete_btn' )
			.click( function() {
				//console.log("remove car");
				var cars_index_to_del = new_section.attr( 'data-carindex' );
				removeCarData( cars_index_to_del ); // removes all Raph objects
				// return its color to colors[]
				colors.push( cars[ cars_index_to_del ].color );
				// removes <section> from DOM
				new_section.remove(); 
		});
		// DRAGGALBE SORTING
		$(function() {
			$( "#dynamic_car_display" ).sortable({
				revert: true
			});
			$( "#dynamic_car_display" ).draggable({
				connectToSortable: "#sortable",
				helper: "clone",
				revert: "invalid"
			});
			$( "ul, li" ).disableSelection();
		});
		
		// append new section to DOM
		new_section
			.css( 'borderColor', newCar.color )
			.appendTo( '#dynamic_car_display' )
			.show(); */
// END REUSABLE CODE		
		// LOCAL STORAGE - add carName and trimName to car_to_storage, and store to local storage
		var car_to_storage = {};
		car_to_storage.carName = 
			newCar.styleObject.makeName + ' ' + newCar.styleObject.modelName + ' ' + newCar.styleObject.year;
		car_to_storage.trimName = $( '#trim_select option:selected' ).html();
		car_to_storage.styleID = newCar.styleObject.id;
		localStorage.setItem( next_ls_key, JSON.stringify( car_to_storage ) );
		//console.log( JSON.parse( localStorage.getItem( next_ls_key ) ) );
		next_ls_key++; // increment for next car added
		
		// PICKER RESET -- do this at end, so can capture info from pickers first
		$( '#add_car_btn' ).attr( 'disabled', 'disabled' ); // 
		pickerInit();
		$( '#dynamic_picker .picker_title' ).click(); // closes the picker
		// expand one section for beginners
		if ( ( $( '.car_info_box.live' ).length == 1 ) && ( $( '.remembered_car.live' ).length == 0 ) ) {
			$( '#section0_toggle' ).click();
		}
	});
	function addCarToUI( newcar_index, trim_name )
	{
		/* var newCar = {};
		newCar['styleObject'] = new_style_object[ chosen_trim_index ];
		newCar['color'] = getNextColor(); 
		cars.push( newCar );
		// call addCarData(car_object, car_counter_index)
		var newcar_index = cars.length - 1; // what's array index of car just added
		addCarData( cars[ newcar_index ].styleObject, newcar_index ); 
		 */
		// CLONE AND POPULATE CAR INFO BOX
		var newCar = cars[ newcar_index ];
		var new_section = $('#dynamic_car_display .template')
			.clone()
			.removeClass( 'template' )
			.addClass( 'live' ) // so we don't attach listeners to hidden markup, test for .live when attaching listeners
			.attr( 'data-carindex', newcar_index) // store index in cars[] for reference, removal.
			.hover( 
				function() {
					highlightCar( newcar_index );
					//$(this).css( 'backgroundColor', '#666666' );//moved to CSS
				}, function() { 
					unHighlightCar( newcar_index );
					//$(this).css( 'backgroundColor', '#000000' );
				}
			);
		// add car name and trim name
		new_section.find( '.car_name' )
			.html( newCar.styleObject.makeName + ' ' + newCar.styleObject.modelName + '<br/>' + newCar.styleObject.year );
		new_section
			.find( '.edmunds_link' )
			.html( trim_name ); 
		// Build and add EDMUNDS LINK --  sample url: http://www.edmunds.com/bmw/1-series-m/2011/features-specs.html?style=101351633
		var edmunds_url = 'http://www.edmunds.com/' + 
			newCar.styleObject.makeNiceName +
			'/' + newCar.styleObject.modelNiceName +
			'/' + newCar.styleObject.year +
			'/features-specs.html?style=' +
			newCar.styleObject.id;
		new_section.find( '.edmunds_link' )
			.attr( 'href', edmunds_url );
		// add click listener for REMOVE button
		new_section.find( '.delete_btn' )
			.click( function() {
				// get style id for car being removed
				
				// loop thru remembered cars and if you find that styleid, re-enable its button.
				
				//console.log("remove car");
				var cars_index_to_del = new_section.attr( 'data-carindex' );
				removeCarData( cars_index_to_del ); // removes all Raph objects
				// return its color to colors[]
				colors.push( cars[ cars_index_to_del ].color );
				// removes <section> from DOM
				new_section.remove(); 
		});
		/* // DRAGGALBE SORTING
		$(function() {
			$( "#dynamic_car_display" ).sortable({
				revert: true
			});
			$( "#dynamic_car_display" ).draggable({
				connectToSortable: "#sortable",
				helper: "clone",
				revert: "invalid"
			});
			$( "ul, li" ).disableSelection();
		});
		 */
		// append new section to DOM
		new_section
			.css( 'borderColor', newCar.color )
			.appendTo( '#dynamic_car_display' )
			.show();
	}
	/*
	$( '.add_stored_car_btn' ).click( function() {
		// retrieve style object from API by ID#
		var edmunds_url = 'http://api.edmunds.com/v1/api/vehicle/stylerepository/findbyid?id=' +
		local_storage.car.id +
		'&api_key=sbzh2xtvh99h73pzr398c2fc&fmt=json';
		
		// request style object from api and do stuff with it
		$.getJSON( edmunds_url, function( retrieved_style_obj ) {
			// add styleHolder object to cars[]
			// call addCarData() to display data
			// create and populate Car Info Box (reuse code from add_car_btn.click() above)
			
		}
	} 
	*/
	
	function getNextColor() {
		var next_color = colors[ next_color_index ]; // see raph_settings
		next_color_index++; // increment for next time a color is called for
		if ( next_color_index == colors.length ) { next_color_index = 0; } // wrap around to start of colors list
		return next_color;
	}
	
	
	
	
/* ****** DEMO NOODLES ******* */
	
/* 	function loadDemoCar( demoStyleObject ) 
	{
		var newCar = {};
		newCar['styleObject'] = demoStyleObject;
		newCar['color'] = colors[next_color_index]; // see raph_settings
		next_color_index++; // increment for next time a color is called for
		//console.log( newCar );
		cars.push( newCar );
		var newcar_index = cars.length - 1;
		// call addCarData(car_object, car_counter_index) to display data
		addCarData( cars[ newcar_index ].styleObject, newcar_index );
		// Add car to UI
		addCarToUI( newcar_index, newCar.styleObject.name );
	
	}
	// CALL loadDemoCar
	loadDemoCar( odyssey_styles.styleHolder[0] );
	
	loadDemoCar( sienna_styles.styleHolder[0] );
	
	loadDemoCar( quest_styles.styleHolder[0] );
	
	loadDemoCar( mazda5_styles.styleHolder[0] );
	
	loadDemoCar( grandcaravan_styles.styleHolder[0] );
	 */
	
	
	/* var newCar0 = {};
	var newcar_index = 0;
	// FORESTER
	newCar0['styleObject'] = forester_styles.styleHolder[0];
	newCar0['color'] = colors[next_color_index]; // see raph_settings
	next_color_index++; // increment for next time a color is called for
	//console.log( newCar );
	cars.push( newCar0 );
	newcar_index = cars.length - 1;
	// call addCarData(car_object, car_counter_index) to display data
	addCarData( cars[ newcar_index ].styleObject, newcar_index );
	// Add car to UI
	addCarToUI( newcar_index, newCar0.styleObject.name );
	
	// ALTIMA
	var newCar1 = {};
	newCar1['styleObject'] = altima_styles.styleHolder[0];
	newCar1['color'] = colors[next_color_index]; // see raph_settings
	next_color_index++; // increment for next time a color is called for
	//console.log( newCar1 );
	cars.push( newCar1 );
	newcar_index = cars.length - 1;
	// call addCarData(car_object, car_counter_index) to display data
	addCarData( cars[newcar_index].styleObject, newcar_index ); 
	// Add car to UI
	addCarToUI( newcar_index, 'Nissan Altima 2010' );
	
	// ACCORD
	var newCar2 = {};
	newCar2['styleObject'] = accord_styles.styleHolder[0];
	newCar2['color'] = colors[next_color_index]; // see raph_settings
	next_color_index++; // increment for next time a color is called for
	//console.log( newCar );
	cars.push( newCar2 );
	newcar_index = cars.length - 1;
	// call addCarData(car_object, car_counter_index)
	addCarData( cars[newcar_index].styleObject, newcar_index ); 
	// Add car to UI
	addCarToUI( newcar_index, 'Honda Accord 2013' );
		 */
	
	
	
	
	
	
	
	
});
