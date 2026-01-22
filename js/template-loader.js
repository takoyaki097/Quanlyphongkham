/**
 * FILE: js/template-loader.js
 * CHỨC NĂNG: Tổng hợp giao diện Modal + Nút Full Screen + Widget Đồng hồ sinh học (Mini)
 * CẬP NHẬT: Xóa bỏ mã inject kim thừa (vì đã có trong tpl-resources.js).
 */

window.loadAllModals = function() {
    // 1. Lấy nội dung các template con
    const tplVisit = window.TPL_VISIT || "";
    const tplPatient = window.TPL_PATIENT || "";
    const tplSettings = window.TPL_SETTINGS || "";
    const tplResources = window.TPL_RESOURCES || "";

    // 2. Template in ấn
    const tplPrint = `
    <div id="printArea" class="hidden">
        <div id="printEast" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto font-serif text-[#000]"></div>
        <div id="printWest" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto font-sans text-[#000]"></div>
        <div id="printBoth" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto text-[#000]"></div>
        <div id="printInvoice" class="print-section hidden bg-white p-8 max-w-[80mm] mx-auto text-[#000] font-mono text-xs"></div>
    </div>`;

    // 3. Input backup
    const tplBackupInput = `<input type="file" id="jsonFileInput" style="display:none" onchange="window.handleJSONFileSelect(event)">`;

    // 4. NÚT FULL SCREEN
    const tplFullScreenBtn = `
    <button id="floatingFullScreenBtn"
            title="Toàn màn hình (Kéo để di chuyển)"
            style="position: fixed; bottom: 20px; right: 20px; z-index: 9000; 
                   width: 40px; height: 40px; border-radius: 50%; 
                   background: #3e2723; color: #fff; border: 2px solid #fff;
                   box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-size: 20px;
                   display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s;
                   touch-action: none;">
        ⛶
    </button>`;

    // 5. WIDGET ĐỒNG HỒ MINI (Bỏ viền trắng)
    const tplBioClockWidget = `
    <div id="miniBioClockWidget"
         title="Xem chi tiết Giờ tạng phủ (Kéo để di chuyển)"
         style="position: fixed; bottom: 20px; left: 20px; z-index: 9000; 
                display: flex; flex-direction: column; align-items: center; 
                cursor: pointer; transition: transform 0.1s;
                touch-action: none;">
        
        <div class="mini-clock-face" style="position: relative; width: 80px; height: 80px; margin-bottom: 5px;">
            <img src="images/clock_bg.png" 
                 style="width: 100%; height: 100%; border-radius: 50%; 
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3); object-fit: cover;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                        border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.6); 
                        animation: pulse-ring 2s infinite;"></div>
        </div>

        <div id="miniDigitalTime" 
             style="background: rgba(62, 39, 35, 0.9); color: #fff; 
                    padding: 2px 8px; border-radius: 12px; font-family: monospace; 
                    font-weight: bold; font-size: 14px; border: 1px solid #d7ccc8;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            --:--:--
        </div>
    </div>
    <style>
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.3); opacity: 0; } }
        #miniBioClockWidget:active, #floatingFullScreenBtn:active { opacity: 0.8; }
    </style>`;

    // 6. Gộp và chèn vào body
    const fullTemplate = tplVisit + tplPatient + tplSettings + tplResources + tplPrint + tplBackupInput + tplFullScreenBtn + tplBioClockWidget;
    document.body.insertAdjacentHTML('beforeend', fullTemplate);
    
    // 7. Kích hoạt tính năng Kéo thả
    if(window.makeDraggable) {
        window.makeDraggable('miniBioClockWidget', function() { if(window.openBioClock) window.openBioClock(); });
        window.makeDraggable('floatingFullScreenBtn', function() { if(window.toggleFullScreen) window.toggleFullScreen(); });
    } else {
        document.getElementById('miniBioClockWidget').onclick = window.openBioClock;
        document.getElementById('floatingFullScreenBtn').onclick = window.toggleFullScreen;
    }
};
