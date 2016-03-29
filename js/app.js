var NeighborhoodMap = function(){
	// Declare some local variable (might update later).
	var bouncingMarker = null,
		//markers        = [],
		infoWindow,
		// MapOptions centers the map to MountainView CA
		// and set the zoom level to 12
		mapOptions     = { 
			center: {lat: 37.386052, lng: -122.083851},
			zoom: 12
		},
		map,
		places         = ko.observableArray(),
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

			//bounds.extend(places[i].marker.getPosition());
			//map.fitBounds(bounds);
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

		//add markers to the map
		//setTimeout(function(){ setMarkers(map); }, 10000);
	}

	// function to add markers to the map
	/*function setMarkers(map) {
		// create a new bound object for our map boundaries
		var bounds = new google.maps.LatLngBounds();

		ko.utils.arrayForEach(places(), function(place){
			// add a marker attribute to each place in 
			// the places observable array
			console.log(3);
			place.marker = new google.maps.Marker({
				position: {lat: place.lat, lng: place.lng},
				title: place.name,
				animation: google.maps.Animation.DROP,
				map: map,
				draggable: false
			});

			console.log(place.marker)

			// add the current place marker to the
			// the map bound 
			bounds.extend(place.marker.getPosition());
			map.fitBounds(bounds);
		});

	}*/

	//places is empty
	setTimeout(function(){ console.log(places()); }, 6000);

	// initialize the map 
	initMap();

	// Function to initialize this module.
	var init = function(){
		ko.applyBindings(NeighborhoodMap);
	};

	// Execute the init function when the DOM is ready
	$(init);

	// return all values that needs to be accessed outside of the modul
	return {
		places: places
	};

}();