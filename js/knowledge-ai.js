/**
 * FILE: js/knowledge-ai.js
 * CHỨC NĂNG: Trí tuệ nhân tạo (AI Engine).
 * NHIỆM VỤ: Phân tích triệu chứng + Thời gian thực => Gợi ý Huyệt & Thuốc.
 */

window.knowledge = window.knowledge || {};

// ============================================================
// 3. AI ANALYSIS ENGINE (TỔNG HỢP & GỢI Ý)
// ============================================================
window.knowledge.analyze = function(symptomText) {
    if (!symptomText) return null;
    const text = symptomText.toLowerCase();
    
    // Lấy thông tin Tí Ngọ từ file knowledge-time.js
    // (Cần đảm bảo file knowledge-time.js đã được load trước file này)
    const flow = window.knowledge.ziWuFlow ? window.knowledge.ziWuFlow.getCurrentFlow() : null;

    let result = {
        points: [], // ID các huyệt gợi ý
        herbs: [],  // Tên các vị thuốc gợi ý
        messages: [] // Các thông điệp/lời khuyên
    };

    // --- 1. GỢI Ý CHUNG TỪ THỜI GIAN (ALWAYS ON) ---
    if (flow) {
        result.messages.push(`⏰ ${flow.msg}`);
    }

    // --- 2. PHÂN TÍCH TRIỆU CHỨNG & THỜI CHÂM ---

    // A. NHÓM CẢM MẠO / HÔ HẤP (Phế)
    if (text.includes('cảm') || text.includes('hắt hơi') || text.includes('sổ mũi') || text.includes('phổi') || text.includes('ho')) {
        result.points.push('LI4', 'LI20', 'GB20', 'LU7', 'GV14', 'BL13');
        if (flow && flow.meridian === 'Phế') {
            result.points.push('LU1', 'LU9');
            result.messages.push("⚡ Đang là giờ PHẾ (3-5h): Châm Thái Uyên (LU9) hiệu quả cao.");
        }
        if (text.includes('lạnh') || text.includes('rét')) {
            result.herbs.push('Tía tô', 'Kinh giới', 'Gừng tươi', 'Bạch chỉ');
            result.messages.push("❄️ Cảm Phong Hàn: Khu phong tán hàn (Tía tô, Gừng).");
        } else if (text.includes('nóng') || text.includes('sốt')) {
            result.herbs.push('Kim ngân hoa', 'Liên kiều', 'Bạc hà', 'Cát căn');
            result.messages.push("🔥 Cảm Phong Nhiệt: Thanh nhiệt giải biểu.");
        }
        if (text.includes('đờm')) {
             result.points.push('ST40'); 
             result.herbs.push('Trần bì', 'Bán hạ');
        } else if (text.includes('ho khan')) {
             result.herbs.push('Mạch môn', 'Tang diệp');
        }
    }

    // B. NHÓM CƠ XƯƠNG KHỚP (Tý chứng)
    if (text.includes('đau đầu')) {
        result.points.push('LI4', 'GB20', 'EX-HN5');
        if (text.includes('đỉnh đầu')) { result.points.push('GV20'); result.herbs.push('Cảo bản'); }
        if (text.includes('sau gáy')) { result.points.push('GB20'); result.herbs.push('Cát căn', 'Khương hoạt'); }
        if (text.includes('thái dương')) { result.points.push('EX-HN5'); result.herbs.push('Xuyên khung', 'Sài hồ'); }
    }
    if (text.includes('đau lưng') || text.includes('thận')) {
        result.points.push('BL23', 'GV4', 'BL40', 'KI3');
        if (flow && flow.meridian === 'Thận') {
            result.points.push('KI1');
            result.messages.push("⚡ Đang là giờ THẬN (17-19h): Châm Dũng Tuyền/Thái Khê cực tốt bổ thận.");
        }
        if (text.includes('lạnh')) {
            result.herbs.push('Đỗ trọng', 'Ngưu tất', 'Quế chi', 'Phụ tử');
            result.messages.push("❄️ Đau lưng Hàn: Cần ôn bổ thận dương.");
        } else {
            result.herbs.push('Đỗ trọng', 'Ngưu tất', 'Tang ký sinh');
        }
    }

    // C. NHÓM TIÊU HÓA (Tỳ Vị)
    if (text.includes('đau bụng') || text.includes('dạ dày') || text.includes('đầy hơi') || text.includes('tiêu hóa')) {
        result.points.push('ST36', 'CV12', 'PC6', 'ST25');
        if (flow && flow.meridian === 'Vị') {
             result.points.push('ST45');
             result.messages.push("⚡ Đang là giờ VỊ (7-9h): Thời điểm vàng trị dạ dày. Châm Túc Tam Lý!");
        }
        if (text.includes('lạnh') || text.includes('sôi bụng')) {
            result.herbs.push('Gừng nướng', 'Mộc hương', 'Sa nhân', 'Trần bì');
            result.messages.push("💡 Tỳ vị hư hàn: Dùng thuốc lý khí ôn trung.");
        } else if (text.includes('ợ chua') || text.includes('nóng')) {
            result.herbs.push('Hoàng liên', 'Mẫu lệ', 'Ô tặc cốt');
        }
    }

    // D. NHÓM THẦN KINH (Tâm)
    if (text.includes('mất ngủ') || text.includes('tim') || text.includes('hồi hộp')) {
        result.points.push('HT7', 'PC6', 'GV20', 'SP6');
        result.herbs.push('Lạc tiên', 'Vông nem', 'Tâm sen', 'Toan táo nhân');
        if (flow && flow.meridian === 'Tâm') {
             result.messages.push("⚡ Giờ TÂM (11-13h): Nên dưỡng thần, tránh kích động.");
        } else if (flow && flow.meridian === 'Thận') {
             result.messages.push("⚡ Giờ Dậu (17-19h): Châm Thận (Dũng Tuyền) dẫn hỏa quy nguyên, trị mất ngủ.");
        }
    }

    // E. NHÓM HUYẾT / PHỤ KHOA
    if (text.includes('kinh nguyệt') || text.includes('đau bụng kinh') || text.includes('huyết')) {
        result.points.push('SP6', 'CV4', 'SP10', 'BL17');
        result.herbs.push('Hương phụ', 'Ngải cứu', 'Ích mẫu', 'Đương quy');
        if (text.includes('xanh xao') || text.includes('chóng mặt')) {
            result.herbs.push('Thục địa', 'Đương quy', 'Bạch thược', 'Xuyên khung'); // Tứ vật
            result.messages.push("💡 Huyết hư: Dùng bài Tứ vật thang.");
        }
    }

    // Lọc trùng lặp
    result.points = [...new Set(result.points)];
    result.herbs = [...new Set(result.herbs)];
    result.messages = [...new Set(result.messages)];

    return result;
};

console.log("Knowledge Base Loaded: AI Engine Ready.");
