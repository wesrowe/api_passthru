/* Raphael style sheet, basically */

// vars that control Axis display
	axis_length_const = 300; // constant for now
	axes_margin_left = 200; // always constant, the main left margin
	axis_margin_left = 0; // in future, offset to dynamically place curves
	axes_margin_right = 150;
	//axis_margin_topbottom = 20; // always constant OLD
	axis_margin_top = 60; // leave room for aggregate axis
	axis_margin_bottom = 20; // no room needed
	agg_axis_margin_top = 30;
	axis_spread = 75; // constant for now
	dot_radius = 6;
	if ( ie_user ) { dot_radius = 7; }
	big_dot_radius = 9; // agg axes
	
	spread_max = 80 // all axis spreads set in proportion to this. Picked 80 so picker can keep us out of fractional pixels


// spread-slider adjustment
	slider_value = .7; // initialize in highest scope, MATCH TO MARKUP (which sets initial value).
// other js-based styles
var keytile_highlight = '#222';	

var colors = [ '#1F78B4', '#FF7F00', '#E31A1C', '#33A02C', '#A6CEE3', '#B2DF8A', '#CA88D6', '#FDBF6F', 'blue', '#33ffff', '#ff44ff', '#FB9A99', 'orange', 'green', '#1F78B4', '#FF7F00', '#E31A1C', '#33A02C', '#A6CEE3', '#B2DF8A', '#CA88D6', '#FDBF6F', 'blue', '#33ffff', '#ff44ff', '#FB9A99', 'orange', 'green', 
]
		
var next_color_index = 0; // initialize, and increment every time color is requested

/* INITIAL SETTINGS */
var paper_collapsed_height = 40;

var connector_path_settings = 
	{
	"stroke-width": 7,
	"opacity": .5 
	//"stroke": "#fff" // debug setting
	}
	if ( ie_user ) { connector_path_settings['stroke-width'] = 5; }
var connector_path_opacity = .5; // match to opacity in object immed. above

var axis_path_settings = 
	{
		"stroke-width": 2,
		"stroke": "#444"
	}
var label_text_settings = 
	{
		"fill": "#bbb",
		"font-size": 14,
		'text-anchor': 'end'
	}
	var agg_axis_label_text_settings = // these are in addition to usual text settings above
	{
		"font-size": 20,
		'fill': '#fff'
	}
var min_text_settings = 
	{
		"fill": "#bbb",
		"font-size": 12,
		'text-anchor': 'end'
	}
var max_text_settings = 
	{
		"fill": "#bbb",
		"font-size": 12,
		'text-anchor': 'start'
	}
var units_text_settings = 
	{
		"fill": "#999",
		"font-size": 10,
		'text-anchor': 'start'
	}
var dot_common_settings = 
	{
		'opacity': 1,
		'stroke': '#000',
		'stroke-width': 1
	}
var dot_common_opacity_setting = 1; //

/* INTERACTION SETTINGS */
var dot_highlight_attrs = 
	{
		'stroke': '#fff',
		'stroke-width': 3
	}
