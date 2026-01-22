/**
 * FILE: js/database.js
 * CHỨC NĂNG: Quản lý Lưu trữ, Khởi tạo dữ liệu, Sao lưu & Khôi phục (Phiên bản "Sạch")
 * ĐIỂM MỚI: Tự động lọc bỏ hình ảnh nặng khi sao lưu để tránh lỗi file JSON.
 */

// 1. CẤU HÌNH LOCALFORAGE
localforage.config({
    name: 'YHCT_Pro_App',
    storeName: 'data_store'
});

// Khởi tạo biến toàn cục
window.db = [];
// window.config đã được định nghĩa sơ bộ trong config-core.js

// ============================================================
// 2. KHỞI TẠO CƠ SỞ DỮ LIỆU (LOAD DATA)
// ============================================================
window.initAppDatabase = async function() {
    try {
        console.log("Đang tải dữ liệu...");
        
        // A. Load từ bộ nhớ
        const savedDb = await localforage.getItem('yhct_db_v49');
        const savedConfig = await localforage.getItem('yhct_cfg_v49');

        // B. Migration (Chuyển từ LocalStorage cũ nếu có)
        if (!savedDb && localStorage.getItem('yhct_db_v49')) {
            window.db = JSON.parse(localStorage.getItem('yhct_db_v49') || '[]');
            await localforage.setItem('yhct_db_v49', window.db);
        } else {
            window.db = savedDb || [];
        }

        if (!savedConfig && localStorage.getItem('yhct_cfg_v49')) {
            window.config = JSON.parse(localStorage.getItem('yhct_cfg_v49') || '{}');
            await localforage.setItem('yhct_cfg_v49', window.config);
        } else {
            // Merge với cấu hình mặc định để không bị lỗi thiếu key
            window.config = savedConfig ? { ...window.defaultConfig, ...savedConfig } : { ...window.defaultConfig };
        }

        // C. Xử lý tương thích dữ liệu cũ
        if (Array.isArray(window.config.diseases)) {
            window.config.diseases.forEach(d => {
                if (d && !d.eastOptions) d.eastOptions = [];
            });
        }
        if (!window.config.tuChan) window.config.tuChan = window.defaultConfig.tuChan;

        // D. Kiểm tra lần đầu sử dụng
        await window.checkFirstTimeUse();

        console.log("Tải dữ liệu thành công!");
        return true;

    } catch (err) {
        console.error("Lỗi khởi tạo DB:", err);
        alert("Lỗi khởi động dữ liệu: " + err.message);
        return false;
    }
};

// ============================================================
// 3. CÁC HÀM LƯU TRỮ (SAVE)
// ============================================================

window.saveDb = async function() { 
    try { 
        await localforage.setItem('yhct_db_v49', window.db);
        if(window.renderMonthFilterList) window.renderMonthFilterList(); 
    } catch(e) { 
        console.error(e); 
    } 
};

window.saveConfig = async function() { 
    try { 
        await localforage.setItem('yhct_cfg_v49', window.config); 
        if(window.updateHeader) window.updateHeader(); 
    } catch(e) { 
        console.error(e); 
    } 
};

// ============================================================
// 4. DỮ LIỆU MẪU (SAMPLE DATA)
// ============================================================

window.checkFirstTimeUse = async function() {
    if (!localStorage.getItem('yhct_first_time')) {
        await window.createSampleData(); 
        localStorage.setItem('yhct_first_time', 'false');
    }
};

window.createSampleData = async function() {
    if (!window.config.diseases || window.config.diseases.length === 0) {
        window.config.diseases = [
            {
                name: "Cảm mạo", sym: "Sốt, sợ lạnh", rxWest: [],
                eastOptions: [{ name: "Giải cảm", ingredients: [{name: "Tía tô", qty: 12, price: 0}] }]
            }
        ];
    }
    if (!window.config.procs || window.config.procs.length === 0) {
        window.config.procs = [{name: "Châm cứu", price: 100000}, {name: "Xoa bóp", price: 150000}];
    }
    await window.saveDb(); 
    await window.saveConfig();
};

// ============================================================
// 5. SAO LƯU & KHÔI PHỤC (PHIÊN BẢN "SẠCH" - KHÔNG ẢNH)
// ============================================================

// --- XUẤT JSON (BACKUP) ---
window.exportToJSON = function() {
    try {
        // 1. Clone cấu hình để xử lý (tránh ảnh hưởng app hiện tại)
        const cleanConfig = JSON.parse(JSON.stringify(window.config || {}));
        
        // 2. LOẠI BỎ ẢNH (Base64) để file nhẹ và không bị lỗi
        cleanConfig.headerBgImage = null;
        cleanConfig.qrCodeImage = null;

        const dataToSave = {
            version: "v49_light",
            timestamp: new Date().toISOString(),
            db: window.db || [],
            config: cleanConfig
        };
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToSave));
        const downloadAnchorNode = document.createElement('a');
        const fileName = "YHCT_Backup_" + new Date().toISOString().slice(0,10) + ".json";
        
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
    } catch (e) {
        console.error(e);
        alert("Lỗi xuất JSON: " + e.message);
    }
};

