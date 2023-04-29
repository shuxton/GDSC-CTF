var express = require("express");
const jwt = require("jsonwebtoken");

const set1 = express.Router();

set1.get("/1", (req, res) => {
  res.render("set1/challenge1");
});

set1.get("/2", (req, res) => {
  res.render("set1/challenge2");
});

set1.get("/3", (req, res) => {
  res.render("set1/challenge3");
});

set1.get("/4", (req, res) => {
  res.render("set1/challenge4");
});

set1.get("/5", (req, res) => {
  res.render("set1/challenge5");
});

set1.get("/6", (req, res) => {
  res.cookie("cookie", "FlagChocochip");
  res.render("set1/challenge6");
});

set1.get("/7", (req, res) => {
  const token = jwt.sign(
    { flag: "Flag:Authentication compromised" },
    "GdscCTF",
    {
      expiresIn: "2h",
    }
  );
  res.cookie("jwt", token);
  res.render("set1/challenge7");
});

set1.get("/robots.txt", function (req, res) {
  res.type("text/plain");
  res.send(
    "User-agent: *\nDisallow: /\nFlag:I don't want to survive I want to live"
  );
});

set1.get("/8", (req, res) => {
  res.render("set1/challenge8");
});

set1.post("/8", (req, res) => {
const password = req.body.password;
try{
if(password.trim().toUpperCase().includes('OR') && password.trim().includes("=")){
  return res.status(200).send("Flag:SQL successfully injected")
}else{
  return res.status(400).render("er",{ msg:"Incorrect password" });

}
}catch(e){
  return res.status(500).render("er",{ msg:"Something went wrong" })
}
});

set1.get("/9", (req, res) => {
  res.render("set1/challenge9");
});

set1.get("/10", (req, res) => {
  res.render("set1/challenge10"); 
});

set1.get("/11", (req, res) => {
  res.render("set1/challenge11");
});

set1.get("/12", (req, res) => {
  res.render("set1/challenge12");
});

set1.get("/13", (req, res) => {
  res.render("set1/challenge13");
});

set1.get("/14", (req, res) => {
  res.render("set1/challenge14");
});
set1.get("/15", (req, res) => {
  res.render("set1/challenge15");
});
module.exports = {
  set1,
};
