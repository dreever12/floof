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


	// Capture Button Click
	$(".btn").on("click", function(event) {
		// Don't refresh the page!
		event.preventDefault();

	//variables to retireve data from the form 
	var name = $("#userName").val().trim();
	var address = $("#userStreetAddress").val().trim();
	var zip = $("#userZipCode").val().trim();
	var age = $("#agePuppy").val().trim();

	//creates local "temp" object for holding user data
	let userSpecs = {
		name: name,
		address: address,
		zip: zip,
		age: age
	};
	console.log(userSpecs);

	});
});

    