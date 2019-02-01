  $(".dogCard").hide();
  $("#map").hide();

  var params={};
  window.location.search
    .replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
      params[key] = value;
    }
  );
  // User Lat/Lng info for centering map 
  var userId = params.uid;
  var ulat = parseFloat(params.ulat);
  var ulng = parseFloat(params.ulng);
  var uluru = {lat: ulat, lng: ulng};

  // Object for dog locations
  var dogMapLoc = {};
  // Counter for dogMapLoc
  var dogMapCount = 0;
  // Dog name for Dog Map
  var dogMapName = "";

  var dlat;
  var dlng;
  var dluru;

  var map;
  
  function initialize() {
    // Google Maps function for Creating a Map
    var dogMap = {
      zoom: 8,
      center: uluru
    };
    map = new google.maps.Map(document.getElementById('map'), dogMap);
  };

  function addMarker(location, markName) {
    var marker = new google.maps.Marker({
      position: location,
      title: markName,
      Map: map,
      icon: "images/marker.png"
    });
    marker.setMap(map);
  }


  console.log(params);

	// 	// initialize firebase
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

  // Object for dog locations
  var dogMapLoc = {};
  // Counter for dogMapLoc
  var dogMapCount = 0;
  // Dog name for Dog Map
  var dogMapName = "";

  //pull information from the firebase 
  database.ref().once("child_added", function(snapshot) {
    let name = snapshot.child("name").val();
    let address = snapshot.child("address").val();
    let zip = snapshot.child("zip").val();
    let age = snapshot.child("age").val();
    ulat = snapshot.child("lat").val();
    ulng = snapshot.child("lng").val();
    // Convert array to string for use in queryURL
    var queryAge = "&age=" + age.join("&age=");
    // console.log(queryAge);
    let size = snapshot.child("size").val();
    // Convert array to string for use in queryURL
    var querySize = "&size=" + size.join("&size=");



  //allows any browser to view infoarmtion from the API
  var cors = "https://cors-anywhere.herokuapp.com/";


  // queryURL for Pet Finder API

  var queryURL = cors + "https://api.petfinder.com/pet.find?format=json&key=16c8fc98e1056d6d5326fcf959f61480&animal=dog&location=" + zip + queryAge + querySize;


  $.ajax({
          url: queryURL,
          method: 'GET',
      }).then(function(result) {
          // Show Dog Card
          $(".dogCard").show();
          //cl
          console.log(result);

          var dogElem = $(".dog-card")
          var dogPic = $(".dog-image")
          // Array fo all dog results
          var dogs = [];
          // Array for loved dogs
          var loved = [];
          var counter = 1;
          var j = 0 + counter

          // Pushes Pets to an array
          result.petfinder.pets.pet.forEach(pet => {
            dogs.push(pet);
          });

          // Specific dog variables 
          var dogName;
          var dogBreed;
          var dogAge;
          var dogSex;
          var dogSize;
          var dogImg;
          var dogZip;
          var dogPhone;

          // Iterates through the dogs array for displaying
          function renderDogs(j) {

              // Get dog name
              dogName = dogs[j].name["$t"];
              // Get Dog Breed
              if (typeof dogs[j].breeds.breed === "string") {
                dogBreed = dogs[j].breeds.breed["$t"];
              } else {
                for (var k=0; k < dogs[j].breeds.breed.length; k++) {
                  dogBreed = dogs[j].breeds.breed[k]["$t"];
                }
              }
              // Get dog age
              dogAge = dogs[j].age["$t"];
              // Get dog sex
              dogSex = dogs[j].sex["$t"];
              // Get dog size
              dogSize = dogs[j].size["$t"];
              // Get dog image if it exists
              if ($.isEmptyObject(dogs[j].media) ) {
                dogImg = "images/placeholder.png";
              } else {
                dogImg = dogs[j].media.photos.photo[2]["$t"];
              }
              // Get contact zip code
              dogZip = dogs[j].contact.zip["$t"];
              // Get contact phone # if it exists
              if ($.isEmptyObject(dogs[j].contact.phone)) {
                dogPhone = "";
              } else {
                dogPhone = dogs[j].contact.phone["$t"];
              }

              var dogElem = $(".dogCard");

              var info = $(".dog-info");

              // Display dog image
              $(".dog-image").attr("src", dogImg);

              // Display Dog name
              $(".dog-name").text(dogName);
              
              // Clear previous Info 
              info.empty();
              // Display dog info
              info.append("Age: " + dogAge + "<br/>").append("Sex: " + dogSex + "<br/>").append("Size: " + dogSize + "<br/>");

          };

          function renderLoves() {
            // Clears page
            $(".container").empty();
            $("#map").show();

            var lovedHeading = $("<h3>").text("Dogs You Loved:").addClass("text-center");

            $(".container").prepend("<br/>").append(lovedHeading);

            // Bootstrap row
            var row1 = $("<div>").attr("class","row");
            var row2 = $("<div>").attr("class","row");
            var row3 = $("<div>").attr("class","row");
            var row4 = $("<div>").attr("class","row");
            var row5 = $("<div>").attr("class","row");
            var row6 = $("<div>").attr("class","row");
            var row7 = $("<div>").attr("class","row");
            var row8 = $("<div>").attr("class","row");

            // Variable to help determine number of columns
            var colNum = 1;

            database.ref(userId + "/loved").on("value", function(result) {
              // Get unique userId for Loves
              keys = Object.keys(result.val())
              // For loop for displaying loved dogs
              for (var l=0; l < keys.length; l++) {
                // Bootstrap repeating column
                var col = $("<div>").attr("class", "col");
                // Variable for putting userId back into Database
                var resKey = result.val()[keys[l]];
                // Variables for dog info
                var name = resKey.name;
                dogMapName = name;
                var age = resKey.age;
                var sex = resKey.sex;
                var size = resKey.size;
                var image = resKey.image;
                var zip = resKey.zip;
                var phone = resKey.phone;
                // Dog info card div
                var card = $("<div>").attr("class", "card lovedBox");
                var cardBody = $("<div>").attr("class", "card-body");
                // Variables for dog info
                var img = $("<img>").attr("src", image).attr("class", "card-img-top").attr("alt", name);
                var showName = $("<h5>").attr("class", "card-title").text(name);
                var p = $("<p>").attr("class", "card-text");
                
                var showAge = "Age: " + age + "<br/>";
                var showSex = "Sex: " + sex + "<br/>";
                var showSize = "Size: " + size + "<br/>";
                var showPhone = "Contact: " + phone + "<br/>";
                var showZip = "Location: " + zip + "<br/>";
                var showInfo = p.append(showAge, showSex, showSize, showPhone, showZip);

                cardBody.append(showName, showInfo);
                card.append(img, cardBody);
                col.append(card);
               
               // Determines number of columns
                if (colNum <= 3) {
                  row1.append(col);
                  colNum++;
                  console.log(colNum);
                } else if (colNum > 3 && colNum <= 6) {
                  row2.append(col);
                  colNum++;
                  console.log(colNum);
                } else if (colNum > 6 && colNum <= 9) {
                  row3.append(col);
                  colNum++;
                  console.log(colNum);
                } else if (colNum > 9 && colNum <= 12) {
                  row4.append(col);
                  colNum++;
                  console.log(colNum);
                } else if (colNum > 12 && colNum <= 15) {
                  row5.append(col);
                  colNum++;
                  console.log(colNum);
                } else if (colNum > 15 && colNum <= 18) {
                  row6.append(col);
                  colNum++;
                  console.log(colNum);
                }
                 else if (colNum > 18 && colNum <= 21) {
                  row7.append(col);
                  colNum++;
                  console.log(colNum);
                }
                 else if (colNum > 21 && colNum <= 24) {
                  row8.append(col);
                  colNum++;
                  console.log(colNum);
                }
                // Google GeoCode AJAX call and object creation
                geoCodeDog(zip, dogMapName);
              }
              // Appends Bootstrap divs
              $(".container").append(row1, row2, row3, row4, row5, row6);
            })
          };

          function geoCodeDog(zip, dogMapName) {
            var mapKey = "AIzaSyBQs0I6hNyIg9gvfW1qpIGNykE03AuTCi4";
            // Get all zips and iterate through them
            var mapAddress = zip;
            var mapQuery = "https://maps.googleapis.com/maps/api/geocode/json?address=" + mapAddress +  "&key=" + mapKey;
            $.ajax({
                url: mapQuery,
                method: 'GET',
              }).then(function(res) {
                // Grab lat/long from result
                var lat = res.results[0].geometry.location.lat;
                var lng = res.results[0].geometry.location.lng;
                // Write lat/log to object with dog name for displaying in Google Map
                dogMapLoc[dogMapCount] = {"name": dogMapName, "dlat": lat, "dlng": lng};

                // Dog Locations for map markers

                dlat = parseFloat(dogMapLoc[dogMapCount].dlat);
                dlng = parseFloat(dogMapLoc[dogMapCount].dlng);
                dluru = {lat: dlat, lng: dlng};
                addMarker(dluru, dogMapLoc[dogMapCount].name);
                dogMapCount++;
              })
          };

         // Initialize Dog render on page load
         renderDogs(counter);

         // Render dogs each time button is clicked
         $("#love-btn").on("click", function(event) { 
            event.preventDefault();
            // Save to database 
            console.log(j);
            // Checks if user has clicked through all results
            if (j <= 24) {
              renderDogs(j);
            } else {
              renderLoves();
            }

            database.ref(userId + "/loved").push({
              name: dogName,
              age: dogAge,
              sex: dogSex,
              size: dogSize,
              image: dogImg,
              zip: dogZip,
              phone: dogPhone
            });
            j++;
         })

         // Skips dog on click
         $("#skip-btn").on("click", function(event) { 
            event.preventDefault();
            console.log(j);
            if (j <= 24) {
              renderDogs(j);
            } else {
              renderLoves();
            }
            j++;
         })

         // Runs renderLoves when "Like" button is pressed
         $("#likesBtn").on("click", function() {
          renderLoves();
         })


     });
  }); 



