var NeighborhoodMap=function(){function e(e){i="https://api.foursquare.com/v2/venues/explore?near=Mountain View, CA&query=pizza&limit=10&oauth_token=50XUH2ZKED4X4GSRF4EOR0LW4EF0R1IUC1USVIABIYXEMXP5&v=20160321",$.ajax({url:i,dataType:"jsonp",success:function(n){e(n)},error:function(e,n,o){$("#map").hide(),$("#sidebar").hide(),$("#message").html("<h1>Oops!!! "+e.status+" error</h1><p>Something went wrong with the foursquare API request.\nPlease refresh your browser ,try again letter or check your internet connection.</p>")}})}function n(e){var n=e.response.groups[0].items,o=new google.maps.LatLngBounds,r="https://foursquare.com/v/";n.forEach(function(e,n){s.push({tip:e.tips[0].text,name:e.venue.name,phone:e.venue.contact.formattedPhone,twitter:e.venue.contact.twitter,address:e.venue.location.formattedAddress[0],rating:e.venue.rating,url:r+e.venue.id,lat:e.venue.location.lat,lng:e.venue.location.lng,marker:new google.maps.Marker({position:{lat:e.venue.location.lat,lng:e.venue.location.lng},title:e.venue.name,animation:google.maps.Animation.DROP,map:map,draggable:!1})}),o.extend(s()[n].marker.getPosition())}),map.fitBounds(o),google.maps.event.addDomListener(window,"resize",function(){var e=map.getCenter();google.maps.event.trigger(map,"resize"),map.setCenter(e),map.fitBounds(o)}),ko.utils.arrayForEach(s(),function(e){google.maps.event.addListener(e.marker,"click",function(){a&&a!==e.marker&&a.setAnimation(null),t&&t.close(),l(e),e.marker.setAnimation(google.maps.Animation.BOUNCE),a=e.marker,t=new google.maps.InfoWindow({content:"<div><h1>"+e.name+'</h1><p class="tip">'+e.tip+'</p><ul><li><span class="bold-text">RATING:</span> '+e.rating+'</li><li><span class="bold-text">ADDRESS:</span> '+e.address+'</li><li><span class="bold-text">TEL:</span> '+e.phone+'</li><li><a href="'+e.url+'" target="_blank">View on Foursquare</li></div></ul>'}),t.open(map,e.marker),map.setCenter(e.marker.getPosition()),map.setZoom(16)})})}function o(e){l(e),google.maps.event.trigger(l().marker,"click")}var a,t,r,i,s=ko.observableArray(),l=ko.observable(""),u=ko.observable("");e(n);var p=function(){ko.applyBindings(NeighborhoodMap)};return $(p),r=ko.computed(function(){var e=[],n=[];return ko.utils.arrayFilter(s(),function(o){return o.name.toLowerCase().indexOf(u().toLowerCase())<0?(e.push(o),void e.forEach(function(e){e.marker.setMap(null)})):(n.push(o),n.forEach(function(e){e.marker.setMap(map)}),0===u().length||o.name.toLowerCase().indexOf(u().toLowerCase())>-1)})}),{searched:r,chosenPlace:l,placeClick:o,query:u}}();