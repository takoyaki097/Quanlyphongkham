/**
 * FILE: js/knowledge-herbs.js
 * CHỨC NĂNG: Cơ sở dữ liệu Dược liệu (Phân loại để hiển thị trong Modal).
 */

window.knowledge = window.knowledge || {};

// 1. DANH MỤC THUỐC (HERB DATABASE)
window.knowledge.herbsDB = [
    // --- GIẢI BIỂU (Cảm mạo) ---
    { name: 'Tía tô', category: 'Giải Biểu', tags: ['cảm lạnh', 'an thai', 'giải độc cua cá'] },
    { name: 'Kinh giới', category: 'Giải Biểu', tags: ['cảm lạnh', 'dị ứng', 'cầm máu'] },
    { name: 'Gừng tươi', category: 'Giải Biểu', tags: ['ôn trung', 'nôn', 'lạnh bụng', 'cảm hàn'] },
    { name: 'Bạc hà', category: 'Giải Biểu', tags: ['đau đầu', 'đau mắt', 'cảm nhiệt'] },
    { name: 'Cát căn', category: 'Giải Biểu', tags: ['đau vai gáy', 'sốt', 'khát nước'] },
    { name: 'Bạch chỉ', category: 'Giải Biểu', tags: ['đau đầu', 'xoang', 'đau răng'] },
    { name: 'Kim ngân hoa', category: 'Giải Biểu', tags: ['mẩn ngứa', 'mụn nhọt', 'viêm họng'] },

    // --- BỔ DƯỠNG (Bổ Khí/Huyết/Âm/Dương) ---
    { name: 'Nhân sâm', category: 'Bổ Dưỡng', tags: ['đại bổ nguyên khí', 'suy nhược', 'cấp cứu'] },
    { name: 'Đảng sâm', category: 'Bổ Dưỡng', tags: ['bổ khí', 'kém ăn', 'mệt mỏi'] },
    { name: 'Hoàng kỳ', category: 'Bổ Dưỡng', tags: ['bổ khí', 'thăng dương', 'sa tử cung', 'mồ hôi trộm'] },
    { name: 'Bạch truật', category: 'Bổ Dưỡng', tags: ['kiện tỳ', 'táo bón', 'tiêu chảy', 'an thai'] },
    { name: 'Thục địa', category: 'Bổ Dưỡng', tags: ['bổ huyết', 'bổ thận', 'đen tóc'] },
    { name: 'Đương quy', category: 'Bổ Dưỡng', tags: ['bổ huyết', 'hoạt huyết', 'đau bụng kinh'] },
    { name: 'Bạch thược', category: 'Bổ Dưỡng', tags: ['dưỡng huyết', 'giảm đau', 'chuột rút'] },
    { name: 'Kỷ tử', category: 'Bổ Dưỡng', tags: ['bổ mắt', 'bổ can thận', 'đẹp da'] },
    { name: 'Đỗ trọng', category: 'Bổ Dưỡng', tags: ['đau lưng', 'bổ thận dương', 'an thai'] },
    { name: 'Nhục thung dung', category: 'Bổ Dưỡng', tags: ['bổ thận dương', 'nhuận tràng', 'liệt dương'] },

    // --- TRỪ ĐÀM & CHỈ KHÁI (Ho/Đờm) ---
    { name: 'Trần bì', category: 'Trừ Đàm', tags: ['ho đờm', 'đầy bụng', 'khó tiêu'] },
    { name: 'Bán hạ', category: 'Trừ Đàm', tags: ['ho đờm nhiều', 'nôn mửa'] },
    { name: 'Cát cánh', category: 'Trừ Đàm', tags: ['ho', 'viêm họng', 'mất tiếng'] },
    { name: 'Hạnh nhân', category: 'Trừ Đàm', tags: ['ho suyễn', 'nhuận tràng'] },
    { name: 'Mạch môn', category: 'Trừ Đàm', tags: ['ho khan', 'bổ phổi', 'nhuận tràng'] },

    // --- LÝ KHÍ & TIÊU HÓA ---
    { name: 'Hương phụ', category: 'Lý Khí', tags: ['đau bụng kinh', 'đau dạ dày', 'stress'] },
    { name: 'Mộc hương', category: 'Lý Khí', tags: ['đau bụng', 'tiêu chảy', 'lỵ'] },
    { name: 'Sa nhân', category: 'Lý Khí', tags: ['an thai', 'đầy bụng', 'tiêu chảy'] },
    { name: 'Chỉ thực', category: 'Lý Khí', tags: ['táo bón', 'sa dạ dày', 'đầy trướng'] },

    // --- HOẠT HUYẾT (Đau nhức/Chấn thương) ---
    { name: 'Xuyên khung', category: 'Hoạt Huyết', tags: ['đau đầu', 'đau nhức', 'hành khí'] },
    { name: 'Ngưu tất', category: 'Hoạt Huyết', tags: ['đau lưng', 'đau gối', 'hạ huyết áp'] },
    { name: 'Đan sâm', category: 'Hoạt Huyết', tags: ['đau tim', 'mất ngủ', 'bổ huyết'] },
    { name: 'Ích mẫu', category: 'Hoạt Huyết', tags: ['kinh nguyệt', 'đẹp da', 'lợi tiểu'] },
    { name: 'Ngải cứu', category: 'Hoạt Huyết', tags: ['trừ hàn', 'đau bụng kinh', 'cầm máu'] },
    { name: 'Quế chi', category: 'Hoạt Huyết', tags: ['cảm lạnh', 'đau nhức', 'ấm kinh lạc'] },

    // --- AN THẦN ---
    { name: 'Lạc tiên', category: 'An Thần', tags: ['mất ngủ', 'an thần'] },
    { name: 'Vông nem', category: 'An Thần', tags: ['mất ngủ', 'trừ phong thấp'] },
    { name: 'Tâm sen', category: 'An Thần', tags: ['mất ngủ', 'thanh nhiệt', 'huyết áp cao'] },
    { name: 'Toan táo nhân', category: 'An Thần', tags: ['mất ngủ', 'mồ hôi trộm'] }
];

// 2. DANH MỤC PHÂN LOẠI
window.knowledge.herbCategories = ['Giải Biểu', 'Bổ Dưỡng', 'Trừ Đàm', 'Lý Khí', 'Hoạt Huyết', 'An Thần'];
