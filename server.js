const express = require('express'); //Importing the library

const app = express(); //Using the library

app.listen(3000,()=>{console.log("listening...")}); //Listen

app.get('/',(req,res)=>{res.send("Hello")}); //Respond