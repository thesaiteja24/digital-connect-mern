if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const mongoose = require("mongoose");

// Database Connection
const dbUrl = process.env.ATLAS_DB_URI;
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Failed to connect to DB:", err));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(` App listening on port ${port}`);
});
