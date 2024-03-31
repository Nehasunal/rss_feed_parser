// importing packages
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');


// middlewares
app.use(express.json());
app.use(cors());


// adding routes
app.use('/api', routes);

app.get('/', (req, res) => {
	res.json('Welcome to the API');
});


// port
const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on Port: ${port}`));