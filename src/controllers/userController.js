const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// CREATE NEW USER
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

// GET ALL REGISTERED USER
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'cannot fetch the users' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
};
