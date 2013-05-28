// Set-up parameters
var HOME_URL = 'http://www.noodlercompare.com/app.html';
/* var ie_user = false; */
// API parameters
var json_level = 'full_json'; // full_json or json
var style_id_url = 'http://api.edmunds.com/v1/api/vehicle/stylerepository/findbyid?id=';

if ( $( 'html' ).hasClass( 'ie_user' ) ) { var ie_user = true;
		} else { var ie_user = false; }
	console.log( ie_user );
		
$(document).ready( function() {
	
	// primitive FB share button
	$( '#fb_icon' ).click( function () {
		console.log("shared");
		var url = 'https://www.facebook.com/sharer/sharer.php?u=';
		url += encodeURIComponent(location.href);
		window.open(url, 'fbshare', 'width=640,height=320');
	});
	
	// is browser touch-compatible? http://stackoverflow.com/a/13470899
	function detect_touch_device () {
		return  ( !!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator) );
	}
	IS_TOUCH_DEVICE = detect_touch_device(); // global var!
	//console.log( "touch device? : " + IS_TOUCH_DEVICE );
	
	/* fixed-scroll action for key */
	var keyScrollTop = $('#lower_left_bar').offset().top;
	
	$(window).scroll( function() {
		if ( keyScrollTop >= $(window).scrollTop() ) {
			if ($('#lower_left_bar').hasClass('fixed') ) {
				$('#lower_left_bar').removeClass('fixed');
				
			}
		} else { 
			if( !$('#lower_left_bar').hasClass('fixed') ) {
				$('#lower_left_bar').addClass('fixed');
			}
		}
	}); 
	// set height of key section to height of window (overflow: auto in styles)
	$( '#lower_left_bar' ).css( 'height', function() {
		return $(window).height() - keyScrollTop;
	});
	// in case of window resize, reset 'height'...
	$(window).resize( function() {
		var newheight = $(window).height();
		$( '#lower_left_bar' ).css( 'height', newheight );
	});
	
	// end fixed-scroll
	
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
	
	// QUERY STRING parsing
	var query_params = getUrlVars();
	
	// load demo from url
	if ( query_params[ 'demo' ] !== undefined ) {
		var chosen_demo = query_params[ 'demo' ];
		var demo_js_url = "common-js/" + chosen_demo + '.js';
		console.log( "demo-load string found");
		$.getScript( demo_js_url, function() { // file located in common-js too
			console.log("demo loaded callback fired");
			loadPageSpecificDemo();
		});
	}
	
	// PHP -- load demo from PHP pass-in, var called dynamic_ids
	if ( dynamic_ids !== undefined ) {
		for ( var n = 0; n < dynamic_ids.length; n++ ) {
			var styleID_to_get = dynamic_ids[ n ];
			console.log( "inside php style loader" );
			loadCarByStyleID ( styleID_to_get, true ); // true=add to LocStor
		}
	}
	
	// EMAILED cars -- look for id1, id2, etc. query parameters
	for ( var i = 1; i <= 20; i++ ) {
		if ( query_params[ 'id' + i ] !== undefined ) {
// load up a car by id!  use loadDemoCar( demoStyleObject );
			var styleID_to_get = query_params[ 'id' + i ];
			loadCarByStyleID ( styleID_to_get, true );// true=add to LocStor
			
		}
	}
	
	// load demo from select dropdown
	$( '#load_demo_btn' ).change( function() {
		var chosen_demo = $( '#load_demo_btn option:selected' ).val();
		var demo_js_url = "common-js/" + chosen_demo + '.js';
		$.getScript( demo_js_url, function() { // file located in common-js too
			loadPageSpecificDemo();
		});
	});
	
	
	function loadLocalStorageCars() // & set storage_empty
	{
		var storage_empty = true;
		var remembered_ids = []; // DUPE-KILLER
		for ( var i = 1; i < 100; i++ ){
			if ( localStorage.getItem( '' + i ) !== null ) {
				next_ls_key = i + 1; // remember highest occupied key + 1
				var remembered_car_obj = JSON.parse( localStorage.getItem ( '' + i ) );
				var duplicate_detected = false;
				for ( var z = 0; z < remembered_ids.length; z++ ) {
					if ( remembered_ids[ z ] == remembered_car_obj.styleID ) {
						duplicate_detected = true;
					}
				}
				if ( !duplicate_detected ) {
					// CLONE and populate template div.template.remembered_car
					var new_li = $('.remembered_car.template')
						.clone()
						.removeClass( 'template' )
						.addClass( 'live' ); // so we don't attach listeners to hidden markup
					// DUPE-KILLER
					remembered_ids.push( remembered_car_obj.styleID );
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
						var trim_to_display = $(this).parent().find( '.trim_level_rem' ).html();
						//console.log( styleID_to_get );
						var style_url = style_id_url + styleID_to_get + '&fmt=' + json_level + '&api_key=sbzh2xtvh99h73pzr398c2fc' + '&callback=?';
						console.log( style_url );
						$.getJSON( style_url, function ( data ) {  // callback: populate trim_select
								//console.log( new_style_object );
								// Create object to hold chosen style object and color, and add to cars[]
								var newCar = {};
								newCar['styleObject'] = data.styleHolder[0];
								newCar['color'] = getNextColor(); 
								newCar['is_selected'] = false;
								cars.push( newCar );
								// call addCarData(car_object, car_counter_index)
								var newcar_index = cars.length - 1; // what's array index of car just added
								addCarData( cars[ newcar_index ].styleObject, newcar_index );
								// Add car to UI
								addCarToUI( newcar_index, trim_to_display );
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
				} // end !duplicate_detected
			}
		}
		// sort list alphabetically -- SO #1134976
		function sortUL(selector) 
		{
			$(selector).children("li").sort(function(a, b) {
				var upA = $(a).text().toUpperCase();
				var upB = $(b).text().toUpperCase();
				return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
			}).appendTo(selector);
		}
		sortUL("#remembered_cars_list");
		
		if ( storage_empty ) { // UI Changes for first-time visitors
			var LS_helpful_tip = 'The next time you come to this site, cars you\'ve looked at previously will be waiting for you here.'
			$( '<li>' + LS_helpful_tip + '</li>' )
				.appendTo( '#remembered_cars_list' )
				.show();
			// load demo (function defined in page-specific js
			// loadPageSpecificDemo();
			
		} else if ( IS_TOUCH_DEVICE ) {
			setTimeout( function() {
				$( '#hints_btn' ).click();
			}, 500);
		} else { // default if they've been here before
			// display local storage cars
			setTimeout( function() {
				$( '#remembered_cars_container .picker_title' ).click();
				$( '#hints_btn' ).click();
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
	
	selected_cars = []; // track which cars user has clicked on, in order
	
	// initialize papers and axes
	papersInit();
	// create Axis and render them to screen
	axesInit();
	
	// CARS
	// add data to Axes and render
	cars = [];
	// call load local storage cars
	loadLocalStorageCars(); 
	
	// convertObjectToHtml( easyload_menu_object );
	
	function containerShow()
	{
		/* $( '#remembered_cars_mask' ).show(); */
		$( '#remembered_cars_container' ).animate(
			{
				'left': '0px'
			}, 300)
			.addClass( 'shadowed' );
	}
	function containerHide()
	{
		$( '#remembered_cars_container' ).animate(
			{
				'left': '-350px'
			}, 300, function() {
				$( this ).removeClass( 'shadowed' );
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
			}, 300)
			.addClass( 'shadowed' );
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
				$( this ).removeClass( 'shadowed' );
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
			$( '#hints' ).slideUp();
		}, function() {
			$( '#hints' ).slideDown();
		}
	);
	// Discover control
	$( '#discover_btn' ).toggle( 
		function() {
			$( '#discover_area' ).slideDown();
		},function() {
			$( '#discover_area' ).slideUp();
		}
	);
	$( '#discover_area .close_x' ).click( function() {
		$( '#discover_btn' ).click();
	});
	// Hints control
	$( '#hints .close_x' ).click( function() {
		$( '#hints_btn' ).click();
	});
	$( '#want_more_devices' ).click( function() {
		$( '#working_on_it' ).show( 300 );
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
					if ( !IS_TOUCH_DEVICE ) { // tiny arrows
						$(this).parent().parent().find( '.spread_adjust_container' ).fadeIn();
					}
					$(this).parent().find( '.expand_indicator' ).html( '&ndash;' );
				},
				function() {  // collapse
					isExpanded[ index ] = false;
					hideshowAllInSection( index, "hide", 300); 
					changeSpread( index, 0, 300, true ); // section id, new spread, timing
					if ( !IS_TOUCH_DEVICE ) { $(this).parent().parent().find( '.spread_adjust_container' ).hide(); }
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
				//console.log( new_style_object );
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
					$('#trim_select')
						.append(
							$('<option></option>')
								.val( i )
								.html( opt_txt )
								.attr( 'data-id', new_style_object[ i ].id )
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
		var styleID_to_get = $( '#trim_select option:selected' ).attr( 'data-id' );
		loadCarByStyleID( styleID_to_get, true ) // DO add to local storage
		/* old way of doing things: (admittedly faster, but no engine stuff)
		var chosen_trim_index = $( '#trim_select option:selected' ).val(); // index of chosen style within styleHolder[] array.
		// Create object to hold chosen style object and color, and add to cars[]
		var newCar = {};
		newCar['styleObject'] = new_style_object[ chosen_trim_index ];
		newCar['color'] = getNextColor(); 
		newCar['is_selected'] = false;
		cars.push( newCar );
		// call addCarData(car_object, car_counter_index)
		var newcar_index = cars.length - 1; // array index of car just added
		addCarData( cars[ newcar_index ].styleObject, newcar_index );
		// Add car to UI (key at left)
		var trim_name = $( '#trim_select option:selected' ).html();
		addCarToUI( newcar_index, trim_name );
			
		// LOCAL STORAGE - add carName and trimName to car_to_storage, and store to local storage
		saveCarToLocStorage( newcar_index );
		 */
		// PICKER RESET -- do this at end, so can capture info from pickers first
		$( '#add_car_btn' ).attr( 'disabled', 'disabled' ); // 
		pickerInit();
		$( '#dynamic_picker .picker_title' ).click(); // close the picker
		// expand one section for beginners
		if ( ( $( '.car_info_box.live' ).length == 1 ) && ( $( '.remembered_car.live' ).length == 0 ) ) {
			$( '#section0_toggle' ).click();
		}
	});

}); // end doc.ready()

/* FUNCTIONS NEEDED FOR DEMO SCOPE */

function loadCarByStyleID ( styleID_to_get, remember_in_ls ) 
{
	console.log( "retrieving style id: " + styleID_to_get );
	/* 
	// sample url for engine-included data: http://www.edmunds.com/api/vehicle/style/100003100?fmt=full_json
	var style_url = // 'http://api.edmunds.com/v1/api/vehicle/stylerepository/findbyid?id=' + 
		style_id_url + styleID_to_get + '?fmt=' + json_level;
			//'&api_key=sbzh2xtvh99h73pzr398c2fc&fmt=' +  + '&callback=?'  
	*/
	var style_url = style_id_url + styleID_to_get + '&fmt=' + json_level + '&api_key=sbzh2xtvh99h73pzr398c2fc' + '&callback=?';
	console.log( style_url );
	// THIS CODE DUPLICATE OF CODE IN loadLocalStorageCar(); however, it has scope issues that can't be resolved without setting up a callback function of some sort.
	// CALLBACK IDEA: return TRUE from loadCarByStyleID. Have a setInterval() loop running back where loadCarByStyleID was called, and when this TRUE is returned it executes some "callback" code and then exits the setInterval.
	$.getJSON(
		style_url, function ( data ) {  
			console.log( data );
			// Create object to hold chosen style object and color, and add to cars[]
			var newCar = {};
			newCar['styleObject'] = data.styleHolder[0];
			newCar['color'] = getNextColor();
			newCar['is_selected'] = false;
			cars.push( newCar );
			// call addCarData(car_object, car_counter_index)
			var newcar_index = cars.length - 1; // array index of added car
			addCarData( newCar.styleObject, newcar_index );
			// Add car to UI
			addCarToUI( newcar_index, newCar.styleObject.name );
			// add car to local storage
			if ( remember_in_ls ) {
				saveCarToLocStorage( newcar_index ); // add to local storage
			}
		}
	)
}

function saveCarToLocStorage( newcar_index )
{
	var newCar = cars[ newcar_index ];
	var car_to_storage = {};
	car_to_storage.carName = 
		newCar.styleObject.makeName + ' ' + newCar.styleObject.modelName + ' ' + newCar.styleObject.year;
	car_to_storage.trimName = newCar.styleObject.name;
	car_to_storage.styleID = newCar.styleObject.id;
	localStorage.setItem( next_ls_key, JSON.stringify( car_to_storage ) );
	//console.log( JSON.parse( localStorage.getItem( next_ls_key ) ) );
	next_ls_key++; // increment for next car added
}
function getNextColor() 
{
	var next_color = colors[ next_color_index ]; // see raph_settings
	next_color_index++; // increment for next time a color is called for
	if ( next_color_index == colors.length ) { next_color_index = 0; } // wrap around to start of colors list
	return next_color;
}
function updateSelectedCars( cars_index, action ) { // moves current car to front of array, so that highlighted cars can maintain their order.
	// loop thru array, find cars_index if it's there, .pop() it.
	var new_array = []
	for ( var i in selected_cars ){
		if ( selected_cars[ i ] !== cars_index ) 
			new_array.push( selected_cars[ i ] );
	}
	selected_cars = new_array; 
	if ( action !== 'remove' ) {
		selected_cars.push( cars_index );
		console.log('inside add action');
	} 
	console.log( selected_cars );
}
function addCarToUI( newcar_index, trim_name )
{
	// CLONE AND POPULATE CAR INFO BOX
	var newCar = cars[ newcar_index ];
	var new_section = $('#dynamic_car_display .template')
		.clone()
		.removeClass( 'template' )
		.addClass( 'live' ) // so we don't attach listeners to hidden markup, test for .live when attaching listeners
		.attr( 'data-carindex', newcar_index) // store index in cars[] for reference, removal.
		.on(/* 'touchstart */ 'click', function(event){
			//event.stopPropagation(); 
			//if (event.handled !== true) {
			if ( !cars[ newcar_index ].is_selected ) { // it's not already selected
				cars[ newcar_index ].is_selected = true;
				updateSelectedCars( newcar_index, 'add' );
				highlightCar( newcar_index );
				$( this ).find( '.tile_button_row' ).slideDown();
			} else {  // already selected, so unhighlight and unselect
				cars[ newcar_index ].is_selected = false;
				updateSelectedCars( newcar_index, 'remove' );
				unHighlightCar( newcar_index );
				$( this ).find( '.tile_button_row' ).slideUp();
			}
			
			//event.handled = true; // stops the second event from firing
			//} else {
			//	return false;
			//}
		}); // end chained methods
	if ( !IS_TOUCH_DEVICE ) { // hover behavior for UI key
		new_section.hover( 
			function() {
				// don't highlight if it's already selected/highlighted
				if ( !cars[ newcar_index ].is_selected ) highlightCar( newcar_index );
				
			}, function() { 
				// don't highlight if it's already selected/highlighted
				if ( !cars[ newcar_index ].is_selected ) unHighlightCar( newcar_index );
				
			}
		)
	}
	// related to addtoUI: 
	new_section.find( '.edmunds_link' ).click( function(event) { 
		console.log('event prop/stop');
		event.stopPropagation(); 
	});	
	// add car name and trim name
	new_section.find( '.car_name' )
		.html( /* newCar.styleObject.makeName + ' ' + */ newCar.styleObject.modelName + " '" + newCar.styleObject.year.toString().slice(-2) );
	new_section
		.find( '.trim_text' ) // note: despite class name, no longer a link (see below, no href)
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
	// hide buttons
	new_section.find( '.tile_button_row' ).hide();
	// emailer
	updateMailtoURL();
}

			
/* DEMOS */
function loadDemoCar( demoStyleObject ) 
{
	var newCar = {};
	newCar['styleObject'] = demoStyleObject;
	newCar['color'] = colors[next_color_index]; // see raph_settings
	next_color_index++; // increment for next time a color is called for
	newCar['is_selected'] = false;
	cars.push( newCar );
	var newcar_index = cars.length - 1;
	// call addCarData(car_object, car_counter_index) to display data
	addCarData( cars[ newcar_index ].styleObject, newcar_index );
	// Add car to UI
	addCarToUI( newcar_index, newCar.styleObject.name );

}
function loadPageSpecificDemo()
{
	for ( var i = 0; i < demo_array.length; i++ ) {
		loadDemoCar( demo_array[ i ].styleHolder[0] ); // demo_array[] defined in page-specific js
	}
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
	/* ACTUALLY, PUT THE HIDE HINTS CODE FOR NON-FIRST-TIMERS*/
	// setTimeout( function() { $( '#hints_btn' ).hide(); }, 7000 ); 
}
// QUERY STRINGS-- 
// Read a page's GET URL variables and return them as an associative array. (from SO 4656843)
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('+'); 
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
// Emailing noodles
function updateMailtoURL()
{ // called when car added to UI (key tile)
	var mailto_url = HOME_URL; // .html vs .php, top of this file
	var email_array = [];
	if ( cars !== undefined ) {
		for ( var i = 0; i < cars.length; i++ ) {
			email_array.push( cars[ i ].styleObject.id );
			//console.log( email_array[i] )
		}
	}
	for (var j = 0; j < email_array.length; j++ ) {
		if ( j == 0 ) { 
			mailto_url += "?"; 
		} else { mailto_url += "+"; }
		mailto_url += "id" + ( j + 1 ) + "=" + email_array[ j ];
	}
	var body_str = 'mailto:?body=Check out this car comparison I did on Noodler Compare. Add a car or two you like and send it back to me!%0A%0AThe cars I picked will load automatically:%0A'+ mailto_url + '%0A%0Ac/o www.noodlercompare.com';
	body_str.replace( ' ', '%20' );
	$( '#emailer' ).attr( 'href', body_str );
}


// CONFIRM user wants to close comparison
$(window).bind('beforeunload', function(){
  return 'Are you done with your comparison?  If you do leave, the cars you added will be waiting for easy reload under "My Cars" (on the left console).';
});
// generate EasyLoad dropdowns from easyload_menu_object.js
function convertObjectToHtml( menus_object )
{
	var current_group = ""; // initialize for first group
	// build <select> elements
	for ( var i = 0; i < menus_object.length; i++ ) {
		// if current object IS NOT same vehicle_type as previous one, create a <select> element
		if ( menus_object[i].vehicle_type != current_group ) {
			$( '#discover_area' ).append(
				$( '<select class="easy_loader" id=' + menus_object[i].vehicle_type + '>' + menus_object[i].vehicle_type + '</select>' )
			);
		}
		// update current_group
		current_group = menus_object[i].vehicle_type;
	}
	// build <option> lists
	current_group = ""; // re-initialize for this time through
	
	for ( var i = 0; i < menus_object.length; i++ ) {
	
		if ( menus_object[i].vehicle_type != current_group ) {
			$( '#discover_area #' + menus_object[i].vehicle_type ).append(
				$( '<option value>' + menus_object[i].vehicle_type + '</option>' )
			);
		
		} else {
			$( '#discover_area #' + menus_object[i].vehicle_type ).append(
				$( '<option value=' + menus_object[i].style_id + '>' + menus_object[i].make + ' ' + menus_object[i].model + '</option>' )
			);
		}
		// update current_group
		current_group = menus_object[i].vehicle_type;
		
	}
	//$( '#discover_area' ).slideDown('slow');
}
// handler for selecting an EasyLoad style
function setEasyloadHandlers() 
{
	$( '#discover_area select.easy_loader' ).change( function() {
		var styleID_to_get = $( this ).find( 'option:selected' ).val();
		$( this ).attr( 'disabled', 'disabled' );
		var original_color = $( this ).css( 'color' ); // preserve for below
		var that = $( this );
		$( this ).css( 'color', '#777'); // gray out for "disabled" look
		loadCarByStyleID ( styleID_to_get, true )
		
		// remove disabled attr
		setTimeout( function() { // cheesy delay to get UX point across without hard coding. :)
			$( '#discover_area select' )
				.removeAttr( 'disabled' )
				.css( 'color', original_color );
			
			that.val(''); // reset dropdown
		}, 2000 );
		
	});
}

/* **** LAST-TO-LOAD SCRIPTS ****
 * load scripts here that are low-importance, or not needed right away.
*/
$(window).bind("load", function() {
	// generate EasyLoad dropdowns in Discover section 
	$.getScript( 'chooser_objects/easyload_menu_object.js', function() {
		convertObjectToHtml( easyload_menu_object );
		setEasyloadHandlers();
	});
	$.getScript( 'common-js/fastclick.js', function() {
		// FastClick implementation -- holy shit, it's 22k unminified 
		$(function() {
			FastClick.attach(document.body);
		});
	});
	// $.getScript( 'http://s7.addthis.com/js/300/addthis_widget.js#pubid=xa-519a904f584c0b14#async=1' ); // NOTE: addthis uses cookies to track my users, and it will slow the site.
});



