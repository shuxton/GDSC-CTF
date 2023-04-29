//create user model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
  },
  participants: {
    type: Array,
    required: true,
  },
  solvedQuestions:{
    type:Array,
    default:[]
  },
  answered: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    default: "This server is not gaurded!",
  },
  previousSubmission: {
    type: String,
    default: null,
  },
  score: {
    type: Number,
    default: null,
  },
  key: {
    type: String,
    default:''
  },
  password: {
    type: String,
    required:true
  }
});

module.exports = mongoose.model("User", UserSchema);
