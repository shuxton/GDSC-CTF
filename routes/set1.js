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

module.exports = {
  set1,
};
