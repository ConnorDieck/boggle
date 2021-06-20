const $boggleForm = $('.guess-word');

$score = $('.score');
let score = 0;
let highscore = 0;
$score.append(score);

$timer = $('#secs');
let secs = 10;

// When form is submitted, send word to server and display message back on page
$boggleForm.on('submit', async function(evt) {
	evt.preventDefault();
	$word = $('input');
	word = $word.val();

	if (secs === 0) {
		return alert("Sorry, there's no more time!");
	}

	// Send word to server to be processed
	let response = await axios.get('/guess', { params: { word: word } });

	// Get result from server and use to create appropriate message. Increase score by word length if word exists and is on the board
	let res = response.data.result;
	let msg = '';
	if (res === 'ok') {
		msg = `Nice job, "${word}" is worth ${word.length} points!`;
		score += word.length;
	} else if (res === 'not-on-board') {
		msg = `Sorry, "${word}" is not on the Boggle board.`;
	} else {
		msg = `Sorry, "${word}" is not a recognized word.`;
	}

	// Select results div, erase any previous messages and append new message
	$results = $('#results');
	$results.empty();
	$results.append(msg);

	// Select score and append new score
	$score.empty();
	$score.append(score);

	// Reset form after submission
	$boggleForm[0].reset();
});

// Set timer for 60 seconds. Once time has elapsed, don't allow further submissions
$(document).ready(function() {
	$timer.append(secs);
	let id = setInterval(async function() {
		secs--;
		$timer.empty();
		$timer.append(secs);
		if (secs === 0) {
			clearInterval(id);

			let response = await axios.post('/stats', { score: score });

			console.log(response);

			highscore = response.data.highscore;

			alert("Time's up!");
		}
	}, 1000);
});
