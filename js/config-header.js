/**
 * FILE: js/config-header.js
 * CHỨC NĂNG: Quản lý hiển thị Header, Ảnh nền, QR Code và Bảo mật Doanh thu.
 * CẬP NHẬT: Fix lỗi hiển thị "Giờ undefined" (Đồng bộ với knowledge-time.js).
 */

window.updateHeader = function() { 
    if (!window.config) return;
    
    // A. Cập nhật nội dung Text (Giữ nguyên)
    document.getElementById('displayTitle').innerText = window.config.clinicTitle || 'Phòng Khám'; 
    const drName = window.config.doctorName ? window.config.doctorName : 'Đông Y';
    const drEl = document.getElementById('displayDoctor');
    if(drEl) drEl.innerHTML = `<span class="text-xs font-bold uppercase block opacity-80 mb-1">Xin chào,</span><span class="font-black text-xl">BS. ${drName}</span>`;
    
    // B. Cập nhật thông tin chuyên môn (ĐÃ SỬA LỖI TẠI ĐÂY)
    if (window.knowledge) {
        if (window.knowledge.lunar) {
            const lunar = window.knowledge.lunar.getLunarDetails();
            document.getElementById('headerDate').innerText = lunar.date;
            document.getElementById('headerLunar').innerText = lunar.full;
        }
        if (window.knowledge.yunQi) {
            const yunQi = window.knowledge.yunQi.getCurrentInfo();
            document.getElementById('headerYunQi').innerText = `${yunQi.year} - ${yunQi.nature}`;
        }
        if (window.knowledge.ziWuFlow) {
            const ziWu = window.knowledge.ziWuFlow.getCurrentFlow();
            // FIX: Thay ziWu.branch (không tồn tại) thành ziWu.can + ziWu.chi
            // Kết quả sẽ ra: "Giờ Bính Dần: Giờ Dần vượng Phế..."
            document.getElementById('headerZiWu').innerText = `Giờ ${ziWu.can} ${ziWu.chi}: ${ziWu.msg}`;
        }
    }

    // C. Lợi nhuận & Màu sắc (Giữ nguyên)
    window.updateProfitDisplay();
    const profitBox = document.getElementById('profitBoxContainer');
    const headerCard = document.getElementById('mainHeaderCard');

    if (headerCard && window.config.profitTextColor) {
        headerCard.style.color = window.config.profitTextColor;
        headerCard.querySelectorAll('*').forEach(el => {
            el.style.color = window.config.profitTextColor;
            el.style.borderColor = window.config.profitTextColor; 
        });
    }

    if (profitBox && window.config.profitBgColor) {
        profitBox.style.backgroundColor = window.config.profitBgColor;
        profitBox.style.borderColor = window.config.profitBgColor;
    }
    
    // D. XỬ LÝ BLUR & TÁCH BIỆT (Giữ nguyên logic bạn đã viết)
    const header = document.getElementById('mainHeader');
    const overlay = document.getElementById('headerOverlay');
    const infoBox = document.getElementById('headerInfoBox');
    
    if (window.config.headerBgImage) {
        // 1. Ảnh nền
        header.style.backgroundImage = `url(${window.config.headerBgImage})`;
        overlay.style.opacity = (window.config.headerOverlayOpacity || 0) / 100;
        
        // 2. Xử lý KHUNG CHÍNH (Parent)
        if(headerCard) {
            headerCard.classList.add('transparent-mode');
            const blurVal = window.config.headerBlur || 0;
            
            if (blurVal > 0) {
                // Áp dụng blur
                const blurCss = `blur(${blurVal}px)`;
                headerCard.style.backdropFilter = blurCss;
                headerCard.style.webkitBackdropFilter = blurCss;
                // Tăng nhẹ bg khi mờ để dễ đọc chữ
                headerCard.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; 
            } else {
                headerCard.style.backdropFilter = 'none';
                headerCard.style.webkitBackdropFilter = 'none';
                headerCard.style.backgroundColor = ''; // Reset
            }
        }
        
        // 3. Xử lý Ô THÔNG TIN CON (Child) - TẠO SỰ TÁCH BIỆT
        if(infoBox) {
            const infoBlurVal = window.config.headerInfoBlur || 0;
            
            if (infoBlurVal > 0) {
                const infoBlurCss = `blur(${infoBlurVal}px)`;
                infoBox.style.backdropFilter = infoBlurCss;
                infoBox.style.webkitBackdropFilter = infoBlurCss;
                
                // KỸ THUẬT TÁCH BIỆT:
                // a. Thêm bóng đổ (Shadow) để nổi lên
                infoBox.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                
                // b. Thêm viền sáng (Border)
                infoBox.style.border = '1px solid rgba(255,255,255, 0.3)';
                
                // c. Tăng độ đặc của nền (Background Opacity)
                // Càng mờ -> Nền càng đục để che lớp cha phía sau
                infoBox.style.backgroundColor = `rgba(255, 255, 255, ${0.1 + (infoBlurVal/20)})`; 
            } else {
                // Nếu kéo về 0 -> Trả về trong suốt hoàn toàn (như cũ)
                infoBox.style.backdropFilter = 'none';
                infoBox.style.webkitBackdropFilter = 'none';
                infoBox.style.boxShadow = 'none';
                infoBox.style.border = ''; // Reset về class gốc của Tailwind
                infoBox.style.backgroundColor = ''; // Reset về class gốc
            }
        }

    } else {
        // Reset toàn bộ nếu không có ảnh nền
        header.style.backgroundImage = 'none';
        overlay.style.opacity = 0;
        
        if(headerCard) {
            headerCard.classList.remove('transparent-mode');
            headerCard.style.backdropFilter = 'none';
            headerCard.style.webkitBackdropFilter = 'none';
            headerCard.style.backgroundColor = '';
        }
        
        if(infoBox) {
            infoBox.style.backdropFilter = 'none';
            infoBox.style.webkitBackdropFilter = 'none';
            infoBox.style.boxShadow = 'none';
            infoBox.style.backgroundColor = '';
            infoBox.style.border = '';
        }
    }
};

