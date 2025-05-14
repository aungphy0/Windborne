const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {

	res.send('Voice AI backend is running');
});


app.post('/api/message', async(req, res) => {
	const {message} = req.body;

	const response = 'You said: "${message}". This is a mock AI response.';

	res.json({reply: response });

});

app.get('/windborne/:jsonFile', async(req, res) => {
	const { jsonFile }  = req.params; 

	try{
	    const fetch = (await import('node-fetch')).default;
		const url = `https://a.windbornesystems.com/treasure/${jsonFile}.json`;
	    const result = await fetch(url);

		if(!result.ok){
			throw new Error(`Failed to fetch ${url} - Status: ${result.status}`);
		}

        const json = await result.json();
        res.json(json);
	}
	catch(err){
	    console.error(err);
        res.status(500).send('Failed to fetch from Windborne');
    }

});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
