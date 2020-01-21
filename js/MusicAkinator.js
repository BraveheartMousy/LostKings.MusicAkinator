let host = 'http://localhost:5000'
let totalAttempt = 5;
let attemptNumber = 0;
let gameNumber = 1;
let scoreAkinator = 0;
let scoreUser = 0;
let results = []

$(document).ready(function(){
	$("#totalAttemptNumber").text(totalAttempt);
	updateScoreHTML();

	$('#inputSongTextForm').submit(function() {
		// ToDo: add spiner for request executing
		// toDo: validatin of empty string in input
		let textSong = $('#songTextInput').val();
		$.ajax({
			url: host + '/api/audio/search',
			type: 'GET',
			contentType: "application/json",
			data: {
				songText: textSong
			},
			crossDomain: true,		
			success: function (result) {
				results.push(result['result']);
				showGuessForm();
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

function showGuessForm() {
	if(results[gameNumber-1].length > attemptNumber) {
		$('#songAuthor').text(results[gameNumber-1][attemptNumber].artist);
		$('#songTitle').text(results[gameNumber-1][attemptNumber].title);
		$('#audioUrl').attr("src", results[gameNumber-1][attemptNumber].previewLink);
		attemptNumber++;
		resetAudio();
	} else {
		// ToDo: add logic for less number of attempts
		alert(`I have just ${results[gameNumber-1].length} songs, so I lose`);
		showRaundResultForm();
	}
	updateScoreHTML();
	$('#inputSongTextForm, #raundResult, #gameResult').hide();
	$('#suggestedSong').show();
	$('#songTextInput').val("");
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
	resetAudio();
}

// pressed No
function nextAttempt() {
	if (attemptNumber < totalAttempt) {
		showGuessForm();
	} else {
		scoreUser++;
		showRaundResultForm();
	}
	resetAudio();
}

function showRaundResultForm() {
	updateScoreHTML();
	$('#inputSongTextForm, #suggestedSong, #gameResult').hide();
	$('#raundResult').show(); 

}

function showGameResult() {
	$('#inputSongTextForm, #suggestedSong, #raundResult').hide();
	$('#gameResult').show(); 
}

function newRaund() {
	attemptNumber = 0;
	gameNumber++;
	updateScoreHTML();
	$('#suggestedSong, #raundResult, #gameResult').hide();
	$('#inputSongTextForm').show(); 
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
	$('#inputSongTextForm').show(); 
}

function resetAudio(){
	let audio = $("#player");
	audio[0].pause();
	audio[0].load();
}