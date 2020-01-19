let userAnswers = [];
// let urlDev = 'http://localhost:57181/api/audio/search'
let urlDev = 'http://localhost:5000/api/audio/search'

$(document).ready(function(){
$("#inputSongText").submit(function( event ) {
	userAnswers = [];
	$.ajax({
		url: urlDev,
		type: 'GET',
		contentType: "application/json",
		crossDomain: true,		
		success: function (result) {
			//alert(result);
			showSecondForm(result);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			errorAlert(xhr, thrownError);
		}
	});
	event.preventDefault();
  });

function errorAlert(xhr, thrownError) {
	if (xhr.status === 429) {
		alert("Too many requests in 5 seconds!");
	} else {
		alert("Status: " + xhr.status + "\nError: "+ thrownError);
	}
}

function showSecondForm(result) {
	console.log(result);
	$('#inputTextSong, #form3').hide();
	$('#suggestedSong').show();
}
});

