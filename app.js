import express from 'express';

//create an instance of an express application
const app = express();

// Allow the app to parse form data
app.use(express.urlencoded({ extended: true }));

// Create an array to store orders
const orders = [];

// Enable static file serving
app.use(express.static('public'));

//Define the port number where our server will listen 
const PORT = 3003;

//Define a default "route" ('/')
//req: contains information about the incoming request
//res: allows us to send back a response to the client
app.get('/', (req, res) => {
    //res.send('Welcome to ice cream!');
    res.sendFile(`${import.meta.dirname}/views/home.html`);
})

// Define a submit route
app.post('/submit', (req, res) => {
    console.log(req.body);

    const guestEntry = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }

    //res.sendFile(`${import.meta.dirname}/views/submit.html`);
})

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http:localhost:${PORT}`);
})