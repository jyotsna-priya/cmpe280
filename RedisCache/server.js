const express = require('express')
const redis = require('redis');
var bodyParser = require("body-parser");

// create express application instance
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
// create and connect redis client to local instance.
const client = redis.createClient({host : 'localhost', port : 6379})
 
// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
});
 
// api to store values in the redis cache
app.post('/putItems', function(req, res) {
    console.log(JSON.stringify(req.body));
    var dataKey = req.body.redisKey;
    var dataVal = req.body.redisValue;
    client.set(dataKey, dataVal, (err, response) => {
        if(err){
            return response.json(error.toString())
        }
        else {
            return res.json({key: dataKey, value: dataVal});
        }
    })
})

// api to get values from the redis cache
app.get('/getItems', function(req, res) {
    client.get(req.query.key, (err, response) => {
        if(err) {
            return response.json(error.toString());
        }
        else {
            return res.json({key: req.query.key, value: response})
        }
    })
})
 
// start express server at 3000 port
app.listen(3000, () => {
    console.log('Server listening on port: ', 3000)
});