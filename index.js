var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
const { challenges } = require("./challenges");
const { set1 } = require("./routes/set1");
const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  fileUpload({
    limits: {
      fileSize: 1 * 1024 * 1024,
      fields: 50,
      files: 1,
      parts: 51,
    },
  })
);
app.use(express.static(path.join(__dirname + "/public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

var mongoose = require("mongoose");
const User = require("./models/User");
const { calculatePoints } = require("./utils/utils");
const uri =
  "mongodb+srv://snj:snj@cluster0.ndqer.mongodb.net/gdsc_ctf?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("strictQuery", false);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

//add your set here
app.use(set1);

app.listen(process.env.port || 3000, function () {
  console.log("CTF server started");
});

app.get("/", (req, res) => {
  res.render("homepage", { challenges });
});

app.get("/leaderboard", async (req, res) => {
  var leaderboard = await (await User.find({})).map((val,key)=>{
    return{
      teamName:val.teamName,
      participants:val.participants,
      answered:val.answered,
      score:val.score
    }
  })
  var teamNames = await (await User.find({})).map((val,key)=>{
    return{
      teamName:val.teamName,
      _id:val._id
    }
    
  })
  res.render("leaderboard", { users:teamNames,leaderboard });
});

app.post("/submit/:id", async (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  let answersFile = req.files.answers;
  let answers = [];
  let password = "";
  try {
    answers = answersFile.data.toString().split("\n");
    password = answers[0].replace("\r", "").trim();
    answers = answers.slice(1).map((val, key) => {
      val = val.replace("\r", "");
      keyVal = val.split("-");
      return {
        id: parseInt(keyVal[0].trim()),
        answer: keyVal[1].trim(),
      };
    });
    console.log(answers);
  } catch (ex) {
    console.log(ex);
    return res
      .status(400)
      .send("The text in file does not comply with GDSC CTF standards.");
  }
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Team not found");
    }

    if (user.password != password) {
      return res.status(400).send("Incorrect password!");
    }

    const { points, answered } = calculatePoints(answers);
    user.set("score", points);
    user.set("answered", answered);
    user.set("previousSubmission", answersFile.data.toString());
    await user.save();
    return res
      .status(200)
      .send(
        `<p>Score ${user.score}<br/>Answered Correctly ${user.answered}<p/>`
      );
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Something went wrong");
  }
});

app.get("/create", async (req, res) => {
  try {
    let user = await User.create({
      teamName: "BhagwanKeBharose",
      participants: ["Akhil", "Shubham", "Supreet"],
      password: "meow",
    });
    await user.save();
    return res
      .status(200)
      .send(`Team ${user.teamName}-${user._id} created successfully`);
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Something went wrong");
  }
});


