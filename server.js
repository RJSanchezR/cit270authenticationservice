const express = require('express'); //Importing the library

const port = 3000;
const app = express(); // Using the library
const md5 = require('md5'); // Importing the library
const bodyParser = require('body-parser'); // Middleware
const {createClient} = require('redis');
const redisClient = createClient(
{
    socket:{
        port:6379,
        host:"127.0.0.1",
    }
}
); // This creates a connection to the redis database
redisClient.connect();

app.use(bodyParser.json()); // Using the middleware (call it before anything else happens on each request)

app.listen(port, ()=>{
    console.log("Listening on port: "+port);
})

const validatePassword = async (request, response)=>{
    //await redisClient.connect(); // Creating a TCP socket with Redis
    const requestHashedPassword = md5(request.body.password);
    const redisHashedPassword = await redisClient.hmGet('credentials', request.body.userName); // Read password from Redis
    const loginRequest = request.body;
    console.log("Request Body",JSON.stringify(request.body)); // Search the database for username and retrieve current password

    // Compare the hashed version of the password that was sent with the hashed version from the database
    if(requestHashedPassword == redisHashedPassword){
        response.status(200); //200 means ok
        response.send("Welcome mijo");
    } else {
        response.status(401); //400 means unauthorized
        response.send("Unauthorized ma fren");
    }
}

app.get('/',(request,response)=>{ // Every time something calls your API that is a request
    response.send("Hello"); // A response is when the API gives the information requested
})

app.post('/login',validatePassword);