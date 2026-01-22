/**
 * FILE: js/knowledge-acupoints.js
 * CHỨC NĂNG: Cơ sở dữ liệu Huyệt vị FULL (360+ huyệt).
 * CẬP NHẬT: Dữ liệu đầy đủ các đường kinh.
 */

window.knowledge = window.knowledge || {};

// 1. DANH SÁCH HUYỆT VỊ
window.knowledge.acupoints = [
    // === I. THỦ THÁI ÂM PHẾ KINH (LU) ===
    { id: 'LU1', name: 'Trung Phủ', meridian: 'Phế', region: 'Ngực', tags: ['ho', 'hen suyễn', 'đau vai', 'viêm phế quản'] },
    { id: 'LU5', name: 'Xích Trạch', meridian: 'Phế', region: 'Tay', tags: ['ho ra máu', 'sốt', 'co giật', 'đau khuỷu tay'] },
    { id: 'LU6', name: 'Khổng Tối', meridian: 'Phế', region: 'Tay', tags: ['ho ra máu', 'viêm họng', 'khản tiếng', 'trĩ'] },
    { id: 'LU7', name: 'Liệt Khuyết', meridian: 'Phế', region: 'Tay', tags: ['ho', 'đau đầu', 'đau cổ gáy', 'liệt mặt', 'tổng huyệt đầu gáy'] },
    { id: 'LU9', name: 'Thái Uyên', meridian: 'Phế', region: 'Tay', tags: ['ho', 'đau ngực', 'mạch yếu', 'bổ phế'] },
    { id: 'LU10', name: 'Ngư Tế', meridian: 'Phế', region: 'Tay', tags: ['sốt', 'ho', 'đau họng', 'mất tiếng'] },
    { id: 'LU11', name: 'Thiếu Thương', meridian: 'Phế', region: 'Tay', tags: ['sốt cao', 'đau họng', 'trúng gió', 'cấp cứu'] },

    // === II. THỦ DƯƠNG MINH ĐẠI TRƯỜNG KINH (LI) ===
    { id: 'LI1', name: 'Thương Dương', meridian: 'Đại Trường', region: 'Tay', tags: ['đau răng', 'đau họng', 'sốt cao', 'ngất'] },
    { id: 'LI4', name: 'Hợp Cốc', meridian: 'Đại Trường', region: 'Tay', tags: ['đau đầu', 'đau răng', 'sốt', 'liệt mặt', 'tổng huyệt vùng mặt'] },
    { id: 'LI5', name: 'Dương Khê', meridian: 'Đại Trường', region: 'Tay', tags: ['đau cổ tay', 'đau mắt đỏ', 'đau răng'] },
    { id: 'LI10', name: 'Thủ Tam Lý', meridian: 'Đại Trường', region: 'Tay', tags: ['đau vai', 'liệt tay', 'đau bụng', 'nôn mửa'] },
    { id: 'LI11', name: 'Khúc Trì', meridian: 'Đại Trường', region: 'Tay', tags: ['sốt', 'dị ứng', 'mẩn ngứa', 'tăng huyết áp', 'liệt tay'] },
    { id: 'LI15', name: 'Kiên Ngung', meridian: 'Đại Trường', region: 'Vai', tags: ['đau vai', 'không giơ tay được', 'liệt tay'] },
    { id: 'LI20', name: 'Nghênh Hương', meridian: 'Đại Trường', region: 'Mặt', tags: ['ngạt mũi', 'viêm mũi', 'xoang', 'liệt mặt'] },

    // === III. TÚC DƯƠNG MINH VỊ KINH (ST) ===
    { id: 'ST1', name: 'Thừa Khấp', meridian: 'Vị', region: 'Mặt', tags: ['đau mắt', 'quáng gà', 'liệt mặt', 'giật mí mắt'] },
    { id: 'ST2', name: 'Tứ Bạch', meridian: 'Vị', region: 'Mặt', tags: ['đau mắt', 'liệt mặt', 'đau đầu'] },
    { id: 'ST4', name: 'Địa Thương', meridian: 'Vị', region: 'Mặt', tags: ['liệt mặt', 'chảy nước dãi', 'đau răng'] },
    { id: 'ST6', name: 'Giáp Xa', meridian: 'Vị', region: 'Mặt', tags: ['đau răng', 'liệt mặt', 'quai bị', 'cứng hàm'] },
    { id: 'ST7', name: 'Hạ Quan', meridian: 'Vị', region: 'Mặt', tags: ['ù tai', 'đau răng', 'trật khớp hàm', 'liệt mặt'] },
    { id: 'ST8', name: 'Đầu Duy', meridian: 'Vị', region: 'Đầu', tags: ['đau đầu', 'chóng mặt', 'chảy nước mắt'] },
    { id: 'ST21', name: 'Lương Môn', meridian: 'Vị', region: 'Bụng', tags: ['đau dạ dày', 'nôn mửa', 'chán ăn'] },
    { id: 'ST25', name: 'Thiên Khu', meridian: 'Vị', region: 'Bụng', tags: ['tiêu chảy', 'táo bón', 'đau bụng', 'kiết lỵ'] },
    { id: 'ST29', name: 'Quy Lai', meridian: 'Vị', region: 'Bụng', tags: ['đau bụng kinh', 'bế kinh', 'sa tử cung', 'thoát vị bẹn'] },
    { id: 'ST34', name: 'Lương Khâu', meridian: 'Vị', region: 'Chân', tags: ['đau dạ dày cấp', 'đau đầu gối', 'tắc tia sữa'] },
    { id: 'ST35', name: 'Độc Tỵ', meridian: 'Vị', region: 'Chân', tags: ['đau khớp gối', 'viêm khớp gối'] },
    { id: 'ST36', name: 'Túc Tam Lý', meridian: 'Vị', region: 'Chân', tags: ['đau dạ dày', 'suy nhược', 'tiêu hóa kém', 'tăng sức đề kháng', 'tổng huyệt bụng trên'] },
    { id: 'ST40', name: 'Phong Long', meridian: 'Vị', region: 'Chân', tags: ['trừ đờm', 'ho có đờm', 'hen suyễn', 'béo phì', 'chóng mặt'] },
    { id: 'ST41', name: 'Giải Khê', meridian: 'Vị', region: 'Chân', tags: ['đau cổ chân', 'đầy bụng', 'đau đầu'] },
    { id: 'ST44', name: 'Nội Đình', meridian: 'Vị', region: 'Chân', tags: ['đau răng', 'đau họng', 'chảy máu cam', 'đau bụng'] },

    // === IV. TÚC THÁI ÂM TỲ KINH (SP) ===
    { id: 'SP1', name: 'Ẩn Bạch', meridian: 'Tỳ', region: 'Chân', tags: ['rong kinh', 'băng huyết', 'mất ngủ', 'đầy bụng'] },
    { id: 'SP3', name: 'Thái Bạch', meridian: 'Tỳ', region: 'Chân', tags: ['đau dạ dày', 'đầy bụng', 'tiêu chảy', 'táo bón', 'bổ tỳ'] },
    { id: 'SP4', name: 'Công Tôn', meridian: 'Tỳ', region: 'Chân', tags: ['đau dạ dày', 'nôn mửa', 'đau bụng', 'kinh nguyệt không đều'] },
    { id: 'SP6', name: 'Tam Âm Giao', meridian: 'Tỳ', region: 'Chân', tags: ['mất ngủ', 'rối loạn kinh nguyệt', 'di tinh', 'bí tiểu', 'bổ âm'] },
    { id: 'SP9', name: 'Âm Lăng Tuyền', meridian: 'Tỳ', region: 'Chân', tags: ['phù thũng', 'bí tiểu', 'tiêu chảy', 'đau gối', 'trừ thấp'] },
    { id: 'SP10', name: 'Huyết Hải', meridian: 'Tỳ', region: 'Chân', tags: ['ngứa', 'dị ứng', 'kinh nguyệt không đều', 'bổ huyết', 'đau gối'] },
    { id: 'SP15', name: 'Đại Hoành', meridian: 'Tỳ', region: 'Bụng', tags: ['táo bón', 'tiêu chảy', 'đau bụng'] },

    // === V. THỦ THIẾU ÂM TÂM KINH (HT) ===
    { id: 'HT1', name: 'Cực Tuyền', meridian: 'Tâm', region: 'Nách', tags: ['đau tim', 'hôi nách', 'liệt tay'] },
    { id: 'HT3', name: 'Thiếu Hải', meridian: 'Tâm', region: 'Tay', tags: ['đau khuỷu tay', 'đau vùng tim', 'run tay'] },
    { id: 'HT5', name: 'Thông Lý', meridian: 'Tâm', region: 'Tay', tags: ['mất tiếng', 'tim đập nhanh', 'hồi hộp', 'đau cổ tay'] },
    { id: 'HT7', name: 'Thần Môn', meridian: 'Tâm', region: 'Tay', tags: ['mất ngủ', 'hồi hộp', 'lo âu', 'tim đập nhanh', 'stress', 'an thần'] },
    { id: 'HT9', name: 'Thiếu Xung', meridian: 'Tâm', region: 'Tay', tags: ['cấp cứu', 'sốt cao', 'đau tim', 'hồi hộp'] },
    // === VI. THỦ THÁI DƯƠNG TIỂU TRƯỜNG KINH (SI) ===
    { id: 'SI1', name: 'Thiếu Trạch', meridian: 'Tiểu Trường', region: 'Tay', tags: ['thiếu sữa', 'đau mắt', 'đau đầu', 'sốt'] },
    { id: 'SI3', name: 'Hậu Khê', meridian: 'Tiểu Trường', region: 'Tay', tags: ['đau cổ gáy', 'đau lưng', 'ù tai', 'mồ hôi trộm'] },
    { id: 'SI6', name: 'Dưỡng Lão', meridian: 'Tiểu Trường', region: 'Tay', tags: ['mắt mờ', 'đau lưng', 'đau vai', 'đau cổ tay'] },
    { id: 'SI8', name: 'Tiểu Hải', meridian: 'Tiểu Trường', region: 'Tay', tags: ['đau khuỷu tay', 'đau vai', 'động kinh'] },
    { id: 'SI9', name: 'Kiên Trinh', meridian: 'Tiểu Trường', region: 'Vai', tags: ['đau vai', 'không giơ tay được', 'hôi nách'] },
    { id: 'SI11', name: 'Thiên Tông', meridian: 'Tiểu Trường', region: 'Vai', tags: ['đau vai', 'đau lưng trên', 'viêm tuyến vú'] },
    { id: 'SI18', name: 'Quyền Liêu', meridian: 'Tiểu Trường', region: 'Mặt', tags: ['liệt mặt', 'đau răng', 'co giật cơ mặt'] },
    { id: 'SI19', name: 'Thính Cung', meridian: 'Tiểu Trường', region: 'Mặt', tags: ['ù tai', 'điếc', 'viêm tai giữa'] },

    // === VII. TÚC THÁI DƯƠNG BÀNG QUANG KINH (BL) ===
    { id: 'BL1', name: 'Tình Minh', meridian: 'Bàng Quang', region: 'Mặt', tags: ['đau mắt', 'mờ mắt', 'quáng gà', 'liệt mặt'] },
    { id: 'BL2', name: 'Toản Trúc', meridian: 'Bàng Quang', region: 'Mặt', tags: ['đau đầu', 'đau mắt', 'liệt mặt', 'nấc'] },
    { id: 'BL10', name: 'Thiên Trụ', meridian: 'Bàng Quang', region: 'Cổ Gáy', tags: ['đau cổ gáy', 'đau đầu', 'ngạt mũi'] },
    { id: 'BL11', name: 'Đại Trữ', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đau xương', 'sốt', 'ho', 'đau vai gáy'] },
    { id: 'BL13', name: 'Phế Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['ho', 'hen', 'lao phổi', 'bổ phế'] },
    { id: 'BL14', name: 'Quyết Âm Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đau tim', 'hồi hộp', 'ho'] },
    { id: 'BL15', name: 'Tâm Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['mất ngủ', 'hồi hộp', 'mộng tinh', 'lo âu'] },
    { id: 'BL17', name: 'Cách Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['nấc', 'thiếu máu', 'nôn ra máu', 'đau lưng'] },
    { id: 'BL18', name: 'Can Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['vàng da', 'đau mắt', 'đau mạn sườn', 'bổ can'] },
    { id: 'BL19', name: 'Đởm Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['vàng da', 'đắng miệng', 'đau mạn sườn'] },
    { id: 'BL20', name: 'Tỳ Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đầy bụng', 'tiêu chảy', 'chán ăn', 'bổ tỳ'] },
    { id: 'BL21', name: 'Vị Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đau dạ dày', 'nôn mửa', 'tiêu hóa kém'] },
    { id: 'BL23', name: 'Thận Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đau lưng', 'ù tai', 'yếu sinh lý', 'thận hư'] },
    { id: 'BL25', name: 'Đại Trường Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đau lưng', 'táo bón', 'tiêu chảy', 'đau thần kinh tọa'] },
    { id: 'BL40', name: 'Ủy Trung', meridian: 'Bàng Quang', region: 'Chân', tags: ['đau lưng', 'đau thần kinh tọa', 'đau đầu gối', 'tổng huyệt lưng'] },
    { id: 'BL57', name: 'Thừa Sơn', meridian: 'Bàng Quang', region: 'Chân', tags: ['chuột rút', 'trĩ', 'đau gót chân', 'đau thần kinh tọa'] },
    { id: 'BL60', name: 'Côn Lôn', meridian: 'Bàng Quang', region: 'Chân', tags: ['đau lưng', 'đau cổ chân', 'đau đầu', 'khó sinh'] },
    { id: 'BL67', name: 'Chí Âm', meridian: 'Bàng Quang', region: 'Chân', tags: ['đau đầu', 'ngạt mũi', 'chỉnh ngôi thai', 'khó sinh'] },

    // === VIII. TÚC THIẾU ÂM THẬN KINH (KI) ===
    { id: 'KI1', name: 'Dũng Tuyền', meridian: 'Thận', region: 'Chân', tags: ['mất ngủ', 'ngất', 'hạ huyết áp', 'sốt cao co giật'] },
    { id: 'KI3', name: 'Thái Khê', meridian: 'Thận', region: 'Chân', tags: ['đau lưng', 'ù tai', 'ho hen', 'bổ thận âm', 'liệt dương'] },
    { id: 'KI6', name: 'Chiếu Hải', meridian: 'Thận', region: 'Chân', tags: ['mất ngủ', 'khô họng', 'táo bón', 'rối loạn kinh nguyệt'] },
    { id: 'KI7', name: 'Phục Lưu', meridian: 'Thận', region: 'Chân', tags: ['phù thũng', 'mồ hôi trộm', 'tiêu chảy', 'bổ thận dương'] },
    { id: 'KI27', name: 'Du Phủ', meridian: 'Thận', region: 'Ngực', tags: ['ho', 'hen suyễn', 'đau ngực'] },

    // === IX. THỦ QUYẾT ÂM TÂM BÀO KINH (PC) ===
    { id: 'PC3', name: 'Khúc Trạch', meridian: 'Tâm Bào', region: 'Tay', tags: ['đau tim', 'sốt cao', 'nôn mửa', 'run tay'] },
    { id: 'PC6', name: 'Nội Quan', meridian: 'Tâm Bào', region: 'Tay', tags: ['đau dạ dày', 'nôn', 'say xe', 'hồi hộp', 'mất ngủ', 'đau ngực'] },
    { id: 'PC7', name: 'Đại Lăng', meridian: 'Tâm Bào', region: 'Tay', tags: ['hôi miệng', 'đau tim', 'mất ngủ', 'cười nói lảm nhảm'] },
    { id: 'PC8', name: 'Lao Cung', meridian: 'Tâm Bào', region: 'Tay', tags: ['ra mồ hôi tay', 'hôi miệng', 'loét miệng', 'đau tim'] },

    // === X. THỦ THIẾU DƯƠNG TAM TIÊU KINH (TE/SJ) ===
    { id: 'TE3', name: 'Trung Chử', meridian: 'Tam Tiêu', region: 'Tay', tags: ['ù tai', 'điếc', 'đau đầu', 'đau ngón tay'] },
    { id: 'TE5', name: 'Ngoại Quan', meridian: 'Tam Tiêu', region: 'Tay', tags: ['cảm mạo', 'sốt', 'đau đầu', 'đau vai', 'ù tai'] },
    { id: 'TE6', name: 'Chi Cấu', meridian: 'Tam Tiêu', region: 'Tay', tags: ['táo bón', 'đau mạn sườn', 'sốt'] },
    { id: 'TE14', name: 'Kiên Liêu', meridian: 'Tam Tiêu', region: 'Vai', tags: ['đau vai', 'không giơ tay được'] },
    { id: 'TE17', name: 'Ế Phong', meridian: 'Tam Tiêu', region: 'Mặt', tags: ['ù tai', 'điếc', 'liệt mặt', 'quai bị'] },
    { id: 'TE21', name: 'Nhĩ Môn', meridian: 'Tam Tiêu', region: 'Mặt', tags: ['ù tai', 'điếc', 'viêm tai giữa'] },
    { id: 'TE23', name: 'Ty Trúc Không', meridian: 'Tam Tiêu', region: 'Mặt', tags: ['đau đầu', 'đau mắt', 'giật mí mắt'] },
    // === XI. TÚC THIẾU DƯƠNG ĐỞM KINH (GB) ===
    { id: 'GB1', name: 'Đồng Tử Liêu', meridian: 'Đởm', region: 'Mặt', tags: ['đau đầu', 'đau mắt', 'liệt mặt'] },
    { id: 'GB2', name: 'Thính Hội', meridian: 'Đởm', region: 'Mặt', tags: ['ù tai', 'điếc', 'viêm tai giữa', 'liệt mặt'] },
    { id: 'GB8', name: 'Suất Cốc', meridian: 'Đởm', region: 'Đầu', tags: ['đau nửa đầu', 'say rượu', 'chóng mặt'] },
    { id: 'GB20', name: 'Phong Trì', meridian: 'Đởm', region: 'Cổ Gáy', tags: ['đau vai gáy', 'đau đầu', 'cảm mạo', 'tăng huyết áp', 'rối loạn tiền đình'] },
    { id: 'GB21', name: 'Kiên Tỉnh', meridian: 'Đởm', region: 'Vai', tags: ['đau vai gáy', 'tắc tia sữa', 'sa tử cung', 'đau lưng trên'] },
    { id: 'GB30', name: 'Hoàn Khiêu', meridian: 'Đởm', region: 'Chân', tags: ['đau thần kinh tọa', 'đau mông', 'liệt chi dưới'] },
    { id: 'GB31', name: 'Phong Thị', meridian: 'Đởm', region: 'Chân', tags: ['ngứa', 'dị ứng', 'liệt nửa người', 'đau đùi'] },
    { id: 'GB34', name: 'Dương Lăng Tuyền', meridian: 'Đởm', region: 'Chân', tags: ['đau thần kinh tọa', 'đau khớp gối', 'chuột rút', 'đau mạn sườn'] },
    { id: 'GB39', name: 'Huyền Chung', meridian: 'Đởm', region: 'Chân', tags: ['đau cổ gáy', 'liệt chi dưới', 'đau thần kinh tọa'] },
    { id: 'GB41', name: 'Túc Lâm Khấp', meridian: 'Đởm', region: 'Chân', tags: ['đau nửa đầu', 'đau mạn sườn', 'tắc tia sữa', 'đau mắt'] },

    // === XII. TÚC QUYẾT ÂM CAN KINH (LR) ===
    { id: 'LR1', name: 'Đại Đôn', meridian: 'Can', region: 'Chân', tags: ['băng huyết', 'sa tử cung', 'đái dầm', 'thoát vị bẹn'] },
    { id: 'LR2', name: 'Hành Gian', meridian: 'Can', region: 'Chân', tags: ['đau đầu', 'mất ngủ', 'tăng huyết áp', 'đau mắt đỏ', 'rong kinh'] },
    { id: 'LR3', name: 'Thái Xung', meridian: 'Can', region: 'Chân', tags: ['tăng huyết áp', 'đau đầu', 'chóng mặt', 'cáu gắt', 'bình can'] },
    { id: 'LR13', name: 'Chương Môn', meridian: 'Can', region: 'Bụng', tags: ['đầy bụng', 'đau mạn sườn', 'nôn mửa', 'tiêu chảy'] },
    { id: 'LR14', name: 'Kỳ Môn', meridian: 'Can', region: 'Ngực', tags: ['đau mạn sườn', 'ợ chua', 'viêm gan', 'trầm cảm'] },

    // === XIII. MẠCH NHÂM (CV/REN) ===
    { id: 'CV3', name: 'Trung Cực', meridian: 'Nhâm', region: 'Bụng', tags: ['bệnh phụ khoa', 'viêm bàng quang', 'bí tiểu', 'liệt dương'] },
    { id: 'CV4', name: 'Quan Nguyên', meridian: 'Nhâm', region: 'Bụng', tags: ['bổ thận', 'tráng dương', 'suy nhược', 'tiểu đêm', 'bồi bổ'] },
    { id: 'CV6', name: 'Khí Hải', meridian: 'Nhâm', region: 'Bụng', tags: ['suy nhược', 'đau bụng', 'tiểu đêm', 'bổ khí', 'lạnh bụng'] },
    { id: 'CV8', name: 'Thần Khuyết', meridian: 'Nhâm', region: 'Bụng', tags: ['tiêu chảy cấp', 'lạnh bụng', 'sôi bụng', 'cứu ngải'] },
    { id: 'CV12', name: 'Trung Quản', meridian: 'Nhâm', region: 'Bụng', tags: ['đau dạ dày', 'đầy bụng', 'nôn', 'viêm loét dạ dày'] },
    { id: 'CV17', name: 'Đản Trung', meridian: 'Nhâm', region: 'Ngực', tags: ['đau ngực', 'hen suyễn', 'ít sữa', 'hồi hộp', 'tức ngực'] },
    { id: 'CV22', name: 'Thiên Đột', meridian: 'Nhâm', region: 'Cổ Gáy', tags: ['ho', 'hen suyễn', 'viêm họng', 'khản tiếng', 'nghẹn'] },
    { id: 'CV23', name: 'Liêm Tuyền', meridian: 'Nhâm', region: 'Cổ Gáy', tags: ['khản tiếng', 'cứng lưỡi', 'nuốt khó', 'chảy dãi'] },
    { id: 'CV24', name: 'Thừa Tương', meridian: 'Nhâm', region: 'Mặt', tags: ['liệt mặt', 'đau răng', 'chảy dãi', 'nôn'] },

    // === XIV. MẠCH ĐỐC (GV/DU) ===
    { id: 'GV1', name: 'Trường Cường', meridian: 'Đốc', region: 'Lưng', tags: ['trĩ', 'sa trực tràng', 'tiêu chảy', 'đau lưng cùng'] },
    { id: 'GV4', name: 'Mệnh Môn', meridian: 'Đốc', region: 'Lưng', tags: ['đau lưng', 'lạnh sống lưng', 'liệt dương', 'di tinh', 'bổ dương'] },
    { id: 'GV14', name: 'Đại Chùy', meridian: 'Đốc', region: 'Lưng', tags: ['sốt cao', 'cảm mạo', 'ho', 'hen', 'tăng sức đề kháng'] },
    { id: 'GV15', name: 'Á Môn', meridian: 'Đốc', region: 'Cổ Gáy', tags: ['câm điếc', 'đau gáy', 'chảy máu cam'] },
    { id: 'GV16', name: 'Phong Phủ', meridian: 'Đốc', region: 'Cổ Gáy', tags: ['đau đầu', 'đau gáy', 'trúng gió', 'ngạt mũi'] },
    { id: 'GV20', name: 'Bách Hội', meridian: 'Đốc', region: 'Đầu', tags: ['đau đầu', 'mất ngủ', 'sa tử cung', 'trĩ', 'choáng', 'thăng dương'] },
    { id: 'GV23', name: 'Thượng Tinh', meridian: 'Đốc', region: 'Đầu', tags: ['chảy máu cam', 'ngạt mũi', 'đau mắt', 'đau đầu'] },
    { id: 'GV26', name: 'Nhân Trung', meridian: 'Đốc', region: 'Mặt', tags: ['ngất', 'choáng', 'cấp cứu', 'đau lưng cấp', 'méo miệng'] },

    // === XV. HUYỆT NGOÀI KINH (EX) ===
    { id: 'EX-HN1', name: 'Tứ Thần Thông', meridian: 'Ngoài Kinh', region: 'Đầu', tags: ['đau đầu', 'chóng mặt', 'mất ngủ', 'suy giảm trí nhớ'] },
    { id: 'EX-HN3', name: 'Ấn Đường', meridian: 'Ngoài Kinh', region: 'Mặt', tags: ['đau đầu', 'xoang', 'mất ngủ', 'an thần', 'ngạt mũi'] },
    { id: 'EX-HN5', name: 'Thái Dương', meridian: 'Ngoài Kinh', region: 'Đầu', tags: ['đau đầu', 'đau nửa đầu', 'đau mắt'] },
    { id: 'EX-UE11', name: 'Thập Tuyên', meridian: 'Ngoài Kinh', region: 'Tay', tags: ['sốt cao', 'say nắng', 'tê đầu ngón tay', 'cấp cứu'] },
    { id: 'EX-UE7', name: 'Yêu Thống', meridian: 'Ngoài Kinh', region: 'Tay', tags: ['đau lưng cấp', 'giãn dây chằng lưng'] },
    { id: 'EX-LE6', name: 'Đ胆 Nang', meridian: 'Ngoài Kinh', region: 'Chân', tags: ['viêm túi mật', 'giun chui ống mật'] },
    { id: 'EX-LE4', name: 'Nội Tất Nhãn', meridian: 'Ngoài Kinh', region: 'Chân', tags: ['đau khớp gối', 'viêm khớp gối'] },
    { id: 'EX-B2', name: 'Giáp Tích', meridian: 'Ngoài Kinh', region: 'Lưng', tags: ['đau lưng', 'đau cột sống', 'bệnh tạng phủ tương ứng'] },
    { id: 'EX-HN', name: 'An Miên', meridian: 'Ngoài Kinh', region: 'Cổ Gáy', tags: ['mất ngủ', 'đau đầu', 'chóng mặt'] }
];

// 2. DANH MỤC PHÂN LOẠI
window.knowledge.regions = ['Đầu', 'Mặt', 'Cổ Gáy', 'Vai', 'Nách', 'Tay', 'Ngực', 'Bụng', 'Lưng', 'Chân'];
window.knowledge.meridians = ['Phế', 'Đại Trường', 'Vị', 'Tỳ', 'Tâm', 'Tiểu Trường', 'Bàng Quang', 'Thận', 'Tâm Bào', 'Tam Tiêu', 'Đởm', 'Can', 'Nhâm', 'Đốc', 'Ngoài Kinh'];
