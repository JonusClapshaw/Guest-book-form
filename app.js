import express from 'express';

//create an instance of an express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

// Allow the app to parse form data
app.use(express.urlencoded({ extended: true }));

// Create an array to store orders
const guestEntries = [];

//Define the port number where our server will listen 
const PORT = 3003;

//Define a default "route" ('/')
//req: contains information about the incoming request
//res: allows us to send back a response to the client
app.get('/', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
})

/*app.get('/return', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
})*/

// Define a submit route
app.post('/submit', (req, res) => {

    const guestEntry = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        linkedin: req.body.linkedin,
        mailingList: req.body.mailingList,
        message: req.body.message,
        method: req.body.method,
        other: req.body.other
    };

    guestEntries.push(guestEntry);

    res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
})


//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http:localhost:${PORT}`);
})