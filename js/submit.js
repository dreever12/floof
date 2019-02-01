$(document).ready(function() {
	// initialize firebase
	var config = {
		apiKey: "AIzaSyD9lAd_ZoK1PmY-_jwVQLQbqO9QhD11CGw",
		authDomain: "floof-6900b.firebaseapp.com",
		databaseURL: "https://floof-6900b.firebaseio.com",
		projectId: "floof-6900b",
		storageBucket: "floof-6900b.appspot.com",
		messagingSenderId: "508207663303"
	};
	// Initialize Firebase
	firebase.initializeApp(config);

	// a var to represent the database
	var database = firebase.database();

	var age = [];
	var size = [];

	$(".checkAge").on("click", function() {
		if($(this).is(':checked')) {
			// push to age array
			age.push($(this).attr("data-age"));
			console.log(age);
		} else {
		 	// remove from age array
		 	var e = $(this).attr("data-age")
		 	age.splice($.inArray(e, age), 1);
		 	console.log(age);
		}
	});

	$(".checkSize").on("click", function() {
		if($(this).is(':checked')) {
			// push to age array
			size.push($(this).attr("data-size"));
			console.log(size);
		} else {
		 	// remove from age array
		 	var e = $(this).attr("data-size")
		 	size.splice($.inArray(e, size), 1);
		 	console.log(size);
		}
	});



	// Capture Button Click
	$(".btn").on("click", function(event) {
		// Don't refresh the page!
		event.preventDefault();

	// Sets default values for checkboxes if left unchecked
	if (age.length < 1) {
		age = ["Baby", "Young", "Adult", "Senior"];
	} 

	if (size.length < 1) {
		size = ["S", "M", "L"];
	}

	//variables to retireve data from the form 
	var name = $("#userName").val().trim();
	var address = $("#userStreetAddress").val().trim();
	var zip = $("#userZipCode").val().trim();
	var ulat;
	var ulng;

	function geoCode(userZip) {
        var mapKey = "AIzaSyBQs0I6hNyIg9gvfW1qpIGNykE03AuTCi4";
        // Get all zips and iterate through them
        var mapAddress = userZip;
        var mapQuery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + mapAddress +  "&key=" + mapKey;
        $.ajax({
            url: mapQuery,
            method: 'GET',
        }).then(function(res) {
            // Grab lat/long from result
            ulat = res.results[0].geometry.location.lat;
            ulng = res.results[0].geometry.location.lng;

			//creates local "temp" object for holding user data
			let userSpecs = {
				name: name,
				address: address,
				zip: zip,
				age: age,
				size: size,
				lat: ulat,
				lng: ulng
			};
			database.ref().push(userSpecs)
				.then((ref) => {
					window.location = "dogs.html?uid=" + ref.key + "&ulat=" + ulat + "&ulng=" + ulng;
				});            
        })
    };

    // Passes user zip through GeoCode to get lat and lng
    geoCode(zip)
	
	});
});

    