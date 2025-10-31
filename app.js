import express from 'express';

//create an instance of an express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

// Create an array to store orders
const guestEntries = [];

//Define the port number where our server will listen 
const PORT = 3003;

app.set ('view engine', 'ejs');

// Allow the app to parse form data
app.use(express.urlencoded({ extended: true }));

//Define a default "route" ('/')
//req: contains information about the incoming request
//res: allows us to send back a response to the client
app.get('/', (req, res) => {
    res.sendFile('home');
})

app.get('/confirm', (req, res) => {
    res.render('confirmation');
});

app.get('/admin', (req, res) => {
    res.sendFile('admin');
})

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
    console.log(guestEntries);

    res.sendFile('confirmation', {guestEntry});
})

app.post('/return', (req, res) => {
    res.sendFile('home');
})

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http:localhost:${PORT}`);
})