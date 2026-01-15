// --- INIT & MIGRATION ---
// Cấu hình LocalForage
localforage.config({
    name: 'YHCT_Pro_App',
    storeName: 'data_store'
});

// Khởi tạo biến toàn cục
window.db = [];
window.config = {};

// Default configurations
const defaultConfig = {
    clinicTitle: 'Phòng Khám YHCT',
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
    headerOverlayOpacity: 0,
    headerBgImage: null,
    qrCodeImage: null,
    profitVisible: false,
    password: ''
};

// Variables for Visit Logic
let currentVisit = { 
    step: 1, 
    rxEast: [], rxWest: [], procs: [], 
    manualMedTotalEast: 0, manualMedTotalWest: 0,
    eastDays: 1, westDays: 1,
    eastNote: "", westNote: "",
    manualPriceEast: 0, manualPriceWest: 0,
    tuChan: {vong:[],van:[],vanhoi:[],thiet:[],thietchan:[],machchan:[]} 
};

// Variables for Settings Logic
let tempEastOptions = [];
let currentEastOptionIndex = -1;

// General Variables
let chartInstance = null;
let currentFilteredVisits = [];
let currentPrintType = 'invoice';
let currentMonthFilter = 'CURRENT'; // 'ALL', 'CURRENT' (YYYY-MM), or specific 'YYYY-MM'

// KEYPAD & INPUT VARIABLES
let keypadMode = "unlock";
let tempPassInput = "";
let numberPadValue = "", currentNumberInput = null;
let numberPadConfig = { min: 0, max: 99999999, defaultValue: 0, isPhone: false };

// --- DATE HELPER FUNCTION (FIX TIMEZONE ISSUE) ---
window.getLocalDate = function() {
    const now = new Date();
    // Trừ đi offset timezone để lấy đúng giờ địa phương khi convert sang ISO
    const local = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return local.toISOString().split('T')[0];
};

// Detect iPad
window.isIPad = function() {
    return /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// --- MAIN LOAD FUNCTION (ASYNC) ---
window.onload = async function() {
    try {
        // 1. Load Data
        const savedDb = await localforage.getItem('yhct_db_v49');
        const savedConfig = await localforage.getItem('yhct_cfg_v49');

        // 2. Migration Logic
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
            window.config = savedConfig || {};
        }

        // 3. Apply Defaults
        if (!window.config.clinicTitle) window.config = { ...defaultConfig, ...window.config };
        
        if (Array.isArray(window.config.diseases)) {
            window.config.diseases.forEach(d => {
                if (d && !d.eastOptions) {
                    d.eastOptions = [];
                    if (d.rxEast && d.rxEast.length > 0) d.eastOptions.push({ name: "Bài thuốc cơ bản", ingredients: d.rxEast });
                }
            });
        }
        
        if (!window.config.tuChan) window.config.tuChan = defaultConfig.tuChan;

        // Set Default Month Filter to Current Month
        currentMonthFilter = window.getLocalDate().slice(0, 7); // YYYY-MM

        // 4. Initial Render
        window.renderMonthFilterList(); // Generate tabs
        window.render();
        window.updateHeader();
        window.initDefaultValues();
        window.checkFirstTimeUse();
        window.injectCustomButtons();
        window.injectBackupButtons();
        window.injectKeypadModal();

        // FIX: Ensure Header Card is clickable
        const headerCard = document.getElementById('mainHeaderCard');
        if(headerCard) {
            headerCard.style.position = 'relative';
            headerCard.style.zIndex = '10';
        }

        if (window.isIPad()) {
            document.querySelectorAll('.song-input, textarea').forEach(input => input.classList.add('ipad-input-fix'));
        }

    } catch (err) {
        console.error("Error initializing app:", err);
        alert("Lỗi khởi động: " + err.message);
    }
};

// --- SAVE FUNCTIONS (ASYNC) ---
window.saveDb = async function() { 
    try { 
        await localforage.setItem('yhct_db_v49', window.db);
        window.renderMonthFilterList(); // Refresh labels when DB changes
    } catch(e) { 
        alert("Lỗi lưu DB: " + e); 
    } 
};

window.saveConfig = async function() { 
    try { 
        await localforage.setItem('yhct_cfg_v49', window.config); 
        window.updateHeader(); 
    } catch(e) { 
        alert("Lỗi lưu Cấu hình: " + e); 
    } 
};

// --- MONTH FILTER LOGIC (NEW) ---
window.renderMonthFilterList = function() {
    const container = document.getElementById('monthFilterArea');
    if (!container) return;

    // 1. Collect all unique months from visits
    let months = new Set();
    // Always add current month
    const currentMonth = window.getLocalDate().slice(0, 7);
    months.add(currentMonth);

    window.db.forEach(p => {
        if (p.visits && p.visits.length > 0) {
            p.visits.forEach(v => {
                if (v.date && v.date.length >= 7) {
                    months.add(v.date.slice(0, 7));
                }
            });
        }
    });

    // 2. Sort months descending
    const sortedMonths = Array.from(months).sort().reverse();

    // 3. Generate HTML
    let html = `<button onclick="window.setMonthFilter('ALL')" class="month-chip ${currentMonthFilter === 'ALL' ? 'active' : ''}">Tất cả</button>`;
    
    sortedMonths.forEach(m => {
        const [year, month] = m.split('-');
        const label = `T${parseInt(month)}/${year}`;
        html += `<button onclick="window.setMonthFilter('${m}')" class="month-chip ${currentMonthFilter === m ? 'active' : ''}">${label}</button>`;
    });

    container.innerHTML = html;
};

window.setMonthFilter = function(filter) {
    currentMonthFilter = filter;
    window.renderMonthFilterList(); // Re-render to update active state
    window.render();
};

// --- CUSTOM BUTTON INJECTION ---
window.injectCustomButtons = function() {
    const step3 = document.getElementById('step3');
    if (!step3) return;

    if (!document.getElementById('btnProcOnly')) {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'mb-4';
        btnContainer.innerHTML = `<button id="btnProcOnly" onclick="window.setOnlyProcedures()" class="w-full py-3 bg-teal-50 text-teal-700 font-bold rounded-xl border border-teal-200 shadow-sm uppercase text-sm hover:bg-teal-100 transition-colors">✨ Chỉ làm thủ thuật (Xóa thuốc)</button>`;
        step3.insertBefore(btnContainer, step3.firstChild);
    }

    const eastHeader = step3.querySelector('.rx-header-controls');
    if (eastHeader && !document.getElementById('btnClearEast')) {
        const titleDiv = eastHeader.firstElementChild;
        if(titleDiv) {
            const btn = document.createElement('button');
            btn.id = 'btnClearEast';
            btn.className = 'text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded ml-2 hover:bg-gray-300 font-bold border border-gray-300';
            btn.innerText = '✘ Bỏ toa này';
            btn.onclick = function() { window.clearRx('east'); };
            titleDiv.appendChild(btn);
        }
    }

    const westSection = step3.querySelector('.border-blue-200');
    if (westSection) {
        const westHeader = westSection.querySelector('.rx-header-controls');
        if (westHeader && !document.getElementById('btnClearWest')) {
            const titleDiv = westHeader.firstElementChild;
            if(titleDiv) {
                const btn = document.createElement('button');
                btn.id = 'btnClearWest';
                btn.className = 'text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded ml-2 hover:bg-blue-200 font-bold border border-blue-200';
                btn.innerText = '✘ Bỏ toa này';
                btn.onclick = function() { window.clearRx('west'); };
                titleDiv.appendChild(btn);
            }
        }
    }
};

window.injectBackupButtons = function() {
    const backupGrid = document.querySelector('#backupModal .backup-grid');
    if (backupGrid && !document.getElementById('btnImportExcel')) {
        const div = document.createElement('div');
        div.className = 'backup-card';
        div.id = 'btnImportExcel';
        div.onclick = window.importFromExcel;
        div.innerHTML = `<div class="backup-icon">📥</div><div class="backup-title">Nhập Excel</div><div class="backup-desc">Đồng bộ từ file Excel</div>`;
        if(backupGrid.children.length > 1) {
            backupGrid.insertBefore(div, backupGrid.children[2]);
        } else {
            backupGrid.appendChild(div);
        }
    }
};

window.setOnlyProcedures = function() {
    if(confirm("Bạn có chắc muốn xóa toàn bộ thuốc Đông Y và Tây Y để chỉ làm thủ thuật?")) {
        window.clearRx('east', false);
        window.clearRx('west', false);
    }
};

window.clearRx = function(type, ask = true) {
    if(ask && !confirm("Xóa toàn bộ thuốc " + (type==='east'?'Đông Y':'Tây Y') + "?")) return;
    
    if(type === 'east') {
        currentVisit.rxEast = [];
        currentVisit.eastDays = 1;
        currentVisit.manualPriceEast = 0;
        currentVisit.eastNote = "";
        document.getElementById('vEastDays').value = 1;
        document.getElementById('vEastManualPrice').value = "";
        document.getElementById('vEastNote').value = "";
    } else {
        currentVisit.rxWest = [];
        currentVisit.westDays = 1;
        currentVisit.manualPriceWest = 0;
        currentVisit.westNote = "";
        document.getElementById('vWestDays').value = 1;
        document.getElementById('vWestManualPrice').value = "";
        document.getElementById('vWestNote').value = "";
    }
    window.renderMedList(type);
    window.calcTotal();
};

// --- HEADER & QR FUNCTIONS ---
window.updateHeader = function() { 
    if (!window.config) return;
    document.getElementById('displayTitle').innerText = window.config.clinicTitle || 'Phòng Khám'; 
    document.getElementById('displayDoctor').innerText = window.config.doctorName ? window.config.doctorName : 'Đông Y'; 
    window.updateProfitDisplay();
    
    const header = document.getElementById('mainHeader');
    const overlay = document.getElementById('headerOverlay');
    const card = document.getElementById('mainHeaderCard');
    
    if (window.config.headerBgImage) {
        header.style.backgroundImage = `url(${window.config.headerBgImage})`;
        overlay.style.opacity = (window.config.headerOverlayOpacity || 0) / 100;
        card.classList.add('transparent-mode');
    } else {
        header.style.backgroundImage = 'none';
        overlay.style.opacity = 0;
        card.classList.remove('transparent-mode');
    }
}

window.handleImageUpload = function(input, configKey, previewId, isHeader = false) {
    const file = input.files[0];
    if (!file) return;
    
    if (file.size > 5000000) { 
        alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.");
        input.value = "";
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        window.config[configKey] = e.target.result;
        if (previewId) document.getElementById(previewId).src = e.target.result;
        if (isHeader) window.updateHeader();
        window.saveConfig();
    };
    reader.readAsDataURL(file);
}

