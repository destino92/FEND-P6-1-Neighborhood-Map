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
		chosenPlace    = ko.observable(''),
		query          = ko.observable(''),
		searched,
		categories     = ['Coffee','Pizza Place','Nightlife'],
		url,
		bounds;


	/* Get Places to use on the List and as map marker using
	 * the Foursquare API.
	 * Location are retrieved based on the categories array
	 * it will allow for searching and filtering later.
	*/
	function getPlaces(callback){
		// Loop trough the categories array.
		categories.forEach(function(category){
			// Set the url for the ajax request based on
			// the current category.
			url = "https://api.foursquare.com/v2/venues/explore?near=Mountain View, CA&query=" 
			+ category + "&limit=10&oauth_token=50XUH2ZKED4X4GSRF4EOR0LW4EF0R1IUC1USVIABIYXEMXP5&v=20160321"
			
			$.ajax({
				url: url,
				dataType: 'jsonp',
				success: function(response){
					//remove console.log later
					callback(response, category);
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
				marker  : new google.maps.Marker({
							position: {lat: location.venue.location.lat, lng: location.venue.location.lng},
							title: location.venue.name,
							animation: google.maps.Animation.DROP,
							map: map,
							draggable: false
						})
			})
		});

		// Loop into each place and set an click event listner to it's marker
		ko.utils.arrayForEach(places(), function(place){
			google.maps.event.addListener(place.marker, 'click', function() {
				place.marker.setAnimation(null);
				if(infoWindow)infoWindow.close();

				$('ul').find('li').removeClass('selected');
               	$('ul').find('li:contains('+ place.name + ')').addClass('selected');

                place.marker.setAnimation(google.maps.Animation.BOUNCE);
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
	function placeClick(place){
		console.log(place);
		//$('ul').find('li').removeClass('selected');
		chosenPlace(place);
		console.log(chosenPlace().marker);
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