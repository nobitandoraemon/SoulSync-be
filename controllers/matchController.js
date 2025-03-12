const User = require('../models/User');
const calculateZodiacScore = require('../data/zodiacMatch');
const calculateNumerologyScore = require('../data/numerologyMatch');
const freeUser = require('../data/freeUser');

const findMatch = async (username) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return { error: "User not found" };

        let bestMatch = null;
        let bestScore = -Infinity;
        let elapsedTime = 0;
        const interval = 10000;
        const timeout = 10 * 60000;

        const searchMatch = async (resolve) => {
            for (const otherUsername of freeUser) {
                if (otherUsername === username) continue;

                const otherUser = await User.findOne({ username: otherUsername });
                if (!otherUser || otherUser.gender === user.gender) continue;

                //Tính điểm
                const zodiacScore = calculateZodiacScore(user.zodiac, otherUser.zodiac);
                const numerologyScore = calculateNumerologyScore(user.birthday, otherUser.birthday);

                const score = zodiacScore * 2 + numerologyScore;

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = otherUser;
                }
            }

            if (bestMatch) {
                freeUser.delete(bestMatch.username);
                freeUser.delete(username);
                return resolve({ match: bestMatch.username });
            }

            if (elapsedTime >= timeout) {
                return resolve({ message: "Không có người thích hợp" });
            }

            elapsedTime += interval;
            setTimeout(() => searchMatch(resolve), interval);
        };

        return new Promise((resolve) => searchMatch(resolve));

    } catch (error) {
        return { error: "Server error", details: error.message };
    }
};

const matchController = {
    matching: async (req, res) => {
        try {
            const { username } = req.body;

            if (!username) return res.status(400).json({ error: "Username is required" });

            const matchedUser = await findMatch(username);

            if (!matchedUser) {
                return res.status(403).json("No match found");
            }

            res.status(200).json({
                message: "Match found",
                matchedUser: matchedUser
            });
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
}

module.exports = matchController;