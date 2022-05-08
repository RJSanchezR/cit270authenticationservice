const express = require('express'); //Importing the library
const bodyParser = require('body-parser'); //Middleware
const port = 3000;
const app = express(); //Using the library

app.use(bodyParser.json()); //Using the middleware

app.listen(port, ()=>{
    console.log("listening on port: "+port)
})

app.post('/login', (request, response) =>{
    const loginRequest = request.body;
    if (loginRequest.userName == "tiyiwe2325@reimondo.com" && loginRequest.password == "MiPassword1!"){
        response.status(200);
        response.send("Welcome buddy");
    } else {
        response.status(401);
        response.send("Unauthorized ma fren");
    }
});

app.get('/',(request, response) => response.send("Hello"));