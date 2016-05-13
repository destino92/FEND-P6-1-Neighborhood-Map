var NeighborhoodMap = function(){
	// Declare some local variable (might update later).
	var bouncingMarker,
		infoWindow,
		places         = ko.observableArray(),
		chosenPlace    = ko.observable(''),
		query          = ko.observable(''),
		apiError       = ko.observable(true),
		errorMessage   = ko.observable(),
		searched,
		url,
		map,
		bounds;

	// Function to be used as a callback for the google map
	// I can't seem to figure out a way to handle errors here 
	function initMap() {
		// set map to be equal to a new google map
		// with the div with the id map as the element
		// and the mapOptions object as the options 
		map = new google.maps.Map($('.map').get(0), { center: {lat: 37.386052, lng: -122.083851},
			zoom: 14 }
		);

		// initialize module
		ko.applyBindings(NeighborhoodMap);
	}

	// Fallback function for google map loading script
	function googleError() {
		ko.applyBindings(NeighborhoodMap);
		errorMessage("<h1>Google Map error!!!</h1><p>Something went wrong with the Google map API request.\nPlease refresh your browser ,try again letter or check your internet connection.</p>");
		apiError(false);
	}

	/* Get Places to use on the List and as map marker using
	 * the Foursquare API.
	 */
	function getPlaces(callback){
		// Set the url for the ajax request
		url = "https://api.foursquare.com/v2/venues/explore?near=Mountain View, CA&query=pizza&limit=10&oauth_token=50XUH2ZKED4X4GSRF4EOR0LW4EF0R1IUC1USVIABIYXEMXP5&v=20160321";
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function(response){
				// Call callback with response as argument
				callback(response);
			},
			error: function(xhr, ajaxOptions, thrownError){
				errorMessage("<h1>Oops!!! " + xhr.status + 
				" error</h1><p>Something went wrong with the foursquare API request.\nPlease refresh your browser ,try again letter or check your internet connection.</p>");
				apiError(false);
			}
		});
	}


	/* setPlacesAndMarker is a callback to be used inside getPlaces ajax
	 * success calls.
	 * It creates an object based on the data retrieved from ajax 
	 * and pushes it to the places array.
	 */
	function setPlacesAndMarker(result){
		// Get all the items from the ajax response and store it 
		// to locations.
		var locations = result.response.groups[0].items,
			   bounds = new google.maps.LatLngBounds(), 
		       fourSquareUrl = 'https://foursquare.com/v/';

		// Loop trough locations variable
		locations.forEach(function(location, i){
			// Push the current location to the places array
			// after formatting it as an object.
			places.push({
				tip     : location.tips[0].text,
				name    : location.venue.name,
				phone   : location.venue.contact.formattedPhone,
				twitter : location.venue.contact.twitter,
				address : location.venue.location.formattedAddress[0],
				rating  : location.venue.rating,
				url     : fourSquareUrl + location.venue.id,
				lat     : location.venue.location.lat,
				lng     : location.venue.location.lng,
				marker  : new google.maps.Marker({
							position: {lat: location.venue.location.lat, lng: location.venue.location.lng},
							title: location.venue.name,
							animation: google.maps.Animation.DROP,
							map: map,
							draggable: false
						})
			});

			// Extend map bound with the current place marker
			bounds.extend(places()[i].marker.getPosition());
		});

		// Set map to fit bounds
		map.fitBounds(bounds);

		// Add an invest listener for window resize so that the map can be responsive
		// And all markers are still visible regardless of the screen size
        google.maps.event.addDomListener(window, 'resize', function() {
        	var center = map.getCenter();
        	google.maps.event.trigger(map, "resize");
        	map.setCenter(center);
        	map.fitBounds(bounds);
   		});

		// Loop into each place and set a click event listner to it's marker
		// to activate marker animation and open infowindow if marker is clicked
		ko.utils.arrayForEach(places(), function(place){
			google.maps.event.addListener(place.marker, 'click', function() {
				// If there is a bouncing marker and the bouncing marker
				// Is not the current marker set animation for the bouncing marker
				// to be null
				if(bouncingMarker && bouncingMarker !== place.marker){
					bouncingMarker.setAnimation(null);
				}

				// Close infowindow that is open
				if(infoWindow)infoWindow.close();

				// Set the chosen marker place to be chosenPlace
				// for styling in the place list
				chosenPlace(place);

				// Set animation of the current marker
                place.marker.setAnimation(google.maps.Animation.BOUNCE);

                // Set the bouncingMarker to the current marker
                bouncingMarker = place.marker;

                // Set infowindow to contain information of the current marker
                // place.
                infoWindow = new google.maps.InfoWindow({
                    content: '<div><h1>' + place.name + '</h1><p class="tip">' + place.tip + '</p><ul><li><span class="bold-text">RATING:</span> ' +
                    		place.rating + '</li><li><span class="bold-text">ADDRESS:</span> ' + place.address +
                    		'</li><li><span class="bold-text">TEL:</span> ' + place.phone +
                    		'</li><li><a href="' + place.url + '" target="_blank">View on Foursquare</li></div></ul>'
                });

                infoWindow.open(map, place.marker);

                // Center the map to the current marker
                map.setCenter(place.marker.getPosition());
                map.setZoom(16);
			});
		});
	}

	// Call getPlaces with setPlacesAndMarker as an argument.
	getPlaces(setPlacesAndMarker);

	/* After all initialization has been done i can now place the code to update the DOM
	 * Below */

	// Click event to be trigered when a place in the sidebar list is clicked
	function placeClick(place){
		// set the clicked place to be chosenPlace for styling
		// not that i call this twice to avoid issue when
		// the first item clicked is a place and not a marker
		chosenPlace(place);

		// Trigger the click event of the place marker
		google.maps.event.trigger(chosenPlace().marker, 'click');
	}

	// Define a computed observale to handle search activity
	// from search input
	searched = ko.computed(function(){
		// Here visible and not visible are arrays that will contains
		// places and marker that are visible and not visible
		var notVisible = [],
			visible    = [];

		// Filter places accordind to the search input value
		return ko.utils.arrayFilter(places(), function(place){
			// If the current place doesn't match the search input value
			//remove it's marker from the map and the list
			if(place.name.toLowerCase().indexOf(query().toLowerCase()) < 0){
				notVisible.push(place);
				notVisible.forEach(function(place){
					place.marker.setMap(null);
				});

			} else {
				visible.push(place);
				visible.forEach(function(place){
					place.marker.setMap(map);
				});

				// If the current place matches the search input value
				// set it's marker to be visible on the map and on the list or
				// if there is no search input show all markers and places
				return ((query().length === 0 || place.name.toLowerCase().indexOf(query().toLowerCase()) > -1 ));
			}
		});
	});

	// return all values that needs to be accessed outside of the module
	return {
		searched: searched,
		chosenPlace: chosenPlace,
		placeClick: placeClick,
		query: query,
		initMap: initMap,
		apiError: apiError,
		errorMessage: errorMessage,
		googleError: googleError
	};

}();