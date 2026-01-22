/**
 * FILE: js/knowledge-time.js
 * CHỨC NĂNG: Bộ máy tính toán thời gian & Y Lý (TCM Time Engine).
 * PHIÊN BẢN: 2.2 (Update Bio-Clock Logic)
 * * MODULES:
 * 1. knowledge.lunar: Lịch Âm, Can Chi (Năm, Tháng, Ngày).
 * 2. knowledge.yunQi: Ngũ Vận Lục Khí (Khí hậu năm).
 * 3. knowledge.ziWuFlow: Tí Ngọ Lưu Chú (Thời châm, Huyệt Bổ/Tả/Nguyên).
 * 4. knowledge.bioClock: Đồng hồ sinh học 12 canh giờ (MỚI).
 */

window.knowledge = window.knowledge || {};

// ============================================================
// 1. CÔNG CỤ LỊCH ÂM (LUNAR CALENDAR UTILS)
// ============================================================
window.knowledge.lunar = {
    can: ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"],
    chi: ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"],

    getLunarDetails: function() {
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        // 1. LẤY NGÀY ÂM TỪ INTL API (CHÍNH XÁC CAO)
        let lDay = dd, lMonth = mm, lYear = yyyy;
        try {
            const formatter = new Intl.DateTimeFormat('vi-VN', {
                calendar: 'chinese',
                timeZone: 'Asia/Ho_Chi_Minh',
                day: 'numeric', month: 'numeric', year: 'numeric'
            });
            const parts = formatter.formatToParts(today);
            parts.forEach(p => {
                if (p.type === 'day') lDay = parseInt(p.value);
                if (p.type === 'month') lMonth = parseInt(p.value);
                if (p.type === 'relatedYear') lYear = parseInt(p.value);
                else if (p.type === 'year' && !lYear) lYear = parseInt(p.value.replace(/[^0-9]/g, ''));
            });
        } catch (e) { console.error("Lỗi Intl:", e); }

        // 2. TÍNH CAN CHI
        // A. Năm
        const canNamIdx = (lYear + 6) % 10;
        const chiNamIdx = (lYear + 8) % 12;
        
        // B. Tháng (Ngũ Hổ Độn: Giáp Kỷ khởi Bính Dần)
        const baseMonthCan = (canNamIdx % 5) * 2; 
        const currentMonthCan = (baseMonthCan + (lMonth - 1)) % 10;
        const currentMonthChi = (lMonth + 1) % 12;

        // C. Ngày (Công thức Julian Day)
        const a = Math.floor((14 - mm) / 12);
        const y = yyyy + 4800 - a;
        const m = mm + 12 * a - 3;
        const jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        const canNgayIdx = (jd + 9) % 10;
        const chiNgayIdx = (jd + 1) % 12;

        return {
            date: `${dd}/${mm}/${yyyy}`,
            lunarDate: `${lDay}/${lMonth}/${lYear}`,
            canDayIdx: canNgayIdx, // Quan trọng: Dùng để tính giờ Tí Ngọ
            chiDayIdx: chiNgayIdx,
            full: `${lDay}/${lMonth}/${lYear} - Ngày ${this.can[canNgayIdx]} ${this.chi[chiNgayIdx]}, Tháng ${this.can[currentMonthCan]} ${this.chi[currentMonthChi]}, Năm ${this.can[canNamIdx]} ${this.chi[chiNamIdx]}`
        };
    }
};

// ============================================================
// 2. NGŨ VẬN LỤC KHÍ (YUNQI ENGINE)
// ============================================================
window.knowledge.yunQi = {
    stemNature: {
        0: 'Thổ Thái Quá (Ẩm thấp)', 1: 'Kim Bất Cập (Gió nhiều)',
        2: 'Thủy Thái Quá (Lạnh giá)', 3: 'Mộc Bất Cập (Nóng khô)',
        4: 'Hỏa Thái Quá (Oi bức)', 5: 'Thổ Bất Cập (Gió ẩm)',
        6: 'Kim Thái Quá (Khô hanh)', 7: 'Thủy Bất Cập (Mưa nhiều)',
        8: 'Mộc Thái Quá (Gió lớn)', 9: 'Hỏa Bất Cập (Sương lạnh)'
    },
    getCurrentInfo: function() {
        const year = new Date().getFullYear();
        const stemIdx = (year - 4) % 10;
        const branchIdx = (year - 4) % 12;
        const s = stemIdx < 0 ? stemIdx + 10 : stemIdx;
        const b = branchIdx < 0 ? branchIdx + 12 : branchIdx;
        const stems = window.knowledge.lunar.can;
        const branches = window.knowledge.lunar.chi;
        return { 
            year: `Năm ${stems[s]} ${branches[b]}`, 
            nature: `Vận ${this.stemNature[s]}` 
        };
    }
};

