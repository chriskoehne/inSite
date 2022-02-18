/**
 * @fileoverview This file provides a middleware function for verifying jwtse
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const jwt = require('jsonwebtoken');
const config = require('../config.json');
const jwtSecret = config.jwtSecret;


exports.verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token || '';

    if (token) {
      let decoded = jwt.verify(token, jwtSecret);
      if (!decoded) {
        res.status(401).send({message: "User is not authorized!"});
      }
      console.log('here')
      return next();
    } else {
      res.status(401).send({message: "Authorization headers missing!"});
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message);
  }
};

exports.generateToken = (id, email, res) => {
  const token = jwt.sign({ id, email }, jwtSecret, {
    expiresIn: '6hr', // will change this to a variable later
  });
  return res.cookie('token', token, {
    expires: new Date(Date.now() + 21600),
    secure: false, // set to true if your using https
    httpOnly: true,
  });
};
