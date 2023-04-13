const Joi = require('joi');//load joi module - returns class
//load express module
const express = require('express') //returns function
const router = express.Router();


//need to enable parsing json objects 
// in body of requests
router.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' },
]

router.get('/', (req, res) => {
    res.send(courses)
})
//java programing  
router.get('/:id', (req, res) => { //parameter defined by : and parameter name

    const course = courses.find(({ id }) => { return id == req.params.id })
    if (!course) { //404
        res.status(404).send('The course with the given id was not found')
    } else { res.send(course) }
})

router.post('/', (req, res) => {

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    const result = schema.validate(req.body)
    console.log(result)
    if (result.error) {
        //400 restful convention - Bad request
        res.status(400).send(result.error.details.map((detail) => { return detail.message }))
        return
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course)
})

router.put('/:id', (req, res) => {
    //look up the course
    //if not exist return 404 resource not found
    const course = courses.find(({ id }) => { return id == req.params.id })
    if (!course) { //404
        res.status(404).send('The course with the given id was not found')
        return;
    }

    //validate
    //not valid - 400 - bad request
    const result = validateCourse(req.body)
    if (result.error) {
        res.status(400).send(result.error.details.map((detail) => { return detail.message }))
        return;
    }

    //update course
    //return the updated course
    course.name = req.body.name;
    res.send(course)
})

router.delete('/:id', (req, res) => {
    //look up the course
    //if not exist return 404 resource not found
    const course = courses.find(({ id }) => { return id == req.params.id })
    if (!course) { //404
        res.status(404).send('The course with the given id was not found')
        return;
    }

    //delete 
    const index = courses.indexOf(course)
    courses.splice(index, 1)
    //return same course
    res.send(course)
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    const result = schema.validate(course)
    return result
}

module.exports = router