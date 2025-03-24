const User = require('../models/User');
const calculateZodiacScore = require('../data/zodiacMatch');
const calculateNumerologyScore = require('../data/numerologyMatch');
const calculateLocationScore = require('../data/locationMatch');
const freeUser = require('../data/freeUser');

const searchMatch = async (username) => {
    const user = await User.findOne({ username });
    if (!user) return null;

    let bestMatch = null;
    let bestScore = -Infinity;
    for (const otherUsername of freeUser) {
        if (otherUsername === username) continue;

        const otherUser = await User.findOne({ username: otherUsername });
        if (!otherUser || otherUser.gender === user.gender) continue;

        //Tính điểm
        const zodiacScore = calculateZodiacScore(user.zodiac, otherUser.zodiac);
        const numerologyScore = calculateNumerologyScore(user.birthday, otherUser.birthday);
        const locationScore = calculateLocationScore(user.location, otherUser.location);

        const score = zodiacScore * 2 + numerologyScore + locationScore;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = otherUser;
        }
    }

    return bestMatch;
};

const findMatch = async (username) => {
    console.log('match');

    const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));

    let elapsedTime = 0;
    const interval = 3000;
    const timeout = 10000;

    let matchUser = null;
    const match = async () => {
        while (elapsedTime < timeout) {
            matchUser = await searchMatch(username);
            // if (matchUser) {
            //     console.log('g');
            //     return matchUser;
            // }
            elapsedTime += interval;
            await wait(3000);
        };
    }
    await match();
    return matchUser;
};


module.exports = findMatch;