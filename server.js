const express = require('express'); //Importing the library
const bodyParser = require('body-parser'); //Middleware
const port = 3000;
const md5 = require('md5');
const app = express(); //Using the library
const redis = require('redis');

const redisClient = redis.createClient();

app.use(bodyParser.json()); //Using the middleware

app.listen(port, ()=>{
    console.log("listening on port: "+port)
})

app.post('/login',async (request, response) =>{

    const hashedPassword = md5(request.body.password);
    const password = await redisClient.hGet('credentials', request.body.userName);
    const loginRequest = request.body;
    console.log("Request body", JSON.stringify(request.body));
    //Search database for username, and retrieve current password

    //Compared the hashed version of the password that has sent with the hashed version from the database
    if (loginRequest.userName == "tiyiwe2325@reimondo.com" && loginRequest.password == "Password1"){
        response.status(200); //200 means ok
        response.send("Welcome buddy");
    } else {
        response.status(401); //400 means unauthorized
        response.send("Unauthorized ma fren");
    }
});

app.get('/',(request, response) => response.send("Hello"));