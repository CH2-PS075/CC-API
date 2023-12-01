const Talent = require('../models/talentModel');

const verifyTalent = async (req, res) => {
    try {
        const { talentId } = req.params;

        const updated = await Talent.update({ isVerified: true }, {
            where: { talentId },
        });

        if (updated[0] > 0) {
            res.status(200).json({ message: 'Talent verified successfully' });
        } else {
            res.status(404).json({ message: 'Talent not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Verification failed', details: error.message });
    }
};

module.exports = {
    verifyTalent,
};
