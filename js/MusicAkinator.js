let host = 'https://music-akinator.herokuapp.com'
let totalAttempt = 5;
let attemptNumber = 0;
let gameNumber = 1;
let scoreAkinator = 0;
let scoreUser = 0;
let results = [];
let suggestedSongs = [];
let textRequests = [];

$(document).ready(function(){
	$("#totalAttemptNumber").text(totalAttempt);
	updateScoreHTML();

	$('#inputSongTextForm').submit(function() {
		// ToDo: add spiner for request executing
		let textSong = $('#songTextInput').val().trim();
		if (textSong === '') { 
			$('#errorInput').text('Please, enter song text!');
		} else {
			$('#errorInput').text('');
			textRequests.push(textSong);
			$.ajax({
				url: host + '/api/audio/search',
				type: 'GET',
				contentType: "application/json",
				data: {
					songText: textSong
				},
				crossDomain: true,		
				success: function (result, textStatus, xhr) {

					if (xhr.status === 200) {
						results.push(result['result']);
						suggestedSongs.push([]);
						showGuessForm();
					} else if (xhr.status === 204) {
						results.push({comment: 'No ideas'});
						scoreUser++;
						suggestedSongs.push([]);
						$('#whoIsWinner').text(`You win! I have any ideas`);
						showRoundResultForm();
					} else {
						$('#gameAdditionalText').text('Ups... Something went wrong, I must finish the game');
						showGameResult();
						console.log('error');
					}
					// Todo: to check error handling
				},
				error: function (xhr, ajaxOptions, thrownError) {
					errorAlert(xhr, thrownError);
				}
			});
		}
		$('#songTextInput').val('');
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
		suggestedSongs[gameNumber-1].push(results[gameNumber-1][attemptNumber]);
		console.log(suggestedSongs);
		$('#songAuthor').text(results[gameNumber-1][attemptNumber].artist);
		$('#songTitle').text(results[gameNumber-1][attemptNumber].title);
		$('#audioUrl').attr("src", results[gameNumber-1][attemptNumber].previewLink);
		attemptNumber++;
		$('#inputSongTextForm, #roundResult, #gameResult').hide();
		$('#suggestedSong').show();
	} else {
		// ToDo: check logic for less number of attempts
		scoreUser++;
		$('#whoIsWinner').text(`You win this round! I have no more ideas`);
		showRoundResultForm();
	}
	updateScoreHTML();
	resetAudio();
}

function updateScoreHTML(){
	$("#attemptNumber").text(attemptNumber);
	$("#gameNumber").text(gameNumber);
	$("#scoreAkinator").text(scoreAkinator);
	$("#scoreUser").text(scoreUser);
}

// pressed Yes
function songGuessed() {
	$('#whoIsWinner').text('You win this round!');
	scoreAkinator++;
	console.log(gameNumber-1, attemptNumber-1)
	suggestedSongs[gameNumber-1][attemptNumber-1].isTrueSong = true;
	showRoundResultForm();
	resetAudio();
}

// pressed No
function nextAttempt() {
	console.log(gameNumber-1, attemptNumber-1)
	suggestedSongs[gameNumber-1][attemptNumber-1].isTrueSong = false;
	if (attemptNumber < totalAttempt) {
		showGuessForm();
	} else {
		$('#whoIsWinner').text('I win this round!');
		scoreUser++;
		showRoundResultForm();
	}
	resetAudio();
}

function showRoundResultForm() {
	updateScoreHTML();
	let roundHtml = '';
	console.log(suggestedSongs);
	if (suggestedSongs[gameNumber-1].length !== 0) {
		roundHtml += '<ol>';
		for(let i = 0; i < suggestedSongs[gameNumber-1].length; i++) {
			roundHtml += `<li>${suggestedSongs[gameNumber-1][i].artist} - ${suggestedSongs[gameNumber-1][i].title}</li>`;
		}
		roundHtml += '</ol>';
	} else {
		roundHtml += '<p>No songs</p>';
	}
	console.log(roundHtml);
	$('#roundSongList').html(roundHtml);
	$('#inputSongTextForm, #suggestedSong, #gameResult').hide();
	$('#roundResult').show(); 
	$('#songTextInput').val("");
}

function showGameResult() {
	let gameHtml = '<ol>';
	for (let j = 0; j < suggestedSongs.length; j++) {
		gameHtml += '<li>';
		if (suggestedSongs[j].length === 0) {
			gameHtml += `Round ${j+1}: no songs`;
		} else {
			gameHtml += `Round ${j+1}:<ol>`;
			if (suggestedSongs[j]) {
				for(let i = 0; i < suggestedSongs[j].length; i++) {
					gameHtml += `<li>${suggestedSongs[j][i].artist} - ${suggestedSongs[j][i].title}</li>`;
				}
			} else {
				gameHtml += 'no songs';
			}
				gameHtml += '</ol>';
		}
		gameHtml += '</li>';
	}
	gameHtml += '</ol>';
	$('#gameSongList').html(gameHtml);

	if (scoreAkinator < scoreUser) {
		$('#gameAdditionalText').text(`You are winner! Your score is ${scoreUser}`);
	} else if (scoreAkinator > scoreUser) {
		$('#gameAdditionalText').text(`Akinator is winner! His score is ${scoreAkinator}`);
	} else {
		$('#gameAdditionalText').text(`Friendship won the game!`);
	}

	$('#songTextInput').val("");
	$('#inputSongTextForm, #suggestedSong, #roundResult').hide();
	$('#gameResult').show(); 
}

function newRound() {
	attemptNumber = 0;
	gameNumber++;
	updateScoreHTML();
	$('#roundAdditionalText').text('');
	$('#suggestedSong, #roundResult, #gameResult').hide();
	$('#inputSongTextForm').show(); 
}

function resetGameValues() {
	attemptNumber = 0;
	gameNumber = 1;
	scoreAkinator = 0;
	scoreUser = 0;
	results = [];
	suggestedSongs = [];
	textRequests = [];
	$('#gameAdditionalText').text('');
}

function newGame() {
	resetGameValues();
	updateScoreHTML();
	$('#suggestedSong, #roundResult, #gameResult').hide();
	$('#inputSongTextForm').show(); 
}

function resetAudio(){
	let audio = $("#player");
	audio[0].pause();
	audio[0].load();
}
