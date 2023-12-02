const bcrypt = require('bcrypt');
const Talent = require('../models/talentModel');

const addTalent = async (req, res) => {
    try {
        const { password, ...otherDetails } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTalent = await Talent.create({
            ...otherDetails,
            password: hashedPassword,
            isVerified: 0,
        });

        res.status(201).json({ message: 'Talent registered successfully', talentId: newTalent.talentId });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed', details: error.message });
    }
};

const getAllTalents = async (req, res) => {
    try {
        const talents = await Talent.findAll();
        res.status(200).json(talents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching talents', details: error.message });
    }
};

const getTalentById = async (req, res) => {
    try {
        const talent = await Talent.findByPk(req.params.id);
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
    try {
        const { id } = req.params;
        const { password, ...otherDetails } = req.body;

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

module.exports = {
    addTalent,
    getAllTalents,
    getTalentById,
    updateTalentById,
    deleteTalentById,
};
