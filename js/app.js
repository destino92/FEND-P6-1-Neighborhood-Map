var NeighborhoodMap = function(){
	// Declare some local variable (might update later).
	var bouncingMarker,
		infoWindow,
		places         = ko.observableArray(),
		chosenPlace    = ko.observable(''),
		query          = ko.observable(''),
		searched,
		url,
		bounds;


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
				//remove console.log later
				callback(response);
			}
		});
	}


	/* puhsPlaces is a callback to be used inside getPlaces ajax
	 * success calls.
	 * it creates an abject based on the data retrieved from ajax 
	 * and pushes it to the places array.
	 */
	function pushPlaces(result){
		// Get all the items from the ajax response and store it 
		// to locations.
		var locations = result.response.groups[0].items;
		var bounds = new google.maps.LatLngBounds(); 

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
				url     : location.venue.url,
				lat     : location.venue.location.lat,
				lng     : location.venue.location.lng,
				marker  : new google.maps.Marker({
							position: {lat: location.venue.location.lat, lng: location.venue.location.lng},
							title: location.venue.name,
							animation: google.maps.Animation.DROP,
							map: map,
							draggable: false
						})
			})

			bounds.extend(places()[i].marker.getPosition());
		});

		map.fitBounds(bounds);

        google.maps.event.addDomListener(window, 'resize', function() {
        	var center = map.getCenter();
        	google.maps.event.trigger(map, "resize");
        	map.setCenter(center);
        	map.fitBounds(bounds);
   		});

		// Loop into each place and set an click event listner to it's marker
		ko.utils.arrayForEach(places(), function(place){
			google.maps.event.addListener(place.marker, 'click', function() {
				if(bouncingMarker && bouncingMarker !== place.marker){
					bouncingMarker.setAnimation(null);
					console.log(bouncingMarker.title);
				}

				if(infoWindow)infoWindow.close();

				$('ul').find('li').removeClass('selected');
               	$('ul').find('li:contains('+ place.name + ')').addClass('selected');

                place.marker.setAnimation(google.maps.Animation.BOUNCE);
                bouncingMarker = place.marker;
                infoWindow = new google.maps.InfoWindow({
                    content: '<div><h1>' + place.name + '</h1><p>' + 
                    		place.tip + '</p><ul><li>' + place.rating +
                    		'</li><li>' + place.address + '</li><li> TEL: ' 
                    		+ place.phone + '</li></ul></div>'
                });
                infoWindow.open(map, place.marker);
                map.setCenter(place.marker.getPosition());
                map.setZoom(16);
			})
		})
	}

	// Call getPlaces with pushPlaces as an argument.
	getPlaces(pushPlaces);

	// Function to initialize this module.
	var init = function(){
		ko.applyBindings(NeighborhoodMap);
	};

	// Execute the init function when the DOM is ready
	$(init);

	/* After all initialization has been done i can now place the code to update the DOM
	 * Below */

	// Click event to be trigered when a map marker or title in the sidebar list is clicked
	function placeClick(place){
		chosenPlace(place);
		google.maps.event.trigger(chosenPlace().marker, 'click');
	}

	searched = ko.computed(function(){
		var notVisible = [],
			visible    = [];

		return ko.utils.arrayFilter(places(), function(place){
			if(place.name.toLowerCase().indexOf(query().toLowerCase()) < 0){
				notVisible.push(place);
				notVisible.forEach(function(place){
					place.marker.setMap(null);
				})

			} else {
				visible.push(place);
				visible.forEach(function(place){
					place.marker.setMap(map);
				})

				return ((query().length == 0 || place.name.toLowerCase().indexOf(query().toLowerCase()) > -1 ))
			}
		})
	})

	// return all values that needs to be accessed outside of the module
	return {
		searched: searched,
		chosenPlace: chosenPlace,
		placeClick: placeClick,
		query: query
	};

}();