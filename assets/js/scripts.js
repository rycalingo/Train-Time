// Scripts

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDVvxCYLYSscytXs9zUCkKYV5Eyq8No0c8",
	authDomain: "train-time-f5787.firebaseapp.com",
	databaseURL: "https://train-time-f5787.firebaseio.com",
	projectId: "train-time-f5787",
	storageBucket: "",
	messagingSenderId: "205504872898"
};
firebase.initializeApp(config);


var database = firebase.database();

var trainName, trainDestination, trainFrequency, nextArrival, minsAway;

function addTrain() {

	var newTrain = {
	    train: $("#train-name").val().trim(),
	    dest: $("#dest").val().trim(),
	    firstTrain: $("#first-train").val().trim(),
	   	frequency: $("#freq").val().trim()
	}
	return newTrain;
};

$("#submit").on("click", function(event) {
	event.preventDefault();

	database.ref().push(addTrain());
	$(".field").val("");
});
database.ref().on("child_added", function(snapshot) {
	var data = snapshot.val();

	for( var key in data ){

		console.log(key + ": " + data[key]);

	};
	var timeArrival = calTimes(data.firstTrain, data.frequency);
	var newRow = "<tr>" +
				 "<td>" + data.train + "</td>" + 
				 "<td>" + data.dest + "</td>" + 
				 "<td>" + data.frequency + "</td>" +
				 "<td>" + timeArrival.arr + "</td>" +
				 "<td>" + timeArrival.mins + "</td>"
				 "</tr>";

	$("tbody").append(newRow);


});

function calTimes(start, freq) {
	var format = "HH:mm";
	// current time
	var now = moment();
	// start time
	var s = moment(start, format);
	// frequency
	var f = freq;

	var diff = moment().diff(moment(s), "minutes");

	var minsAway = f - diff % f;

	var arr = moment().add(minsAway, "minutes");

	var results = "start: " + s.format(format) + ", now: " + now.format(format) + ", diff: " + diff + ", freq: " + f;

	var data = {arr: arr.format('hh:mma'), mins: minsAway}

	console.log(results);

	return data;
}