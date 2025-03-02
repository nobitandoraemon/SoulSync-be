const zodiacMatch = new Map([
    // [1, [2, 3]]  //kieu kieu nhu nay

    [1, 12],  // Bach Duong male - Xu Nu female
    [2, 11],  // Bach Duong female - Xu Nu male
    [3, 20],  // Kim Nguu male - Ma Ket female
    [4, 19],  // Kim Nguu female - Ma Ket male
    [5, 22],  // Song Tu male - Bao Binh female
    [6, 21],  // Song Tu female - Bao Binh male
    [7, 16],  // Cu Giai male - Bo Cap female
    [8, 15],  // Cu Giai female - Bo Cap male
    [9, 12],  // Su Tu male - Xu Nu female
    [10, 11], // Su Tu female - Xu Nu male
    [13, 18], // Thien Binh male - Nhan Ma female
    [14, 17], // Thien Binh female - Nhan Ma male
    [15, 8],  // Bo Cap male - Cu Giai female
    [16, 7],  // Bo Cap female - Cu Giai male
    [17, 14], // Nhan Ma male - Thien Binh female
    [18, 13], // Nhan Ma female - Thien Binh male
    [19, 4],  // Ma Ket male - Kim Nguu female
    [20, 3],  // Ma Ket female - Kim Nguu male
    [21, 6],  // Bao Binh male - Song Tu female
    [22, 5],  // Bao Binh female - Song Tu male
    [23, 2],  // Song Ngu male - Bach Duong female
    [24, 1]   // Song Ngu female - Bach Duong male
]);

// zodiacMatch.get(1); //dung cai nay se lay duoc phan tu tuong ung voi 1

module.exports = zodiacMatch;