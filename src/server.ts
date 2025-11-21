import express from "express";
import { routes } from "./routes";
import { errorHandling } from "./middlewares/error-handling";

const PORT = 3333

const app = express()

app
  .use(express.json())
  .use(routes)

app.use(errorHandling)

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`)
})