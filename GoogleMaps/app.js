const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

var path = require('path');
const app = express();
const port = process.env.PORT || 5555;

// app.use(morgan('combined'));
app.use(morgan('short'));

app.use(express.static('public'));
app.use('/data', express.static(__dirname + '/public/data'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('maps');
}) 

var filepath = 'public/data/data.json';
app.get('/map', (req, res) => {
    let locationData = fs.readFileSync(filepath);
    let data = JSON.parse(locationData);
    console.log(data);
    console.log(JSON.stringify(data));
    res.send(JSON.stringify(data));
})

app.listen(port, function() {
    console.log('Server running on port: ' + port);
 });