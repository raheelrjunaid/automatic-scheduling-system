import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db/conn.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = getDB();
  db.collection("dates")
    .find()
    .toArray((err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Error getting dates", err });
      } else {
        res.json({ message: "Successfully got dates", result });
      }
    });
});

// TODO: Add statement to check if date being modified exists (deletion or updating)

router.get("/:date", (req, res) => {
  const db = getDB();
  db.collection("dates").findOne(
    { date: new Date(req.params.date) },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Error getting date", err });
      } else {
        res.json({ message: "Successfully got date", result });
      }
    }
  );
});

router.post("/", (req, res) => {
  const db = getDB();
  const { date, opens, closes, min_emps_working } = req.body;

  const newDate = {
    date: new Date(date),
    opens: opens,
    closes: closes,
    min_emps_working: min_emps_working,
    availability: [],
  };

  // TODO make date unique to prevent duplicates
  db.collection("dates").insertOne(newDate, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "Error creating date", err });
    } else {
      res.json({ message: "Successfully added date", result });
    }
  });
});

router.put("/:id", (req, res) => {
  const db = getDB();

  const dateQuery = { _id: ObjectId(req.params.id) };

  const { _id, ...updates } = req.body;
  updates.availability = updates?.availability?.map(
    ({ employee_id, start, end }) => ({
      employee_id: ObjectId(employee_id),
      start: new Date(start),
      end: new Date(end),
    })
  );

  db.collection("dates").updateOne(
    dateQuery,
    {
      $set: updates,
    },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Error updating date", error: err });
      } else {
        res.json({ message: "Successfully updated date", result });
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  const db = getDB();

  let dateQuery = { _id: ObjectId(req.params.id) };

  db.collection("dates").deleteOne(dateQuery, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "Error deleting date", err });
    } else {
      res.json({ message: "Successfully deleted date", result });
    }
  });
});

export default router;
