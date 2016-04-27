var NeighborhoodMap = function(){
	// Declare some local variable (might update later).
	var bouncingMarker = null,
		infoWindow,
		// MapOptions centers the map to MountainView CA
		// and set the zoom level to 12
		mapOptions     = { 
			center: {lat: 37.386052, lng: -122.083851},
			zoom: 14
		},
		map,
		places         = ko.observableArray(),
		chosenMarker   = ko.observable(''),
		categories     = ['Coffee','Pizza Place','Nightlife'],
		url,
		bounds;


	/* Get Places to use on the List and as map marker using
	 * the Foursquare API.
	 * Location are retrieved based on the categories array
	 * it will allow for filtering later.
	*/
	function getPlaces(callback){
		// Loop trough the categories array.
		categories.forEach(function(category){
			// Set the url for the ajax request based on
			// the current category.
			url = "https://api.foursquare.com/v2/venues/explore?near=Mountain View, CA&query=" + category + "&limit=10&oauth_token=50XUH2ZKED4X4GSRF4EOR0LW4EF0R1IUC1USVIABIYXEMXP5&v=20160321"
			
			$.ajax({
				url: url,
				dataType: 'jsonp',
				success: function(response){
					//remove console.log later
					console.log(category);
					callback(response, category);
					console.log(places());
				}
			});
		});
	}


	/* puhsPlaces is a callback to be used inside getPlaces ajax
	 * success calls.
	 * it creates an abject based on the data retrieved from ajax 
	 * and pushes it to the places array.
	 */
	function pushPlaces(result, category){
		// Get all the items from the ajax response and store it 
		// to locations.
		var locations = result.response.groups[0].items;
		var bounds = new google.maps.LatLngBounds(); 

		// Loop trough locations variable
		locations.forEach(function(location){
			// Push the current location to the places array
			// after formatting it as an object.
			//console.log(i);
			places.push({
				tip     : location.tips[0].text,
				name    : location.venue.name,
				phone   : location.venue.contact.formattedPhone,
				twitter : location.venue.contact.twitter,
				address : location.venue.location.formattedAddress[0],
				rating  : location.venue.rating,
				url     : location.venue.url,
				lat     : location.venue.location.lat,
				lng     : location.venue.location.lng,
				category: category,
				//id      : i,
				marker  : new google.maps.Marker({
							position: {lat: location.venue.location.lat, lng: location.venue.location.lng},
							title: location.venue.name,
							animation: google.maps.Animation.DROP,
							map: map,
							draggable: false
						})
			})
		});
	}

	// Call getPlaces with pushPlaces as an argument.
	getPlaces(pushPlaces);

	//function to initialize the map
	function initMap() {
		// set map to be equal to a new google map
		// with the div with the id map as the element
		// and the mapOptions object as the options 
		map = new google.maps.Map($('#map').get(0), mapOptions);
	}

	// initialize the map 
	initMap();

	// Function to initialize this module.
	var init = function(){
		ko.applyBindings(NeighborhoodMap);
	};

	// Execute the init function when the DOM is ready
	$(init);

	/* After all initialization has been done i can now place the code to update the DOM
	 * Below */

	// Click event to be trigered when a map marker or title in the sidebar list is clicked
	function placeClick(marker){
		$('ul').find('li').removeClass('selected');
		chosenMarker(marker);
		$('ul').find('li:contains('+ marker.title + ')').addClass('selected');
		console.log('Hi');
	}

	// return all values that needs to be accessed outside of the module
	return {
		places: places,
		chosenMarker: chosenMarker,
		placeClick: placeClick
	};

}();