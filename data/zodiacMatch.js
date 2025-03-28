const zodiacScores = {
    1: { veryCompatible: [10, 18], compatible: [2, 14], neutral: [6, 20], lessCompatible: [8, 22], nonCompatible: [12, 24] },  // Bạch Dương Nam
    2: { veryCompatible: [9, 17], compatible: [1, 13], neutral: [5, 19], lessCompatible: [7, 21], nonCompatible: [3, 15] },   // Bạch Dương Nữ
    3: { veryCompatible: [12, 20], compatible: [4, 16], neutral: [8, 24], lessCompatible: [6, 18], nonCompatible: [2, 10] },  // Kim Ngưu Nam
    4: { veryCompatible: [11, 19], compatible: [3, 15], neutral: [7, 23], lessCompatible: [5, 17], nonCompatible: [1, 9] },  // Kim Ngưu Nữ
    5: { veryCompatible: [14, 22], compatible: [6, 18], neutral: [2, 16], lessCompatible: [4, 20], nonCompatible: [8, 10] },  // Song Tử Nam
    6: { veryCompatible: [13, 21], compatible: [5, 17], neutral: [1, 15], lessCompatible: [3, 19], nonCompatible: [7, 11] },  // Song Tử Nữ
    7: { veryCompatible: [16, 24], compatible: [8, 20], neutral: [4, 18], lessCompatible: [2, 14], nonCompatible: [6, 22] },  // Cự Giải Nam
    8: { veryCompatible: [15, 23], compatible: [7, 19], neutral: [3, 17], lessCompatible: [1, 13], nonCompatible: [5, 9] },  // Cự Giải Nữ
    9: { veryCompatible: [18, 2], compatible: [10, 22], neutral: [12, 4], lessCompatible: [14, 6], nonCompatible: [8, 16] },  // Sư Tử Nam
    10: { veryCompatible: [17, 1], compatible: [9, 21], neutral: [11, 3], lessCompatible: [13, 5], nonCompatible: [7, 15] },  // Sư Tử Nữ
    11: { veryCompatible: [20, 4], compatible: [12, 24], neutral: [14, 6], lessCompatible: [16, 8], nonCompatible: [2, 10] }, // Xử Nữ Nam
    12: { veryCompatible: [19, 3], compatible: [11, 23], neutral: [13, 5], lessCompatible: [15, 7], nonCompatible: [9, 21] }, // Xử Nữ Nữ
    13: { veryCompatible: [22, 6], compatible: [14, 18], neutral: [16, 8], lessCompatible: [20, 12], nonCompatible: [4, 24] },// Thiên Bình Nam
    14: { veryCompatible: [21, 5], compatible: [13, 17], neutral: [15, 7], lessCompatible: [19, 11], nonCompatible: [1, 3] },// Thiên Bình Nữ
    15: { veryCompatible: [24, 8], compatible: [16, 20], neutral: [18, 10], lessCompatible: [22, 12], nonCompatible: [6, 14] },// Bọ Cạp Nam
    16: { veryCompatible: [23, 7], compatible: [15, 19], neutral: [17, 9], lessCompatible: [21, 11], nonCompatible: [5, 13] },// Bọ Cạp Nữ
    17: { veryCompatible: [2, 10], compatible: [18, 14], neutral: [20, 12], lessCompatible: [24, 8], nonCompatible: [4, 6] },// Nhân Mã Nam
    18: { veryCompatible: [1, 9], compatible: [17, 13], neutral: [19, 11], lessCompatible: [23, 7], nonCompatible: [3, 5] },// Nhân Mã Nữ
    19: { veryCompatible: [4, 12], compatible: [20, 24], neutral: [22, 14], lessCompatible: [6, 16], nonCompatible: [8, 10] },// Ma Kết Nam
    20: { veryCompatible: [3, 11], compatible: [19, 23], neutral: [21, 13], lessCompatible: [5, 15], nonCompatible: [1, 17] },// Ma Kết Nữ
    21: { veryCompatible: [6, 14], compatible: [22, 18], neutral: [24, 16], lessCompatible: [8, 20], nonCompatible: [4, 12] },// Bảo Bình Nam
    22: { veryCompatible: [5, 13], compatible: [21, 17], neutral: [23, 15], lessCompatible: [7, 19], nonCompatible: [3, 11] },// Bảo Bình Nữ
    23: { veryCompatible: [8, 16], compatible: [24, 20], neutral: [2, 12], lessCompatible: [10, 18], nonCompatible: [4, 6] },// Song Ngư Nam
    24: { veryCompatible: [7, 15], compatible: [23, 19], neutral: [1, 11], lessCompatible: [9, 17], nonCompatible: [3, 5] },// Song Ngư Nữ
};

const calculateZodiacScore = (zodiac1, zodiac2) => {
    const matchData = zodiacScores[zodiac1];
    if (!matchData) return -10;
  
    if (matchData.veryCompatible.includes(zodiac2)) return 15;
    if (matchData.compatible.includes(zodiac2)) return 10;
    if (matchData.neutral.includes(zodiac2)) return 5;
    if (matchData.lessCompatible.includes(zodiac2)) return 0;
    if (matchData.nonCompatible.includes(zodiac2)) return -3;
    return -5;
  };
  
module.exports = calculateZodiacScore;