// ============================================================
// 3. TÍ NGỌ LƯU CHÚ (ZI WU FLOW - FULL ENGINE)
// ============================================================
window.knowledge.ziWuFlow = {
    // Dữ liệu 12 Kinh và Huyệt Ngũ Du (Tỉnh, Huỳnh, Du, Kinh, Hợp) + Nguyên Huyệt
    meridians: {
        'Tý': { name: 'Đởm (Gallbladder)', element: 'Mộc', type: 'Dương', points: ['Túc Khiếu Âm', 'Hiệp Khê', 'Túc Lâm Khấp', 'Dương Phụ', 'Dương Lăng Tuyền'], source: 'Khâu Hư' },
        'Sửu': { name: 'Can (Liver)', element: 'Mộc', type: 'Âm', points: ['Đại Đôn', 'Hành Gian', 'Thái Xung', 'Trung Phong', 'Khúc Tuyền'], source: 'Thái Xung' },
        'Dần': { name: 'Phế (Lung)', element: 'Kim', type: 'Âm', points: ['Thiếu Thương', 'Ngư Tế', 'Thái Uyên', 'Kinh Cừ', 'Xích Trạch'], source: 'Thái Uyên' },
        'Mão': { name: 'Đại Trường (Large Intestine)', element: 'Kim', type: 'Dương', points: ['Thương Dương', 'Nhị Gian', 'Tam Gian', 'Dương Khê', 'Khúc Trì'], source: 'Hợp Cốc' },
        'Thìn': { name: 'Vị (Stomach)', element: 'Thổ', type: 'Dương', points: ['Lệ Đoài', 'Nội Đình', 'Hãm Cốc', 'Giải Khê', 'Túc Tam Lý'], source: 'Xung Dương' },
        'Tỵ': { name: 'Tỳ (Spleen)', element: 'Thổ', type: 'Âm', points: ['Ẩn Bạch', 'Đại Đô', 'Thái Bạch', 'Thương Khâu', 'Âm Lăng Tuyền'], source: 'Thái Bạch' },
        'Ngọ': { name: 'Tâm (Heart)', element: 'Hỏa', type: 'Âm', points: ['Thiếu Xung', 'Thiếu Phủ', 'Thần Môn', 'Linh Đạo', 'Thiếu Hải'], source: 'Thần Môn' },
        'Mùi': { name: 'Tiểu Trường (Small Intestine)', element: 'Hỏa', type: 'Dương', points: ['Thiếu Trạch', 'Tiền Cốc', 'Hậu Khê', 'Dương Cốc', 'Tiểu Hải'], source: 'Uyển Cốt' },
        'Thân': { name: 'Bàng Quang (Bladder)', element: 'Thủy', type: 'Dương', points: ['Chí Âm', 'Thông Cốc', 'Thúc Cốt', 'Côn Lôn', 'Ủy Trung'], source: 'Kinh Cốt' },
        'Dậu': { name: 'Thận (Kidney)', element: 'Thủy', type: 'Âm', points: ['Dũng Tuyền', 'Nhiên Cốc', 'Thái Khê', 'Phục Lưu', 'Âm Cốc'], source: 'Thái Khê' },
        'Tuất': { name: 'Tâm Bào (Pericardium)', element: 'Hỏa', type: 'Âm', points: ['Trung Xung', 'Lao Cung', 'Đại Lăng', 'Gian Sử', 'Khúc Trạch'], source: 'Đại Lăng' },
        'Hợi': { name: 'Tam Tiêu (San Jiao)', element: 'Hỏa', type: 'Dương', points: ['Quan Xung', 'Dịch Môn', 'Trung Chử', 'Chi Cấu', 'Thiên Tỉnh'], source: 'Dương Trì' }
    },
    
    // Ngũ Hành Tương Sinh: Mộc -> Hỏa -> Thổ -> Kim -> Thủy -> Mộc
    elementOrder: ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'],

    // HÀM 1: Tính Can Giờ theo Can Ngày (Ngũ Hổ Độn)
    getHourStemIdx: function(dayStemIdx, hourBranchIdx) {
        // Công thức: (Can Ngày % 5) * 2 = Can giờ Tý khởi đầu
        const startStem = (dayStemIdx % 5) * 2;
        return (startStem + hourBranchIdx) % 10;
    },

    // HÀM 2: Tính Can Ngày cho một ngày bất kỳ (Dùng cho tra cứu lịch)
    getDayStemIndex: function(date) {
        const dd = date.getDate();
        const mm = date.getMonth() + 1;
        const yyyy = date.getFullYear();
        const a = Math.floor((14 - mm) / 12);
        const y = yyyy + 4800 - a;
        const m = mm + 12 * a - 3;
        const jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        return (jd + 9) % 10;
    },

    // HÀM 3: Tìm Huyệt Bổ/Tả/Bản dựa trên Ngũ Hành
    getSpecialPoints: function(meridianData) {
        const points = meridianData.points; // [Tỉnh, Huỳnh, Du, Kinh, Hợp]
        let pointElements = [];
        
        // Gán hành cho huyệt: Âm (Mộc->Thủy), Dương (Kim->Thổ)
        if (meridianData.type === 'Âm') {
            pointElements = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
        } else {
            pointElements = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ'];
        }

        const meIdx = this.elementOrder.indexOf(meridianData.element); // Hành của Kinh
        const motherIdx = (meIdx - 1 + 5) % 5; // Hành Mẹ (Sinh nhập)
        const sonIdx = (meIdx + 1) % 5;       // Hành Con (Sinh xuất)

        // Hàm tìm tên huyệt theo hành
        const findPoint = (targetElementIdx) => {
            const targetElement = this.elementOrder[targetElementIdx];
            const idx = pointElements.indexOf(targetElement);
            return idx !== -1 ? points[idx] : 'N/A';
        };

        return {
            horary: findPoint(meIdx),       // Huyệt Bản (Giờ) - KHAI
            tonification: findPoint(motherIdx), // Huyệt Mẹ - BỔ
            sedation: findPoint(sonIdx),    // Huyệt Con - TẢ
            source: meridianData.source     // Huyệt NGUYÊN
        };
    },

    // HÀM API 1: Lấy thông tin thời gian thực (Current Time)
    getCurrentFlow: function() {
        const now = new Date();
        const hour = now.getHours();
        
        // Tính Chi Giờ (Tý = 23h-1h => index 0)
        let branchIdx = Math.floor((hour + 1) / 2) % 12;
        const branches = window.knowledge.lunar.chi;
        const stems = window.knowledge.lunar.can;
        
        // Lấy Can Ngày hiện tại từ module lunar
        const lunarInfo = window.knowledge.lunar.getLunarDetails();
        const hourStemIdx = this.getHourStemIdx(lunarInfo.canDayIdx, branchIdx);
        
        const currentBranch = branches[branchIdx];
        const currentStem = stems[hourStemIdx];
        const activeMeridian = this.meridians[currentBranch];
        const specialPoints = this.getSpecialPoints(activeMeridian);
        
        return {
            can: currentStem,
            chi: currentBranch,
            time: `${hour}h (${currentStem} ${currentBranch})`,
            meridian: activeMeridian.name,
            element: activeMeridian.element,
            openPoint: specialPoints.horary,
            tonify: specialPoints.tonification,
            sedate: specialPoints.sedation,
            source: specialPoints.source,
            msg: `Giờ ${currentBranch} vượng ${activeMeridian.name} (${activeMeridian.element}).`
        };
    },

    // HÀM API 2: Lấy danh sách 12 canh giờ của một ngày bất kỳ (Schedule)
    getAllFlows: function(targetDate = new Date()) {
        const dayStemIdx = this.getDayStemIndex(targetDate);
        const branches = window.knowledge.lunar.chi;
        const stems = window.knowledge.lunar.can;
        const schedule = [];

        for (let i = 0; i < 12; i++) {
            const hourStemIdx = this.getHourStemIdx(dayStemIdx, i);
            const currentBranch = branches[i];
            const currentStem = stems[hourStemIdx];
            const activeMeridian = this.meridians[currentBranch];
            const points = this.getSpecialPoints(activeMeridian);
            let startH = (i * 2 - 1 + 24) % 24; 
            let endH = (startH + 2) % 24;
            const timeStr = `${startH.toString().padStart(2,'0')}:00 - ${endH.toString().padStart(2,'0')}:00`;

            schedule.push({
                id: i,
                timeRange: timeStr,
                canChi: `${currentStem} ${currentBranch}`,
                meridianName: activeMeridian.name,
                meridianElement: activeMeridian.element,
                open: points.horary,
                tonify: points.tonification,
                sedate: points.sedation,
                source: points.source
            });
        }
        return schedule;
    }
};

