/**
 * FILE: js/config-core.js
 * CHỨC NĂNG: Chứa dữ liệu cấu hình mặc định, bảng màu và các biến toàn cục dùng chung.
 * MÔ TẢ: File này định nghĩa dữ liệu tĩnh, không chứa logic xử lý giao diện phức tạp.
 * CẬP NHẬT: Thêm thông số Blur cho Header.
 */

window.config = window.config || {}; 

// --- 1. CÁC BIẾN TOÀN CỤC DÙNG CHO QUẢN LÝ BỆNH MẪU ---
// Các biến này được sử dụng trong quá trình thêm/sửa bệnh (config-disease.js)
window.tempEastOptions = [];
window.currentEastOptionIndex = -1;

// --- 2. BẢNG MÀU MỸ HỌC NHÀ TỐNG (SONG DYNASTY PALETTE) ---
// Dùng cho việc tùy chỉnh màu sắc giao diện
window.songPalette = [
    { color: '#3e2723', name: 'Mặc (Đen mực)' },
    { color: '#5d4037', name: 'Gỗ đàn hương' },
    { color: '#8d6e63', name: 'Đất nung' },
    { color: '#263238', name: 'Xanh mực' },
    { color: '#1b5e20', name: 'Tùng (Xanh thông)' },
    { color: '#827717', name: 'Thu hương' },
    { color: '#e65100', name: 'Chu sa (Đỏ cam)' },
    { color: '#bf360c', name: 'Gạch nung' },
    { color: '#006064', name: 'Lam ngọc (Đậm)' },
    { color: '#004d40', name: 'Lục bảo' },
    { color: '#f2ebe0', name: 'Giấy tuyên (Sáng)' },
    { color: '#d7ccc8', name: 'Trắng sứ' },
    { color: '#fff9c4', name: 'Vàng nhạt' },
    { color: '#e0f2f1', name: 'Ngọc bích nhạt' },
    { color: '#ffffff', name: 'Trắng tinh' }
];

// --- 3. CẤU HÌNH MẶC ĐỊNH (DEFAULT CONFIG) ---
// Dữ liệu này sẽ được dùng khi khởi tạo app lần đầu hoặc reset
window.defaultConfig = {
    clinicTitle: 'Phòng Khám YHCT',
    doctorName: 'Đông Y',
    diseases: [],
    procs: [],
    tuChan: {
        vong: ['Sắc mặt hồng nhuận', 'Sắc mặt xanh tái', 'Sắc mặt vàng', 'Sắc mặt đỏ', 'Sắc mặt nhợt', 'Lưỡi to bệu', 'Rêu trắng', 'Rêu vàng'],
        van: ['Tiếng nói nhỏ yếu', 'Tiếng nói lớn mạnh', 'Hơi thở hôi', 'Ho khan', 'Ho đờm'],
        vanhoi: ['Ăn kém', 'Ăn ngon', 'Khát', 'Không khát', 'Đại tiện táo', 'Đại tiện lỏng', 'Ngủ kém', 'Đau đầu', 'Đau lưng'],
        thiet: ['Da nóng', 'Da lạnh', 'Bụng mềm', 'Bụng cứng', 'Đau cự án', 'Đau thiện án'],
        thietchan: ['Lưỡi đỏ', 'Lưỡi nhợt', 'Rêu mỏng', 'Rêu dày', 'Rêu nhớt'],
        machchan: ['Phù', 'Trầm', 'Trì', 'Sác', 'Hoạt', 'Huyền', 'Tế', 'Nhược']
    },
    // Cấu hình giao diện Header
    headerOverlayOpacity: 0,
    headerBgImage: null,
    
    // Cấu hình độ mờ (Blur) - Mới thêm
    headerBlur: 0,      // Độ mờ khung chính
    headerInfoBlur: 0,  // Độ mờ ô thông tin con
    
    // Cấu hình QR và Bảo mật
    qrCodeImage: null,
    profitVisible: false,
    password: '',
    
    // Cấu hình màu sắc
    profitTextColor: '#3e2723',
    profitBgColor: '#ffffff'
};
