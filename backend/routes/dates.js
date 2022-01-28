import express from 'express'
import { ObjectId } from 'mongodb'
import { getDB } from '../db/conn.js'

const router = express.Router()

router.get("/", (req, res) => {
    const db = getDB()
    db
        .collection("dates")
        .find()
        .toArray((err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({"message": "Error getting dates", err});
            } else {
                res.json({"message": "Successfully got dates", result})
            }
        })
})

router.get("/:date", (req, res) => {
    const db = getDB()
    db
        .collection("dates")
        .findOne({ date: new Date(req.params.date).toLocaleDateString() }, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({"message": "Error getting date", err});
            } else {
                res.json({"message": "Successfully got date", result})
            }
        })
})

router.post("/", (req, res) => {
    const db = getDB()
    const body = req.body

    const newDate = {
        date: new Date(body.date).toLocaleDateString(),
        opens: body.opens,
        closes: body.closes,
        min_emps_working: body.min_emps_working
    }

    db
        .collection("dates")
        .insertOne(newDate, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({"message": "Error creating date", err});
            } else {
                res.json({"message": "Successfully added date", result})
            }
        })
})

router.put("/", (req, res) => {
    const db = getDB()
    const body = req.body

    let dateQuery
    if (typeof(body._id) == "string") {
        dateQuery = { _id: ObjectId(body._id)}
    } else {
        dateQuery = { _id: body._id }
    }

    const { _id, ...updates } = body

    db
        .collection("dates")
        .updateOne(dateQuery, {
            $set: updates
        }, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({"message": "Error updating date", "error": err});
            } else {
                res.json({"message": "Successfully updated date", result})
            }
        })
})

router.delete("/", (req, res) => {
    const db = getDB()
    const body = req.body

    let dateQuery
    if (typeof(body._id) == "string") {
        dateQuery = { _id: ObjectId(body._id)}
    } else {
        dateQuery = { _id: body._id }
    }

    db
        .collection("dates")
        .deleteOne(dateQuery, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({"message": "Error deleting date", err});
            } else {
                res.json({"message": "Successfully deleted date", result})
            }
        })
})

export default router