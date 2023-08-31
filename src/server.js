var express = require('express')
var app = express()
const PORT = 9009

app.get('/', function (req, res) {
    readFile(req.query.url)
});

app.get('/logged', function (req, res) {
    res.send("Logged-in!")
});

app.use(function(req, res, next) {
    res.status(404).send("Error.")
});

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}.`)
});