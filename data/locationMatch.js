const REGION_MAP = {
    "Bac": ["Hanoi", "Hai Phong", "Quang Ninh", "Bac Giang", "Bac Kan", "Bac Ninh", "Cao Bang", "Ha Giang", "Hai Duong", "Hoa Binh", "Hung Yen", "Lang Son", "Lao Cai", "Nam Dinh", "Ninh Binh", "Phu Tho", "Quang Ninh", "Son La", "Thai Binh", "Thai Nguyen", "Tuyen Quang", "Vinh Phuc", "Yen Bai"],
    "Trung": ["Thanh Hoa", "Nghe An", "Ha Tinh", "Quang Binh", "Quang Tri", "Thua Thien Hue", "Da Nang", "Quang Nam", "Quang Ngai", "Binh Dinh", "Phu Yen", "Khanh Hoa", "Kon Tum", "Gia Lai", "Dak Lak", "Dak Nong", "Lam Dong"],
    "Nam": ["Ho Chi Minh City", "Ba Ria - Vung Tau", "Binh Duong", "Binh Phuoc", "Tay Ninh", "Dong Nai", "Long An", "Tien Giang", "Ben Tre", "Tra Vinh", "Vinh Long", "Can Tho", "Hau Giang", "Soc Trang", "An Giang", "Dong Thap", "Kien Giang", "Bac Lieu", "Ca Mau"]
};

const getRegion = (province) => {
    for (const [region, provinces] of Object.entries(REGION_MAP)) {
        if (provinces.includes(province)) {
            return region;
        }
    }
    return null;
};

const calculateLocationScore = (user1Province, user2Province) => {
    if (user1Province === user2Province) {
        return 5; // Cung tinh
    }
    
    const region1 = getRegion(user1Province);
    const region2 = getRegion(user2Province);
    
    if (region1 === region2) {
        return 2; // Cung mien
    } else if ((region1 === "Trung" && region2 === "Nam") || (region1 === "Trung" && region2 === "Bac") ||
               (region1 === "Nam" && region2 === "Trung") || (region1 === "Bac" && region2 === "Trung")) {
        return -2; // Trung - Nam hoac Trung - Bac
    } else {
        return -5; // Bac - Nam
    }
};

module.exports = calculateLocationScore;