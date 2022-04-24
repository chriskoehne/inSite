/**
 * @fileoverview This file holds a default schema for Users
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const mongoose = require('mongoose');

const permissionsSchema = new mongoose.Schema(
  {
    reddit: { type: Boolean, required: true, default: false },
    twitter: { type: Boolean, required: true, default: false },
    youtube: { type: Boolean, required: true, default: false },
    twitch: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    darkMode: { type: Boolean, required: true, default: false },
    toolTips: { type: Boolean, required: true, default: true },
    cardOrder: {
      type: [String],
      required: false,
      default: ['reddit', 'twitter', 'youtube', 'twitch'],
    },
    permissions: { type: permissionsSchema, required: true, default: {} },
  },
  { _id: false }
);

const mfaSchema = new mongoose.Schema(
  {
    ascii: { type: String, required: false},
    hex: { type: String, required: false},
    base32: { type: String, required: false},
    otpauth_url: { type: String, required: false}
  },
  { _id: false }
);

const redditDataSchema = new mongoose.Schema(
  {
    overview: { type: Object, required: true, default: {} },
    subKarma: { type: Object, required: true, default: {} },
    totalKarma: { type: Object, required: true, default: {} },
  },
  {_id: false,}
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },
    password: { type: String, required: true },
    phone: { type: String, required: false, default: ''},
    phoneNotif: { type: Boolean, required: false, default: false},
    settings: { type: settingsSchema, required: true, default: {} },
    mfaSecret: { type: mfaSchema, required: true, default: {} },
    redditData: { type: redditDataSchema, required: true, default: {} },
  },
  { timestamps: true, strict: false }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
