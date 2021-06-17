const $boggleForm = $('#boggle-form');

console.log($boggleForm);

$boggleForm.on('submit', async function(evt) {
	evt.preventDefault();
	$guess = $('input').val();

	let response = await axios.post('/', { $guess });
	console.log(response);
});
