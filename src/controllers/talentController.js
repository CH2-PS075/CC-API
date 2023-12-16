const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Talent = require('../models/talentModel');
const User = require('../models/userModel');
const { storage, bucketName } = require('../config/cloudStorage');
const uploadPicture = require('../utils/uploadPicture');
const { Category, detailCategory } = require('../models/categoryModel');
const Admin = require('../models/adminModel');

const bucket = storage.bucket(bucketName);

const addTalent = async (req, res) => {
    uploadPicture.single('identityCard')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err, details: err.message });
        }

        try {
            const existingUserByEmail = await User.findOne({
                where: {
                    email: req.body.email,
                },
            });
            const existingAdminByEmail = await Admin.findOne({
                where: {
                    email: req.body.email,
                },
            });
            const existingTalentByEmail = await Talent.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (existingUserByEmail || existingAdminByEmail || existingTalentByEmail) {
                return res.status(409).send({ message: 'Email already in use' });
            }

            const { password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const formattedTalentName = req.body.talentName.replace(/\s+/g, '_');

            let identityCardUrl = req.body.identityCard;
            if (req.file) {
                const blob = bucket.file(`uploads/${formattedTalentName}/identity/-${Date.now()}-${req.file.originalname}`);
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
                detailCategoryId: req.body.detailCategoryId,
                talentName: req.body.talentName,
                quantity: req.body.quantity,
                address: req.body.address,
                contact: req.body.contact,
                price: req.body.price,
                email: req.body.email,
                password: hashedPassword,
                isVerified: false,
                picture: req.body.picture,
                portfolio: req.body.portfolio,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                identityCard: identityCardUrl,
                paymentConfirmationReceipt: req.body.paymentConfirmationReceipt,
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
            return res.status(400).json({ error: err.message });
        }

        try {
            const talentId = req.params.id;
            const talentToUpdate = await Talent.findByPk(talentId);

            const existingUser = await User.findOne({ where: { email: req.body.email } });
            const existingAdmin = await Admin.findOne({ where: { email: req.body.email } });
            const existingTalent = await Talent.findOne({ where: { email: req.body.email } });

            if (existingUser || existingAdmin || existingTalent) {
                return res.status(409).send({ message: 'Email already in use' });
            }

            if (!talentToUpdate) {
                return res.status(404).json({ message: 'Talent not found' });
            }

            if (req.file) {
                // Delete the old image from Google Cloud Storage
                if (talentToUpdate.identityCard) {
                    const oldFileName = talentToUpdate.identityCard.split('/').pop();
                    const oldFile = bucket.file(`uploads/${talentToUpdate.talentName.replace(/\s+/g, '_')}/identityCard-${oldFileName}`);
                    await oldFile.delete();
                }

                // Upload the new image
                const formattedTalentName = req.body.talentName.replace(/\s+/g, '_');
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
                const identityCardUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
                req.body.identityCard = identityCardUrl;
            }

            // Update talent's details
            const updatedData = { ...req.body };
            if (req.body.password) {
                updatedData.password = await bcrypt.hash(req.body.password, 10);
            }

            await talentToUpdate.update(updatedData);

            return res.status(200).json({ message: 'Talent updated successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Error updating talent', details: error.message });
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
