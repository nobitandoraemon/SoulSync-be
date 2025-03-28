const Provinces = {
    "An Giang": { lat: 10.5200, lon: 105.1259 },
    "Ba Ria - Vung Tau": { lat: 10.4950, lon: 107.1689 },
    "Bac Giang": { lat: 21.2810, lon: 106.1972 },
    "Bac Kan": { lat: 22.1470, lon: 105.8348 },
    "Bac Lieu": { lat: 9.2940, lon: 105.7210 },
    "Bac Ninh": { lat: 21.1860, lon: 106.0763 },
    "Ben Tre": { lat: 10.2434, lon: 106.3750 },
    "Binh Dinh": { lat: 14.1665, lon: 108.9027 },
    "Binh Duong": { lat: 11.3254, lon: 106.4770 },
    "Binh Phuoc": { lat: 11.7512, lon: 106.9375 },
    "Binh Thuan": { lat: 11.0904, lon: 108.0721 },
    "Ca Mau": { lat: 9.1768, lon: 105.1524 },
    "Can Tho": { lat: 10.0452, lon: 105.7469 },
    "Cao Bang": { lat: 22.6650, lon: 106.2579 },
    "Da Nang": { lat: 16.0544, lon: 108.2022 },
    "Dak Lak": { lat: 12.6667, lon: 108.0382 },
    "Dak Nong": { lat: 12.2620, lon: 107.6098 },
    "Dien Bien": { lat: 21.3860, lon: 103.0230 },
    "Dong Nai": { lat: 10.9340, lon: 107.1340 },
    "Dong Thap": { lat: 10.5289, lon: 105.4471 },
    "Gia Lai": { lat: 13.8073, lon: 108.1094 },
    "Ha Giang": { lat: 22.8283, lon: 104.9849 },
    "Ha Nam": { lat: 20.5835, lon: 105.9229 },
    "Hanoi": { lat: 21.0285, lon: 105.8542 },
    "Ha Tinh": { lat: 18.3550, lon: 105.8877 },
    "Hai Duong": { lat: 20.9375, lon: 106.3146 },
    "Hai Phong": { lat: 20.8449, lon: 106.6881 },
    "Hau Giang": { lat: 9.7846, lon: 105.4700 },
    "Hoa Binh": { lat: 20.8170, lon: 105.3376 },
    "Hung Yen": { lat: 20.6466, lon: 106.0510 },
    "Khanh Hoa": { lat: 12.2586, lon: 109.0526 },
    "Kien Giang": { lat: 10.0120, lon: 105.0809 },
    "Kon Tum": { lat: 14.3498, lon: 108.0000 },
    "Lai Chau": { lat: 22.4016, lon: 103.4707 },
    "Lam Dong": { lat: 11.5753, lon: 108.1429 },
    "Lang Son": { lat: 21.8537, lon: 106.7615 },
    "Lao Cai": { lat: 22.4852, lon: 103.9707 },
    "Long An": { lat: 10.5432, lon: 106.4055 },
    "Nam Dinh": { lat: 20.4337, lon: 106.1770 },
    "Nghe An": { lat: 18.8081, lon: 105.6700 },
    "Ninh Binh": { lat: 20.2506, lon: 105.9745 },
    "Ninh Thuan": { lat: 11.6739, lon: 108.9984 },
    "Phu Tho": { lat: 21.3256, lon: 105.1914 },
    "Phu Yen": { lat: 13.1626, lon: 109.1237 },
    "Quang Binh": { lat: 17.4685, lon: 106.6223 },
    "Quang Nam": { lat: 15.5394, lon: 108.0191 },
    "Quang Ngai": { lat: 15.1205, lon: 108.7923 },
    "Quang Ninh": { lat: 21.0064, lon: 107.2925 },
    "Quang Tri": { lat: 16.7471, lon: 107.1915 },
    "Soc Trang": { lat: 9.6025, lon: 105.9739 },
    "Son La": { lat: 21.3280, lon: 103.9143 },
    "Tay Ninh": { lat: 11.2892, lon: 106.0980 },
    "Thai Binh": { lat: 20.4500, lon: 106.3400 },
    "Thai Nguyen": { lat: 21.5942, lon: 105.8482 },
    "Thanh Hoa": { lat: 19.8067, lon: 105.7852 },
    "Thua Thien Hue": { lat: 16.4637, lon: 107.5909 },
    "Tien Giang": { lat: 10.4493, lon: 106.3421 },
    "Ho Chi Minh City": { lat: 10.7769, lon: 106.7009 },
    "Tra Vinh": { lat: 9.9347, lon: 106.3450 },
    "Tuyen Quang": { lat: 21.8070, lon: 105.2131 },
    "Vinh Long": { lat: 10.2536, lon: 105.9722 },
    "Vinh Phuc": { lat: 21.3089, lon: 105.6049 },
    "Yen Bai": { lat: 21.7229, lon: 104.9110 }
};

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Khoảng cách tính bằng km
};

const calculateLocationScore = (user1Province, user2Province) => {
    if (!Provinces[user1Province] || !Provinces[user2Province]) {
        return 0;
    }

    const { lat: lat1, lon: lon1 } = Provinces[user1Province];
    const { lat: lat2, lon: lon2 } = Provinces[user2Province];

    const distance = haversine(lat1, lon1, lat2, lon2);

    if (distance <= 50) return 10;
    if (distance <= 100) return 8;
    if (distance <= 200) return 6;
    if (distance <= 400) return 4;
    if (distance <= 600) return 2;
    if (distance <= 800) return 1;
    if (distance <= 1000) return 0;
    if (distance <= 1200) return -1;
    if (distance <= 1500) return -2;
    return -3;
};

module.exports = calculateLocationScore;