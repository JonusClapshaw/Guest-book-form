import express from 'express';

//create an instance of an express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

// Create an array to store orders
const guestEntries = [];

const now = new Date();
const formattedTime = now.toLocaleString();

//Define the port number where our server will listen 
const PORT = 3003;

app.set ('view engine', 'ejs');

// Allow the app to parse form data
app.use(express.urlencoded({ extended: true }));

//Define a default "route" ('/')
//req: contains information about the incoming request
//res: allows us to send back a response to the client
app.get('/' , (req, res) => {
    res.render('resume');
})

app.get('/form', (req, res) => {
    res.render('home');
})

app.get('/confirm', (req, res) => {
    res.render('confirmation');
});

app.get('/admin', (req, res) => {
    res.render('admin', {guestEntries});
})

app.post('/return' , (req, res) => {
    res.render('home');
})

// Define a submit route
app.post('/submit-order', (req, res) => {

    const guestEntry = {
        fname: req.body.fname,
        lname: req.body.lname,
        jtitle: req.body.jtitle,
        company: req.body.company,
        linkedin: req.body.linkedin,
        email: req.body.email,
        meet: req.body.meet,
        other: req.body.other,
        message: req.body.message,
        mailingList: req.body.mailingList,
        method: req.body.method,
        time: formattedTime
    };

    guestEntries.push(guestEntry);
    console.log(guestEntries);

    res.render('confirmation', {guestEntry});
})

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http:localhost:${PORT}`);
})