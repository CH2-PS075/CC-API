const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Talent = require('../models/talentModel');
const User = require('../models/userModel');
const { storage, bucketName } = require('../config/cloudStorage');
const uploadPicture = require('../utils/uploadPicture');
const { Category, detailCategory } = require('../models/categoryModel');

const bucket = storage.bucket(bucketName);

const addTalent = async (req, res) => {
    uploadPicture.single('identityCard')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err, details: err.message });
        }

        try {
            const existingTalent = await Talent.findOne({ where: { email: req.body.email } });
            if (existingTalent) {
                return res.status(409).json({ message: 'Email already in use' });
            }

            const { password, ...otherDetails } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const formattedTalentName = req.body.talentName.replace(/\s+/g, '_');

            let identityCardUrl = req.body.identityCard;
            if (req.file) {
                const blob = bucket.file(`uploads/${formattedTalentName}/identityCard-${Date.now()}-${req.file.originalname}`);
                const blobStream = blob.createWriteStream({
                    metadata: { contentType: req.file.mimetype },
                });

                blobStream.end(req.file.buffer);
                await new Promise((resolve, reject) => {
                    blobStream.on('error', reject);
                    blobStream.on('finish', resolve);
                });

                await blob.makePublic();
                identityCardUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            }

            const newTalent = await Talent.create({
                ...otherDetails,
                password: hashedPassword,
                isVerified: 0,
                picture: req.body.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.fullName)}`,
                identityCard: identityCardUrl,
            });

            return res.status(201).json({ message: 'Talent registered successfully', talentId: newTalent.talentId });
        } catch (error) {
            return res.status(400).json({ error: 'Registration failed', details: error.message });
        }
    });
};

const getAllTalents = async (req, res) => {
    try {
        const talents = await Talent.findAll({
            include: [
                {
                    model: detailCategory,
                    as: 'detailCategory',
                    include: [{
                        model: Category,
                        as: 'category',
                    }],
                },
            ],
        });

        if (talents && talents.length > 0) {
            res.status(200).json(talents);
        } else {
            res.status(404).json({ message: 'No talents found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching talents', details: error.message });
    }
};

const getTalentById = async (req, res) => {
    try {
        const talentId = req.params.id;
        const talent = await Talent.findByPk(talentId, {
            include: [
                {
                    model: detailCategory,
                    as: 'detailCategory',
                    include: [{
                        model: Category,
                        as: 'category',
                    }],
                },
            ],
        });

        if (talent) {
            res.status(200).json(talent);
        } else {
            res.status(404).json({ message: 'Talent not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching talent', details: error.message });
    }
};

const updateTalentById = async (req, res) => {
    // eslint-disable-next-line consistent-return
    uploadPicture.single('identityCard')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err, details: err.message });
        }

        try {
            const { id } = req.params;
            const { password, talentName, ...otherDetails } = req.body;

            let identityCardUrl;
            if (req.file) {
                const formattedTalentName = talentName.replace(/\s+/g, '_');
                const blob = bucket.file(`uploads/${formattedTalentName}/identityCard-${Date.now()}-${req.file.originalname}`);
                const blobStream = blob.createWriteStream({
                    metadata: { contentType: req.file.mimetype },
                });

                blobStream.end(req.file.buffer);
                await new Promise((resolve, reject) => {
                    blobStream.on('error', reject);
                    blobStream.on('finish', resolve);
                });

                await blob.makePublic();
                identityCardUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
                otherDetails.identityCard = identityCardUrl;
            }

            if (password) {
                otherDetails.password = await bcrypt.hash(password, 10);
            }

            const updated = await Talent.update(otherDetails, { where: { talentId: id } });

            if (updated[0] > 0) {
                res.status(200).json({ message: 'Talent updated successfully' });
            } else {
                res.status(404).json({ message: 'Talent not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error updating talent', details: error.message });
        }
    });
};

const deleteTalentById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Talent.destroy({ where: { talentId: id } });

        if (deleted) {
            res.status(200).json({ message: 'Talent deleted successfully' });
        } else {
            res.status(404).json({ message: 'Talent not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting talent', details: error.message });
    }
};

const addTalentToFavorites = async (req, res) => {
    const { userId, talentId } = req.params;

    try {
        const user = await User.findByPk(userId);
        const talent = await Talent.findByPk(talentId);

        if (!user || !talent) {
            res.status(404).json({ message: 'User or Talent not found' });
        }

        await user.addFavoriteTalent(talent);
        res.status(200).json({ message: 'Talent added to favorites' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to add talent to favorites' });
    }
};

const searchTalentByName = async (req, res) => {
    try {
        const { name } = req.query;
        const talents = await Talent.findAll({
            where: {
                talentName: {
                    [Op.iLike]: `%${name}%`, // Case-insensitive search for talent name
                },
            },
        });
        res.status(200).json(talents);
    } catch (error) {
        res.status(500).json({ error: 'Error searching talents by name', details: error.message });
    }
};

const searchTalentByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        const talents = await Talent.findAll({
            where: {
                category: {
                    [Op.iLike]: `%${category}%`, // Case-insensitive search for category
                },
            },
        });
        res.status(200).json(talents);
    } catch (error) {
        res.status(500).json({ error: 'Error searching talents by category', details: error.message });
    }
};

module.exports = {
    addTalent,
    getAllTalents,
    getTalentById,
    updateTalentById,
    deleteTalentById,
    addTalentToFavorites,
    searchTalentByName,
    searchTalentByCategory,
};
