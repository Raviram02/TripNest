const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
});

// Tell passport-local-mongoose to use 'email' instead of the default 'username'
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  errorMessages: {
    IncorrectUsernameError: "Email not found.",
    IncorrectPasswordError: "Incorrect password.",
    MissingUsernameError: "Email is required.",
    MissingPasswordError: "Password is required.",
    UserExistsError: "Email already registered.",
  },
});

module.exports = mongoose.model("User", userSchema);
