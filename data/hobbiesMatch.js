const calculateHobbyScore = (hobbies1, hobbies2) => {
    if (!Array.isArray(hobbies1) || !Array.isArray(hobbies2)) {
        return 0;
    }
    
    const set1 = new Set(hobbies1);
    const set2 = new Set(hobbies2);
    
    let score = 0;
    
    for (let hobby of set1) {
        if (set2.has(hobby)) {
            score += 2;
        }
    }
    
    return score;
}

module.exports = calculateHobbyScore;