window.updateHeaderOverlay = function(value) {
    window.config.headerOverlayOpacity = value;
    document.getElementById('overlayValueDisplay').innerText = value + '%';
    document.getElementById('headerOverlay').style.opacity = value / 100;
}

window.clearHeaderImage = function() {
    window.config.headerBgImage = null;
    document.getElementById('headerBgInput').value = "";
    window.updateHeader();
    window.saveConfig();
}

window.clearQrImage = function() {
    window.config.qrCodeImage = null;
    document.getElementById('qrInput').value = "";
    document.getElementById('previewQrSettings').src = "";
    window.saveConfig();
}

// --- PROFIT BOX LOGIC ---
window.handleProfitBoxClick = async function() { 
    if(!window.config.password) { 
        window.config.profitVisible = !window.config.profitVisible; 
        await window.saveConfig(); 
        window.updateProfitDisplay(); 
    } else { 
        if(window.config.profitVisible) { 
            window.config.profitVisible = false; 
            await window.saveConfig(); 
            window.updateProfitDisplay(); 
        } else {
            window.openKeypad('unlock'); 
        }
    } 
};

window.updateProfitDisplay = function() {
    const l = document.getElementById('profitLabel');
    if(window.config.profitVisible || !window.config.password) {
        let t = 0; 
        const now = new Date();
        if(window.db) {
            window.db.forEach(p => p.visits?.forEach(v => { 
                const d = new Date(v.date);
                if(d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && v.paid) 
                    t += (v.total - (v.cost || 0)); 
            }));
        }
        l.innerText = t.toLocaleString()+'đ';
    } else {
        l.innerText = '******';
    }
};

// --- KEYPAD FUNCTIONS ---
window.injectKeypadModal = function() {
    if (document.getElementById('keypadModal')) return;
    
    const div = document.createElement('div');
    div.id = 'keypadModal';
    div.className = 'modal';
    div.innerHTML = `
        <div class="modal-box max-w-sm text-center">
            <div class="modal-header justify-center"><h3 id="keypadTitle" class="font-bold text-lg text-[#3e2723]">Nhập mật khẩu</h3></div>
            <div class="modal-body">
                <div class="flex justify-center gap-2 mb-6" id="dotsArea">
                    <div class="dot w-3 h-3 rounded-full border border-[#3e2723]"></div><div class="dot w-3 h-3 rounded-full border border-[#3e2723]"></div>
                    <div class="dot w-3 h-3 rounded-full border border-[#3e2723]"></div><div class="dot w-3 h-3 rounded-full border border-[#3e2723]"></div>
                    <div class="dot w-3 h-3 rounded-full border border-[#3e2723]"></div><div class="dot w-3 h-3 rounded-full border border-[#3e2723]"></div>
                </div>
                <div class="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
                    <button onclick="window.addDigit('1')" class="btn-glass h-12 text-lg font-bold">1</button>
                    <button onclick="window.addDigit('2')" class="btn-glass h-12 text-lg font-bold">2</button>
                    <button onclick="window.addDigit('3')" class="btn-glass h-12 text-lg font-bold">3</button>
                    <button onclick="window.addDigit('4')" class="btn-glass h-12 text-lg font-bold">4</button>
                    <button onclick="window.addDigit('5')" class="btn-glass h-12 text-lg font-bold">5</button>
                    <button onclick="window.addDigit('6')" class="btn-glass h-12 text-lg font-bold">6</button>
                    <button onclick="window.addDigit('7')" class="btn-glass h-12 text-lg font-bold">7</button>
                    <button onclick="window.addDigit('8')" class="btn-glass h-12 text-lg font-bold">8</button>
                    <button onclick="window.addDigit('9')" class="btn-glass h-12 text-lg font-bold">9</button>
                    <button onclick="window.closeKeypad()" class="btn-glass h-12 text-sm font-bold text-red-500">Hủy</button>
                    <button onclick="window.addDigit('0')" class="btn-glass h-12 text-lg font-bold">0</button>
                    <button onclick="window.removeDigit()" class="btn-glass h-12 text-lg font-bold">⌫</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(div);
};

window.openKeypad = function(mode) {
    window.injectKeypadModal();
    keypadMode = mode;
    tempPassInput = "";
    window.updateKeypadDots();
    document.getElementById('keypadTitle').innerText = mode === 'settings' ? 'Nhập mật khẩu mới' : 'Nhập mật khẩu';
    document.getElementById('keypadModal').classList.add('active');
};

window.closeKeypad = function() {
    const k = document.getElementById('keypadModal');
    if(k) k.classList.remove('active');
};

window.addDigit = function(d) {
    if (tempPassInput.length < 6) {
        tempPassInput += d;
        window.updateKeypadDots();
        if (tempPassInput.length === 6) {
            setTimeout(() => {
                window.processKeypadInput();
            }, 200);
        }
    }
};

window.removeDigit = function() {
    if (tempPassInput.length > 0) {
        tempPassInput = tempPassInput.slice(0, -1);
        window.updateKeypadDots();
    }
};

window.updateKeypadDots = function() {
    const dots = document.querySelectorAll('#dotsArea .dot');
    dots.forEach((dot, index) => {
        if (index < tempPassInput.length) {
            dot.style.backgroundColor = '#3e2723';
        } else {
            dot.style.backgroundColor = 'transparent';
        }
    });
};

window.processKeypadInput = async function() {
    if (keypadMode === 'settings') {
        window.config.password = tempPassInput;
        document.getElementById('confPass').value = tempPassInput;
        await window.saveConfig();
        alert('Đã cập nhật mật khẩu!');
        window.closeKeypad();
    } 
    else if (keypadMode === 'unlock') {
        if (tempPassInput === window.config.password) {
            window.config.profitVisible = true;
            await window.saveConfig();
            window.updateProfitDisplay();
            window.closeKeypad();
        } else {
            alert('Mật khẩu không đúng!');
            tempPassInput = "";
            window.updateKeypadDots();
        }
    }
};

// --- NUMBER PAD FUNCTIONS (UPDATED FOR MED INPUTS) ---
window.openNumberPad = function(id, title, range, def) {
    currentNumberInput = id; 
    numberPadConfig.isPhone = false; 
    const el = document.getElementById(id);
    let val = def;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) val = el.value || def;
    numberPadValue = val.toString();
    document.getElementById('numberPadTitle').innerText = title; 
    document.getElementById('numberPadDisplay').innerText = numberPadValue;
    document.getElementById('numberPadModal').classList.add('active');
    if(range && range.includes('-')) {
        const [min,max] = range.split('-'); 
        numberPadConfig.min = parseInt(min); numberPadConfig.max = parseInt(max);
    } else {
        numberPadConfig.min = 0; numberPadConfig.max = 99999999;
    }
};

window.openPhonePad = function() {
    currentNumberInput = 'pPhone'; numberPadConfig.isPhone = true; numberPadValue = document.getElementById('pPhone').value;
    document.getElementById('numberPadTitle').innerText = 'Số điện thoại';
    document.getElementById('numberPadDisplay').innerText = numberPadValue || "";
    document.getElementById('numberPadModal').classList.add('active');
};

window.addNumberPadDigit = function(d) {
    if(numberPadConfig.isPhone) { if(numberPadValue.length<15) numberPadValue+=d; }
    else { 
        if(numberPadValue==="0") numberPadValue=d; 
        else { 
            const n = parseInt(numberPadValue+d); 
            if(n<=numberPadConfig.max) numberPadValue+=d; 
        } 
    }
    document.getElementById('numberPadDisplay').innerText = numberPadValue;
};

window.deleteNumberPadDigit = function() { numberPadValue = numberPadValue.slice(0,-1); document.getElementById('numberPadDisplay').innerText = numberPadValue||"0"; };
window.clearNumberPad = function() { numberPadValue = ""; document.getElementById('numberPadDisplay').innerText = "0"; };
window.closeNumberPad = function() { document.getElementById('numberPadModal').classList.remove('active'); };

// --- MAIN NUMBER PAD CONFIRM LOGIC (CRITICAL FIX) ---
window.confirmNumberPad = function() {
    if(currentNumberInput) {
        // Handle Medicine Inputs
        if (currentNumberInput.startsWith('med_')) {
            const parts = currentNumberInput.split('_'); // e.g., med_qty_east_0 or med_price_west_2
            const field = parts[1]; // qty or price
            const type = parts[2]; // east or west
            const idx = parseInt(parts[3]);
            
            // Update Data directly
            window.updateMed(type, idx, field, numberPadValue);
            
            // Re-render list is handled in updateMed, but we ensure input value is set
            const el = document.getElementById(currentNumberInput);
            if(el) el.value = numberPadValue;
        }
        // Handle Procedure Inputs
        else if (currentNumberInput.startsWith('proc_days_')) {
            const idx = parseInt(currentNumberInput.split('_')[2]);
            window.updateProcDays(idx, numberPadValue);
        }
        else if (currentNumberInput.startsWith('proc_disc_')) {
            const idx = parseInt(currentNumberInput.split('_')[2]);
            if(currentVisit.procs[idx]) currentVisit.procs[idx].discount = parseInt(numberPadValue) || 0;
            window.renderProcList(); window.calcTotal();
        }
        // Handle Settings Inputs (Setting East/West Template Items)
        else if (currentNumberInput.startsWith('set_')) {
             const parts = currentNumberInput.split('_'); // set_east_qty_0
             const el = document.getElementById(currentNumberInput);
             if (el) el.value = numberPadValue;
        }
        // Standard inputs
        else {
            const el = document.getElementById(currentNumberInput);
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) el.value = numberPadValue;

            if(currentNumberInput.startsWith('vBp')) window.updateBpDisplay();
            else if(currentNumberInput==='vPulse') document.getElementById('displayPulse').innerText = numberPadValue;
            else if(currentNumberInput==='vHeight'||currentNumberInput==='vWeight') window.updateHeightWeightDisplay();
            else if(currentNumberInput==='vDiscountPercent') {
                document.getElementById('discountBtn').innerText = numberPadValue + "% ▼"; window.calcTotal();
            }
            else if(currentNumberInput === 'vEastDays' || currentNumberInput === 'vWestDays' || 
                    currentNumberInput === 'vEastManualPrice' || currentNumberInput === 'vWestManualPrice' || currentNumberInput === 'vCost') {
                window.calcTotal();
            }
        }
    }
    window.closeNumberPad();
};

window.updateBpDisplay = function() { 
    document.getElementById('displayBP').innerText = (document.getElementById('vBpSys').value||120)+'/'+(document.getElementById('vBpDia').value||80); 
};

window.updateHeightWeightDisplay = function() {
    const h = document.getElementById('vHeight').value, w = document.getElementById('vWeight').value;
    document.getElementById('displayHeightWeight').innerText = `${h}cm - ${w}kg`;
    if(h>0 && w>0) document.getElementById('displayBMI').innerText = 'BMI: ' + (w/((h/100)*(h/100))).toFixed(1);
};

window.initDefaultValues = function() {
    if(!document.getElementById('vBpSys').value) {
        document.getElementById('vBpSys').value=120; document.getElementById('vBpDia').value=80;
        document.getElementById('vPulse').value=80; document.getElementById('vHeight').value=165; document.getElementById('vWeight').value=60;
    }
};

// --- BACKUP & RESTORE ---
window.openBackupModalDirect = function() { 
    window.closeModals();
    setTimeout(() => { document.getElementById('backupModal').classList.add('active'); }, 10);
};

// UPDATED: Export to Excel with new columns (Age, Payment Status)
window.exportToExcel = function() {
    if(!currentFilteredVisits.length) return alert("Không có dữ liệu");
    
    const data = currentFilteredVisits.map((v, i) => ({
        "STT": i+1, 
        "Ngày": v.date, 
        "Tên": v.pName, 
        "Tuổi": v.pAge, // NEW
        "Bệnh": v.disease,
        "Thuốc Đông Y": v.rxEast?.map(m=>`${m.name}(${m.qty}g)`).join(', ')||'',
        "Thuốc Tây Y": v.rxWest?.map(m=>`${m.name}(${m.qty}v)`).join(', ')||'',
        "Thủ thuật": v.procs?.map(p=>`${p.name}(${p.days} ngày)`).join(', ')||'',
        "Đã thanh toán": v.paid ? "Rồi" : "Chưa", // NEW
        "Tổng thu": v.total, 
        "Lãi": v.total-(v.cost||0)
    }));
    
    const ws = XLSX.utils.json_to_sheet(data); const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo");
    XLSX.writeFile(wb, `BaoCao_${new Date().toISOString().split('T')[0]}.xlsx`);
};

window.exportFullDataExcel = function() {
    const wb = XLSX.utils.book_new();
    const pData = window.db.map((p,i)=>({
        "ID": p.id,
        "Tên": p.name,
        "Năm sinh": p.year,
        "SĐT": p.phone,
        "Địa chỉ": p.address
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(pData), "BenhNhan");
    XLSX.writeFile(wb, `FullData_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// --- IMPORT EXCEL FEATURE ---
window.importFromExcel = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                window.syncDataFromExcel(json);
            } catch (err) {
                alert("Lỗi đọc file Excel: " + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    };
    input.click();
};

