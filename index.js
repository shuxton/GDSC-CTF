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

app.listen(process.env.port || 5000, function () {
  console.log("CTF server started");
});

app.get("/", (req, res) => {
  res.render("homepage", { challenges });
});

app.get("/leaderboard", async (req, res) => {
  var leaderboard = await (await User.find({}).sort({score:-1})).map((val,key)=>{
    return{
      _id:val._id,
      teamName:val.teamName,
      participants:val.participants,
      answered:val.answered,
      score:val.score,
    }
  })
  res.render("leaderboard", { leaderboard });
});

app.post("/submit/undefined", async(req, res) => {
  var msg = "Team Not Selected";
  res.status(400).render("er",{ msg });
})
app.post("/submit/:id", async (req, res) => {
  if (!req.files) {
    var msg = "No files were uploaded.";
    return res.status(400).render("er",{ msg });
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
    var msg = "The text in file does not comply with GDSC CTF standards.";
    return res.status(400).render("er",{ msg });
  }
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      var msg = "Team not found";
      return res.status(400).render("er",{ msg });
    }

    if (user.password != password) {
      var msg = "Incorrect password!";
      return res.status(400).render("er",{ msg });
    }

    const { points, answered } = calculatePoints(answers);
    user.set("score", points);
    user.set("answered", answered);
    user.set("previousSubmission", answersFile.data.toString());
    await user.save();
    var msg2 = {scr: user.score, crr: user.answered};
    return res.status(200).render("cr", { msg2 });
  } catch (ex) {
    console.log(ex);
    var msg = "Something went wrong";
    return res.status(400).render("er",{ msg });
  }
});

app.get("/create", async (req, res) => {
  try {
    let user = await User.create({
      teamName: "BhagwanKBharose",
      participants: ["Akhila", "Shubhama", "aSupreet"],
      password: "meowa",
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

app.get('*', function(req, res){
  res.render("404");
});


