const Joi = require('joi');//load joi module - returns class
//load express module
const express = require('express') //returns function
const router = express.Router();

const connection = require('../database');
const { func } = require('joi');

const pool = require('../database')

//need to enable parsing json objects 
// in body of requests
router.use(express.json());

const courses = [
    { id: 1, name: 'course5' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' },
]

router.get('/', async (req, res) => {
    const [courses] = await pool.query('SELECT * FROM college_schema.courses')
    res.send(courses)
})
//java programing  
router.get('/:id', async (req, res) => { //parameter defined by : and parameter name
    const [[course]] = await pool.query(`
    SELECT *
    FROM college_schema.courses
    WHERE id=?
    `, [req.params.id])
    console.log(course)
    if (!course) { //404
        res.status(404).send('The course with the given id was not found')
    } else { res.send(course) }
})

router.post('/', async (req, res) => {

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

    const [insertResult] = await pool.query(`
    INSERT INTO college_schema.courses (name)
    VALUES (?)
    `, [req.body.name])
    const [[course]] = await pool.query(`
    SELECT *
    FROM college_schema.courses
    WHERE id=?
    `, [insertResult.insertId])
    res.send(course)
})

router.put('/:id', async (req, res) => {
    //look up the course
    //if not exist return 404 resource not found
    const [[course]] = await pool.query(`
    SELECT *
    FROM college_schema.courses
    WHERE id=?
    `, [req.params.id])
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
    await pool.query(`
    UPDATE college_schema.courses
    SET name=?
    WHERE id=?
    `, [req.body.name, req.params.id])
    const [[updatedCourse]] = await pool.query(`
    SELECT *
    FROM college_schema.courses
    WHERE id=?
    `, [req.params.id])
    res.send(updatedCourse)
})

router.delete('/:id', async (req, res) => {
    //look up the course
    //if not exist return 404 resource not found
    const [[course]] = await pool.query(`
    SELECT *
    FROM college_schema.courses
    WHERE id=?
    `, [req.params.id])
    if (!course) { //404
        res.status(404).send('The course with the given id was not found')
        return;
    }

    //delete 
    await pool.query(`
    DELETE FROM college_schema.courses
    WHERE id=?
    `, [req.params.id])
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