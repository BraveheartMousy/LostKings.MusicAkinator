let urlDev = 'http://localhost:5000/api/audio/search'
let totalAttempt = 5;
let attemptNumber = 0;
let gameNumber = 1;
let scoreAkinator = 0;
let scoreUser = 0;
let results = []

$(document).ready(function(){
	$("#totalAttemptNumber").text(totalAttempt);
	updateScoreHTML();

	$("#inputSongText").submit(function( event ) {
		$.ajax({
			url: urlDev,
			type: 'GET',
			contentType: "application/json",
			crossDomain: true,		
			success: function (result) {
				showGuessForm(result);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				errorAlert(xhr, thrownError);
			}
		});
		event.preventDefault();
	  });
});

function errorAlert(xhr, thrownError) {
	if (xhr.status === 429) {
		alert("Too many requests in 5 seconds!");
	} else {
		alert("Status: " + xhr.status + "\nError: "+ thrownError);
	}
}

function showGuessForm(result) {
	// console.log(result);
	results.push(result);
	attemptNumber++;
	updateScoreHTML();
	// toDo update html with real results
	$('#inputTextSong, #raundResult, #gameResult').hide();
	$('#suggestedSong').show();
	$('#SongTextInput').val("");
}

function updateScoreHTML(){
	$("#attemptNumber").text(attemptNumber);
	$("#gameNumber").text(gameNumber);
	$("#scoreAkinator").text(scoreAkinator);
	$("#scoreUser").text(scoreUser);
}

// pressed Yes
function songGuessed() {
	scoreAkinator++;
	showRaundResultForm();
}

// pressed No
function nextAttempt() {
	if (attemptNumber < totalAttempt) {
		showGuessForm();
	} else {
		scoreUser++;
		showRaundResultForm();
	}
}

function showRaundResultForm() {
	updateScoreHTML();
	$('#inputTextSong, #suggestedSong, #gameResult').hide();
	$('#raundResult').show(); 

}

function showGameResult() {
	$('#inputTextSong, #suggestedSong, #raundResult').hide();
	$('#gameResult').show(); 
}

function newRaund() {
	attemptNumber = 0;
	gameNumber++;
	updateScoreHTML();
	$('#suggestedSong, #raundResult, #gameResult').hide();
	$('#inputTextSong').show(); 
}

function resetGameValues() {
	attemptNumber = 0;
	gameNumber = 1;
	scoreAkinator = 0;
	scoreUser = 0;
	results = []
}

function newGame() {
	resetGameValues();
	updateScoreHTML();
	$('#suggestedSong, #raundResult, #gameResult').hide();
	$('#inputTextSong').show(); 
}