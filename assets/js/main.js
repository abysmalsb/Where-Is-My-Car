var apiKey = "AIzaSyCY2rXMYuVroQApjcHAC0jbZsvNFMpYIoc";
var map;
var carMarker;

function loadMapsApi() {
	'use strict';
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap";
	document.body.appendChild(script);
}

function initMap() {
	var defPosition = getLastPosition();
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: defPosition.lat, lng: defPosition.lng},
		zoom: 18
	});
	var infoWindow = new google.maps.InfoWindow({map: map});
	
	if(isThereSavedCar()) {
		document.getElementById('deleteMarkButton').disabled = false;
		var pos = getCarPosition();
		addMarker(new google.maps.LatLng(pos.lat, pos.lng));
	}

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			
			saveLastPosition(pos)
			infoWindow.setPosition(pos);
			infoWindow.setContent('You');
			map.setCenter(pos);
			}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}

function addMarker(location) {
	var marker = new google.maps.Marker({
		position: location,
		label: "C",
		map: map

	});
	carMarker = marker;
}

function deleteMarker(){
	if(carMarker){
		carMarker.setMap(null);
	}
}

function getLastPosition() {
	var longitude = 34.397;
	var latitude = 10.644;
	if (typeof(Storage) !== "undefined") {
		var longitude = localStorage.getItem('LastLongitude') || longitude;
		var latitude = localStorage.getItem('LastLatitude') || latitude;
	} else {
		// Sorry! No Web Storage support..
	}	
	return {lng: Number(longitude), lat: Number(latitude)};
}

function saveLastPosition(pos) {
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("LastLongitude", pos.lng);
		localStorage.setItem("LastLatitude", pos.lat);
	} else {
		// Sorry! No Web Storage support..
	}	
}

function isThereSavedCar() {
	if (typeof(Storage) !== "undefined") {
		return Number(localStorage.getItem('CarLongitude'));
	} 
}

function addCar() {
	deleteMarker();
	document.getElementById('deleteMarkButton').disabled = false;
	var pos = getLastPosition();
	saveCarPosition(pos);
	var carPos = new google.maps.LatLng(pos.lat, pos.lng);
	addMarker(carPos);
}

function deleteCar() {
	deleteMarker();
	localStorage.removeItem('CarLongitude');
	localStorage.removeItem('CarLatitude');
	document.getElementById('deleteMarkButton').disabled = true;
}

function saveCarPosition(pos) {
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("CarLongitude", pos.lng);
		localStorage.setItem("CarLatitude", pos.lat);
	} else {
		// Sorry! No Web Storage support..
	}	
}

function getCarPosition() {
	var longitude;
	var latitude;
	if (typeof(Storage) !== "undefined") {
		var longitude = localStorage.getItem('CarLongitude') || longitude;
		var latitude = localStorage.getItem('CarLatitude') || latitude;
	} else {
		// Sorry! No Web Storage support..
	}
	if(longitude === "undefined") {
		throw "Car not found";
	}
	return {lng: Number(longitude), lat: Number(latitude)};
}