var connector_highlight_settings = 
	{
		"opacity": 1
	}


 /* ******  axesData OBJECT: RECIPE FOR BUILDING AXES ****************
	   ****************************************************/
	var axesData = 
	{
		"Roominess": {  // if I name them w/o "_axes" I can use these keys to name other things
			"1ST_ROW_HEAD_ROOM": {
				"label": "Headroom (front)",
				"minvalue": "36",
				"maxvalue": "43",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "INTERIOR_DIMENSIONS",
					"attributes": "1ST_ROW_HEAD_ROOM"
				},
				"parent": "Roominess"
			},
			"1ST_ROW_LEG_ROOM": {
				"label": "Legroom (front)",
				"minvalue": "39",
				"maxvalue": "46",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "INTERIOR_DIMENSIONS",
					"attributes": "1ST_ROW_LEG_ROOM"
				},
				"parent": "Roominess"
			},
			"1ST_ROW_SHOULDER_ROOM": {
				"label": "Shoulder Room (front)",
				"minvalue": "45",
				"maxvalue": "70",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "INTERIOR_DIMENSIONS",
					"attributes": "1ST_ROW_SHOULDER_ROOM"
				},
				"parent": "Roominess"
			},
			"2ND_ROW_HEAD_ROOM": {
				"label": "Headroom (rear)",
				"minvalue": "35",
				"maxvalue": "42",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "INTERIOR_DIMENSIONS",
					"attributes": "2ND_ROW_HEAD_ROOM"
				},
				"parent": "Roominess"
			},
			"2ND_ROW_LEG_ROOM": {
				"label": "Legroom (rear)",
				"minvalue": "20",
				"maxvalue": "45",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "INTERIOR_DIMENSIONS",
					"attributes": "2ND_ROW_LEG_ROOM"
				},
				"parent": "Roominess"
			},
			"1ST_ROW_SHOULDER_ROOM": {
				"label": "Shoulder room (front)",
				"minvalue": "45",
				"maxvalue": "70",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "INTERIOR_DIMENSIONS",
					"attributes": "1ST_ROW_SHOULDER_ROOM"
				},
				"parent": "Roominess"
			},
			"2ND_ROW_SHOULDER_ROOM": {
				"label": "Shoulder Room (rear)",
				"minvalue": "45",
				"maxvalue": "75",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "INTERIOR_DIMENSIONS",
					"attributes": "2ND_ROW_SHOULDER_ROOM"
				},
				"parent": "Roominess"
			}
		},
		"Cargo": {
			"CARGO_CAPACITY,_ALL_SEATS_IN_PLACE": {
				"label": "Cargo Space",
				"minvalue": "0",
				"maxvalue": "160",
				"units": "cu.ft.",
				"dataKeys": {
					"attributeGroup": "CARGO_DIMENSIONS",
					"attributes": "CARGO_CAPACITY,_ALL_SEATS_IN_PLACE"
				},
				"parent": "Cargo"
			},
			"MAX_CARGO_CAPACITY": {
				"label": "Cargo Space MAX",
				"minvalue": "0",
				"maxvalue": "160",
				"units": "cu.ft.",
				"dataKeys": {
					"attributeGroup": "CARGO_DIMENSIONS",
					"attributes": "MAX_CARGO_CAPACITY"
				},
				"parent": "Cargo"
			},
			"TOWING_CAPACITY": {
				"label": "Towing Capacity",
				"minvalue": "500",
				"maxvalue": "16000",
				"units": "lbs",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "TOWING_CAPACITY"
				},
				"parent": "Cargo"
			},
			"PAYLOAD": {
				"label": "Payload",
				"minvalue": "0",
				"maxvalue": "3500",
				"units": "lbs",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "PAYLOAD"
				},
				"parent": "Cargo"
			}
		} ,
		"Safety": {
			"NHTSA_FRONTAL_DRIVER_RATING": {
				"label": "NHTSA Frontal driver",
				"minvalue": "1",
				"maxvalue": "5",
				"units": "stars",
				"dataKeys": {
					"attributeGroup": "CRASH_TEST_RATINGS",
					"attributes": "NHTSA_FRONTAL_DRIVER_RATING"
				},
				"parent": "Safety"
			},
			"NHTSA_FRONTAL_PASSENGER_RATING": {
				"label": "NHTSA Frontal passenger",
				"minvalue": "1",
				"maxvalue": "5",
				"units": "stars",
				"dataKeys": {
					"attributeGroup": "CRASH_TEST_RATINGS",
					"attributes": "NHTSA_FRONTAL_PASSENGER_RATING"
				},
				"parent": "Safety"
			},
			"NHTSA_SIDE_DRIVER_RATING": {
				"label": "NHTSA Side driver",
				"minvalue": "1",
				"maxvalue": "5",
				"units": "stars",
				"dataKeys": {
					"attributeGroup": "CRASH_TEST_RATINGS",
					"attributes": "NHTSA_SIDE_DRIVER_RATING"
				},
				"parent": "Safety"
			},
			"NHTSA_ROLLOVER_RATING": {
				"label": "NHTSA Rollover",
				"minvalue": "1",
				"maxvalue": "5",
				"units": "stars",
				"dataKeys": {
					"attributeGroup": "CRASH_TEST_RATINGS",
					"attributes": "NHTSA_ROLLOVER_RATING"
				},
				"parent": "Safety"
			},
			"IIHS_FRONTAL_OFFSET_TEST_RESULTS": {
				"label": "IIHS Frontal offset",
				"minvalue": "poor",
				"maxvalue": "good",
				"units": "",
				"dataKeys": {
					"attributeGroup": "CRASH_TEST_RATINGS",
					"attributes": "IIHS_FRONTAL_OFFSET_TEST_RESULTS"
				},
				"parent": "Safety"
			},
			"IIHS_ROOF_STRENGTH_TEST_RESULTS": {
				"label": "IIHS Roof strength",
				"minvalue": "poor",
				"maxvalue": "good",
				"units": "",
				"dataKeys": {
					"attributeGroup": "CRASH_TEST_RATINGS",
					"attributes": "IIHS_ROOF_STRENGTH_TEST_RESULTS"
				},
				"parent": "Safety"
			},
			"IIHS_REAR_CRASH_PROTECTION/HEAD_RESTRAINT_RATINGS": {
				"label": "IIHS Rear/head restraint",
				"minvalue": "poor",
				"maxvalue": "good",
				"units": "",
				"dataKeys": {
					"attributeGroup": "CRASH_TEST_RATINGS",
					"attributes": "IIHS_REAR_CRASH_PROTECTION/HEAD_RESTRAINT_RATINGS"
				},
				"parent": "Safety"
			},
			"IIHS_SIDE_IMPACT_TEST_RESULTS": {
				"label": "IIHS Side impact",
				"minvalue": "poor",
				"maxvalue": "good",
				"units": "",
				"dataKeys": {
					"attributeGroup": "CRASH_TEST_RATINGS",
					"attributes": "IIHS_SIDE_IMPACT_TEST_RESULTS"
				},
				"parent": "Safety"
			}
		},
		"Exterior Size": {
			"OVERALL_WIDTH_WITHOUT_MIRRORS": {
				"label": "Body width",
				"minvalue": "58",
				"maxvalue": "90",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "EXTERIOR_DIMENSIONS",
					"attributes": "OVERALL_WIDTH_WITHOUT_MIRRORS"
				},
				"parent": "Exterior Size"
			},
			"OVERALL_LENGTH": {
				"label": "Length",
				"minvalue": "100",
				"maxvalue": "280",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "EXTERIOR_DIMENSIONS",
					"attributes": "OVERALL_LENGTH"
				},
				"parent": "Exterior Size"
			},
			"WHEELBASE": {
				"label": "Wheelbase",
				"minvalue": "70",
				"maxvalue": "180",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "EXTERIOR_DIMENSIONS",
					"attributes": "WHEELBASE"
				},
				"parent": "Exterior Size"
			},
			"OVERALL_HEIGHT": {
				"label": "Height",
				"minvalue": "48",
				"maxvalue": "84",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "EXTERIOR_DIMENSIONS",
					"attributes": "OVERALL_HEIGHT"
				},
				"parent": "Exterior Size"
			},
			"TURNING_DIAMETER": {
				"label": "Turn Diameter",
				"minvalue": "15",
				"maxvalue": "70",
				"units": "feet",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "TURNING_DIAMETER"
				},
				"parent": "Exterior Size"
			},
			"MINIMUM_GROUND_CLEARANCE": {
				"label": "Ground Clearance",
				"minvalue": "3",
				"maxvalue": "10",
				"units": "inches",
				"dataKeys": {
					"attributeGroup": "EXTERIOR_DIMENSIONS",
					"attributes": "MINIMUM_GROUND_CLEARANCE"
				},
				"parent": "Exterior Size"
			}
			
		}, // next section
		"MPG": {
			/* "CURB_WEIGHT": {
				"label": "Curb Weight",
				"minvalue": "7000",
				"maxvalue": "800",
				"units": "lbs",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "CURB_WEIGHT"
				},
				"parent": "Eco"
			}, */"EPA_CITY_MPG": {
				"label": "MPG City",
				"minvalue": "5",
				"maxvalue": "50",
				"units": "mpg",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "EPA_CITY_MPG"
				},
				"parent": "Eco"
			},"EPA_HIGHWAY_MPG": {
				"label": "MPG Highway",
				"minvalue": "5",
				"maxvalue": "50",
				"units": "mpg",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "EPA_HIGHWAY_MPG"
				},
				"parent": "Eco"
			},"EPA_COMBINED_MPG": {
				"label": "MPG Combined",
				"minvalue": "5",
				"maxvalue": "50",
				"units": "mpg",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "EPA_COMBINED_MPG"
				},
				"parent": "Eco"
			}/* ,"AERODYNAMIC_DRAG_(CD)": {
				"label": "Aerodynamic Drag",
				"minvalue": "1",
				"maxvalue": "0",
				"units": "(drag coefficient)",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "AERODYNAMIC_DRAG_(CD)"
				},
				"parent": "Eco"
			} */ // redundant to mpg, and often not included in dataset
		}, // next section
		"Price": {
			"MSRP": {
				"label": "MSRP New",
				"minvalue": "0",
				"maxvalue": "80000",
				"units": "dollars",
				"dataKeys": {
					"attributeGroup": "PRICING",
					"attributes": "MSRP"
				},
				"parent": "Price"
			},
			"USED_TMV_RETAIL": {
				"label": "Used Retail (Edmunds)",
				"minvalue": "0",
				"maxvalue": "80000",
				"units": "dollars",
				"dataKeys": {
					"attributeGroup": "PRICING",
					"attributes": "USED_TMV_RETAIL"
				},
				"parent": "Price"
			}
		},
		"Performance": {
			"CURB_WEIGHT": {
				"label": "Curb Weight",
				"minvalue": "7000",
				"maxvalue": "800",
				"units": "lbs",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "CURB_WEIGHT"
				},
				"parent": "Performance"
			},
			"TORQUE": {
				"label": "Torque",
				"minvalue": "0",
				"maxvalue": "450",
				"units": "ft-lb",
				"irreg": "standardEquipment",
				"dataKeys": {
					"attributeGroup": "ENGINE",
					"attributes": "TORQUE"
				},
				"parent": "Performance"
			},
			"HORSEPOWER": {
				"label": "Horsepower",
				"minvalue": "0",
				"maxvalue": "400",
				"units": "HP",
				"irreg": "standardEquipment",
				"dataKeys": {
					"attributeGroup": "ENGINE",
					"attributes": "HORSEPOWER"
				},
				"parent": "Performance"
			},
			"MANUFACTURER_0_60MPH_ACCELERATION_TIME_(SECONDS)": {
				"label": "Acceleration 0-60",
				"minvalue": "20",
				"maxvalue": "3",
				"units": "sec",
				"dataKeys": {
					"attributeGroup": "SPECIFICATIONS",
					"attributes": "MANUFACTURER_0_60MPH_ACCELERATION_TIME_(SECONDS)"
				},
				"parent": "Performance"
			}
		}
		
	/* 	<section_name>: {
			"axis_name": {
				"label": "",
				"minvalue": "",
				"maxvalue": "",
				"units": "",
				"dataKeys": {
					"attributeGroup": "__",
					"attributes": "__"
				},
				"parent": ""
			},
		},
	 */
	}
	/* ******************************************************** 
	   ******  AXIS OBJECT  ****************
	   ****************************************************/
	// Function to add commas to large numbers
	function delimitNumbers(str) {
		return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
			return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
		});
	}

	function Axis ( axis_data, paper, index_within_paper, is_last ) 
	{ 	/* SECTION string is passed in for aggregate Axis creation! So if axis_data is a string, it's the section name! */
		/* --axis_data is object of data for single axis, pulled from axesData
		   --paper is jQ/Raphael object (var) for the paper Axis belongs to, in papers[],
		   --index_within_paper is counted from top */
		if ( typeof( axis_data ) == 'string' ) {
			var is_aggregate_axis = true;
		}
		if ( axis_data.irreg !== undefined ) { this.irreg = axis_data.irreg; }
		this.paper = paper;
		this.index_in_sect = index_within_paper; // starts at 1
		this.anchor_x = axes_margin_left + axis_margin_left; // axIs_mar_lft = 0 until dynamic axis placement
		this.axis_length = axis_length_const;
		this.endpoint_x = this.anchor_x + this.axis_length;
		if ( is_aggregate_axis ) {
			this.anchor_y = agg_axis_margin_top; 
		} else { 
			this.anchor_y = axis_margin_top;  // + ( ( slider_value * spread_max ) * ( index_within_paper - 1 ) );  // When initializing Axes for initally-collapsed, start them all at same height
		}
		this.endpoint_y = this.anchor_y;
		if ( !is_aggregate_axis ) {
			this.label = axis_data.label;
			this.minvalue = axis_data.minvalue; // Number(axis_data.minvalue); 
			this.maxvalue = axis_data.maxvalue; // Number(axis_data.maxvalue); 
			this.units = axis_data.units;
			this.attributeGroup_key = axis_data.dataKeys.attributeGroup; // these navigate path inside 
			this.attributes_key = axis_data.dataKeys.attributes;			// Edmunds style object
			this.pixel_ratio = this.axis_length / (this.maxvalue - this.minvalue);
			/* AGG AXIS NEEDS DEF. LATER */
		} else {
			this.label = /* axis_data + */ ' Overall'; // if aggregate, the section name was passed in as axis_data
			this.minvalue = 'less';
			this.maxvalue = 'more';
			this.units = '';
		}
		this.is_last = is_last; // boolean for last axis on a paper, maybe not needed
		this.data = [];
		this.dots = []; // will hold Raph objets
		this.connectors = []; // will hold Raph objects
		
		/* Raphael SVG objects for Axis */
		
		//axis line
			this.axisline_svg = this.paper
				.path("M"+this.anchor_x+","+this.anchor_y+"L"+this.endpoint_x+","+this.endpoint_y) 
				.attr( axis_path_settings );
		//axis label
			this.label_svg = this.paper
				.text( this.anchor_x-50 , this.anchor_y-4 , this.label )
				// .attr({'text-anchor': 'end'}) moved to settings file
				.attr( label_text_settings ); 
				
		//min label
			this.minlabel_svg = this.paper
				.text( this.anchor_x , this.anchor_y , delimitNumbers( this.minvalue ) )
				.attr( min_text_settings );
			this.minlabel_svg.attr({  // center vertically
					'y': this.minlabel_svg.attr('y') - ( this.minlabel_svg.attr('font-size') / 2 + 2 )
				}); 
		//max label
			this.maxlabel_svg = this.paper
				.text( this.endpoint_x + 3, this.endpoint_y , delimitNumbers( this.maxvalue ) )
				.attr( max_text_settings );
			this.maxlabel_svg.attr({  // center vertically
					'y': this.maxlabel_svg.attr('y') - ( this.maxlabel_svg.attr('font-size') / 2 + 2 )
				}); 
		//units label
			this.unitslabel_svg = this.paper
				.text( this.endpoint_x + 3, this.endpoint_y , this.units )
				.attr( units_text_settings );
			this.unitslabel_svg.attr({  // DRY: make this a function
					'y': this.unitslabel_svg.attr('y') + ( this.unitslabel_svg.attr('font-size') / 2 )
				}); 
	}
	
	/* *********** FUNCTIONS RELATED TO AXES *********** */
	var collapse_elements_list = {
		"1": "axisline_svg",
		"2": "label_svg",
		"3": "minlabel_svg",
		"4": "maxlabel_svg",
		"5": "unitslabel_svg"
	}
	function changeSpread( sect_index, new_spread_percent, timing, isCollapse ) 
	{   // isCollapse indicates special case for paper sizing: makes paper height only 40px high instead of usual.
	
		var axs = axesAll[ sect_index ]; // conversion for array math
		for ( var i = 1 ; i < axs.length; i++ ) {  
			// start at 1 to avoid aggregate axis
			var ax = axs[i];  // a single Axis
			var old_y = ax.anchor_y; // all axes are created at anchor_y = axis_margin_top now (as of 1/2/13), due to creating axes in collapsed state, and this function is written to update transform from that initial state (ie, mv_dist is always the full distance from collapsed state).  IN FACT, this code was built for a non-adjustable spread, so that it was always transforming from collapsed-to-expanded, or vice versa.  In this version, mv_dist is semantically incorrect, it should be called new_transform_height or something like that.
			var new_y = axis_margin_top + ( new_spread_percent * spread_max * ( ax.index_in_sect - 1 ) );
			var mv_distance = new_y - old_y;
			var transform_string = "t"+"0," + mv_distance;
			// YOU *DO* HAVE TO RESET ANCHOR_Y, so that new data points know where to get positioned.    But, oh crap, I tried updating ax.anchor_y with the following line of code and it broke *everything* pretty, pretty, pretty bad:
			//ax.anchor_y = new_y;
			
			
			// move DOTS		
			for ( var d = 0; d < ax.dots.length; d++ ) {
				//console.log("dots loop: loop # "+d);
				if ( ax.dots[d] != "NUTS" ) {
					ax.dots[d].animate( { transform: transform_string }, timing, 'linear' );
				}
				if ( /* ( ax.connectors[ d ] ) && */ ( ax.connectors[ d ] != "NUTS" ) ) {
					scaleConnector ( ax.connectors[d], new_spread_percent, timing );
				}
			}
			// move AXES
			for ( var key in collapse_elements_list ) {
				var el_to_transform = collapse_elements_list[key];
				ax[el_to_transform].stop().animate( { transform: transform_string }, timing, 'linear' );
			}
		}
		// CONNECTORS -- scale about y value of top non-aggregate axis, which is by definition axis_margin_top.  Their non-scaled proportion is 100% of the full-spreaded axes (spread_max), so we're just scaling them by the factor passed in, new_spread_percent.
		// transform can accept "scale" which goes s{x_scale},{y_scale},{x_scaleOrigin},{y_scaleOrigin}.
		// loop thru all paths per car in that section
		/* // OLD CODE -- CONNECTORS NOW IN AXES -- FRI NIGHT
		for ( var c in cars ) { // loop thru all cars, c is integer
			for ( var j = 0; j < cars[c].connectors[ sect_index ].length; j++ ) { 
				// new function outsourcing:
				var connectors_to_scale = cars[c].connectors[sect_index][j];
				if ( connectors_to_scale != "NUTS" ) {
					scaleConnector ( connectors_to_scale, new_spread_percent, timing );
				}
			}
		} */
		// resize paper
		var target_paper = axs[0].paper; // random Axis in group
		var same_width = target_paper.width;
		if ( isCollapse ) { var new_height = paper_collapsed_height; // raph_settings.js 
		} else {
			var new_height = axis_margin_top + ( axs.length - 2 ) * (new_spread_percent * spread_max) + axis_margin_bottom ; // -2 b/c don't count agg axis or first axis
		}
		animatePaperSize ( target_paper, same_width, same_width, target_paper.height, new_height, timing/2 ); // the shrunken timing is to keep up with axes, 
								// they seem to move faster

	}
	function scaleConnector( connector_path, new_spread_percent, timing )
	{
		var transform_string = "s" + "1," + new_spread_percent + ",0," + axis_margin_top;
				
		connector_path.animate( { transform: transform_string }, timing, 'linear' );
		
	}

	function hideshowAllInSection( section_index, hide_or_show, timing ) 
	{  //used for fading axes out on collapse, fading them back in on expand
		var axs = axesAll[ section_index ];
		// are we hiding or showing all?
		if ( hide_or_show == "hide" ) {
			var new_opacity = 0;
			var new_connector_opacity = 0;
		} else { // i.e., "show"
			var new_opacity = dot_common_opacity_setting; 
			var new_connector_opacity = connector_path_opacity;
		}
		// DOTS and AXES
		// loop thru axs for axes and dots
		for (var i = 1; i < axs.length; i++ ) { // Loop thru axes (non-aggregate)
			// hide/show axes & labels
				var ax = axs[ i ];
				for ( var key in collapse_elements_list ) {
					
					var el_to_showhide = collapse_elements_list[ key ];
					var animation_debug = ax[ el_to_showhide ].attr( { 'opacity': Math.ceil( new_opacity ) }/* , timing */ );  // for some reason .animate dosn't work but .attr does.  Math.ceil() rounds up, and in this case takes opacity for various axis elements up to 1 on show so that their attributes can be styled directly by settings vars at top of carviz.js (but keeps 0 if it's 0).
				}
			// hide/show dots & connectors: animate to new_opacity
				for ( var cars_index in ax.dots ) { 
					// DOTS
					if ( ax.dots[ cars_index ] != "NUTS" ) {
						ax.dots[ cars_index ].animate( { 'opacity': new_opacity }, timing );
					}
					// CONNECTORS
					if ( ( ax.connectors[ cars_index ] != "NUTS" ) && !cars[ cars_index ].is_selected ) {
						//excluded is_selcted connectors b/c the animation competed with highlightCar and canceled it out.
						ax.connectors[ cars_index ].animate( { 'opacity': new_connector_opacity }, timing ); 
					}
					if ( hide_or_show != 'hide' && cars[ cars_index ].is_selected ) {
						console.log('highlightCar() called inside showhide');
						highlightCar( cars_index );
					}
				}
		}
		
		
	}

	function animatePaperSize ( rs_paper, old_width, new_width, old_height, new_height, timing )
	{
		var frame_counter = 0;
		var frames = 5; // low frames really helps smoothness
		var width_change_per_frame = ( new_width - old_width ) / frames;
		var height_change_per_frame = ( new_height - old_height ) / frames;
		
		var interval = setInterval( function() {
			// console.log( "inside setInterval");
			frame_counter++;
			//console.log ("frame: "+frame_counter+ "  width_animation: "+ old_width + ( width_change_per_frame * frame_counter ));
			rs_paper.setSize( 
				old_width + ( width_change_per_frame * frame_counter ), 
				old_height + ( height_change_per_frame * frame_counter )
			);
			if ( frame_counter == frames )	
				clearInterval ( interval);
		}, timing / frames );
	}
	/* ******************************************************** 
	   ******  AXIS METHODS  ****************
	   ****************************************************/
	
	/* ******************************************************** 
	   ******  BUILD PAPERS  ****************
	   ****************************************************/
	// 
	function papersInit()
	{
		//console.log("papersInit()");
		var paper_width = 0;
		var paper_height = 0;
		var paper_counter = 0;
		// loop thru axesData.length
		for (var section in axesData) {
			//initialize isExpanded[] array as TRUE (starting before ++ to maintain array counting from 0 )
			isExpanded[ paper_counter ] = false;  // initialize to false
			
			// paper_counter++; // paper divs start at id="canvas_container1"
			// count axesData elements (no .length prop on {} literals
			var section_axis_count = 0;
			for ( var i in axesData[section] ) {
				if ( axesData[section].hasOwnProperty(i) ) { // why do this? safety of some sort?  It seems redundant, since we're only looping BECAUSE it indeed has that property
					section_axis_count++; 
				}
			}
			paper_width = axes_margin_left + axis_length_const + axes_margin_right;
			paper_height = paper_collapsed_height; // raph_settings.js // old version: paper_height = axis_margin_top + ( section_axis_count - 1 ) * ( slider_value * spread_max ) + axis_margin_bottom // calcs height for expanded state (old version)
			
			// create paper for each subobject, key it with the section name
			papers[section] = new Raphael(document.getElementById('canvas_container'+paper_counter), paper_width, paper_height)
			paper_counter++; // new location for all-array-logic revision
		}
	}
	
	/* ******************************************************** 
	   ******  BUILD AND RENDER AXES  ****************
	   ****************************************************/
	function axesInit() 
	{   // note: axesAll[][] is empty when this begins.
		// console.log("axesInit()");
		var ax_per_sect_counter = 0;
		var section_counter = 0 // numerical section counter
		
		for (var section in papers) { // recall that paper keys are same as axesData keys: section titles
			
			ax_per_sect_counter = 0; // NEW FOR AGGREGATE CHANGES start building axes at array index[1], then afterward use just-created axes to generate data for aggregate axis arrayindex[0]
			//create a sub-array to hold just Axes in a section
			axesAll[section_counter] = []; 
			
			for (var att_name in axesData[section]) { // loops thru attributes
				ax_per_sect_counter++; // increment axis counter before inside loop, to leave [0] for aggregate axis.
				//load axesData values into each Axis
				axesAll[section_counter][ax_per_sect_counter] = new Axis 
				(
					axesData[section][att_name] , // object literal holding axis definition
					papers[section] , // raphael paper object/var
					ax_per_sect_counter , // adjusted Axis object to adapt to start at 0
					( ax_per_sect_counter == axesData[section].length - 1 ) // adjusted for start at 0 instead of 1
				);
			}
			// generate Aggregate Axis
			axesAll[section_counter][0] = new Axis (
				section , // PASS IN A STRING, and then test for it; would have been {} obj otherwise
				papers[section] ,
				0 , // maps to index_within_paper, zero for all aggregate axes
				false // maps to is_last
			);
			//console.log("aggregate axis: ");
			//console.log(axesAll[section_counter][0]);
			
			//console.log("section of new agg axis: "+section)
			axesAll[section_counter][0].label = section; // this is attempted cleanup since section name wasn't available inside Axis object definition scope
			// special attributes for aggregate axis labels
			axesAll[section_counter][0].label_svg.attr ( agg_axis_label_text_settings );
			// increment counter after outside loop
			section_counter++; 
		}
		
		
	} 
	
	/* ******************************************************** 
	   ******  ADD NEW CAR WHEN REQUESTED****************
	   ****************************************************/
	function addCarData ( car_obj, cars_index )     // adds car data and svg elements to Axis.data[] arrays.
	{
		// load data, then draw Raph circles and paths while I'm there
		
		//prepare .connectors array for connector paths
		//cars[ cars_index ].connectors = []; // array 
			
		//console.log("DID YOU FORGET TO DEFINE A PIXEL_RATIO FOR AGGREGATE AXES?"); No, just decided position was good enough
		for ( var i=0 ; i<axesAll.length ; i++ ) { // loops thru sections (array math, starting zero)
			// Need a flag in case, like Ferrari, a whole section is data-less
			var no_data_to_aggregate = true;
			// cache data as we move thru axes in this section
			var x_values_of_data = [];
			// cache which raph paper this section is working in, picked [0] at random
			var current_paper = axesAll[i][0].paper; 
			
			/* EXCEPTIONS for certain areas of Edmunds object */
			if ( axesAll[i][1].attributeGroup_key == 'CRASH_TEST_RATINGS' ) { // in Safety?
				in_safety_section = true;
				//console.log( 'in_safety_section' );
			} else { 
				in_safety_section = false;
			}
			// per car, each section will have its own sub-array to hold paths by section, for collapse.
			//cars[ cars_index ].connectors[i] = []; 
			
			for ( var j=1 ; j<axesAll[i].length ; j++ ) {    // loops thru axes within section, NOT including aggAxis which is [0]
				
				var current_axis = axesAll[i][j];
				var group_key = current_axis.attributeGroup_key;
				var att_key = current_axis.attributes_key;
				var car_obj_copy = car_obj; // don't mess with car_obj
				
				// check for exceptions
				if ( current_axis.irreg !== undefined && current_axis.irreg == 'standardEquipment' ) {
					var irreg_object_arr = car_obj.standardEquipment;
					var engine_index = -1;
					// seek ENGINE
					for ( var n in irreg_object_arr ) { 
						if ( irreg_object_arr[ n ].equipmentClass == "ENGINE" ) {
							engine_index = n;
							break;
						}
					}
					if ( engine_index !== -1 ) { // keep us out of trouble
						var car_obj_copy = irreg_object_arr[ engine_index ];
					}
				}
				
				// DOTS
				if ( car_obj_copy.attributeGroups[ group_key ] == undefined ) { // if whold att group is missing
					current_axis.data.push( "NUTS" );
					current_axis.dots.push( "NUTS" );
					// flag aggregate-dot creator below NOT to create dot for this section's aggregate:
				} else { // safe to look at attributes themselves now
					
					var att_obj = car_obj_copy.attributeGroups[ group_key ].attributes[ att_key ];
					
					// test for second version of MAX_CARGO_CAPACITY, such as in Mazda5 minivan case.
					if ( att_obj == undefined && 
						group_key == "CARGO_DIMENSIONS" &&
						car_obj_copy.attributeGroups[ group_key ].attributes[ 'CARGO_CAPACITY,_REAR_SEAT_DOWN_OR_REMOVED' ] !== undefined ) 
					{
							att_obj = car_obj_copy.attributeGroups[ group_key ].attributes[ 'CARGO_CAPACITY,_REAR_SEAT_DOWN_OR_REMOVED' ]; // switches to alternative attribute.
					} 
					if ( att_obj == undefined ) { // if data is still missing after fixes...
						current_axis.data.push( "NUTS" );
						current_axis.dots.push( "NUTS" );
					} else { // there is definitely a value to display.
						no_data_to_aggregate = false;
						var value = att_obj.value;
						if ( att_obj.value == 'TORQUE' ) {
							console.log( 'TORQUE' );
						}
						
						current_axis.data.push( value );
						/* DOT CALC DIFFERS FOR NON-QUANTITATIVE RATINGS */
						// SAFETY section
						if ( !in_safety_section ) {
							var dot_x = current_axis.anchor_x + current_axis.pixel_ratio * ( current_axis.data[cars_index] - current_axis.minvalue );
						} else { // actually in Safety section
							var ratio = 0;
							switch ( value )
							{
								case '5 stars': 
									ratio = .8;
									break;
								case 'Good':
									ratio = .8;
									break;
								case '4 stars':
									ratio = .6;
									break;
								case 'Acceptable':
									ratio = .6;
									break;
								case '3 stars':
									ratio = .4;
									break;
								case '2 stars':
									ratio = .2;
									break;
								case 'Marginal':
									ratio = .4;
									break;
								case '1 star':
									ratio = .05;
									break;
								case 'Poor':
									ratio = .2;
									break;
								case 'Not tested':
									ratio = -.1;
									break;
							}
							function get_nonquantitative_dotx( cars_index, ratio, i, j ) 
							{
								return ( current_axis.anchor_x + ( ratio * axis_length_const ) + 
								4 * ( cars_index % 8 ) ); // 4 is for pixels offset 
							}  
							var dot_x = get_nonquantitative_dotx( cars_index, ratio, i, j );
						}
						// height calcs
						var transform_height = /* axis_margin_top */ + ( slider_value * spread_max * ( current_axis.index_in_sect - 1 ) );
						
						var new_dot = current_paper.circle( dot_x, current_axis.anchor_y, dot_radius )
							.attr( dot_common_settings )
							.attr( {"fill": cars[ cars_index ]['color'] } )
							.transform ( 't0,' + transform_height );
						
						// bind data() for tooltip to dot -- this worked!
						new_dot.data( 'myAxis', current_axis );
						// add HOVER handlers
						new_dot.hover( 
							function( event ) {
								if ( !ie_user ) this.toFront();
								showTooltip( cars[cars_index], true, this.data( 'myAxis' ), cars_index, event ); // -- true means include data in tooltip, and pass in Axis dot lives in.
								if ( ie_user ) { highlightCar( cars_index, this ); 
								} else { highlightCar( cars_index, null); } 
							}, function() {
								hideTooltip();
								// don't unhighlight if it's already selected/highlighted
								if ( !cars[ cars_index ].is_selected ) unHighlightCar ( cars_index );
						}); 
						
						// push new dot to array in cars
						current_axis.dots.push( new_dot );
						x_values_of_data.push( dot_x );  // record x position of new dot for aggregating
					}
				} 
				
				// CONNECTOR CURVES: if j>1, and if this axis j has a dot, and if the previous axis (j-1) has a dot, draw a path
				var new_connector = buildConnector( i, j, cars_index );
				if ( new_connector != "NUTS" ) {
					scaleConnector( new_connector, slider_value, 1 ); // passing in 1ms for "instant"
				}
				
			} // end inside loop (axis level j)
			
			// AGGREGATE AXIS creator:
			// after end of inside loop j is where to generate aggregate axis .data[] for new car, for section corresponding to [i]
			if ( !no_data_to_aggregate && x_values_of_data.length > 0 ) { // attGroup exists, and indeed we drew some dots in it
				var sum = 0;
				for ( var k in x_values_of_data ) {
					sum += x_values_of_data[k];
				}
				var agg_x = sum / x_values_of_data.length ; // gives average x for this car, in this section
				axesAll[i][0].data.push( agg_x );  // THIS IS JUST X-POSITION, not 'data' how I use it other axes
				var agg_dot = current_paper.circle( agg_x, axesAll[i][0].anchor_y, big_dot_radius )
					.attr( dot_common_settings )
					.attr( {"fill": cars[ cars_index ]['color'] } );
				// HOVER
				agg_dot.hover(
					function( event ) {
						if ( !ie_user ) this.toFront();
						showTooltip( cars[cars_index], false, null, null, event ); 
						// don't highlight if it's already selected/highlighted
						if ( !cars[ cars_index ].is_selected ) {
							if ( ie_user ) { highlightCar( cars_index, this ); 
							} else { highlightCar( cars_index, null); }
						}
					}, 
					function() {
						hideTooltip();
						// don't highlight if it's already selected/highlighted
						if ( !cars[ cars_index ].is_selected ) unHighlightCar( cars_index );
				}); 
				axesAll[i][0].dots.push( agg_dot );
			} else {
				axesAll[i][0].dots.push( "NUTS" );
			}
			axesAll[i][0].connectors.push( "NUTS" ); // keeping house, make sure everybody gets a connector or nuts, never nothing.
		} // end outside loop (section level i)
	}
	function buildConnector ( i, j, cars_index )
	{  // NEW: build as if spread is set at spread_max, then scale to current spread.
		if ( j == 1 ) {
			axesAll[i][j].connectors[ cars_index ] = 'NUTS';
		}
		if ( ( j > 1 ) && ( axesAll[i][j-1].dots[ cars_index ] != 'NUTS' ) && ( axesAll[i][j].dots[ cars_index ] != 'NUTS' ) ) 
		{
			var top_ax = axesAll[i][j-1];
			var bott_ax = axesAll[i][j];
			// draw a path (have to draw "backwards" (up) b/c forward dot doesn't exist yet
			var path_bottom_x = bott_ax.dots[cars_index].attr( 'cx' );
			// var path_bottom_y = top_ax.dots[cars_index].attr( 'cy' );
			var path_bottom_y = axis_margin_top + ( spread_max * ( bott_ax.index_in_sect - 1 ) );  // no spread for first real Axis
						
			// using absolute coords
			var controlbott_x = path_bottom_x;
			var controlbott_y = path_bottom_y - 30;
			var path_top_x = top_ax.dots[cars_index].attr( 'cx' );
			//var path_top_y = bott_ax.dots[cars_index].attr( 'cy' );
			var path_top_y = axis_margin_top + ( spread_max * ( top_ax.index_in_sect - 1 ) );
			
			var controltop_x = path_top_x;
			var controltop_y = path_top_y + 30;
			var new_connector = top_ax.paper.path( 
				'M'+path_bottom_x+","+path_bottom_y+" "+
				'C'+controlbott_x+","+controlbott_y+" "+
				controltop_x+","+controltop_y+" "+
				path_top_x+","+path_top_y 
				)
				.attr ( connector_path_settings )
				.attr ( { "stroke": cars[ cars_index ].color } )
				.toBack();
			if ( !isExpanded[i] ) {
				new_connector.attr( { 'opacity': 0 } );
			}
			if ( !IS_TOUCH_DEVICE && !ie_user ) {
				new_connector.hover( 
					function( event ) {
						showTooltip( cars[cars_index], false, null, null, event ); 
						// don't highlight or toFront() if it's already selected/highlighted
						if ( !ie_user ) this.toFront();
						if ( ie_user ) { highlightCar( cars_index, this ); 
						} else { highlightCar( cars_index, null); }
					}, function() {
						hideTooltip();
						// don't highlight if it's selected
						if ( !cars[ cars_index ].is_selected ) unHighlightCar ( cars_index );
					}
				); 
			}
			// store it
			axesAll[i][j].connectors.push( new_connector );
			return ( new_connector );
		} else {
			axesAll[i][j].connectors.push( "NUTS" );
			return "NUTS";
		}
	}
	function highlightCar( cars_index, object_not_to_toFront ) 
	{  // index "should" correspond to spot in axes' .dots[] arrays
		for ( var i = 0; i < axesAll.length; i++ ) { // loop thru sections
			if ( isExpanded[ i ] ) {
				for ( var j = 1; j < axesAll[i].length; j++ ) { // thru axes in sect
					// connectors
					var ax = axesAll[i][j];
					if ( ( ax.connectors[ cars_index ] ) && ( ax.connectors[ cars_index ] != 'NUTS' ) ) {
						ax.connectors[ cars_index ]
							.animate( connector_highlight_settings, 200 );
						// IE patch
						if ( ax.connectors[ cars_index ] !== object_not_to_toFront ) {
							ax.connectors[ cars_index ].toFront(); 
						}
					}
					
					// dots
					if ( ( ax.dots[ cars_index ] ) && ( ax.dots[ cars_index ] != 'NUTS' ) ) {
						ax.dots[ cars_index ].animate( dot_highlight_attrs, 200 );
						// IE patch
						if ( ax.dots[ cars_index ] !== object_not_to_toFront ) {
							ax.dots[ cars_index ].toFront(); //next path will still fall in front, so front dots at end of section
						}
					}
					// front all dots in one go at end of section
					if ( j == ( axesAll[i].length - 1 ) ) {
						
					}
				}
				for ( var k = 1; k < axesAll[i].length; k++ ) {
					// IE patch
					if ( ( axesAll[i][k].dots[ cars_index ] !== 'NUTS' ) && ( axesAll[i][k].dots[ cars_index ] !== object_not_to_toFront ) ) {
						axesAll[i][k].dots[ cars_index ].toFront();
					}
				}
			}
			// always highlight aggregate dots
			if ( axesAll[ i ][ 0 ].dots[ cars_index ] != 'NUTS' ) {
				axesAll[ i ][ 0 ].dots[ cars_index ].animate( dot_highlight_attrs, 200 )
				// IE patch
				if ( axesAll[ i ][ 0 ].dots[ cars_index ] !== object_not_to_toFront ) {
					axesAll[ i ][ 0 ].dots[ cars_index ].toFront();
				}
			}
			// highlight UI key
			$( '#dynamic_car_display' ).find( "[data-carindex='" + cars_index + "']" )
				.css( 'background-color', keytile_highlight );
		}
	}
	function unHighlightCar( cars_index ) 
	{
		hideTooltip();
		for ( var i = 0; i < axesAll.length; i++ ) {
			if ( isExpanded[ i ] ) { 
				for ( var j = 1; j < axesAll[i].length; j++ ) {
					//console.log ( axesAll[i][j].dots[cars_index] );
					if ( ( axesAll[i][j].dots[ cars_index ] ) && ( axesAll[i][j].dots[ cars_index ] != 'NUTS' ) ) {
						axesAll[i][j].dots[ cars_index ].animate( dot_common_settings, 200 );
					}
					// NEW CODE FRI NIGHT CONNECTOR MOVE
					if ( ( axesAll[i][j].connectors[ cars_index ] ) && ( axesAll[i][j].connectors[ cars_index ] != 'NUTS' ) ) {
						axesAll[i][j].connectors[ cars_index ].animate( connector_path_settings, 200 );
					}
				}
			}
			// aggregate axes
			if ( axesAll[ i ][ 0 ].dots[ cars_index ] != 'NUTS' ) {
				axesAll[ i ][ 0 ].dots[ cars_index ].animate( dot_common_settings, 200 )
				.toFront();
			}
			$( '#dynamic_car_display' ).find( "[data-carindex='" + cars_index + "']" )
				.css( 'background-color', '#000' );
		}
		selectedToFront();
	}
	function selectedToFront() {
		for ( var i in selected_cars ) {
			highlightCar( selected_cars[ i ] );
		}
	}
	
	function showTooltip( current_car, isDataDot, axisOfDataDot, cars_index, event )  
	{  // isDataDot is boolean, indicates to display data
		var vscroll = (document.all ? document.scrollTop : window.pageYOffset);
		
		if ( $( '#tooltip' ).length > 0 ) {  //test for currently displayed
			$( '#tooltip' ).css( {
				top: (/* vscroll + */ event.clientY)+'px', // used fixed pos. instead
				left: (event.clientX + 20)+'px'
			});
		} 
		else { 
			var tt_text = '<span class="tt_carname">' + current_car.styleObject.makeName + ' ' + current_car.styleObject.modelName + '</span>';
			if ( isDataDot ) {
				tt_text += ( '<br /><span class="data_display">' + axisOfDataDot.label + ": " + delimitNumbers( axisOfDataDot.data[ cars_index ] ) + '</span>' );
			}
			$( '<div id="tooltip"></div>' ).css( {
				border: '2px solid ' + current_car.color,
				top: event.clientY + 'px', 
				left: (event.clientX + 20) + 'px'
			})
			.html( tt_text )
			.appendTo("body").fadeIn(100);
		} 
	}
	
	function hideTooltip() 
	{
		$( '#tooltip' ).remove();
		// tried adding fadeOut() but if a new tooltip is called for during fadeOut it doesn't work.
	}
	
	function removeCarData( cars_index_to_del )
	{
		// loop thru axes i j and replace all data, dots, and connectors with "NUTS"
		for ( var i = 0; i < axesAll.length; i++ ) {
			for ( var j = 0; j < axesAll[i].length; j++ ) {
				var ax = axesAll[ i ][ j ];
				if ( ax.dots[ cars_index_to_del ] != "NUTS" ) {
					ax.dots[ cars_index_to_del ].remove();
					ax.dots[ cars_index_to_del ] = "NUTS";
				}
				if ( ax.connectors[ cars_index_to_del ] != "NUTS" ) {
					ax.connectors[ cars_index_to_del ].remove();
					ax.connectors[ cars_index_to_del ] = "NUTS";
				}
				ax.data[ cars_index_to_del ] = "NUTS";
			}
		}
		// replace cars[ cars_index_to_del ] = "NUTS"
	}
	/* ******************************************************** 
	   ******  MAIN PROGRAM  ****************
	   ****************************************************/
	$(document).ready( function() {
		
		
		
	});
	
	/* ******************************************************** 
	   ****** OLD CODE        ****************
	   ****************************************************/
/*




*/








