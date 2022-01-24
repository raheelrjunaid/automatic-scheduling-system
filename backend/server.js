import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectToServer, getDB } from "./db/conn.js"
import employeesRouter from "./routes/employees.js"
const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.json({"page": "home"})
})

app.use("/api", employeesRouter)

// perform a database connection when the server starts
connectToServer(function (err) {
  if (err) {
    console.error(err)
    process.exit()
  }

  // start the Express server
  app.listen(8000, () => {
    console.log(`Server is running on port: 8000`)
  })
})