// --- NHẬP JSON (RESTORE) ---
window.importFromJSON = function() {
    const input = document.getElementById('jsonFileInput');
    if (input) {
        input.value = ''; // Reset để chọn lại được file cũ
        input.click();
    } else {
        alert("Lỗi: Thiếu thẻ <input> trong file HTML. Vui lòng kiểm tra lại code index.html!");
    }
};

window.handleJSONFileSelect = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const jsonContent = JSON.parse(e.target.result);
            
            // Kiểm tra cấu trúc
            if (!jsonContent.db && !jsonContent.config) {
                throw new Error("File không đúng định dạng YHCT Pro!");
            }

            if (confirm(`Tìm thấy bản sao lưu ngày: ${jsonContent.timestamp || 'Cũ'}.\nBạn có muốn khôi phục không? (Dữ liệu hiện tại sẽ bị thay thế)`)) {
                
                // 1. Khôi phục DB Bệnh nhân
                if (jsonContent.db) {
                    window.db = jsonContent.db;
                    await localforage.setItem('yhct_db_v49', window.db);
                }

                // 2. Khôi phục Cấu hình (Giữ lại ảnh cũ nếu file backup không có)
                if (jsonContent.config) {
                    // Lưu lại ảnh nền đang dùng trên máy
                    const currentBg = window.config.headerBgImage;
                    const currentQr = window.config.qrCodeImage;
                    
                    // Nạp config mới từ file backup
                    window.config = { ...window.defaultConfig, ...jsonContent.config };
                    
                    // Nếu file backup không có ảnh (do ta đã xóa khi xuất), thì khôi phục lại ảnh cũ
                    if (!window.config.headerBgImage && currentBg) {
                        window.config.headerBgImage = currentBg;
                    }
                    if (!window.config.qrCodeImage && currentQr) {
                        window.config.qrCodeImage = currentQr;
                    }

                    await localforage.setItem('yhct_cfg_v49', window.config);
                }

                alert("✅ Khôi phục thành công! Ứng dụng sẽ tự tải lại.");
                location.reload();
            }
        } catch (err) {
            console.error(err);
            alert("❌ Lỗi đọc file: " + err.message + "\nVui lòng đảm bảo bạn sử dụng file JSON được xuất từ phiên bản mới này.");
        }
    };
    reader.readAsText(file);
};

// ============================================================
// 6. XUẤT EXCEL (XLSX)
// ============================================================

// Xuất danh sách bệnh nhân
window.exportToExcel = function() {
    if (!window.db || window.db.length === 0) { alert("Chưa có dữ liệu!"); return; }
    try {
        const data = window.db.map((p, index) => ({
            STT: index + 1,
            "Họ Tên": p.name,
            "Năm Sinh": p.year,
            "SĐT": p.phone,
            "Địa Chỉ": p.address,
            "Số Lần Khám": p.visits ? p.visits.length : 0
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "BenhNhan");
        XLSX.writeFile(wb, "YHCT_DS_BenhNhan.xlsx");
    } catch (e) { alert("Lỗi Excel: " + e.message); }
};

// Xuất chi tiết lịch sử khám
window.exportFullDataExcel = function() {
    if (!window.db || window.db.length === 0) { alert("Chưa có dữ liệu!"); return; }
    try {
        const data = [];
        window.db.forEach(p => {
            if (p.visits && p.visits.length > 0) {
                p.visits.forEach(v => {
                    // Xử lý chuỗi thuốc/thủ thuật
                    let dongY = v.rxEast ? v.rxEast.map(i => `${i.name}(${i.qty}g)`).join(", ") : "";
                    let tayY = v.rxWest ? v.rxWest.map(i => `${i.name}(${i.qty})`).join(", ") : "";
                    let thuThuat = v.procs ? v.procs.map(i => i.name).join(", ") : "";

                    data.push({
                        "Mã BN": p.id,
                        "Họ Tên": p.name,
                        "Năm Sinh": p.year,
                        "SĐT": p.phone,
                        "Ngày Khám": v.date,
                        "Chẩn Đoán": v.disease,
                        "Triệu Chứng": v.symptoms,
                        "Đông Y": dongY,
                        "Tây Y": tayY,
                        "Thủ Thuật": thuThuat,
                        "Tổng Tiền": v.total || 0,
                        "Ghi Chú": v.note || ""
                    });
                });
            }
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ChiTietKham");
        XLSX.writeFile(wb, "YHCT_LichSuKham.xlsx");
    } catch (e) { alert("Lỗi Excel: " + e.message); }
};