window.syncDataFromExcel = function(data) {
    let countNew = 0;
    let countUpdate = 0;
    
    if(!Array.isArray(window.db)) window.db = [];

    data.forEach(row => {
        const id = row['ID'] ? String(row['ID']) : null;
        const name = row['Tên'] || row['Tên bệnh nhân'];
        
        if(!id || !name) return; 

        const existingP = window.db.find(p => String(p.id) === id);
        
        if(existingP) {
            existingP.name = name;
            if(row['Năm sinh']) existingP.year = row['Năm sinh'];
            if(row['SĐT']) existingP.phone = row['SĐT'];
            if(row['Địa chỉ']) existingP.address = row['Địa chỉ'];
            countUpdate++;
        } else {
            window.db.push({
                id: id,
                name: name,
                year: row['Năm sinh'] || '',
                phone: row['SĐT'] || '',
                address: row['Địa chỉ'] || '',
                visits: []
            });
            countNew++;
        }
    });
    
    window.saveDb();
    window.render();
    alert(`Đã đồng bộ xong!\n- Thêm mới: ${countNew}\n- Cập nhật: ${countUpdate}`);
};

window.exportToJSON = function() {
    const blob = new Blob([JSON.stringify({db: window.db, config: window.config}, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup_yhct_${window.getLocalDate()}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
};

window.importFromJSON = function() { document.getElementById('jsonFileInput').click(); };

window.handleJSONFileSelect = function(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(ev) {
        try {
            const data = JSON.parse(ev.target.result);
            if (data.db && data.config) {
                if(confirm('Dữ liệu hiện tại sẽ bị ghi đè. Tiếp tục?')) {
                    window.db = data.db; window.config = data.config;
                    await window.saveDb(); 
                    await window.saveConfig();
                    alert('Khôi phục thành công! Trang sẽ tải lại.');
                    location.reload();
                }
            } else alert('File không hợp lệ');
        } catch(err) { alert('Lỗi đọc file: ' + err.message); }
    };
    reader.readAsText(file); e.target.value = '';
};

// --- FIRST TIME ---
window.checkFirstTimeUse = function() {
    if (!localStorage.getItem('yhct_first_time')) {
        window.createSampleData(); localStorage.setItem('yhct_first_time', 'false');
    }
};

window.createSampleData = async function() {
    if (window.config.diseases.length===0) window.config.diseases = [{name:"Cảm mạo",sym:"Sốt, sợ lạnh",rxWest:[],eastOptions:[]}];
    if (window.config.procs.length===0) window.config.procs = [{name:"Châm cứu",price:100000}, {name:"Xoa bóp",price:150000}];
    if (window.db.length===0) window.db = [{id:"1",name:"Nguyễn Văn A",year:"1990",phone:"0909000111",visits:[]}];
    await window.saveDb(); 
    await window.saveConfig();
};

// --- PATIENT & LIST ---
let searchTimeout;
window.debouncedRender = function() { clearTimeout(searchTimeout); searchTimeout = setTimeout(window.render, 250); };

// UPDATED RENDER FUNCTION WITH MONTH FILTERING
window.render = function() {
    if(!window.db) return;
    const list = document.getElementById('list');
    const kw = document.getElementById('search').value.toLowerCase();
    
    list.innerHTML = window.db.map(p => {
        // 1. Check if matches search keyword
        const matchesKeyword = p.name.toLowerCase().includes(kw) || (p.phone && p.phone.includes(kw));
        
        if (!matchesKeyword) return '';

        // 2. Check Month Filter Logic
        let showPatient = false;

        if (currentMonthFilter === 'ALL') {
            showPatient = true; 
        } else {
            if (p.visits && p.visits.some(v => v.date && v.date.startsWith(currentMonthFilter))) {
                showPatient = true;
            }
        }

        if(showPatient) {
            return `<div class="patient-row"><div class="p-info" onclick="window.viewHistory('${p.id}')"><h3 class="font-bold text-lg text-[#3e2723]">${p.name}</h3><p class="text-xs text-[#8d6e63]">${p.year?'SN '+p.year:''} ${p.phone?'• '+p.phone:''}</p></div><div class="p-actions"><button onclick="window.handleEdit('${p.id}',event)" class="act-btn act-edit">SỬA</button><button onclick="window.handleExam('${p.id}',event)" class="act-btn act-exam">KHÁM</button><button onclick="window.handleDelete('${p.id}')" class="act-btn act-del">XÓA</button></div></div>`;
        }
        return '';
    }).join('');
    
    // Check empty state
    if(list.innerHTML === '') {
        list.innerHTML = `<div class="text-center text-gray-400 mt-10 italic">Không tìm thấy bệnh nhân nào trong tháng này.</div>`;
    }

    document.getElementById('monthLabel').innerText = `T${new Date().getMonth()+1}`;
    window.updateProfitDisplay();
};

window.handleEdit = function(id,e) { e.stopPropagation(); window.openPatientModal(id); };
window.handleExam = function(id,e) { e.stopPropagation(); window.startVisit(id); };
window.handleDelete = async function(id) { 
    if(confirm('Xóa bệnh nhân này?')) { 
        window.db = window.db.filter(x=>String(x.id)!==String(id)); 
        await window.saveDb(); 
        window.render(); 
    } 
};

window.openPatientModal = function(id=null) {
    document.getElementById('pEditId').value = id||'';
    if(id) { 
        const p = window.db.find(x=>x.id==id); 
        document.getElementById('pName').value=p.name; document.getElementById('pYear').value=p.year; document.getElementById('pPhone').value=p.phone; document.getElementById('pAddress').value=p.address; 
    } else { 
        document.getElementById('pName').value=''; document.getElementById('pYear').value=''; document.getElementById('pPhone').value=''; document.getElementById('pAddress').value=''; 
    }
    document.getElementById('pModal').classList.add('active');
};

window.savePatient = async function() {
    const name = document.getElementById('pName').value; if(!name) return alert("Nhập tên!");
    const id = document.getElementById('pEditId').value, p = { 
        id: id||Date.now().toString(), name: name, year: document.getElementById('pYear').value, phone: document.getElementById('pPhone').value, address: document.getElementById('pAddress').value, visits: id?window.db.find(x=>x.id==id).visits:[] 
    };
    if(id) window.db[window.db.findIndex(x=>x.id==id)] = p; else window.db.unshift(p);
    await window.saveDb(); 
    window.closeModals(); 
    window.render();
};

// --- DISEASE MANAGEMENT ---
window.addNewDisease = function() {
    window.closeModals();
    setTimeout(() => {
        document.getElementById('diseaseModalTitle').innerText = 'Thêm Bệnh Mới';
        document.getElementById('diseaseEditIndex').value = '';
        document.getElementById('diseaseName').value = '';
        document.getElementById('diseaseSymptoms').value = '';
        document.getElementById('westMedicinesContainer').innerHTML = '';
        
        tempEastOptions = [{name: "Bài thuốc 1", ingredients: []}];
        currentEastOptionIndex = 0;
        
        window.renderEastTabsInSettings();
        window.addWestMedicine();
        document.getElementById('diseaseModal').classList.add('active');
    }, 100);
};

window.editDisease = function(index) {
    window.closeModals(); 
    setTimeout(() => {
        const disease = window.config.diseases[index];
        document.getElementById('diseaseModalTitle').innerText = 'Sửa Bệnh';
        document.getElementById('diseaseEditIndex').value = index;
        document.getElementById('diseaseName').value = disease.name || '';
        document.getElementById('diseaseSymptoms').value = disease.sym || '';
        
        document.getElementById('westMedicinesContainer').innerHTML = '';
        if (disease.rxWest && disease.rxWest.length > 0) {
            disease.rxWest.forEach(med => {
                window.renderWestMedInSettings(med);
            });
        } else window.addWestMedicine();
        
        if (disease.eastOptions && disease.eastOptions.length > 0) {
            tempEastOptions = JSON.parse(JSON.stringify(disease.eastOptions));
        } else {
            tempEastOptions = [{name: "Bài thuốc cơ bản", ingredients: []}];
        }
        
        currentEastOptionIndex = 0;
        window.renderEastTabsInSettings();
        document.getElementById('diseaseModal').classList.add('active');
    }, 100);
};

window.renderEastTabsInSettings = function() {
    const container = document.getElementById('eastIngredientsContainer');
    let tabArea = document.getElementById('eastSettingsTabs');
    if (!tabArea) {
        tabArea = document.createElement('div');
        tabArea.id = 'eastSettingsTabs';
        tabArea.className = 'flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-dashed border-[#d7ccc8]';
        if(container.parentElement && document.getElementById('diseaseEastName').parentElement) {
            container.parentElement.insertBefore(tabArea, document.getElementById('diseaseEastName').parentElement);
        }
    }
    
    tabArea.innerHTML = tempEastOptions.map((opt, i) => `
        <button onclick="window.switchEastPresetSettings(${i})" 
                class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                ${i === currentEastOptionIndex ? 'bg-[#5d4037] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
            ${opt.name || 'Bài thuốc ' + (i+1)}
        </button>
    `).join('') + `
        <button onclick="window.addEastPresetInSettings()" class="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">+ Thêm bài</button>
        ${tempEastOptions.length > 1 ? '<button onclick="window.removeCurrentEastPreset()" class="px-2 py-1 text-xs text-red-500 font-bold ml-2">Xóa bài này</button>' : ''}
    `;
    
    const currentOpt = tempEastOptions[currentEastOptionIndex];
    document.getElementById('diseaseEastName').value = currentOpt.name;
    container.innerHTML = ''; 
    
    if (currentOpt.ingredients && currentOpt.ingredients.length > 0) {
        currentOpt.ingredients.forEach((ing, idx) => {
            window.renderEastIngInSettings(ing, idx);
        });
    } else {
        window.renderEastIngInSettings({}, 0); 
    }
};

window.switchEastPresetSettings = function(newIndex) {
    window.saveCurrentTabToTemp();
    currentEastOptionIndex = newIndex;
    window.renderEastTabsInSettings();
};

window.addEastPresetInSettings = function() {
    window.saveCurrentTabToTemp();
    tempEastOptions.push({name: `Bài thuốc ${tempEastOptions.length + 1}`, ingredients: []});
    currentEastOptionIndex = tempEastOptions.length - 1;
    window.renderEastTabsInSettings();
};

window.removeCurrentEastPreset = function() {
    if (tempEastOptions.length <= 1) return;
    if (confirm("Xóa bài thuốc này?")) {
        tempEastOptions.splice(currentEastOptionIndex, 1);
        currentEastOptionIndex = 0;
        window.renderEastTabsInSettings();
    }
};

window.saveCurrentTabToTemp = function() {
    if (currentEastOptionIndex === -1 || !tempEastOptions[currentEastOptionIndex]) return;
    
    const currentName = document.getElementById('diseaseEastName').value.trim();
    tempEastOptions[currentEastOptionIndex].name = currentName || `Bài thuốc ${currentEastOptionIndex + 1}`;
    
    const ingredients = [];
    document.querySelectorAll('#eastIngredientsContainer .disease-ingredient-row').forEach(row => {
        const name = row.querySelector('.east-ingredient-name').value.trim();
        const qty = parseInt(row.querySelector('.east-ingredient-qty').value) || 0;
        const price = parseInt(row.querySelector('.east-ingredient-price').value) || 0;
        if (name) ingredients.push({name, qty, days: 1, price});
    });
    tempEastOptions[currentEastOptionIndex].ingredients = ingredients;
};

// UPDATED SETTINGS RENDER WITH IDs
window.renderEastIngInSettings = function(ing = {}, idx = 0) {
    const container = document.getElementById('eastIngredientsContainer');
    const div = document.createElement('div');
    const uniqueID = Date.now() + Math.random().toString(36).substr(2, 9);
    div.className = 'disease-ingredient-row med-row-grid';
    div.innerHTML = `
        <button onclick="this.parentElement.remove()" class="med-delete-btn">&times;</button>
        <div class="med-row-name">
            <input type="text" class="east-ingredient-name song-input ipad-input-fix" placeholder="Tên vị thuốc..." value="${ing.name || ''}" onfocus="this.blur = null"> 
        </div>
        <div class="med-input-group"><label>S.Lượng</label>
            <input type="text" id="set_east_qty_${uniqueID}" class="east-ingredient-qty med-input-large ipad-input-fix" value="${ing.qty || 10}" 
            onclick="window.openNumberPad('set_east_qty_${uniqueID}', 'Số lượng', '0-999', ${ing.qty || 10})" readonly>
        </div>
        <div class="med-input-group"><label>Đơn Giá</label>
            <input type="text" id="set_east_price_${uniqueID}" class="east-ingredient-price med-input-large ipad-input-fix" value="${ing.price || 0}" 
            onclick="window.openNumberPad('set_east_price_${uniqueID}', 'Đơn giá', '0-999999', ${ing.price || 0})" readonly>
        </div>
        <input type="hidden" class="east-ingredient-days" value="1">
    `;
    container.appendChild(div);
};

window.addEastIngredient = function() { window.renderEastIngInSettings({}, document.querySelectorAll('#eastIngredientsContainer > div').length); };

// UPDATED SETTINGS RENDER WEST
window.renderWestMedInSettings = function(med = {}, idx = 0) {
    const container = document.getElementById('westMedicinesContainer');
    const div = document.createElement('div');
    const uniqueID = Date.now() + Math.random().toString(36).substr(2, 9);
    div.className = 'disease-ingredient-row med-row-grid';
    div.innerHTML = `
        <button onclick="this.parentElement.remove()" class="med-delete-btn">&times;</button>
        <div class="med-row-name">
            <input type="text" class="west-medicine-name song-input ipad-input-fix" placeholder="Tên thuốc mẫu..." value="${med.name || ''}" onfocus="this.blur = null">
        </div>
        <div class="med-input-group"><label>S.Lượng</label>
            <input type="text" id="set_west_qty_${uniqueID}" class="west-medicine-qty med-input-large ipad-input-fix" value="${med.qty || 2}" 
            onclick="window.openNumberPad('set_west_qty_${uniqueID}', 'Số lượng', '0-999', ${med.qty || 2})" readonly>
        </div>
        <div class="med-input-group"><label>Đơn Giá</label>
            <input type="text" id="set_west_price_${uniqueID}" class="west-medicine-price med-input-large ipad-input-fix" value="${med.price || 0}" 
            onclick="window.openNumberPad('set_west_price_${uniqueID}', 'Đơn giá', '0-999999', ${med.price || 0})" readonly>
        </div>
        <input type="hidden" class="west-medicine-days" value="1">
    `;
    container.appendChild(div);
};

window.addWestMedicine = function() { window.renderWestMedInSettings({}, document.querySelectorAll('#westMedicinesContainer > div').length); };

window.saveDisease = async function() {
    const name = document.getElementById('diseaseName').value.trim();
    if (!name) return alert('Vui lòng nhập tên bệnh');
    const symptoms = document.getElementById('diseaseSymptoms').value.trim();
    
    window.saveCurrentTabToTemp();
    
    const rxWest = [];
    document.querySelectorAll('#westMedicinesContainer .disease-ingredient-row').forEach(row => {
        const name = row.querySelector('.west-medicine-name').value.trim();
        const qty = parseInt(row.querySelector('.west-medicine-qty').value) || 0;
        const price = parseInt(row.querySelector('.west-medicine-price').value) || 0;
        if (name) rxWest.push({name, qty, days: 1, price});
    });
    
    const disease = {
        name: name,
        sym: symptoms,
        rxWest: rxWest,
        eastOptions: tempEastOptions.filter(opt => opt.name) 
    };
    
    const editIndex = document.getElementById('diseaseEditIndex').value;
    if (editIndex !== '') window.config.diseases[editIndex] = disease;
    else window.config.diseases.push(disease);
    
    await window.saveConfig();
    window.renderDiseaseSettings();
    window.closeModals();
};

window.deleteDisease = async function(index) {
    if (confirm('Bạn có chắc chắn muốn xóa bệnh này?')) {
        window.config.diseases.splice(index, 1);
        await window.saveConfig();
        window.renderDiseaseSettings();
    }
};

window.renderDiseaseSettings = function() { 
    document.getElementById('diseaseList').innerHTML = window.config.diseases.map((d,i)=>`
        <div class="flex justify-between items-center p-3 border border-[#eee] rounded-lg bg-white shadow-sm">
            <div class="font-bold text-sm text-[#3e2723]">${d.name} <span class="text-xs font-normal text-gray-500">(${d.eastOptions ? d.eastOptions.length : 0} bài thuốc)</span></div>
            <div class="flex gap-2">
                <button onclick="window.editDisease(${i})" class="text-xs px-3 py-1 bg-[#efebe9] rounded font-bold text-[#5d4037]">SỬA</button>
                <button onclick="window.deleteDisease(${i})" class="text-xs px-3 py-1 bg-red-50 rounded text-red-600">XÓA</button>
            </div>
        </div>`).join(''); 
};

// --- VISIT ---
window.startVisit = function(pid, vid=null) {
    const p = window.db.find(x=>x.id==pid); if(!p) return;
    document.getElementById('vPid').value = pid; document.getElementById('vVisitId').value = vid||'';
    document.getElementById('vPatientName').innerText = p.name;
    
    currentVisit = { 
        step: 1, 
        rxEast: [], 
        rxWest: [], 
        procs: [], 
        manualMedTotalEast: 0, 
        manualMedTotalWest: 0,
        eastDays: 1,
        westDays: 1,
        eastNote: "",
        westNote: "",
        manualPriceEast: 0, 
        manualPriceWest: 0,
        tuChan: {vong:[],van:[],vanhoi:[],thiet:[],thietchan:[],machchan:[]} 
    };
    
    // FIX: USE LOCAL DATE FUNCTION
    document.getElementById('vDate').value = window.getLocalDate();
    
    document.getElementById('vDiseaseInput').value = ''; document.getElementById('vSpecial').value = '';
    document.getElementById('vCost').value = 0; document.getElementById('vDiscountPercent').value = 0;
    document.getElementById('discountBtn').innerText = '0% ▼';
    
    document.getElementById('vEastDays').value = 1;
    document.getElementById('vWestDays').value = 1;
    document.getElementById('vEastNote').value = "";
    document.getElementById('vWestNote').value = "";
    document.getElementById('vEastManualPrice').value = "";
    document.getElementById('vWestManualPrice').value = "";
    
    document.getElementById('vDiseaseSelect').innerHTML = '<option value="">-- Chọn bệnh mẫu --</option>' + window.config.diseases.map(d=>`<option value="${d.name}">${d.name}</option>`).join('');
    
    if(vid) {
        const v = p.visits.find(x=>x.id==vid);
        if(v) {
            document.getElementById('vDate').value = v.date; 
            document.getElementById('vDiseaseInput').value = v.disease;
            document.getElementById('vSpecial').value = v.symptoms; 
            document.getElementById('vCost').value = v.cost;
            document.getElementById('vDiscountPercent').value = v.disc||0; 
            document.getElementById('discountBtn').innerText = (v.disc||0)+'% ▼';
            if(v.tuChan) currentVisit.tuChan = v.tuChan;
            if(v.vong) document.getElementById('vVongExtra').value = v.vong;
            
            currentVisit.eastDays = v.eastDays || 1;
            currentVisit.westDays = v.westDays || 1;
            currentVisit.eastNote = v.eastNote || "";
            currentVisit.westNote = v.westNote || "";
            currentVisit.manualPriceEast = v.manualPriceEast || 0;
            currentVisit.manualPriceWest = v.manualPriceWest || 0;
            
            currentVisit.rxEast = JSON.parse(JSON.stringify(v.rxEast||[])); 
            currentVisit.rxWest = JSON.parse(JSON.stringify(v.rxWest||[]));
            currentVisit.procs = JSON.parse(JSON.stringify(v.procs||[]));
        }
    }
    
    window.renderMedList('east'); 
    window.renderMedList('west'); 
    window.renderProcOptions();
    window.renderProcList();
    window.calcTotal();
    window.goToStep(1); 
    document.getElementById('vModal').classList.add('active');
};

// --- PROCEDURES ---
window.renderProcOptions = function() {
    const area = document.getElementById('vProcOptionsArea');
    if (!window.config.procs || window.config.procs.length === 0) {
        area.innerHTML = '<span class="text-xs text-gray-400 italic w-full text-center">Chưa có dịch vụ nào trong cài đặt.</span>';
        return;
    }
    area.innerHTML = window.config.procs.map((p, i) => `
        <button onclick="window.addProcToVisit(${i})" class="bg-white border border-[#d7ccc8] text-[#5d4037] px-3 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform flex items-center gap-1 hover:bg-[#efebe9]">
            ${p.name} <span class="text-[10px] opacity-70 ml-1">(${p.price.toLocaleString()})</span>
        </button>
    `).join('');
};

window.addProcToVisit = function(index) {
    const procTemplate = window.config.procs[index];
    currentVisit.procs.push({ name: procTemplate.name, price: procTemplate.price, days: 1, discount: 0, note: '' });
    window.renderProcList(); window.calcTotal();
};

window.renderProcList = function() {
    const container = document.getElementById('vProcList');
    container.innerHTML = '';
    if (currentVisit.procs.length === 0) {
        container.innerHTML = `<div class="text-center py-4 text-gray-400 text-xs italic">Chưa chọn thủ thuật nào</div>`;
        return;
    }
    currentVisit.procs.forEach((proc, idx) => {
        const totalPrice = Math.round((proc.price * (proc.days||1)) * (1 - (proc.discount||0)/100));
        const procDiv = document.createElement('div');
        procDiv.className = 'med-row-grid';
        procDiv.innerHTML = `
            <button onclick="window.removeProcedure(${idx})" class="med-delete-btn">&times;</button>
            <div class="med-row-name"><div class="flex justify-between items-center"><span>${proc.name}</span><span class="text-xs font-normal text-gray-500">${proc.price.toLocaleString()}đ/lần</span></div></div>
            <div class="med-input-group"><label>Số ngày</label><input type="text" min="1" value="${proc.days||1}" id="proc_days_${idx}" onclick="window.openNumberPad('proc_days_${idx}', 'Số ngày thủ thuật', '1-30', ${proc.days||1})" readonly class="med-input-large bg-white ipad-input-fix"></div>
            <div class="med-input-group"><label>Giảm giá</label><button onclick="window.openNumberPad('proc_disc_${idx}', 'Giảm giá (%)', '0-100', ${proc.discount||0})" id="proc_disp_${idx}" class="med-input-large text-blue-600 bg-white border-dashed">${proc.discount||0}%</button></div>
            <div class="med-input-group"><label>Thành tiền</label><div class="med-input-large flex items-center justify-center bg-gray-100 text-base">${totalPrice.toLocaleString()}</div></div>
            <div class="med-usage-row">
                <button class="time-btn-large ${(proc.note||'').includes('Sáng')?'active':''}" onclick="window.toggleProcNote(${idx}, 'Sáng')">Sáng</button>
                <button class="time-btn-large ${(proc.note||'').includes('Trưa')?'active':''}" onclick="window.toggleProcNote(${idx}, 'Trưa')">Trưa</button>
                <button class="time-btn-large ${(proc.note||'').includes('Chiều')?'active':''}" onclick="window.toggleProcNote(${idx}, 'Chiều')">Chiều</button>
                <button class="time-btn-large ${(proc.note||'').includes('Tối')?'active':''}" onclick="window.toggleProcNote(${idx}, 'Tối')">Tối</button>
            </div>
            <div style="grid-column: 1 / -1; margin-top: 5px;"><input type="text" value="${proc.note||''}" onchange="window.updateProcNoteText(${idx}, this.value)" placeholder="Ghi chú khác..." class="w-full text-xs py-2 border-b border-dashed border-gray-300 focus:border-[#8d6e63] outline-none bg-transparent ipad-input-fix" onfocus="this.blur=null"></div>
        `;
        container.appendChild(procDiv);
    });
};

window.removeProcedure = function(idx) { if (confirm("Xóa thủ thuật này?")) { currentVisit.procs.splice(idx, 1); window.renderProcList(); window.calcTotal(); } };
window.updateProcDays = function(idx, days) { days = parseInt(days) || 1; if (days < 1) days = 1; currentVisit.procs[idx].days = days; window.renderProcList(); window.calcTotal(); };
window.toggleProcNote = function(idx, time) {
    const proc = currentVisit.procs[idx];
    const currentNote = proc.note || '';
    let parts = currentNote.split(',').map(p => p.trim()).filter(p => p !== '');
    const timeKeywords = ['Sáng', 'Trưa', 'Chiều', 'Tối'];
    let timeParts = parts.filter(p => timeKeywords.includes(p));
    let otherParts = parts.filter(p => !timeKeywords.includes(p));
    if (timeParts.includes(time)) timeParts = timeParts.filter(t => t !== time); else timeParts.push(time);
    timeParts.sort((a, b) => timeKeywords.indexOf(a) - timeKeywords.indexOf(b));
    proc.note = [...timeParts, ...otherParts].join(', ');
    window.renderProcList();
};
window.updateProcNoteText = function(idx, text) { currentVisit.procs[idx].note = text; };

// --- MEDICINES ---
window.loadDiseaseSuggestions = function() {
    const dName = document.getElementById('vDiseaseSelect').value;
    const box = document.getElementById('suggestedSymptomsBox'), preArea = document.getElementById('eastPresetsArea');
    if(!dName) { box.classList.add('hidden'); preArea.classList.add('hidden'); return; }
    const d = window.config.diseases.find(x=>x.name===dName);
    if(d) {
        if(d.sym) { 
            box.classList.remove('hidden'); 
            document.getElementById('symptomButtons').innerHTML = d.sym.split(',').map(s=>`<span onclick="document.getElementById('vSpecial').value+=(document.getElementById('vSpecial').value?', ':'')+'${s.trim()}'" class="med-chip">${s.trim()}</span>`).join(''); 
        } else box.classList.add('hidden');
        
        currentVisit.rxWest = JSON.parse(JSON.stringify(d.rxWest||[])); 
        window.renderMedList('west');
        
        // Render Multiple Prescriptions Chips
        if(d.eastOptions?.length) { 
            preArea.classList.remove('hidden'); 
            document.getElementById('eastPresetButtons').innerHTML = d.eastOptions.map((o,i)=>`
                <div class="med-chip ${i===0?'bg-[#5d4037] text-white':''}" onclick="window.applyEasternSample(${i})">${o.name}</div>`).join(''); 
            
            // Auto select first option
            if(d.eastOptions.length > 0) window.applyEasternSample(0);
        } else preArea.classList.add('hidden');
        window.calcTotal();
    }
};

window.applyEasternSample = function(i) {
    const d = window.config.diseases.find(x=>x.name===document.getElementById('vDiseaseSelect').value);
    if(d && d.eastOptions[i]) { 
        currentVisit.rxEast = JSON.parse(JSON.stringify(d.eastOptions[i].ingredients)); 
        window.renderMedList('east'); 
        window.calcTotal(); 
    }
};

// Updated: Render Med List with 2 columns (qty, price) + total, WITH ONCLICK FOR NUMBER PAD
window.renderMedList = function(type) {
    const list = document.getElementById(type==='east'?'vMedListEast':'vMedListWest');
    const data = type==='east'?currentVisit.rxEast:currentVisit.rxWest;
    const days = type==='east'?currentVisit.eastDays:currentVisit.westDays;
    
    if (data.length === 0) {
        list.innerHTML = `<div class="text-center py-6 text-gray-400 italic text-sm border-2 border-dashed border-gray-200 rounded-lg">Chưa kê vị thuốc nào</div>`;
        return;
    }
    list.innerHTML = data.map((m,i)=>`
        <div class="med-row-grid">
            <button onclick="window.removeMed('${type}',${i})" class="med-delete-btn">&times;</button>
            <div class="med-row-name"><input type="text" value="${m.name}" onchange="window.updateMed('${type}',${i},'name',this.value)" class="song-input ipad-input-fix" placeholder="Nhập tên thuốc..." onfocus="this.blur=null"></div>
            
            <!-- FIXED INPUTS: Added ID and ONCLICK to trigger Number Pad -->
            <div class="med-input-group"><label>S.Lượng (${type==='east'?'g':'viên'})</label>
                <input type="text" id="med_qty_${type}_${i}" value="${m.qty}" 
                onclick="window.openNumberPad('med_qty_${type}_${i}', 'Số lượng', '0-999', ${m.qty})" 
                readonly class="med-input-large ipad-input-fix">
            </div>
            
            <div class="med-input-group"><label>Đơn giá</label>
                <input type="text" id="med_price_${type}_${i}" value="${m.price||0}" 
                onclick="window.openNumberPad('med_price_${type}_${i}', 'Đơn giá', '0-9999999', ${m.price||0})" 
                readonly class="med-input-large ipad-input-fix text-right">
            </div>
            
            <div class="med-input-group"><label>Thành tiền</label><div class="med-input-large flex items-center justify-center bg-gray-100 text-sm font-bold text-gray-500">${((m.qty||0)*(m.price||0)*days).toLocaleString()}</div></div>
            <div class="med-usage-row">
                <button class="time-btn-large ${(m.usage||'').includes('Sáng')?'active':''}" onclick="window.toggleMedUsage('${type}',${i},'Sáng')">Sáng</button>
                <button class="time-btn-large ${(m.usage||'').includes('Trưa')?'active':''}" onclick="window.toggleMedUsage('${type}',${i},'Trưa')">Trưa</button>
                <button class="time-btn-large ${(m.usage||'').includes('Chiều')?'active':''}" onclick="window.toggleMedUsage('${type}',${i},'Chiều')">Chiều</button>
                <button class="time-btn-large ${(m.usage||'').includes('Tối')?'active':''}" onclick="window.toggleMedUsage('${type}',${i},'Tối')">Tối</button>
            </div>
        </div>
    `).join('');
};

window.addMedRow = function(type) { 
    (type==='east'?currentVisit.rxEast:currentVisit.rxWest).push({ name:"", qty:1, days:1, price:0, usage:"" }); 
    window.renderMedList(type); window.calcTotal();
};
window.updateMed = function(type,i,f,v) { 
    const meds = type==='east'?currentVisit.rxEast:currentVisit.rxWest; 
    meds[i][f] = (f==='qty'||f==='price')?parseFloat(v):v; 
    window.calcTotal(); 
    // Optimization: If specific field update, maybe only refresh total, but safe to render all
    if(f==='qty'||f==='price') window.renderMedList(type);
};
window.updateMedDays = function(type,i,days) {
    // Legacy function, kept to prevent errors if called, but does nothing to UI now
    const meds = type==='east'?currentVisit.rxEast:currentVisit.rxWest; 
    days = parseInt(days) || 1; if (days < 1) days = 1; meds[i].days = days; window.calcTotal();
};
window.toggleMedUsage = function(type,i,time) {
    const meds = type==='east'?currentVisit.rxEast:currentVisit.rxWest;
    const med = meds[i];
    const currentUsage = med.usage || '';
    let parts = currentUsage.split(',').map(p => p.trim()).filter(p => p !== '');
    const timeKeywords = ['Sáng', 'Trưa', 'Chiều', 'Tối'];
    let timeParts = parts.filter(p => timeKeywords.includes(p));
    let otherParts = parts.filter(p => !timeKeywords.includes(p));
    if (timeParts.includes(time)) timeParts = timeParts.filter(t => t !== time); else timeParts.push(time);
    timeParts.sort((a, b) => timeKeywords.indexOf(a) - timeKeywords.indexOf(b));
    med.usage = [...timeParts, ...otherParts].join(', ');
    window.renderMedList(type);
};
window.removeMed = function(type,i) { 
    (type==='east'?currentVisit.rxEast:currentVisit.rxWest).splice(i,1); 
    window.renderMedList(type); window.calcTotal(); 
};

// CẬP NHẬT: Tính tiền (Giá trọn gói * Số ngày)
window.calcTotal = function() {
    let procTotal = 0;
    currentVisit.procs.forEach(proc => {
        const price = proc.price || 0;
        procTotal += Math.round(price * (proc.days||1) * (1 - (proc.discount||0)/100));
    });
    
    let eastTotal = 0;
    const eastDays = parseInt(document.getElementById('vEastDays').value) || 1;
    const eastManual = parseInt(document.getElementById('vEastManualPrice').value) || 0;
    
    // Recalculate med list to update 'Thành tiền' column when days change
    currentVisit.eastDays = eastDays;
    
    if (eastManual > 0) {
        eastTotal = eastManual * eastDays;
    } else {
        let eastSum = currentVisit.rxEast.reduce((acc, m) => acc + ((m.qty||0) * (m.price||0)), 0);
        eastTotal = eastSum * eastDays;
    }
    
    let westTotal = 0;
    const westDays = parseInt(document.getElementById('vWestDays').value) || 1;
    const westManual = parseInt(document.getElementById('vWestManualPrice').value) || 0;
    
    currentVisit.westDays = westDays;
    
    if (westManual > 0) {
        westTotal = westManual * westDays;
    } else {
        let westSum = currentVisit.rxWest.reduce((acc, m) => acc + ((m.qty||0) * (m.price||0)), 0);
        westTotal = westSum * westDays;
    }
    
    currentVisit.manualMedTotalEast = eastTotal;
    currentVisit.manualMedTotalWest = westTotal;
    
    // Update displayed list to reflect new totals per item
    // We only re-render if the focused element is NOT an input in the list to avoid losing focus
    // if (!document.activeElement || !document.activeElement.classList.contains('med-input-large')) {
         // Optimization: Don't full re-render constantly on typing, but do it when days change
         // For now, we rely on the total display at bottom, individual row updates on next interaction
    // }
    
    document.getElementById('displayMedTotalEast').innerText = eastTotal.toLocaleString() + 'đ';
    document.getElementById('displayMedTotalWest').innerText = westTotal.toLocaleString() + 'đ';
    document.getElementById('displayProcTotal').innerText = procTotal.toLocaleString() + 'đ';
    
    const total = eastTotal + westTotal + procTotal;
    document.getElementById('displayGrandTotal').innerText = total.toLocaleString() + 'đ';
    const discP = parseInt(document.getElementById('vDiscountPercent').value)||0;
    document.getElementById('finalTotal').innerText = Math.round(total*(1-discP/100)).toLocaleString() + 'đ';
};

// --- OTHER FUNCTIONS ---
window.renderTuchanChips = function() {
    ['vong','van','vanhoi','thiet','thietchan','machchan'].forEach(sec => {
        const c = document.getElementById(`tuchan${sec.charAt(0).toUpperCase()+sec.slice(1)}Buttons`);
        if(c) c.innerHTML = (window.config.tuChan[sec]||[]).map(t=>`
            <div class="tuchan-chip ${currentVisit.tuChan[sec].includes(t)?'active':''}" 
                 onclick="window.toggleTuchanChip('${sec}','${t.replace(/'/g,"\\'")}')">${t}</div>`).join('');
    });
};
window.toggleTuchanChip = function(sec,t) {
    const idx = currentVisit.tuChan[sec].indexOf(t);
    if(idx===-1) currentVisit.tuChan[sec].push(t); else currentVisit.tuChan[sec].splice(idx,1);
    window.renderTuchanChips();
};
window.goToStep = function(s) {
    currentVisit.step = s;
    document.querySelectorAll('.step-content').forEach(e => { e.classList.remove('active'); e.classList.add('hidden'); });
    document.getElementById('step'+s).classList.remove('hidden'); document.getElementById('step'+s).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', i+1===s));
    document.getElementById('btnBack').classList.toggle('hidden', s===1);
    document.getElementById('btnNext').classList.toggle('hidden', s===4);
    document.getElementById('btnSaveOnly').classList.toggle('hidden', s!==4);
    document.getElementById('btnPrint').classList.toggle('hidden', s!==4);
    if(s===1) window.renderTuchanChips();
    if(s===3||s===4) window.calcTotal();
    if(s===3) window.injectCustomButtons(); // Inject buttons when arriving at Step 3
    if(s===4) {
        const qrSection = document.getElementById('qrPaymentSection');
        const qrImg = document.getElementById('displayQrPayment');
        if(window.config.qrCodeImage) { qrSection.classList.remove('hidden'); qrImg.src = window.config.qrCodeImage; } else qrSection.classList.add('hidden');
    }
};
window.nextStep = function() { if(currentVisit.step<4) window.goToStep(currentVisit.step+1); };
window.prevStep = function() { if(currentVisit.step>1) window.goToStep(currentVisit.step-1); };
window.saveOnly = function() { window.processSave(false); };
window.saveAndPrint = function() { window.processSave(true); };

window.processSave = async function(print) {
    try {
        const pid = document.getElementById('vPid').value; if(!pid) throw new Error("Mất kết nối bệnh nhân");
        window.calcTotal();
        const visit = {
            id: parseInt(document.getElementById('vVisitId').value)||Date.now(),
            date: document.getElementById('vDate').value,
            disease: document.getElementById('vDiseaseSelect').value||document.getElementById('vDiseaseInput').value,
            symptoms: document.getElementById('vSpecial').value,
            tuChan: currentVisit.tuChan,
            vong: document.getElementById('vVongExtra').value,
            rxEast: currentVisit.rxEast, rxWest: currentVisit.rxWest, procs: currentVisit.procs,
            eastDays: parseInt(document.getElementById('vEastDays').value) || 1,
            westDays: parseInt(document.getElementById('vWestDays').value) || 1,
            eastNote: document.getElementById('vEastNote').value,
            westNote: document.getElementById('vWestNote').value,
            manualPriceEast: parseInt(document.getElementById('vEastManualPrice').value) || 0,
            manualPriceWest: parseInt(document.getElementById('vWestManualPrice').value) || 0,
            medPriceEast: currentVisit.manualMedTotalEast, medPriceWest: currentVisit.manualMedTotalWest,
            total: parseInt(document.getElementById('finalTotal').innerText.replace(/[^\d]/g,'')),
            cost: parseInt(document.getElementById('vCost').value)||0,
            disc: parseInt(document.getElementById('vDiscountPercent').value)||0,
            paid: document.getElementById('vPaid').checked
        };
        const pIdx = window.db.findIndex(x=>String(x.id)===String(pid));
        if(pIdx>-1) {
            if(!window.db[pIdx].visits) window.db[pIdx].visits=[];
            const vIdx = window.db[pIdx].visits.findIndex(v=>v.id===visit.id);
            if(vIdx>-1) window.db[pIdx].visits[vIdx]=visit; else window.db[pIdx].visits.unshift(visit);
            await window.saveDb();
            if(print) window.preparePrint('invoice');
            else { alert("Đã lưu thông tin khám bệnh!"); window.closeModals(); window.render(); }
        }
    } catch(e) { alert("Lỗi: "+e.message); }
};

// --- PRINTING LOGIC (UPDATED TO MATCH NEW HTML IDs) ---
window.preparePrint = function(type) { currentPrintType = type; window.doPrint(type); };

window.doPrint = function(type) {
    const pid = document.getElementById('vPid').value; const p = window.db.find(x=>x.id==pid); if (!p) return;
    document.querySelectorAll('.print-section').forEach(el => { el.classList.add('hidden'); });
    window.calcTotal();
    const eastTotal = currentVisit.manualMedTotalEast; const westTotal = currentVisit.manualMedTotalWest;
    let procTotal = 0; currentVisit.procs.forEach(proc => { procTotal += Math.round((proc.price||0) * (proc.days||1) * (1 - (proc.discount||0)/100)); });
    const total = eastTotal + westTotal + procTotal;
    const discP = parseInt(document.getElementById('vDiscountPercent').value)||0;
    const finalTotal = Math.round(total*(1-discP/100));
    
    const clinicTitle = window.config.clinicTitle || 'PHÒNG KHÁM YHCT';
    const doctorName = window.config.doctorName ? 'BS. ' + window.config.doctorName : 'BS. Đông Y';
    const visitDate = document.getElementById('vDate').value.split('-').reverse().join('/');
    const disease = document.getElementById('vDiseaseSelect').value||document.getElementById('vDiseaseInput').value;
    const eastDays = document.getElementById('vEastDays').value || 1;
    const westDays = document.getElementById('vWestDays').value || 1;
    const eastNote = document.getElementById('vEastNote').value;
    const westNote = document.getElementById('vWestNote').value;
    const manualPriceEast = parseInt(document.getElementById('vEastManualPrice').value) || 0;
    
    // 1. POPULATE EAST PRESCRIPTION
    if (type === 'east' || type === 'both') {
        const eastSec = document.getElementById('printEast');
        if(eastSec) {
            eastSec.classList.remove('hidden');
            document.getElementById('prTitleEast').innerText = clinicTitle;
            document.getElementById('prDocEast').innerText = doctorName;
            document.getElementById('prDateEast').innerText = 'Ngày: ' + visitDate;
            document.getElementById('prNameEast').innerText = p.name;
            document.getElementById('prYearEast').innerText = p.year ? `(${p.year})` : '';
            document.getElementById('prDisEast').innerText = disease;
            document.getElementById('prSymEast').innerText = document.getElementById('vSpecial').value || '';
            document.getElementById('prDaysEast').innerText = eastDays;
            document.getElementById('prUsageEast').innerText = eastNote || 'Sắc uống ngày 1 thang.';
            document.getElementById('prTotalEast').innerText = eastTotal.toLocaleString() + 'đ';
            let eastHtml = '';
            currentVisit.rxEast.forEach(m => {
                eastHtml += `<tr><td class="py-1 border-b border-gray-300">${m.name}</td><td class="py-1 text-right border-b border-gray-300">${m.qty || 0}g</td><td class="py-1 text-right border-b border-gray-300">${(m.price||0).toLocaleString()}đ</td><td class="py-1 text-right border-b border-gray-300">${manualPriceEast > 0 ? '-' : ((m.qty||0)*(m.price||0)*eastDays).toLocaleString() + 'đ'}</td></tr>`;
            });
            if(manualPriceEast > 0) eastHtml += `<tr><td class="p-1 font-bold" colspan="3">Giá trọn gói (${eastDays} thang)</td><td class="p-1 text-right font-bold">${eastTotal.toLocaleString()}đ</td></tr>`;
            document.getElementById('prTableEast').innerHTML = eastHtml;
        }
    }
    
    // 2. POPULATE WEST PRESCRIPTION
    if (type === 'west' || type === 'both') {
        const westSec = document.getElementById('printWest');
        if(westSec) {
            westSec.classList.remove('hidden');
            document.getElementById('prTitleWest').innerText = clinicTitle;
            document.getElementById('prDocWest').innerText = doctorName;
            document.getElementById('prDateWest').innerText = 'Ngày: ' + visitDate;
            document.getElementById('prNameWest').innerText = p.name;
            document.getElementById('prYearWest').innerText = p.year ? `(${p.year})` : '';
            document.getElementById('prDisWest').innerText = disease;
            document.getElementById('prDaysWest').innerText = westDays;
            document.getElementById('prUsageWest').innerText = westNote || 'Uống theo đơn.';
            document.getElementById('prTotalWest').innerText = westTotal.toLocaleString() + 'đ';
            let westHtml = '';
            currentVisit.rxWest.forEach(m => {
                westHtml += `<tr><td class="py-1 border-b border-gray-300">${m.name}</td><td class="py-1 text-right border-b border-gray-300">${m.qty || 0} viên</td><td class="py-1 text-right border-b border-gray-300">${(m.price||0).toLocaleString()}đ</td><td class="py-1 text-right border-b border-gray-300">${((m.qty||0)*(m.price||0)*westDays).toLocaleString()}đ</td></tr>`;
            });
            document.getElementById('prTableWest').innerHTML = westHtml;
        }
    }
    
    // 3. POPULATE BOTH
    if (type === 'both') {
        const bothSec = document.getElementById('printBoth');
        if(bothSec) {
            bothSec.classList.remove('hidden');
            document.getElementById('printEast').classList.add('hidden'); // Hide individual ones
            document.getElementById('printWest').classList.add('hidden');
            
            document.getElementById('prTitleBoth').innerText = clinicTitle;
            document.getElementById('prDocBoth').innerText = doctorName;
            document.getElementById('prDateBoth').innerText = 'Ngày: ' + visitDate;
            document.getElementById('prNameBoth').innerText = p.name;
            document.getElementById('prYearBoth').innerText = p.year ? `(${p.year})` : '';
            document.getElementById('prDisBoth').innerText = disease;
            document.getElementById('prSymBoth').innerText = document.getElementById('vSpecial').value || '';
            document.getElementById('prDaysBothEast').innerText = eastDays;
            document.getElementById('prNoteBothEast').innerText = eastNote || 'Sắc uống.';
            document.getElementById('prDaysBothWest').innerText = westDays;
            document.getElementById('prNoteBothWest').innerText = westNote || 'Uống theo đơn.';
            let eastBothHtml = ''; currentVisit.rxEast.forEach(m => { eastBothHtml += `<tr><td class="p-1 border-b border-gray-200">${m.name}</td><td class="p-1 text-right border-b border-gray-200">${m.qty || 0}g</td><td class="p-1 text-right border-b border-gray-200">${m.usage || ''}</td></tr>`; });
            document.getElementById('prTableBothEast').innerHTML = eastBothHtml;
            let westBothHtml = ''; currentVisit.rxWest.forEach(m => { westBothHtml += `<tr><td class="p-1 border-b border-gray-200">${m.name}</td><td class="p-1 text-right border-b border-gray-200">${m.qty || 0} viên</td><td class="p-1 text-right border-b border-gray-200">${m.usage || ''}</td></tr>`; });
            document.getElementById('prTableBothWest').innerHTML = westBothHtml;
        }
    }
    
    // 4. POPULATE INVOICE
    if (type === 'invoice') {
        const invSec = document.getElementById('printInvoice');
        if(invSec) {
            invSec.classList.remove('hidden');
            document.getElementById('prTitleInvoice').innerText = clinicTitle;
            document.getElementById('prDocInvoice').innerText = doctorName;
            document.getElementById('prDateInvoice').innerText = 'Ngày xuất: ' + new Date().toLocaleDateString('vi-VN');
            document.getElementById('prVisitDateInvoice').innerText = visitDate;
            document.getElementById('prNameInvoice').innerText = p.name;
            document.getElementById('prYearInvoice').innerText = p.year ? `(${p.year})` : '';
            document.getElementById('prDisInvoice').innerText = disease;
            let invoiceHtml = '';
            currentVisit.procs.forEach(proc => {
                const tPrice = Math.round((proc.price||0) * (proc.days||1) * (1 - (proc.discount||0)/100));
                invoiceHtml += `<tr><td class="py-1">${proc.name}</td><td class="py-1 text-right">${proc.days||1}</td><td class="py-1 text-right">${(proc.price||0).toLocaleString()}</td><td class="py-1 text-right">${tPrice.toLocaleString()}</td></tr>`;
            });
            if (manualPriceEast > 0) {
                 invoiceHtml += `<tr><td class="py-1 font-bold">Thuốc Đông Y (Gói)</td><td class="py-1 text-right">${eastDays}t</td><td class="py-1 text-right">${manualPriceEast.toLocaleString()}</td><td class="py-1 text-right">${eastTotal.toLocaleString()}</td></tr>`;
            } else {
                currentVisit.rxEast.forEach(m => {
                    const tPrice = (m.qty||0) * (m.price||0) * eastDays;
                    invoiceHtml += `<tr><td class="py-1">${m.name}</td><td class="py-1 text-right">${m.qty}g x ${eastDays}</td><td class="py-1 text-right">${(m.price||0).toLocaleString()}</td><td class="py-1 text-right">${tPrice.toLocaleString()}</td></tr>`;
                });
            }
            if (parseInt(document.getElementById('vWestManualPrice').value) > 0) {
                 invoiceHtml += `<tr><td class="py-1 font-bold">Thuốc Tây Y (Gói)</td><td class="py-1 text-right">${westDays}n</td><td class="py-1 text-right">${parseInt(document.getElementById('vWestManualPrice').value).toLocaleString()}</td><td class="py-1 text-right">${westTotal.toLocaleString()}</td></tr>`;
            } else {
                currentVisit.rxWest.forEach(m => {
                    const tPrice = (m.qty||0) * (m.price||0) * westDays;
                    invoiceHtml += `<tr><td class="py-1">${m.name}</td><td class="py-1 text-right">${m.qty}v x ${westDays}</td><td class="py-1 text-right">${(m.price||0).toLocaleString()}</td><td class="py-1 text-right">${tPrice.toLocaleString()}</td></tr>`;
                });
            }
            document.getElementById('prTableInvoice').innerHTML = invoiceHtml;
            document.getElementById('prProcTotalInvoice').innerText = procTotal.toLocaleString() + 'đ';
            document.getElementById('prEastTotalInvoice').innerText = eastTotal.toLocaleString() + 'đ';
            document.getElementById('prWestTotalInvoice').innerText = westTotal.toLocaleString() + 'đ';
            document.getElementById('prGrandTotalInvoice').innerText = total.toLocaleString() + 'đ';
            document.getElementById('prDiscInvoice').innerText = discP + '%';
            document.getElementById('prFinalInvoice').innerText = finalTotal.toLocaleString() + 'đ';
            if (window.config.qrCodeImage) { document.getElementById('prQrInvoice').src = window.config.qrCodeImage; document.getElementById('prQrContainerInvoice').classList.remove('hidden'); } else document.getElementById('prQrContainerInvoice').classList.add('hidden');
        }
    }
    
    setTimeout(() => { window.print(); document.getElementById('printModal').classList.remove('active'); }, 500);
};

window.closeModals = function() { document.querySelectorAll('.modal').forEach(m=>m.classList.remove('active')); };
window.switchSettingsTab = function(id, btn) {
    document.querySelectorAll('.settings-panel').forEach(p=>p.classList.add('hidden')); 
    document.getElementById(id).classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active')); 
    btn.classList.add('active');
};
window.openSettings = function() {
    document.getElementById('sModal').classList.add('active');
    document.getElementById('confTitle').value = window.config.clinicTitle;
    document.getElementById('confDoctor').value = window.config.doctorName;
    document.getElementById('confPass').value = window.config.password;
    document.getElementById('headerOverlayInput').value = window.config.headerOverlayOpacity || 0;
    document.getElementById('overlayValueDisplay').innerText = (window.config.headerOverlayOpacity || 0) + '%';
    if(window.config.qrCodeImage) document.getElementById('previewQrSettings').src = window.config.qrCodeImage;
    window.renderDiseaseSettings(); window.renderProcSettings(); window.renderTuChanConfig();
};
window.saveSettings = async function() {
    window.config.clinicTitle = document.getElementById('confTitle').value;
    window.config.doctorName = document.getElementById('confDoctor').value;
    // Password saved via keypad already
    await window.saveConfig(); window.closeModals();
};

// --- TU CHAN CONFIGURATION ---
window.renderTuChanConfig = function() {
    const keys = ['vong', 'van', 'vanhoi', 'thiet', 'thietchan', 'machchan'];
    
    keys.forEach(key => {
        const container = document.getElementById('setting_list_' + key);
        if (!container) return;

        container.innerHTML = (window.config.tuChan[key] || []).map((item, index) => `
            <div class="flex justify-between items-center bg-gray-50 p-2 mb-1 rounded border border-gray-100">
                <span class="text-sm text-gray-700">${item}</span>
                <button onclick="window.deleteTuChanItem('${key}', ${index})" class="text-xs text-red-500 font-bold px-2 py-1 hover:bg-red-50 rounded">&times; Xóa</button>
            </div>
        `).join('');
    });
};

window.addTuChanItem = async function(key) {
    const inputId = 'setting_new_' + key;
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const value = input.value.trim();
    if (!value) return;

    if (!window.config.tuChan[key]) window.config.tuChan[key] = [];
    window.config.tuChan[key].push(value);

    await window.saveConfig();
    input.value = '';
    window.renderTuChanConfig();
};

window.deleteTuChanItem = async function(key, index) {
    if (confirm('Xóa mục này khỏi danh sách mẫu?')) {
        window.config.tuChan[key].splice(index, 1);
        await window.saveConfig();
        window.renderTuChanConfig();
    }
};

// --- UPDATED VIEW HISTORY WITH COUNTING ---
window.viewHistory = function(pid) {
    const p = window.db.find(x=>x.id==pid); 
    document.getElementById('hName').innerText=p.name;
    
    const totalVisits = p.visits ? p.visits.length : 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const visitsThisMonth = p.visits ? p.visits.filter(v => {
        const d = new Date(v.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length : 0;

    const summaryHtml = `
        <div class="flex justify-between bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200 text-xs font-bold text-[#5d4037]">
            <span>Tổng số lần khám: ${totalVisits}</span>
            <span>Tháng này: ${visitsThisMonth}</span>
        </div>
    `;

    const listHtml = p.visits?.map((v, i) => {
        const stt = totalVisits - i;
        return `
        <div class="p-4 rounded-xl border border-[#eee] bg-white mb-2 shadow-sm relative pl-6">
            <div class="absolute top-3 -left-2 bg-[#8d6e63] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md border-2 border-white z-10">
                ${stt}
            </div>
            <div class="flex justify-between text-xs font-bold text-[#8d6e63] mb-1">
                <span>📅 ${v.date}</span>
                <span>${parseInt(v.total).toLocaleString()}đ</span>
            </div>
            <div class="font-bold text-[#5d4037] mb-1 serif">${v.disease}</div>
            <div class="text-xs text-gray-600 mb-2">
                ${v.rxEast?.length ? `Đông Y: ${v.rxEast.length} vị` : ''} 
                ${v.rxWest?.length ? ` • Tây Y: ${v.rxWest.length} loại` : ''} 
                ${v.procs?.length ? ` • Thủ thuật: ${v.procs.length}` : ''}
            </div>
            <div class="flex gap-2 justify-end mt-2">
                <button onclick="window.closeModals();window.startVisit('${pid}',${v.id})" 
                        class="px-3 py-1 bg-[#efebe9] text-[#5d4037] text-xs rounded font-bold border">Sửa</button>
                <button onclick="window.deleteVisit('${pid}',${v.id})" 
                        class="px-3 py-1 bg-white text-red-600 text-xs rounded font-bold border border-red-100">Xóa</button>
            </div>
        </div>`;
    }).join('')||'<p class="text-center text-gray-400">Chưa có lịch sử khám bệnh</p>';
    
    document.getElementById('hContent').innerHTML = summaryHtml + listHtml;
    document.getElementById('hModal').classList.add('active');
};

window.deleteVisit = async function(pid,vid) { 
    if(confirm("Xóa lịch sử khám này?")) { 
        const p=window.db.find(x=>x.id==pid); 
        p.visits=p.visits.filter(v=>v.id!=vid); 
        await window.saveDb(); 
        window.viewHistory(pid); 
        window.render(); 
    } 
};
window.openStats = function() { document.getElementById('analyticsModal').classList.add('active'); setTimeout(()=>{ window.renderAnalytics(); window.updateChart() },300); };
window.updateChart = function() {
    const ctx = document.getElementById('analyticsChart').getContext('2d'); let lbl=[],data=[];
    for(let i=5;i>=0;i--) { const d=new Date(); d.setMonth(d.getMonth()-i); lbl.push(`Tháng ${d.getMonth()+1}`); let m=0; window.db.forEach(p=>p.visits?.forEach(v=>{ if(new Date(v.date).getMonth()===d.getMonth()&&v.paid) m+=(v.total-(v.cost||0)); })); data.push(m); }
    if(chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, { type:'line', data:{ labels:lbl, datasets:[{ label:'Lợi nhuận', data:data, borderColor:'#5d4037', backgroundColor:'rgba(93, 64, 55, 0.1)', fill:true, tension:0.3 }] }, options:{ responsive:true, maintainAspectRatio:false } });
};

// UPDATED: Analytics Render Function with new columns and sorting logic
window.renderAnalytics = function() {
    const f = document.getElementById('anaTimeFilter').value;
    const s = document.getElementById('anaSortBy').value; // Get sort value
    const n = new Date();
    const currentYear = n.getFullYear();

    let all = [];
    // Flatten data: Patient info + Visit info
    window.db.forEach(p => {
        const pAge = p.year ? (currentYear - parseInt(p.year)) : '';
        const pVisitCount = p.visits ? p.visits.length : 0;
        const pTotalSpent = p.visits ? p.visits.reduce((sum, v) => sum + (v.total || 0), 0) : 0;

        p.visits?.forEach(v => {
            all.push({
                ...v,
                pName: p.name,
                pAge: pAge,
                pVisitCount: pVisitCount, // For sorting by patient frequency
                pTotalSpent: pTotalSpent // For sorting by patient value
            });
        });
    });

    // Filter
    currentFilteredVisits = all.filter(v => {
        const d = new Date(v.date);
        if (f === 'today') return d.toDateString() === n.toDateString();
        if (f === 'month') return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
        return true;
    });

    // Sort Logic
    currentFilteredVisits.sort((a, b) => {
        switch(s) {
            case 'date_desc': return new Date(b.date) - new Date(a.date);
            case 'name_asc': return a.pName.localeCompare(b.pName);
            case 'age_asc': return (a.pAge || 0) - (b.pAge || 0); // Handle empty age
            case 'visits_desc': return b.pVisitCount - a.pVisitCount; // Most visits first
            case 'total_desc': return b.pTotalSpent - a.pTotalSpent; // Highest spender first
            default: return new Date(b.date) - new Date(a.date);
        }
    });

    // Render Table with new columns
    document.getElementById('anaTableBody').innerHTML = currentFilteredVisits.map(v => `
        <tr>
            <td class="p-2 border-b">${v.date}</td>
            <td class="p-2 border-b font-bold">${v.pName}</td>
            <td class="p-2 border-b text-center">${v.pAge || '-'}</td>
            <td class="p-2 border-b text-xs max-w-[120px] truncate">${v.disease}</td>
            <td class="p-2 border-b text-center">${v.paid ? '<span class="text-green-600 font-bold">✔</span>' : '<span class="text-red-500 font-bold">✘</span>'}</td>
            <td class="p-2 border-b text-right">${v.total.toLocaleString()}</td>
            <td class="p-2 border-b text-right text-xs text-gray-500">${(v.total - (v.cost || 0)).toLocaleString()}</td>
        </tr>`).join('');
};

window.renderProcSettings = function() { document.getElementById('procList').innerHTML = window.config.procs.map((p,i)=>`<div class="flex justify-between items-center p-3 border rounded bg-white mb-1"><div class="text-sm font-bold text-[#5d4037]">${p.name} <span class="font-normal text-gray-400">(${p.price.toLocaleString()}đ/lần)</span></div><button onclick="window.deleteProc(${i})" class="text-xs px-2 py-1 bg-red-50 rounded text-red-600 hover:bg-red-100">Xóa</button></div>`).join(''); };
window.addProc = async function() { const n=document.getElementById('newProcName').value, p=parseInt(document.getElementById('newProcPrice').value); if(n&&p) { window.config.procs.push({name:n,price:p}); document.getElementById('newProcName').value=''; document.getElementById('newProcPrice').value=''; window.renderProcSettings(); await window.saveConfig(); } };
window.deleteProc = async function(i) { if(confirm('Xóa dịch vụ này?')) { window.config.procs.splice(i,1); window.renderProcSettings(); await window.saveConfig(); } };
window.onload();