// ============================================================
// 4. ĐỒNG HỒ SINH HỌC 12 CANH GIỜ (BIO CLOCK - MỚI)
// ============================================================
window.knowledge.bioClock = {
    zones: [
        { id: 'ty', name: 'Tý', timeRange: '23:00 - 01:00', meridian: 'Đởm Kinh', advice: 'Ngủ sâu, đởm tạo máu' },
        { id: 'suu', name: 'Sửu', timeRange: '01:00 - 03:00', meridian: 'Can Kinh', advice: 'Can thải độc, ngủ say dưỡng Can' },
        { id: 'dan', name: 'Dần', timeRange: '03:00 - 05:00', meridian: 'Phế Kinh', advice: 'Phế khí vận chuyển sâu, nên ngủ sâu' },
        { id: 'mao', name: 'Mão', timeRange: '05:00 - 07:00', meridian: 'Đại Trường Kinh', advice: 'Thời gian thải độc, uống nước ấm' },
        { id: 'thin', name: 'Thìn', timeRange: '07:00 - 09:00', meridian: 'Vị Kinh', advice: 'Thời gian ăn sáng tốt nhất' },
        { id: 'ty_ran', name: 'Tỵ', timeRange: '09:00 - 11:00', meridian: 'Tỳ Kinh', advice: 'Công việc học tập, Tỳ chủ vận hóa' },
        { id: 'ngo', name: 'Ngọ', timeRange: '11:00 - 13:00', meridian: 'Tâm Kinh', advice: 'Ngủ trưa nhỏ, dưỡng tâm thời gian' },
        { id: 'mui', name: 'Mùi', timeRange: '13:00 - 15:00', meridian: 'Tiểu Trường Kinh', advice: 'Tiêu hóa hấp thu, uống nhiều nước' },
        { id: 'than', name: 'Thân', timeRange: '15:00 - 17:00', meridian: 'Bàng Quang Kinh', advice: 'Thải độc lợi thủy, uống trà nhiều' },
        { id: 'dau', name: 'Dậu', timeRange: '17:00 - 19:00', meridian: 'Thận Kinh', advice: 'Thời gian bổ thận, thích hợp ăn tối' },
        { id: 'tuat', name: 'Tuất', timeRange: '19:00 - 21:00', meridian: 'Tâm Bào Kinh', advice: 'Đi bộ thư giãn, chuẩn bị nghỉ ngơi' },
        { id: 'hoi', name: 'Hợi', timeRange: '21:00 - 23:00', meridian: 'Tam Tiêu Kinh', advice: 'Thời gian vào giấc ngủ, điều lý tam tiêu' }
    ],

    // Hàm lấy ID của giờ hiện tại (để highlight trên giao diện)
    getCurrentZoneId: function() {
        const h = new Date().getHours();
        if (h >= 23 || h < 1) return 'ty';
        if (h >= 1 && h < 3) return 'suu';
        if (h >= 3 && h < 5) return 'dan';
        if (h >= 5 && h < 7) return 'mao';
        if (h >= 7 && h < 9) return 'thin';
        if (h >= 9 && h < 11) return 'ty_ran';
        if (h >= 11 && h < 13) return 'ngo';
        if (h >= 13 && h < 15) return 'mui';
        if (h >= 15 && h < 17) return 'than';
        if (h >= 17 && h < 19) return 'dau';
        if (h >= 19 && h < 21) return 'tuat';
        if (h >= 21 && h < 23) return 'hoi';
        return 'ty';
    },

    // Hàm lấy thông tin chi tiết giờ hiện tại
    getCurrentBioInfo: function() {
        const id = this.getCurrentZoneId();
        return this.zones.find(z => z.id === id);
    }
};
