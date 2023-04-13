const Joi = require('joi');//load joi module - returns class
//load express module
const express = require('express') //returns function

const app = express()//returns object type Express, name it app because convention
const courses = require('./routes/courses_db')



//app.use(courses)
app.use('/api/courses', courses)//for any
//routes that start with api/courses, use courses router

//need to enable parsing json objects 
// in body of requests
app.use(express.json());



//define route
//scpecify route-url
//callback fnc - route handler
app.get('/', (req, res) => {
    res.send('hello worldddd')
}) //second arg is callback function - ROUTE HANDLER

//query string parameters - in url after ? 


app.get('/api/posts/:year/:month', (req, res) => { //parameter defined by : and parameter name
    res.send(req.query)
})

//PORT
console.log("process.env ", process.env)
const port = process.env.PORT || 3000 // global object process, property env - environment variable, PORT - is used if it is set otherwise 3000
app.listen(port, () => { console.log('listening on port ' + port) }) //fnc when apps starts listening on given port

