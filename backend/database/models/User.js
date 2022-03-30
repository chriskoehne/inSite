/**
 * @fileoverview This file holds a default schema for Users
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },
    password: { type: String, required: true },
    authyId: { type: String, required: true, default: 'unset' },
    // redditUsername: { type: String, required: false },
    // redditPassword: { type: String, required: false },
    redditData: {  
      type: {
        overview: { type: Object, required: true, default: null },
        subKarma: { type: Object, required: true, default: null },
        totalKarma: { type: Object, required: true, default: null },
      },
      required: true,
      _id: false,
    },
    
    settings: {
      type: {
        darkMode: { type: Boolean, required: true, default: false },
        cardOrder: {
          type: [String],
          required: false,
          default: ['reddit', 'twitter', 'instagram', 'youtube'],
        },
        permissions: {
          type: {
            reddit: { type: Boolean, required: true, default: false },
            twitter: { type: Boolean, required: true, default: false },
            instagram: { type: Boolean, required: true, default: false },
            youtube: { type: Boolean, required: true, default: false },
          },
          required: true,
          _id: false,
        },
      },
      _id: false,
    },
  },
  { timestamps: true, strict: false }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
