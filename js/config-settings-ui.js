/**
 * FILE: js/config-settings-ui.js
 * CHỨC NĂNG: Quản lý Giao diện Modal Cài đặt, Tabs và Color Picker.
 * CẬP NHẬT: Thêm logic Load/Save cho 2 thanh trượt Blur và Hàm mở modal Backup.
 * PHỤ THUỘC: window.config, window.songPalette (từ config-core.js)
 */

// ============================================================
// 1. QUẢN LÝ TABS CÀI ĐẶT
// ============================================================

window.switchSettingsTab = function(id, btn) {
    // Ẩn tất cả các panel
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.add('hidden')); 
    // Hiện panel được chọn
    document.getElementById(id).classList.remove('hidden');
    
    // Xóa class active ở tất cả các tab
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); 
    // Thêm class active cho tab được bấm
    btn.classList.add('active');
};

// ============================================================
// 2. HỆ THỐNG CHỌN MÀU (COLOR PICKER)
// ============================================================

window.renderColorPalette = function(containerId, inputId, currentVal) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    let html = '';
    window.songPalette.forEach(c => {
        // Kiểm tra xem màu này có phải màu đang chọn không để thêm class active
        // So sánh không phân biệt hoa thường
        const isActive = c.color.toLowerCase() === (currentVal || '').toLowerCase();
        
        html += `<div class="color-swatch ${isActive ? 'active' : ''}" 
                      style="background-color: ${c.color};" 
                      title="${c.name}"
                      onclick="window.selectColor('${inputId}', '${c.color}', this)"></div>`;
    });
    container.innerHTML = html;
};

window.selectColor = function(inputId, color, swatchEl) {
    // Cập nhật giá trị vào input hidden hoặc input color
    const input = document.getElementById(inputId);
    if(input) {
        input.value = color;
        // Kích hoạt sự kiện change để nếu có preview thì nó cập nhật ngay
        input.dispatchEvent(new Event('change'));
    }
    
    // Cập nhật UI: Xóa active cũ, thêm active mới
    const parent = swatchEl.parentElement;
    Array.from(parent.children).forEach(c => c.classList.remove('active'));
    swatchEl.classList.add('active');
};

// ============================================================
// 3. MỞ MODAL CÀI ĐẶT (OPEN SETTINGS)
// ============================================================

window.openSettings = function() {
    const modal = document.getElementById('sModal');
    if (modal) modal.classList.add('active');
    
    // 1. Load thông tin chung
    if(document.getElementById('confTitle')) 
        document.getElementById('confTitle').value = window.config.clinicTitle || '';
    
    if(document.getElementById('confDoctor'))
        document.getElementById('confDoctor').value = window.config.doctorName || '';
    
    // 2. Load cấu hình Màu sắc
    const profitText = window.config.profitTextColor || '#3e2723';
    const profitBg = window.config.profitBgColor || '#ffffff';
    
    if(document.getElementById('profitTextColorInput'))
        document.getElementById('profitTextColorInput').value = profitText;
    
    if(document.getElementById('profitBgColorInput'))
        document.getElementById('profitBgColorInput').value = profitBg;
    
    window.renderColorPalette('paletteTextContainer', 'profitTextColorInput', profitText);
    window.renderColorPalette('paletteBgContainer', 'profitBgColorInput', profitBg);

    // 3. Load Mật khẩu
    const passInput = document.getElementById('confPass');
    if (passInput) {
        passInput.value = window.config.password || ''; 
        // Cấu hình input để hiển thị bàn phím số trên mobile
        passInput.removeAttribute('readonly');
        passInput.setAttribute('type', 'number'); 
        passInput.setAttribute('inputmode', 'numeric'); 
        passInput.setAttribute('pattern', '[0-9]*');
    }

    // 4. Load cấu hình Ảnh nền & QR & BLUR
    if(document.getElementById('headerOverlayInput'))
        document.getElementById('headerOverlayInput').value = window.config.headerOverlayOpacity || 0;
    
    if(document.getElementById('overlayValueDisplay'))
        document.getElementById('overlayValueDisplay').innerText = (window.config.headerOverlayOpacity || 0) + '%';
    
    // -- LOAD GIÁ TRỊ BLUR VÀO THANH TRƯỢT --
    const bHeader = window.config.headerBlur || 0;
    const bInfo = window.config.headerInfoBlur || 0;
    
    const sliderHeader = document.getElementById('confBlurHeader');
    const labelHeader = document.getElementById('blurHeaderVal');
    if(sliderHeader && labelHeader) {
        sliderHeader.value = bHeader;
        labelHeader.innerText = bHeader + 'px';
    }

    const sliderInfo = document.getElementById('confBlurInfo');
    const labelInfo = document.getElementById('blurInfoVal');
    if(sliderInfo && labelInfo) {
        sliderInfo.value = bInfo;
        labelInfo.innerText = bInfo + 'px';
    }
    // ----------------------------------------

    if(window.config.qrCodeImage) {
        if(document.getElementById('previewQrSettings'))
            document.getElementById('previewQrSettings').src = window.config.qrCodeImage;
    } else {
        if(document.getElementById('previewQrSettings'))
            document.getElementById('previewQrSettings').src = "";
    }

    // 5. Gọi các hàm render dữ liệu con (nếu có)
    // Các hàm này nằm ở file config-disease.js, config-procedures.js...
    if(window.renderDiseaseSettings) window.renderDiseaseSettings(); 
    if(window.renderProcSettings) window.renderProcSettings(); 
    if(window.renderTuChanConfig) window.renderTuChanConfig();
};

