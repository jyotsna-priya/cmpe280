// imports
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const morgan = require('morgan')

const app = express();
const port = 5000;

// static files
// app.use(bodyParser.json());//allow access control
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '.');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//use body parser to parse JSON and urlencoded request body
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(cors());
// app.use(morgan('combined'))
app.use(morgan('short'))
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

// set templating engine
app.set('views', './views');
app.set('view engine', 'ejs');

// rendering spa_localstorage.js file
app.get('', (req, res) => {
    res.render('pages/healthcampspa', { title: 'Health Camp SPA'});
});

const connection = mysql.createConnection({
    port: '3306',
    host:'localhost',
    user:'jp',
    password:'password123',
    database:'HealthCampSpaDB',
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');
});

app.post('/DemographicsAPI', function(req, res) {
    const stmt = 'INSERT INTO hcspa_table (FirstName, LastName, Age, Gender, Notes, Photo) VALUES(?, ?, ?, ?, ?, ?)';
    const values = [req.body.fName, req.body.lName, req.body.age, req.body.gender, req.body.notes, req.body.photo];
    connection.query(stmt, values, (err, rows) => {
    if (err) {
     console.log(err.errno);
     console.log("DemographicsAPI Error!");
    }
    else {
 
      res.json({success: "User added", ID: rows.insertId});
      console.log(rows.insertId);
    }
    });
});
  
app.post('/HealthVitalsAPI', function(req, res) {
  const stmt = 'UPDATE hcspa_table set Height=?, Weight=?, Temperature=?, Pulse=?, BloodPressure=?, Medications=?, \
              MedicNotes=? WHERE ID=?';
  const values = [req.body.height, req.body.weight, req.body.BT, req.body.PR, req.body.BP, req.body.medications, 
              req.body.med_notes, req.body.id];
  connection.query(stmt, values, (err, result) => {
    if (err) {
      console.log(err.errno);
      console.log("HealthVitalsAPI Error!");
    }
    else {
      res.json({success: "User updated in DB"});
      // console.log(res);
    }
    });
  
});
  
app.get('/PrintReportAPI', (req, res) => {
connection.query("SELECT FirstName, LastName, Age, Gender, Photo, Medications, MedicNotes FROM hcspa_table", (error,rows,fields) => {
  res.send(JSON.stringify(rows));
});

});

app.post('/SendLocalToServerAPI', function(req, res) {
  const stmt = 'INSERT INTO hcspa_table (FirstName, LastName, Age, Gender, Notes, Photo, Height, Weight, Temperature,\
      Pulse, BloodPressure, Medications, MedicNotes) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [req.body.fName, req.body.lName, req.body.age, req.body.gender, req.body.notes, req.body.photo,
    req.body.height, req.body.weight, req.body.BT, req.body.PR, req.body.BP, req.body.medications, req.body.med_notes];
  connection.query(stmt, values, (err, rows) => {
  if (err) {
    console.log(err.errno);
    console.log("Error in SendLocalToServerAPI!");
  }
  });
});

// listening on the given port
app.listen(port, () => console.info(`Listening on port ${port}`));

