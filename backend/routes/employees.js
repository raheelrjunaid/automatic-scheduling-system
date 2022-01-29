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
                res.status(400).json({"message": "Error getting employees", err});
            } else {
                res.json({"message": "Successfully got all employees", result});
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
                res.status(400).json({"message": "Error creating employee", err});
            } else {
                res.json({"message": `Added a new match with id ${result.insertedId}`, result});
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
                res.status(400).json({"message": "Error updating employee", err});
            } else {
                res.json({"message": "Successfully updated employee", result});
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
                res.status(400).json({"message": "Error deleting employee", err});
            } else {
                res.json({"message": "Successfully deleted employee", result});
            }
        })
})

export default router