// --- GIỮ NGUYÊN CÁC HÀM CŨ ---
window.handleImageUpload = function(input, configKey, previewId, isHeader = false) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        window.config[configKey] = e.target.result;
        if (previewId) document.getElementById(previewId).src = e.target.result;
        if (isHeader) window.updateHeader();
        if(window.saveConfig) window.saveConfig();
    };
    reader.readAsDataURL(file);
};

window.updateHeaderOverlay = function(value) {
    window.config.headerOverlayOpacity = value;
    document.getElementById('overlayValueDisplay').innerText = value + '%';
    document.getElementById('headerOverlay').style.opacity = value / 100;
};

window.clearHeaderImage = function() {
    window.config.headerBgImage = null; document.getElementById('headerBgInput').value = "";
    window.updateHeader(); if(window.saveConfig) window.saveConfig();
};

window.clearQrImage = function() {
    window.config.qrCodeImage = null; document.getElementById('qrInput').value = "";
    document.getElementById('previewQrSettings').src = ""; if(window.saveConfig) window.saveConfig();
};

window.handleProfitBoxClick = async function() { 
    if(!window.config.password) { 
        window.config.profitVisible = !window.config.profitVisible; 
        if(window.saveConfig) await window.saveConfig(); 
        window.updateProfitDisplay(); 
    } else { 
        if(window.config.profitVisible) { 
            window.config.profitVisible = false; 
            if(window.saveConfig) await window.saveConfig(); 
            window.updateProfitDisplay(); 
        } else {
            if(window.openNativePasswordInput) {
                window.openNativePasswordInput((inputPass) => {
                    if (inputPass === window.config.password) {
                        window.config.profitVisible = true; 
                        window.updateProfitDisplay(); 
                        window.saveConfig(); 
                    } else { alert("Sai mật khẩu!"); }
                });
            }
        }
    } 
};

window.updateProfitDisplay = function() {
    const l = document.getElementById('profitLabel'); if(!l) return;
    if(window.config.profitVisible || !window.config.password) {
        let t = 0; const now = new Date();
        if(window.db) {
            window.db.forEach(p => p.visits?.forEach(v => { 
                const d = new Date(v.date);
                if(d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && v.paid) 
                    t += (v.total - (v.cost || 0)); 
            }));
        }
        l.innerText = t.toLocaleString();
    } else { 
        l.innerText = '******'; 
    }
};
