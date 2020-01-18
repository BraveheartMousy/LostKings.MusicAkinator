var userAnswers = [];
function start() {
	userAnswers = [];
	$.ajax({
		url: 'http://localhost:57181/api/audio/search',
		type: 'GET',
		contentType: "application/json",
		crossDomain: true,		
		success: function (result) {
			alert(result);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			errorAlert(xhr, thrownError);
		}
	});
}

function errorAlert(xhr, thrownError) {
	if (xhr.status === 429) {
		alert("Too many requests in 5 seconds!");
	} else {
		alert("Status: " + xhr.status + "\nError: "+ thrownError);
	}
}
