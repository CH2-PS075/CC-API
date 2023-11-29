const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      nama_lengkap: req.body.nama_lengkap,
      username: req.body.username,
      alamat: req.body.alamat,
      telpon: req.body.telpon,
      email: req.body.email,
      password: hashedPassword, // Use the hashed password here
    };
    await User.create(newUser);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  createUser,
};
