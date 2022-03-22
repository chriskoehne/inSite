/**
 * @fileoverview This file provides a middleware function for verifying, refreshing, and removing jwt cookies
 * I can eventually try and transition to sessions again once 2fa is less of a pain to develop for
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const jwt = require('jsonwebtoken');

const jwt_decode = require('jwt-decode');

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.cookies['inSite-token'] || '';

    if (token) {
      let verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) {
        return this.removeToken(req, res, true);
      } else {
        let decoded = jwt_decode(token);
        this.generateToken(decoded.id, decoded.email, res, true);
      }
      return next();
    } else {
      return res.status(401).send({ message: 'Authorization headers missing!' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

exports.generateToken = (id, email, res, overwrite) => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '1hr', // will change this to a variable later
  });
  return res.cookie('inSite-token', token, {
    expires: new Date(Date.now() + 3600000),
    secure: true, // set to true if you're using https
    httpOnly: true,
    overwrite: false || overwrite,
    sameSite: 'none',
  });
};

exports.removeToken = (req, res, force) => {
  const token = req.cookies['inSite-token'];
  if (!token) {
    return res.status(400).send({ message: 'no token' });
  }
  res.cookie('inSite-token', token, {
    expires: new Date(Date.now()),
    secure: true, // set to true if you're using https
    httpOnly: true,
    overwrite: true,
    sameSite: 'none',
  });
  if (force) {
    return res.status(401).send({ message: 'User is not authorized!' });
  }
  return res.send(200).send({ message: 'logout successful' });
};
