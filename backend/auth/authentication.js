/**
 * @fileoverview This file provides a middleware function for verifying, refreshing, and removing jwt cookies
 * I can eventually try and transition to sessions again once 2fa is less of a pain to develop for
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const jwt = require('jsonwebtoken');
const config = require('../config.json');
const jwtSecret = config.jwtSecret;
const jwt_decode = require("jwt-decode");



exports.verifyToken = (req, res, next) => {
  try {
    console.log('yuh')
    const token = req.cookies['inSite-token'] || '';

    if (token) {
      let verified = jwt.verify(token, jwtSecret);
      if (!verified) {
        console.log('removing cookie')
        this.removeToken(res);
        res.status(401).send({message: "User is not authorized!"});
      } else {
        let decoded = jwt_decode(token);
        console.log('redoing cookie')
        this.generateToken(decoded.id, decoded.email, res, true);

      }
      return next();
    } else {
      console.log('missing')
      res.status(401).send({message: "Authorization headers missing!"});
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message);
  }
};

exports.generateToken = (id, email, res, overwrite) => {
  const token = jwt.sign({ id, email }, jwtSecret, {
    expiresIn: '1hr', // will change this to a variable later
  });
  return res.cookie('inSite-token', token, {
    expires: new Date(Date.now() + 3600000),
    secure: false, // set to true if your using https
    httpOnly: true,
    overwrite: false || overwrite
  });
};

exports.removeToken = (req, res) => {
  const token = req.cookies['inSite-token'];
  if (!token) {
    return res.status(400).send({message: 'no token'});
  }
  res.cookie('inSite-token', token, {
    expires: new Date(Date.now()),
    secure: false, // set to true if your using https
    httpOnly: true,
    overwrite: true
  });
  return res.send(200).send({message: 'logout successful'});
}

