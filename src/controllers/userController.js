const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Talent = require('../models/talentModel');

// CREATE NEW USER
const addUser = async (req, res) => {
  try {
    const existingUserByEmail = await User.findOne({ where: { email: req.body.email } });
    const existingAdminByEmail = await Admin.findOne({ where: { email: req.body.email } });
    const existingTalentByEmail = await Talent.findOne({ where: { email: req.body.email } });

    if (existingUserByEmail || existingAdminByEmail || existingTalentByEmail) {
      return res.status(409).send({ message: 'Email already in use' });
    }

    const existingUserByUsername = await User.findOne({ where: { username: req.body.username } });
    const existingAdminByUsername = await Admin.findOne({ where: { username: req.body.username } });

    if (existingUserByUsername || existingAdminByUsername) {
      return res.status(409).send({ message: 'Username already in use' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const pictureUrl = req.body.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.fullName)}`;

    const newUser = {
      username: req.body.username,
      fullName: req.body.fullName,
      address: req.body.address,
      contact: req.body.contact,
      email: req.body.email,
      password: hashedPassword,
      picture: pictureUrl,
    };

    await User.create(newUser);
    return res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(400).send({ error: 'Registration failed', details: error.message });
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

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// UPDATE USER BY ID
// eslint-disable-next-line consistent-return
const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userToUpdate = await User.findByPk(userId);

    const existingUserByEmail = await User.findOne({ where: { email: req.body.email } });
    const existingAdminByEmail = await Admin.findOne({ where: { email: req.body.email } });
    const existingTalentByEmail = await Talent.findOne({ where: { email: req.body.email } });

    if (existingUserByEmail || existingAdminByEmail || existingTalentByEmail) {
      return res.status(409).send({ message: 'Email already in use' });
    }

    const existingUserByUsername = await User.findOne({ where: { username: req.body.username } });
    const existingAdminByUsername = await Admin.findOne({ where: { username: req.body.username } });

    if (existingUserByUsername || existingAdminByUsername) {
      return res.status(409).send({ message: 'Username already in use' });
    }

    if (!userToUpdate) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Prepare updated data, excluding email and password
    const updatedData = {
      username: req.body.username || userToUpdate.username,
      fullName: req.body.fullName || userToUpdate.fullName,
      address: req.body.address || userToUpdate.address,
      contact: req.body.contact || userToUpdate.contact,
      picture: req.body.picture || userToUpdate.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userToUpdate.fullName)}`,
    };

    // Update the user with the new data
    await userToUpdate.update(updatedData);

    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Update failed', details: error.message });
  }
};

// DELETE USER BY ID
const deleteUserById = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { userId: req.params.id },
    });
    if (deleted) {
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFavoriteTalentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Use the userId to fetch the user's favored talents from your database
    // Assuming you have a function in your database model to retrieve favored talents for a user
    const favoredTalents = await User.findFavoriteTalents(userId);

    res.status(200).json(favoredTalents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favored talents', details: error.message });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getFavoriteTalentsForUser,
};
