const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Talent = require('../models/talentModel');
const uploadPicture = require('../utils/uploadPicture');
const { storage, bucketName } = require('../config/cloudStorage');

const bucket = storage.bucket(bucketName);

// CREATE NEW USER
const addUser = async (req, res) => {
  uploadPicture.single('picture')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err, details: err.message });
    }

    try {
      // Check for existing email and username
      const existingUserByEmail = await User.findOne({
        where: { email: req.body.email },
      });
      const existingAdminByEmail = await Admin.findOne({
        where: { email: req.body.email },
      });
      const existingTalentByEmail = await Talent.findOne({
        where: { email: req.body.email },
      });
      const existingUserByUsername = await User.findOne({
        where: { username: req.body.username },
      });
      const existingAdminByUsername = await Admin.findOne({
        where: { username: req.body.username },
      });

      if (
        existingUserByEmail
        || existingAdminByEmail
        || existingTalentByEmail
      ) {
        return res.status(409).send({ message: 'Email already in use' });
      }

      if (existingUserByUsername || existingAdminByUsername) {
        return res.status(409).send({ message: 'Username already in use' });
      }

      if (!req.body.email || !req.body.username || !req.body.password) {
        return res.status(400).send({ message: 'Missing required fields' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Handle picture upload
      let pictureUrl = req.body.picture
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(
          req.body.fullName,
        )}`;
      if (req.file) {
        const formattedUsername = req.body.username.replace(/\s+/g, '_');
        const blob = bucket.file(
          `uploads/users/${formattedUsername}/picture/${Date.now()}-${req.file.originalname
          }`,
        );
        const blobStream = blob.createWriteStream({
          metadata: { contentType: req.file.mimetype },
        });

        blobStream.end(req.file.buffer);
        await new Promise((resolve, reject) => {
          blobStream.on('error', reject);
          blobStream.on('finish', resolve);
        });

        await blob.makePublic();
        pictureUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      }

      // Create new user
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
      return res
        .status(400)
        .send({ error: 'Registration failed', details: error.message });
    }
  });
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
const updateUserById = async (req, res) => {
  // eslint-disable-next-line consistent-return
  uploadPicture.single('picture')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err, details: err.message });
    }

    try {
      const userId = req.params.id;
      const userToUpdate = await User.findByPk(userId);

      if (!userToUpdate) {
        return res.status(404).send({ message: 'User not found' });
      }

      // Check for existing email and username
      // ... existing checks ...

      // Prepare updated data, excluding email and password
      const updatedData = {
        username: req.body.username || userToUpdate.username,
        fullName: req.body.fullName || userToUpdate.fullName,
        address: req.body.address || userToUpdate.address,
        contact: req.body.contact || userToUpdate.contact,
      };

      // Update the picture if a new file is provided
      if (req.file) {
        const formattedUsername = req.body.username.replace(/\s+/g, '_') || userToUpdate.username.replace(/\s+/g, '_');
        const blob = bucket.file(`uploads/users/${formattedUsername}/picture/${Date.now()}-${req.file.originalname}`);
        const blobStream = blob.createWriteStream({
          metadata: { contentType: req.file.mimetype },
        });

        blobStream.end(req.file.buffer);
        await new Promise((resolve, reject) => {
          blobStream.on('error', reject);
          blobStream.on('finish', resolve);
        });

        await blob.makePublic();
        updatedData.picture = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      } else {
        updatedData.picture = req.body.picture || userToUpdate.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userToUpdate.fullName)}`;
      }

      // Update the user with the new data
      await userToUpdate.update(updatedData);

      res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Update failed', details: error.message });
    }
  });
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

// GET FAVORITE TALENTS
const getFavoriteTalentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Use the userId to fetch the user's favored talents from your database
    // Assuming you have a function in your database model to retrieve favored talents for a user
    const favoredTalents = await User.findFavoriteTalents(userId);

    res.status(200).json(favoredTalents);
  } catch (error) {
    res
      .status(500)
      .json({
        error: 'Error fetching favored talents',
        details: error.message,
      });
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
