import express from 'express'
import { ObjectId } from 'mongodb'
import { getDB } from '../db/conn.js'

const router = express.Router()

router.get("/", (req, res) => {
    const db = getDB()
    db
        .collection("employees")
        .find()
        .toArray((err, result) => {
            if (err) {
                console.log(err)
                res.status(400).send("Error getting employees");
            } else {
                res.json(result);
            }
        })
})

router.post("/", (req, res) => {
    const db = getDB()
    const body = req.body

    const newEmployee = {
        first_name: body.first_name,
        last_name: body.last_name,
        colour: body.colour,
        availability: body.availability,
        fixed_hours: body.fixed_hours,
        max_working_days: body.max_working_days
    }

    db
        .collection("employees")
        .insertOne(newEmployee, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).send("Error creating employee");
            } else {
                res.send(`Added a new match with id ${result.insertedId}`);
            }
        })
})

router.put("/", (req, res) => {
    const db = getDB()
    const body = req.body

    let employeeQuery
    if (typeof(body._id) == "string") {
        employeeQuery = { _id: ObjectId(body._id)}
    } else {
        employeeQuery = { _id: body._id }
    }

    const { _id, ...updates } = body

    db
        .collection("employees")
        .updateOne(employeeQuery, {
            $set: updates
        }, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).send(`Error updating employee`);
            } else {
                res.send(result)
            }
        })
})

router.delete("/", (req, res) => {
    const db = getDB()
    const body = req.body

    let employeeQuery
    if (typeof(body._id) == "string") {
        employeeQuery = { _id: ObjectId(body._id)}
    } else {
        employeeQuery = { _id: body._id }
    }

    db
        .collection("employees")
        .deleteOne(employeeQuery, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).send(`Error deleting employee`);
            } else {
                res.send(result)
            }
        })
})

export default router
