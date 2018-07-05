$(document).ready(function() {


console.log("all is working")


// Initialize Firebase
var config = {
  apiKey: "AIzaSyAlY2ApfSLiK8mJv5WaExn7PtyHtqElhEQ",
  authDomain: "trainhw-fcfd2.firebaseapp.com",
  databaseURL: "https://trainhw-fcfd2.firebaseio.com",
  projectId: "trainhw-fcfd2",
  storageBucket: "trainhw-fcfd2.appspot.com",
  messagingSenderId: "255743728677"
};
firebase.initializeApp(config);

var trainData = firebase.database();

var trainName = "";
var destination = "";
var trainTime = "";
var frequency = "";

$(".train-submit").on("click", function(e) {
  e.preventDefault();
  // console.log("This button has been pressed");

  trainName = $("#train-name").val().trim();
  
  destination = $("#destination").val().trim();
 
  trainTime = $("#train-time").val().trim();
  
  frequency = $("#frequency").val().trim();

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");




  //.set replaces data .push adds information
  firebase.database().ref().push({
    trainName: trainName,
    destination: destination,
    trainTime: trainTime,
    frequency: frequency,
    //Firebase method which timestamps data
    dateAdded: firebase.database.ServerValue.TIMESTAMP

  })
  
})


firebase.database().ref().on("child_added", function(childSnapshot, prevChildKey){

  var tName = childSnapshot.val().trainName;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().trainTime;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment().format(), "minutes");
    // console.log(moment.duration(tMinutes, "minutes").format("h:mm"));

  } else {

    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    // To calculate the arrival time, add the tMinutes to the current time
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  // Add each train's data into the table
  // $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
  //         tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
 
  // $(".inputData").append("<tr>");
  

  $(".inputData").append("<tr><td>" + tName+ "</td>" + "<td>" + tDestination+ "</td>" + "<td>" + tFrequency+ "</td>" + "<td>" + tArrival + "</td>" + "<td>" + tMinutes + "</td></tr>");
  // $(".inputData").append("<td>" + snapshot.val().destination+ "</td>");
  // $(".inputData").append("<td>" + snapshot.val().trainTime+ "</td>");
  // $(".inputData").append("<td>" + snapshot.val().frequency+ "</td>");
 
})

//firebase.database().ref().on("value", function(snapshot)
//firebase.database().ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) (Orders all of the keys by their roperty date added determined by the timestamp of the server and will only grab the last one)

// firebase.database().ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
//   $("#trainNameDisplay").html(snapshot.val().trainName);
//   $("#destinationDisplay").html(snapshot.val().destination);
//   $("#trainTimeDisplay").html(snapshot.val().trainTime);
//   $("#frequencyDisplay").html(snapshot.val().frequency);

// })




})