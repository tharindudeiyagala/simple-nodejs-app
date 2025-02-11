const express = require('express');
const app = express();
const request = require('request');
const wikip = require('wiki-infobox-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load the appropriate environment file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Configure database connection based on environment variables
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Create a MySQL connection
const connection = mysql.createConnection(dbConfig);

// Attempt to connect to the database and check if it is successful
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        dbStatus = 'Failed to connect to the database';
    } else {
        console.log('Connected to the database');
        dbStatus = 'Successfully connected to the database';
    }
});

// ejs setup
app.set("view engine", 'ejs');

// Route to render the UI and show DB connection status and environment
app.get('/', (req, res) => {
    const environment = process.env.NODE_ENV; // Get current environment (development or production)
    res.render('index', {
        dbStatus: dbStatus, // Pass DB connection status to the view
        environment: environment // Pass environment (dev/prod) to the view
    });
});

app.get('/index', (req, response) => {
    let url = "https://en.wikipedia.org/w/api.php";
    let params = {
        action: "opensearch",
        search: req.query.person,
        limit: "1",
        namespace: "0",
        format: "json"
    };

    url = url + "?";
    Object.keys(params).forEach((key) => {
        url += '&' + key + '=' + params[key];
    });

    // Get Wikipedia search string
    request(url, (err, res, body) => {
        if (err) {
            response.redirect('404');
        }
        result = JSON.parse(body);
        x = result[3][0];
        x = x.substring(30, x.length);
        // Get Wikipedia JSON
        wikip(x, (err, final) => {
            if (err) {
                response.redirect('404');
            } else {
                const answers = final;
                response.send(answers);
            }
        });
    });
});

// Port
app.listen(3000, console.log("Listening at port 3000..."));


