/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcrypt');
const axios = require('axios');
const FormData = require('form-data');
const { Op } = require('sequelize');
const Talent = require('../models/talentModel');
const User = require('../models/userModel');
const { storage, bucketName } = require('../config/cloudStorage');
const uploadPicture = require('../utils/uploadPicture');
// const { Category, detailCategory } = require('../models/categoryModel');
const Admin = require('../models/adminModel');
const config = require('../config/config');

const bucket = storage.bucket(bucketName);

// ADD TALENT
const addTalent = async (req, res) => {
    uploadPicture.single('picture')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err, details: err.message });
        }

        try {
            // Check for existing email
            const existingUserByEmail = await User.findOne({
                where:
                    { email: req.body.email },
            });
            const existingAdminByEmail = await Admin.findOne({
                where:
                    { email: req.body.email },
            });
            const existingTalentByEmail = await Talent.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (existingUserByEmail || existingAdminByEmail || existingTalentByEmail) {
                return res.status(409).send({ message: 'Email already in use' });
            }

            if (req.file) {
                // Create form-data for the image
                const formData = new FormData();
                formData.append('image', req.file.buffer, req.file.originalname);

                // Send POST request to the prediction API
                const predictionResponse = await axios.post(`${config.faceValidateUrl}/prediction`, formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                });

                // Check the prediction response
                if (predictionResponse.data.data.soil_types_prediction === 'Valid Face') {
                    // Hash the password
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);

                    // Save the picture to Google Cloud Storage
                    const formattedTalentName = req.body.talentName.replace(/\s+/g, '_');
                    const blob = bucket.file(`uploads/talents/${formattedTalentName}/picture/${Date.now()}-${req.file.originalname}`);
                    const blobStream = blob.createWriteStream({
                        metadata:
                            { contentType: req.file.mimetype },
                    });

                    blobStream.end(req.file.buffer);
                    await new Promise((resolve, reject) => {
                        blobStream.on('error', reject);
                        blobStream.on('finish', resolve);
                    });

                    await blob.makePublic();
                    const pictureUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

                    // Create new talent
                    const newTalent = await Talent.create({
                        talentName: req.body.talentName,
                        category: req.body.category,
                        quantity: req.body.quantity,
                        description: req.body.description,
                        address: req.body.address,
                        contact: req.body.contact,
                        price: req.body.price,
                        email: req.body.email,
                        password: hashedPassword,
                        picture: pictureUrl,
                        portfolio: req.body.portfolio,
                        latitude: req.body.latitude,
                        longitude: req.body.longitude,
                    });

                    return res.status(201).json({ message: 'Talent registered successfully', talentId: newTalent.talentId });
                }
                // Prediction is not 'Valid Face'
                return res.status(400).json({ message: 'Invalid picture, unable to register talent' });
            }
            return res.status(400).json({ message: 'No picture provided' });
        } catch (error) {
            return res.status(500).json({ error: 'Error in registration', details: error.message });
        }
    });
};

// GET ALL TALENTS
const getAllTalents = async (req, res) => {
    try {
        const talents = await Talent.findAll({
            // include: [
            //     {
            //         model: detailCategory,
            //         as: 'detailCategory',
            //         include: [{
            //             model: Category,
            //             as: 'category',
            //         }],
            //     },
            // ],
        });

        if (talents && talents.length > 0) {
            res.status(200).json(talents);
        } else {
            res.status(404).json({ message: 'No talents found' });
        }
    } catch (error) {
        res
            .status(500)
            .json({ error: 'Error fetching talents', details: error.message });
    }
};

// GET TALENT BY ID
const getTalentById = async (req, res) => {
    try {
        const talentId = req.params.id;
        const talent = await Talent.findByPk(
            talentId,
            // {
            //     include: [
            //         {
            //             model: detailCategory,
            //             as: 'detailCategory',
            //             include: [{
            //                 model: Category,
            //                 as: 'category',
            //             }],
            //         },
            //     ],
            // },
        );

        if (talent) {
            res.status(200).json(talent);
        } else {
            res.status(404).json({ message: 'Talent not found' });
        }
    } catch (error) {
        res
            .status(500)
            .json({ error: 'Error fetching talent', details: error.message });
    }
};

// UPDATE TALENT BY ID
const updateTalentById = async (req, res) => {
    // eslint-disable-next-line consistent-return
    uploadPicture.single('picture')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err, details: err.message });
        }

        try {
            const { id } = req.params;
            const talent = await Talent.findByPk(id);

            if (!talent) {
                return res.status(404).json({ message: 'Talent not found' });
            }

            const updates = {
                talentName: req.body.talentName || talent.talentName,
                category: req.body.category || talent.category,
                quantity: req.body.quantity || talent.quantity,
                description: req.body.description || talent.description,
                address: req.body.address || talent.address,
                contact: req.body.contact || talent.contact,
                price: req.body.price || talent.price,
                email: req.body.email || talent.email,
                portfolio: req.body.portfolio || talent.portfolio,
                latitude: req.body.latitude || talent.latitude,
                longitude: req.body.longitude || talent.longitude,
            };

            // Update the picture if a new file is provided
            if (req.file) {
                const formattedTalentName = req.body.talentName.replace(/\s+/g, '_');
                const blob = bucket.file(
                    `uploads/talents/${formattedTalentName}/picture/${Date.now()}-${req.file.originalname
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
                updates.picture = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
            }

            // Update talent information
            await talent.update(updates);

            return res
                .status(200)
                .json({
                    message: 'Talent updated successfully',
                    talentId: talent.talentId,
                });
        } catch (error) {
            return res
                .status(500)
                .json({ error: 'Error updating talent', details: error.message });
        }
    });
};

// DELETE TALENT BY ID
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
        res
            .status(500)
            .json({ error: 'Error deleting talent', details: error.message });
    }
};

// ADD TALENT TO FAVORITE
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

// SEARCH TALENT BY NAME OR CATEGORY
const searchTalents = async (req, res) => {
    const { talentName, category } = req.query;

    const whereClause = {};

    if (talentName) {
        whereClause.talentName = { [Op.like]: `%${talentName}%` };
    }
    if (category) {
        whereClause.category = category;
    }

    try {
        const talents = await Talent.findAll({ where: whereClause });
        res.json(talents);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    addTalent,
    getAllTalents,
    getTalentById,
    updateTalentById,
    deleteTalentById,
    addTalentToFavorites,
    searchTalents,
};
