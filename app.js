import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

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

const pool = mysql2.createPool({
    // These values come from the .env file
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT


}).promise();

app.set ('view engine', 'ejs');

// Allow the app to parse form data
app.use(express.urlencoded({ extended: true }));

app.get('/db-test', async(req, res) => {


    // try/catch block for error handling
    try {
        const [orders] = await pool.query('SELECT * FROM guest_book ORDER BY timestamp DESC');
        // Send the orders data back to the browser as JSON
        res.send(orders);
    } catch(err) {
        // If ANY error happened in the 'try' block, this code runs
        // Log the error to the server console (for developers to see)
        console.error('Database error:', err);

        // Send an error response to the browser
        // status(500) means "Internal Server Error"
        res.status(500).send('Database error: ' + err.message);
    }
});

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

app.get('/admin', async(req, res) => {

    try {
        // Fetch all orders from the database, newest first
        const [contacts] = await pool.query('SELECT * FROM guest_book ORDER BY timestamp DESC');

        // Optional: Format timestamps for better display
        contacts.forEach(contact => {
            contact.formattedTimestamp = new Date(contact.timestamp).toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        });

        // Render the admin page with the orders
        res.render('admin', { orders: contacts });

    } catch(err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

app.post('/return' , (req, res) => {
    res.render('home');
})

// Define a submit route
/*app.post('/submit-order', (req, res) => {

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
})*/

// Add a route for the form submission
// This handles POST requests to /submit-order (when the user submits the pizza order form)
app.post('/submit-order', async(req, res) => {
    // Wrap everything in try/catch to handle potential database errors
    try {
        // Get the order data from the form submission
        // req.body contains all the form fields (fname, lname, email, etc.)
        const contact = req.body;

        // Convert the toppings array into a comma-separated string
        // HTML checkboxes submit as an array, but MySQL stores as TEXT
        contact.toppings = Array.isArray(contact.toppings) ? 
	    contact.toppings.join(", ") : "";

        // Add a timestamp to track when this order was placed
        contact.timestamp = new Date();
        // Log the order to the server console (helpful for debugging)
        console.log('New order received:', contact);

        // Define an SQL INSERT query
        // The ? are PLACEHOLDERS that will be replaced with actual values
        // This prevents SQL injection (a common security vulnerability)

        const sql = `INSERT INTO guest_book (fname, lname, jtitle, company, linkedin, email, meet, other, message, mailingList, method, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Create an array of parameters for each ? placeholder in order
        const guestEntry = [
            contact.fname,
            contact.lname,
            contact.jtitle,
            contact.company,
            contact.linkedin,
            contact.email,
            contact.meet,
            contact.other,
            contact.message,
            contact.mailingList,
            contact.method,
            formattedTime
        ];

        // Execute the query with the parameters
        const [result] = await pool.execute(sql, params);

        // Optional: You can access the newly inserted row's ID
        console.log('Order inserted with ID:', result.insertId);

        // Pass the order data to the confirmation page 
        res.render('confirmation', { order: order });

    } catch(err) {

        // If ANYTHING goes wrong, this runs
        console.error('Error inserting order:', err);

        // Check if it's a duplicate email error
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).send('An order with this email already exists.');
        } else {
            // Generic error message for other issues
            res.status(500).send('Sorry, there was an error processing your order. Please try again.');
        }
    }
});

//Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http:localhost:${PORT}`);
})