class BoggleGame {
	constructor(secs = 60) {
		this.secs = secs;
		this.score = 0;
		this.words = new Set();

		$('.guess-word').on('submit', this.handleSubmit.bind(this)); // handleSubmit needs to be bound to this otherwise evt will not work properly

		this.timer = setInterval(this.countdown.bind(this), 1000); // countdown needs to be bound to this otherwise it will not work properly
	}

	// Separate score tracking into its own method
	getScore(word) {
		this.score += word.length;
	}

	// Select score and append new score (separate into its own method)
	updateScore() {
		const $score = $('.score');
		$score.empty();
		$score.append(this.score);
	}

	updateWords(word) {
		this.words.add(word);
	}

	appendWord(word) {
		$('.used-words').append($('<li>', { text: word }));
	}

	// // Select results div, erase any previous messages and append new message (separate into its own method)
	showMsg(msg) {
		const $results = $('#results');
		$results.empty();
		$results.append(msg);
	}

	// When form is submitted, send word to server and display message back on page
	async handleSubmit(evt) {
		evt.preventDefault();
		const $word = $('input');
		let word = $word.val();

		// If no remaining time, return message
		if (this.secs === 0) {
			$('.guess-word')[0].reset();
			return this.showMsg("Sorry, the game's over. Better luck next time, cheater!");
		}

		// If word has already been guessed, return message
		if (this.words.has(word)) {
			$('.guess-word')[0].reset();
			return this.showMsg("You've already guessed that word, cheater!");
		}

		// Send word to server to be processed
		let response = await axios.get('/guess', { params: { word: word } });

		// Get result from server and use to create appropriate message. Increase score by word length if word exists and is on the board
		let res = response.data.result;
		if (res === 'ok') {
			this.showMsg(`Nice job, "${word}" is on the Boggle board!`);
			this.updateWords(word);
			this.appendWord(word);
			this.getScore(word);
			this.updateScore();
		} else if (res === 'not-on-board') {
			this.showMsg(`Sorry, "${word}" is not on the Boggle board.`);
		} else {
			this.showMsg(`Sorry, "${word}" is not a recognized word.`);
		}

		// Reset form after submission
		$('.guess-word')[0].reset();
	}

	// Append timer to DOM
	showTimer() {
		$('#secs').empty();
		$('#secs').append(this.secs);
	}

	// Set timer for 60 seconds. Once time has elapsed, don't allow further submissions
	async countdown() {
		this.secs--;
		this.showTimer();

		if (this.secs === 0) {
			clearInterval(this.timer);
			await this.getHighScore();
			this.showMsg("Time's up!");
		}
	}

	async getHighScore() {
		let response = await axios.post('/stats', { score: this.score });
	}
}

boggleGame = new BoggleGame();
