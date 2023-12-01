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

module.exports = {
    addTalent,
};
