// Require express and create an instance of it
var express = require('express');
var app = express();

// on the request to root (localhost:3000/)
app.get('/', function (req, res) {
    readFile(req.query.url);
});

app.use(function(req, res, next) {
    res.status(404).send("Error.");
});

app.listen(9000, function () {
    console.log('Listening on port 9000.');
});