const path = require('path');
const bcrypt = require('bcrypt');

const User = require(path.resolve(__dirname, '../database/models/user'));
exports.signup = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if ((await User.find({ email: email })).length > 0) {
      res.status(400).send({ message: 'email already in use' });
      return;
    } 
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    let result = await User.create({
      email: email,
      password: hashedPassword,
    });

    console.log
    if (result instanceof User) {
      res.send({ message: 'User registered successfully!' });
      return;
    } else {
      res.send({ message: 'Failure creating user' });
    }
    return;

  } catch (err) {
    return err;
  }
};