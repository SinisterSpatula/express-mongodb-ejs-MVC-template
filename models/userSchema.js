const mongoose = require('mongoose');
// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
    min: 3,
    max: 20,
  },
  hash: {
    type: String,
  },
  salt: {
    type: String,
  },
});

module.exports = userSchema;
