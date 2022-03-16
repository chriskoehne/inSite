/**
 * @fileoverview This file holds a default schema for Users
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, validate: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/},
  password: { type: String , required: true },
  authyId: { type: String, required: true, default: 'unset' },
  redditUsername: { type: String, required: false },
  redditPassword: { type: String, required: false },
  darkmode: { type: Boolean, required: false },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;