// ============================================================
// 4. LƯU CÀI ĐẶT (SAVE SETTINGS)
// ============================================================

window.saveSettings = async function() {
    // 1. Lưu thông tin chung
    if(document.getElementById('confTitle'))
        window.config.clinicTitle = document.getElementById('confTitle').value;
    
    if(document.getElementById('confDoctor'))
        window.config.doctorName = document.getElementById('confDoctor').value;
    
    // 2. Lưu màu sắc
    if(document.getElementById('profitTextColorInput'))
        window.config.profitTextColor = document.getElementById('profitTextColorInput').value;
    
    if(document.getElementById('profitBgColorInput'))
        window.config.profitBgColor = document.getElementById('profitBgColorInput').value;

    // 3. Lưu mật khẩu
    const passInput = document.getElementById('confPass'); 
    if(passInput) window.config.password = passInput.value;
    
    // 4. LƯU CẤU HÌNH BLUR
    const sliderHeader = document.getElementById('confBlurHeader');
    const sliderInfo = document.getElementById('confBlurInfo');
    
    if(sliderHeader) window.config.headerBlur = parseFloat(sliderHeader.value) || 0;
    if(sliderInfo) window.config.headerInfoBlur = parseFloat(sliderInfo.value) || 0;
    
    // 5. Thực hiện lưu vào Database
    if(window.saveConfig) await window.saveConfig(); 
    
    // 6. Cập nhật giao diện Header ngay lập tức
    if(window.updateHeader) window.updateHeader(); 
    
    // 7. Đóng modal
    if(window.closeModals) window.closeModals();
    
    // Thông báo nhỏ (nếu có hệ thống toast)
    if(window.showToast) window.showToast("Đã lưu cài đặt!", "success");
    else alert("Đã lưu cài đặt!");
};

// ============================================================
// 5. HÀM MỞ MODAL BACKUP (QUAN TRỌNG: FIX LỖI)
// ============================================================

window.openBackupModalDirect = function() {
    const modal = document.getElementById('backupModal');
    if (modal) {
        // Mở modal backup
        modal.classList.add('active');
        
        // Đảm bảo z-index cao hơn modal cài đặt để hiển thị đè lên trên
        // Vì nút này nằm trong modal Cài đặt (z-index 2000), nên cái này phải cao hơn
        modal.style.zIndex = "2100"; 
    } else {
        console.error("LỖI: Không tìm thấy phần tử #backupModal trong HTML.");
        alert("Lỗi: Không tìm thấy giao diện Sao lưu.");
    }
};
