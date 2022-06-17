const express = require('express'); //Importing the library
const https = require('https');
const port = 6379;
const app = express(); // Using the library
const fs = require('fs');
const md5 = require('md5'); // Importing the library
const bodyParser = require('body-parser'); // Middleware
const {createClient} = require('redis');
const redisClient = createClient(
{
    url: 'redis://default:@10.128.0.2:6379',
}
); // This creates a connection to the redis database

app.use(bodyParser.json()); // Using the middleware (call it before anything else happens on each request)

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
    passphrase: 'P@ssw0rd',
}, app).listen(port, async ()=>{
    await redisClient.connect();
    console.log("Listening on port: "+port);
});


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

const signup = async (request, response)=>{
    const plainTextPassword = request.body.password; // No need to request it in plain text but it shows story
    const newHashedPassword = md5(plainTextPassword);
    await redisClient.hSet('credentials', request.body.userName, newHashedPassword);
    response.status(200);
    response.send({result:"Saved"});
    console.log("Request Body",JSON.stringify(request.body));
}

app.get('/',(request,response)=>{ // Every time something calls your API that is a request
    response.send("Hello"); // A response is when the API gives the information requested
})

app.post('/login',validatePassword);

app.post('/signup',signup)
