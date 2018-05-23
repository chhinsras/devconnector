const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => {
    console.log(`MongoDB Connected to ${db}`);
  })
  .catch(err => {
    console.log(err);
  });

// Passport middleware
app.use(passport.initialize());

// Passport Config
const messageTest = "Server Parameter passed to Passport";
require("./config/passport")(passport, messageTest);
//require("./config/passport");

// Default Route
app.get("/", (req, res) => res.send("Hello CHHIN SRAS"));

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//mLap Port or localhost port 5000
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
