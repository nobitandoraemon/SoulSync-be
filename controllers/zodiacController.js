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
            const matchZodiacId = zodiacMatch.get(user.zodiac);
            if (!matchZodiacId) {
                return res.status(400).json({ message: "No match found for this zodiac" });
            }

            //Find user2 in freeUser by zodiacId
            let matchedUser = null;
            for (let freeUsername of freeUser) {
                const freeUserData = await User.findOne({ username: freeUsername });
                if (freeUserData && freeUserData.zodiac === matchZodiacId) {
                    matchedUser = freeUsername;
                    break;
                }
            }

            if (!matchedUser) {
                return res.status(404).json({ message: "No free user available" });
            }

            //Delete user1 and user2 from freeUser
            freeUser.delete(user);
            freeUser.delete(matchedUser);

            return res.json({
                message: "Match found!",
                matchedUser
            });

            res.status(200).json("Ok");
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
}

module.exports = zodiacController;