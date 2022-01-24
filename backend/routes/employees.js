import express from 'express'
import { getDB } from '../db/conn.js'

const router = express.Router()

router.get("/", async (req, res) => {
    const db = getDB()
    db
    .collection("employees")
    .find()
    .toArray(function (err, result) {
        if (err) {
            res.status(400).send("Error fetching listings!");
        } else {
            res.json(result);
        }
    })
})

export default router
