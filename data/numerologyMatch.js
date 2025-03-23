const numerologyScores = {
    1: { compatible: [5, 7, 11], lessCompatible: [4, 8, 22] },
    2: { compatible: [4, 8, 22], lessCompatible: [1, 5, 33] },
    3: { compatible: [6, 9, 33], lessCompatible: [2, 4, 11] },
    4: { compatible: [2, 8, 11], lessCompatible: [3, 7, 22] },
    5: { compatible: [1, 7, 33], lessCompatible: [6, 9, 22] },
    6: { compatible: [3, 9, 22], lessCompatible: [5, 8, 11] },
    7: { compatible: [1, 5, 11], lessCompatible: [4, 6, 33] },
    8: { compatible: [2, 4, 22], lessCompatible: [1, 6, 33] },
    9: { compatible: [3, 6, 33], lessCompatible: [2, 7, 11] },
    11: { compatible: [7, 9, 22], lessCompatible: [3, 6, 8] },
    22: { compatible: [2, 4, 6], lessCompatible: [1, 5, 7] },
    33: { compatible: [3, 9, 5], lessCompatible: [2, 7, 8] }
  };
  
function calculateNumerology(birthday) {
    if (!birthday) return null;

    // Chuyển đổi thành dạng YYYY-MM-DD nếu cần
    const date = new Date(birthday);
    if (isNaN(date.getTime())) return null; // Kiểm tra ngày hợp lệ

    // Lấy ngày, tháng, năm
    const day = date.getUTCDate(); 
    const month = date.getUTCMonth() + 1; // Tháng bắt đầu từ 0
    const year = date.getUTCFullYear();

    // Chuyển thành chuỗi để dễ xử lý
    const sumDigits = (num) => num.toString().split('').reduce((sum, digit) => sum + Number(digit), 0);

    // Tổng các chữ số của ngày, tháng, năm
    let total = sumDigits(day) + sumDigits(month) + sumDigits(year);

    // Rút gọn thành 1 chữ số hoặc số chủ đạo (11, 22, 33)
    while (total > 9 && ![11, 22, 33].includes(total)) {
        total = sumDigits(total);
    }

    return total;
}

// Hàm tính điểm tương thích từ ngày sinh
const calculateNumerologyScore = (date1, date2) => {
    const num1 = calculateNumerology(date1);
    const num2 = calculateNumerology(date2);

    if (numerologyScores[num1]?.compatible.includes(num2)) return 3;
    if (numerologyScores[num1]?.lessCompatible.includes(num2)) return -2;
    return 1; // Trung lập
};

module.exports = calculateNumerologyScore;