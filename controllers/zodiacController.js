const User = require('../models/User');
const zodiacMatch = require('../data/zodiacMatch');
const freeUser = require('../data/freeUser');

const zodiacController = {
    matching: async (req, res) => {
        try {
            const { username } = req.body;

            //Find user1 by username
            const user = await User.findOne({username});
            if (!user) return res.status(404).json({ message: "User not found" });

            //Call zodiacMatching -> matched zodiacId
            const matchZodiacIds = zodiacMatch.get(user.zodiac) || [];
            if (matchZodiacIds.length === 0) {
                return res.status(400).json({ message: "No match found for this zodiac" });
            }

            //Find user2 in freeUser by zodiacId
            let matchedUser = null;
            for (let freeUsername of freeUser) {
                const freeUserData = await User.findOne({ username: freeUsername });
                if (freeUserData && matchZodiacId.includes(freeUserData.zodiac)) {
                    matchedUser = freeUsername;
                    freeUser.delete(matchedUser);
                    break;
                }
            }

            if (!matchedUser) {
                return res.status(404).json({ message: "No free user available" });
            }

            //Delete user1 and user2 from freeUser
            freeUser.delete(user);

            return res.status(200).json({
                message: "Match found!",
                matchedUser
            });

        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
}

module.exports = zodiacController;