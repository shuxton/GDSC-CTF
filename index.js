var express = require("express");
var bodyParser = require("body-parser");
const { challenges } = require("./challenges");
const { set1 } = require("./routes/set1");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.set("views", "./views");
app.set("view engine", "ejs");

//add your set here
app.use(set1);

app.listen(process.env.port || 3000, function () {
  console.log("CTF server started");
});

app.get("/", (req, res) => {
  res.render("homepage", { challenges });
});
