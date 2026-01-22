/**
 * FILE: ui-helper.js
 * CHỨC NĂNG: Các tiện ích giao diện, Bàn phím số, Mật khẩu Native, Xử lý In ấn Chuyên nghiệp.
 * CẬP NHẬT: Thêm tính năng Draggable (Kéo thả) cho Widget giống iPhone.
 */

// --- BIẾN TOÀN CỤC ---
let nPadValue = "";        
let nPadTargetId = null;   
let nPadLimit = null;      
let nPadCallback = null;   // Thêm callback để xử lý sau khi nhập
let currentPrintType = 'invoice';
let passwordCallback = null;

// --- 1. TIỆN ÍCH CHUNG ---

window.getLocalDate = function() {
    const now = new Date();
    const local = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return local.toISOString().split('T')[0];
};

window.isIPad = function() {
    return /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Hàm này đóng TẤT CẢ modal (chỉ dùng cho các nút Hủy hoặc Đóng chính)
window.closeModals = function() { 
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); 
};

// --- 2. BÀN PHÍM NHẬP SỐ (NUMBER PAD) - ĐÃ SỬA LỖI ---

window.injectNumberPadModal = function() {
    if (document.getElementById('numberPadModal')) return;
    const div = document.createElement('div');
    div.id = 'numberPadModal';
    div.className = 'modal z-[3000]'; 
    div.innerHTML = `
        <div class="modal-box max-w-sm text-center bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
            <div class="flex justify-between items-center mb-4">
                <h3 id="nPadTitle" class="font-bold text-lg text-[#3e2723] uppercase">Nhập số</h3>
                <button onclick="window.closeNumberPadModal()" class="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
            </div>
            <div class="mb-4 relative">
                <input type="text" id="nPadDisplay" readonly class="w-full text-center text-3xl font-bold text-[#3e2723] bg-gray-100 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#5d4037]">
                <div id="nPadLimitLabel" class="text-xs text-gray-500 mt-1 absolute right-2 bottom-2"></div>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <button onclick="window.nPadAdd('1')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">1</button>
                <button onclick="window.nPadAdd('2')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">2</button>
                <button onclick="window.nPadAdd('3')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">3</button>
                <button onclick="window.nPadAdd('4')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">4</button>
                <button onclick="window.nPadAdd('5')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">5</button>
                <button onclick="window.nPadAdd('6')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">6</button>
                <button onclick="window.nPadAdd('7')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">7</button>
                <button onclick="window.nPadAdd('8')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">8</button>
                <button onclick="window.nPadAdd('9')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">9</button>
                <button onclick="window.nPadDel()" class="btn-glass h-14 text-lg font-bold text-red-500 bg-red-50 border-red-100">⌫</button>
                <button onclick="window.nPadAdd('0')" class="btn-glass h-14 text-xl font-bold active:bg-gray-200">0</button>
                <button onclick="window.nPadOk()" class="btn-primary h-14 text-lg font-bold bg-[#3e2723] text-white shadow-lg">OK</button>
            </div>
        </div>`;
    document.body.appendChild(div);
};

window.openNumberPad = function(targetId, title, limitRange, currentVal, callback) {
    window.injectNumberPadModal();
    nPadTargetId = targetId;
    nPadLimit = limitRange; 
    nPadCallback = callback || null; // Lưu callback nếu có
    
    // Reset giá trị
    nPadValue = currentVal ? String(currentVal) : "";
    
    document.getElementById('nPadTitle').innerText = title || 'Nhập số';
    document.getElementById('nPadLimitLabel').innerText = limitRange ? `Giới hạn: ${limitRange}` : '';
    document.getElementById('nPadDisplay').value = nPadValue || "";
    document.getElementById('nPadDisplay').placeholder = "0";
    document.getElementById('numberPadModal').classList.add('active');
    
    // Tập trung vào modal
    setTimeout(() => {
        const display = document.getElementById('nPadDisplay');
        if (display) display.focus();
    }, 100);
};

window.closeNumberPadModal = function() {
    document.getElementById('numberPadModal').classList.remove('active');
    // Reset biến
    nPadValue = "";
    nPadTargetId = null;
    nPadLimit = null;
    nPadCallback = null;
};

window.nPadAdd = function(num) {
    if (nPadValue.length > 8) return; 
    if (nPadValue === "0" && num === "0") return;
    if (nPadValue === "0" && num !== "0") nPadValue = "";
    nPadValue += num;
    document.getElementById('nPadDisplay').value = nPadValue;
};

window.nPadDel = function() {
    if (nPadValue.length > 0) {
        nPadValue = nPadValue.slice(0, -1);
        document.getElementById('nPadDisplay').value = nPadValue;
    }
};

window.nPadOk = function() {
    let finalVal = 0;
    
    // Nếu không có giá trị nhập, dùng giá trị mặc định (placeholder)
    if (nPadValue === "" || nPadValue === "0") {
        // Lấy giá trị placeholder từ input hiện tại
        const target = document.getElementById(nPadTargetId);
        if (target && target.placeholder) {
            finalVal = parseInt(target.placeholder) || 0;
        }
    } else {
        finalVal = parseInt(nPadValue);
    }
    
    if (isNaN(finalVal)) finalVal = 0;
    
    // Kiểm tra giới hạn
    if (nPadLimit) {
        const [min, max] = nPadLimit.split('-').map(Number);
        if (finalVal < min) {
            alert(`Giá trị tối thiểu là ${min}`);
            return; // Không đóng modal nếu giá trị không hợp lệ
        }
        if (finalVal > max) { 
            alert(`Giá trị tối đa là ${max}`); 
            return; // Không đóng modal
        }
    }
    
    // Cập nhật giá trị vào target input
    const target = document.getElementById(nPadTargetId);
    if (target) {
        target.value = finalVal;
        
        // Kích hoạt sự kiện input và change
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Nếu có hàm onchange riêng, gọi nó
        if (target.onchange) target.onchange();
        
        // Nếu có hàm oninput riêng, gọi nó
        if (target.oninput) target.oninput();
    }
    
    // Gọi callback nếu có
    if (nPadCallback && typeof nPadCallback === 'function') {
        nPadCallback(finalVal);
    }
    
    // FIX: ĐỢI 100ms trước khi đóng modal để tránh xung đột sự kiện
    setTimeout(() => {
        window.closeNumberPadModal();
        
        // FIX QUAN TRỌNG: Khôi phục focus vào input vừa được cập nhật
        if (target) {
            setTimeout(() => {
                target.focus();
                target.select(); // Chọn toàn bộ text để dễ chỉnh sửa
            }, 50);
        }
    }, 100);
};

// --- 3. BÀN PHÍM MẬT KHẨU NATIVE ---

window.injectNativePasswordModal = function() {
    if (document.getElementById('nativePassModal')) return;
    const div = document.createElement('div');
    div.id = 'nativePassModal';
    div.className = 'modal z-[4000]'; 
    div.innerHTML = `
        <div class="modal-box max-w-xs bg-white rounded-2xl shadow-xl overflow-hidden">
            <h3 class="font-bold text-lg text-[#3e2723] text-center p-4 bg-[#f2ebe0] border-b border-dashed border-[#bcaaa4]">NHẬP MẬT KHẨU</h3>
            <div class="p-6">
                <input type="password" id="nativePassInput" inputmode="numeric" pattern="[0-9]*" class="w-full h-12 text-center text-xl border border-gray-300 rounded-xl focus:border-[#5d4037] outline-none tracking-widest bg-gray-50" placeholder="******">
            </div>
            <div class="modal-footer">
                <button onclick="document.getElementById('nativePassModal').classList.remove('active')" class="btn-glass">Hủy</button>
                <button onclick="window.submitNativePassword()" class="btn-primary">Xác nhận</button>
            </div>
        </div>`;
    document.body.appendChild(div);
};

window.openNativePasswordInput = function(callback) {
    window.injectNativePasswordModal();
    passwordCallback = callback;
    const modal = document.getElementById('nativePassModal');
    const input = document.getElementById('nativePassInput');
    input.value = ''; 
    modal.classList.add('active');
    setTimeout(() => { input.focus(); }, 100);
};

window.submitNativePassword = function() {
    const input = document.getElementById('nativePassInput');
    const val = input.value;
    if (passwordCallback) passwordCallback(val);
    // Chỉ đóng modal mật khẩu
    document.getElementById('nativePassModal').classList.remove('active');
};

// --- 4. HỆ THỐNG IN ẤN CHUYÊN NGHIỆP (PRO PRINT SYSTEM) ---

window.preparePrint = function(type) { 
    currentPrintType = type; 
    window.doPrint(type); 
};

// Hàm tạo Header chung cho mọi phiếu in
window.generatePrintHeader = function(title, doctorName, date, patientName, patientYear, patientPhone, disease, symptoms) {
    const logoHtml = window.config.qrCodeImage 
        ? `<img src="${window.config.qrCodeImage}" class="h-20 w-20 object-contain mr-4 rounded-lg border border-gray-200">` 
        : ''; 

    return `
    <div class="flex justify-between items-start border-b-2 border-[#5d4037] pb-4 mb-4 font-serif">
        <div class="flex items-center">
            ${logoHtml}
            <div>
                <h1 class="font-bold text-2xl uppercase text-[#3e2723] tracking-wide">${title}</h1>
                <p class="text-sm font-bold text-[#5d4037] mt-1">${doctorName}</p>
                <p class="text-xs text-gray-500 italic mt-1">YHCT Tinh Hoa - Tận Tâm Phục Vụ</p>
            </div>
        </div>
        <div class="text-right pt-2">
            <p class="text-xs text-gray-500">Ngày khám: <span class="font-bold text-[#3e2723]">${date}</span></p>
            <p class="text-xs text-gray-500">Mã BN: <span class="font-mono font-bold">${patientPhone.slice(-4) || '---'}</span></p>
        </div>
    </div>
    
    <div class="bg-[#f9f9f9] p-3 rounded-lg border border-gray-200 mb-6 text-sm font-serif">
        <div class="flex justify-between mb-1">
            <p><span class="font-bold text-[#5d4037]">Họ tên:</span> <span class="uppercase text-lg font-bold">${patientName}</span></p>
            <p><span class="font-bold text-[#5d4037]">Năm sinh:</span> ${patientYear || '...'}</p>
        </div>
        <div class="mb-1"><span class="font-bold text-[#5d4037]">Chẩn đoán:</span> ${disease}</div>
        ${symptoms ? `<div><span class="font-bold text-[#5d4037]">Triệu chứng:</span> <span class="italic text-gray-600">${symptoms}</span></div>` : ''}
    </div>
    `;
};

// Hàm tạo Footer (Chữ ký)
window.generatePrintFooter = function(doctorName) {
    const today = new Date();
    return `
    <div class="mt-8 flex justify-end text-center font-serif text-sm">
        <div>
            <p class="italic text-gray-500 mb-1">Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}</p>
            <p class="font-bold text-[#3e2723] uppercase mb-12">Bác sĩ điều trị</p>
            <p class="font-bold text-[#5d4037] text-lg">${doctorName.replace('BS. ', '')}</p>
        </div>
    </div>
    <div class="mt-8 text-center text-[10px] text-gray-400 border-t pt-2 italic">
        Phiếu in tự động từ phần mềm quản lý YHCT Pro
    </div>
    `;
};

window.doPrint = function(type) {
    const pid = document.getElementById('vPid').value; 
    const p = window.db.find(x => x.id == pid); 
    if (!p) return;

    // Ẩn tất cả section cũ trước khi render
    document.querySelectorAll('.print-section').forEach(el => { el.classList.add('hidden'); });
    if(window.calcTotal) window.calcTotal();

    const visitData = window.currentVisit || { rxEast: [], rxWest: [], procs: [] };
    
    // Tính toán tiền
    const eastTotal = visitData.manualMedTotalEast || 0; 
    const westTotal = visitData.manualMedTotalWest || 0;
    let procTotal = 0; 
    visitData.procs.forEach(proc => { 
        procTotal += Math.round((proc.price||0) * (proc.days||1) * (1 - (proc.discount||0)/100)); 
    });
    const total = eastTotal + westTotal + procTotal;
    const discP = parseInt(document.getElementById('vDiscountPercent').value)||0;
    const finalTotal = Math.round(total*(1-discP/100));
    
    // Thông tin chung
    const clinicTitle = window.config.clinicTitle || 'PHÒNG KHÁM YHCT';
    const doctorName = window.config.doctorName ? 'BS. ' + window.config.doctorName : 'BS. Đông Y';
    const visitDate = document.getElementById('vDate').value.split('-').reverse().join('/');
    const disease = document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value;
    const symptoms = document.getElementById('vSpecial').value || '';
    
    const headerHtml = window.generatePrintHeader(clinicTitle, doctorName, visitDate, p.name, p.year, p.phone, disease, symptoms);
    const footerHtml = window.generatePrintFooter(doctorName);

    // --- RENDER NỘI DUNG TỪNG LOẠI ---

    // 1. IN ĐÔNG Y (EAST)
    if (type === 'east' || type === 'both') {
        const eastSec = document.getElementById('printEast');
        if(eastSec) {
            eastSec.classList.remove('hidden');
            const eastDays = document.getElementById('vEastDays').value || 1;
            const eastNote = document.getElementById('vEastNote').value || 'Sắc uống ngày 1 thang.';
            const manualPrice = parseInt(document.getElementById('vEastManualPrice').value) || 0;

            let tableRows = visitData.rxEast.map((m, i) => `
                <tr class="border-b border-gray-200">
                    <td class="py-2 text-center text-gray-500">${i+1}</td>
                    <td class="py-2 font-bold text-[#3e2723]">${m.name}</td>
                    <td class="py-2 text-right font-mono">${m.qty} g</td>
                    ${manualPrice > 0 ? '' : `<td class="py-2 text-right text-gray-500 text-xs">${(m.price||0).toLocaleString()}</td>
                    <td class="py-2 text-right font-mono">${((m.qty||0)*(m.price||0)*eastDays).toLocaleString()}</td>`}
                </tr>
            `).join('');

            const headerRow = manualPrice > 0 
                ? `<th class="text-left py-2">Vị thuốc</th><th class="text-right py-2">Khối lượng</th>`
                : `<th class="text-left py-2">Vị thuốc</th><th class="text-right py-2">KL</th><th class="text-right py-2">ĐG</th><th class="text-right py-2">Thành tiền</th>`;

            eastSec.innerHTML = `
                ${headerHtml}
                <div class="mb-4">
                    <h3 class="font-bold text-lg text-center uppercase border-b-2 border-dashed border-[#8d6e63] pb-1 mb-3 text-[#5d4037]">Đơn Thuốc Đông Y</h3>
                    <table class="w-full text-sm mb-4">
                        <thead class="border-b-2 border-[#5d4037] text-[#5d4037] uppercase text-xs">
                            <tr><th class="py-2 w-8 text-center">#</th>${headerRow}</tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                    <div class="flex justify-between items-center bg-[#f2ebe0] p-3 rounded font-bold text-[#3e2723]">
                        <span>Số lượng: ${eastDays} thang</span>
                        <span>Tổng cộng: ${eastTotal.toLocaleString()} đ</span>
                    </div>
                    <div class="mt-3 text-sm">
                        <span class="font-bold text-[#5d4037]">[Cách dùng]:</span> <span class="italic">${eastNote}</span>
                    </div>
                </div>
                ${footerHtml}
            `;
        }
    }

    // 2. IN TÂY Y (WEST)
    if (type === 'west' || type === 'both') {
        const westSec = document.getElementById('printWest');
        if(westSec) {
            westSec.classList.remove('hidden');
            const westDays = document.getElementById('vWestDays').value || 1;
            const westNote = document.getElementById('vWestNote').value || 'Uống theo đơn.';
            
            let tableRows = visitData.rxWest.map((m, i) => `
                <tr class="border-b border-gray-200">
                    <td class="py-2 text-center text-gray-500">${i+1}</td>
                    <td class="py-2 font-bold text-[#3e2723]">${m.name}</td>
                    <td class="py-2 text-center font-mono">${m.qty} viên</td>
                    <td class="py-2 text-right text-gray-600 italic">${m.usage || ''}</td>
                </tr>
            `).join('');

            westSec.innerHTML = `
                ${headerHtml}
                <div class="mb-4">
                    <h3 class="font-bold text-lg text-center uppercase border-b-2 border-dashed border-blue-800 pb-1 mb-3 text-blue-900">Đơn Thuốc Tây Y</h3>
                    <table class="w-full text-sm mb-4">
                        <thead class="border-b-2 border-blue-900 text-blue-900 uppercase text-xs">
                            <tr>
                                <th class="py-2 w-8 text-center">#</th>
                                <th class="text-left py-2">Tên thuốc</th>
                                <th class="text-center py-2 w-20">Sáng/Trưa/Chiều/Tối</th>
                                <th class="text-right py-2 w-32">Cách dùng</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                    <div class="flex justify-between items-center bg-blue-50 p-3 rounded font-bold text-blue-900 border border-blue-100">
                        <span>Số ngày: ${westDays} ngày</span>
                        <span>Tổng tiền: ${westTotal.toLocaleString()} đ</span>
                    </div>
                    <div class="mt-3 text-sm">
                        <span class="font-bold text-blue-900">[Lời dặn]:</span> <span class="italic">${westNote}</span>
                    </div>
                </div>
                ${footerHtml}
            `;
        }
    }

    // 3. IN CẢ HAI (BOTH)
    if (type === 'both') {
        const bothSec = document.getElementById('printBoth');
        if(bothSec) {
            bothSec.classList.remove('hidden');
            if(document.getElementById('printEast')) document.getElementById('printEast').classList.add('hidden'); 
            if(document.getElementById('printWest')) document.getElementById('printWest').classList.add('hidden');

            const eastDays = document.getElementById('vEastDays').value || 1;
            const westDays = document.getElementById('vWestDays').value || 1;
            
            let eastHtml = visitData.rxEast.length ? `
                <div class="mb-6">
                    <h4 class="font-bold text-[#5d4037] border-b border-[#5d4037] mb-2 uppercase text-sm">I. Đơn Đông Y (${eastDays} thang)</h4>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-2">
                        ${visitData.rxEast.map(m => `<div class="flex justify-between border-b border-dashed border-gray-200"><span>${m.name}</span><span class="font-mono">${m.qty}g</span></div>`).join('')}
                    </div>
                    <p class="text-xs italic text-gray-600">HDSD: ${document.getElementById('vEastNote').value}</p>
                </div>
            ` : '';

            let westHtml = visitData.rxWest.length ? `
                <div class="mb-6">
                    <h4 class="font-bold text-blue-900 border-b border-blue-900 mb-2 uppercase text-sm">II. Đơn Tây Y (${westDays} ngày)</h4>
                    <table class="w-full text-xs mb-2">
                        ${visitData.rxWest.map(m => `<tr><td class="font-bold py-1">${m.name}</td><td class="text-right">${m.qty}v</td><td class="text-right italic text-gray-500">${m.usage}</td></tr>`).join('')}
                    </table>
                    <p class="text-xs italic text-gray-600">HDSD: ${document.getElementById('vWestNote').value}</p>
                </div>
            ` : '';

            bothSec.innerHTML = `
                ${headerHtml}
                <h3 class="font-bold text-xl text-center uppercase mb-4 text-[#3e2723]">Đơn Thuốc Tổng Hợp</h3>
                ${eastHtml}
                ${westHtml}
                ${footerHtml}
            `;
        }
    }

    // 4. IN HÓA ĐƠN (INVOICE)
    if (type === 'invoice') {
        const invSec = document.getElementById('printInvoice');
        if(invSec) {
            invSec.classList.remove('hidden');
            
            let invoiceRows = '';
            visitData.procs.forEach(proc => {
                const tPrice = Math.round((proc.price||0) * (proc.days||1) * (1 - (proc.discount||0)/100));
                invoiceRows += `
                <tr>
                    <td class="py-1 text-left">${proc.name} <span class="text-[10px] text-gray-500">x${proc.days}</span></td>
                    <td class="py-1 text-right text-gray-600 text-xs">${(proc.price||0).toLocaleString()}</td>
                    <td class="py-1 text-right font-bold">${tPrice.toLocaleString()}</td>
                </tr>`;
            });
            
            if (eastTotal > 0) {
                invoiceRows += `
                <tr>
                    <td class="py-1 text-left">Thuốc Đông Y <span class="text-[10px] text-gray-500">x${document.getElementById('vEastDays').value}</span></td>
                    <td class="py-1 text-right text-gray-600 text-xs">-</td>
                    <td class="py-1 text-right font-bold">${eastTotal.toLocaleString()}</td>
                </tr>`;
            }
            
            if (westTotal > 0) {
                invoiceRows += `
                <tr>
                    <td class="py-1 text-left">Thuốc Tây Y <span class="text-[10px] text-gray-500">x${document.getElementById('vWestDays').value}</span></td>
                    <td class="py-1 text-right text-gray-600 text-xs">-</td>
                    <td class="py-1 text-right font-bold">${westTotal.toLocaleString()}</td>
                </tr>`;
            }

            const qrHtml = window.config.qrCodeImage 
                ? `<div class="mt-4 text-center"><p class="text-[10px] uppercase font-bold mb-1">Quét QR thanh toán</p><img src="${window.config.qrCodeImage}" class="w-24 h-24 mx-auto object-contain border border-gray-200 rounded"></div>` 
                : '';

            invSec.innerHTML = `
                <div class="text-center mb-4">
                    <h2 class="font-bold text-lg uppercase text-[#3e2723]">${clinicTitle}</h2>
                    <p class="text-xs text-gray-500">ĐC: Việt Nam</p>
                    <div class="my-2 border-b border-dashed border-gray-300"></div>
                    <h3 class="font-black text-xl">HÓA ĐƠN THANH TOÁN</h3>
                    <p class="text-xs italic text-gray-500">${visitDate}</p>
                </div>
                
                <div class="mb-3 text-xs">
                    <p>Khách hàng: <span class="font-bold">${p.name}</span></p>
                    <p>Chẩn đoán: ${disease}</p>
                </div>

                <table class="w-full text-xs mb-3 border-t border-b border-gray-300">
                    <thead class="font-bold border-b border-gray-200">
                        <tr><th class="py-1 text-left">Dịch vụ / Thuốc</th><th class="py-1 text-right">Đơn giá</th><th class="py-1 text-right">Thành tiền</th></tr>
                    </thead>
                    <tbody>${invoiceRows}</tbody>
                </table>

                <div class="flex justify-between text-xs mb-1"><span>Tổng tiền hàng:</span> <span>${total.toLocaleString()}</span></div>
                <div class="flex justify-between text-xs mb-1"><span>Chiết khấu:</span> <span>${discP}%</span></div>
                <div class="flex justify-between text-lg font-black mt-2 pt-2 border-t border-dashed border-gray-400">
                    <span>THANH TOÁN:</span> <span>${finalTotal.toLocaleString()} đ</span>
                </div>

                ${qrHtml}
                
                <div class="text-center mt-6 italic text-[10px] text-gray-400">
                    <p>Cảm ơn quý khách và hẹn gặp lại!</p>
                </div>
            `;
        }
    }
    
    // Gọi lệnh in
    setTimeout(() => { 
        window.print(); 
        document.getElementById('printModal').classList.remove('active'); 
    }, 500);
};

// --- 5. HỆ THỐNG THÔNG BÁO NỔI (TOAST NOTIFICATION) ---

window.ensureToastContainer = function() {
    if (!document.getElementById('toast-container')) {
        const div = document.createElement('div');
        div.id = 'toast-container';
        document.body.appendChild(div);
    }
};

window.showToast = function(message, type = 'info') {
    window.ensureToastContainer();
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    toast.innerHTML = `<div class="toast-icon">${icon}</div><div class="toast-content">${message}</div>`;
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.classList.add('show'); });
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide'); 
        setTimeout(() => { if (toast.parentElement) toast.parentElement.removeChild(toast); }, 300);
    }, 3000);
};

window.originalAlert = window.alert;
window.alert = function(message) {
    window.showToast(message, 'warning');
    console.log("System Alert:", message); 
};
window.notifySuccess = (msg) => window.showToast(msg, 'success');
window.notifyError = (msg) => window.showToast(msg, 'error');

// --- 6. CHỨC NĂNG FULL SCREEN ---

window.toggleFullScreen = function() {
    var doc = window.document;
    var docEl = doc.documentElement;
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        if(requestFullScreen) {
            requestFullScreen.call(docEl);
            if(window.showToast) window.showToast("Đã mở Toàn màn hình", "success");
        } else alert("Trình duyệt này không hỗ trợ Full Screen tự động.");
    } else {
        if(cancelFullScreen) cancelFullScreen.call(doc);
    }
};

// --- 7. TÍNH NĂNG DRAGGABLE (IPHONE STYLE WIDGETS) ---

/**
 * Biến phần tử thành Widget có thể kéo thả (hỗ trợ Touch & Mouse)
 * @param {string} elmntId - ID của phần tử
 * @param {function} onClickCallback - Hàm chạy khi click (nếu không kéo)
 */
window.makeDraggable = function(elmntId, onClickCallback) {
    const elmnt = document.getElementById(elmntId);
    if (!elmnt) return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    let startX = 0, startY = 0;

    // --- SỰ KIỆN MOUSE (PC) ---
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        // Lấy vị trí chuột ban đầu
        pos3 = e.clientX;
        pos4 = e.clientY;
        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        // Tính toán khoảng cách di chuyển
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Nếu di chuyển quá 5px thì coi là đang kéo (không phải click)
        if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
            isDragging = true;
        }

        // Cập nhật vị trí mới (dùng offsetTop/Left thay vì bottom/right)
        let newTop = (elmnt.offsetTop - pos2);
        let newLeft = (elmnt.offsetLeft - pos1);
        
        // Giới hạn trong màn hình
        const maxTop = window.innerHeight - elmnt.offsetHeight;
        const maxLeft = window.innerWidth - elmnt.offsetWidth;
        
        if(newTop < 0) newTop = 0;
        if(newTop > maxTop) newTop = maxTop;
        if(newLeft < 0) newLeft = 0;
        if(newLeft > maxLeft) newLeft = maxLeft;

        // Xóa định vị cũ (bottom/right) nếu có để tránh xung đột
        elmnt.style.bottom = 'auto';
        elmnt.style.right = 'auto';
        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;
        
        // Nếu không kéo (chỉ click nhẹ), thì gọi hàm callback
        if (!isDragging && onClickCallback) {
            onClickCallback();
        }
    }

    // --- SỰ KIỆN TOUCH (MOBILE) ---
    elmnt.addEventListener('touchstart', touchStart, {passive: false});
    elmnt.addEventListener('touchmove', touchMove, {passive: false});
    elmnt.addEventListener('touchend', touchEnd, {passive: false});

    let touchStartX = 0;
    let touchStartY = 0;

    function touchStart(e) {
        // e.preventDefault(); // Không preventDefault ở đây để tránh lỗi scroll nếu cần
        const touch = e.touches[0];
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isDragging = false;
    }

    function touchMove(e) {
        e.preventDefault(); // Ngăn cuộn màn hình khi đang kéo widget
        const touch = e.touches[0];
        
        pos1 = pos3 - touch.clientX;
        pos2 = pos4 - touch.clientY;
        pos3 = touch.clientX;
        pos4 = touch.clientY;

        if (Math.abs(touch.clientX - touchStartX) > 5 || Math.abs(touch.clientY - touchStartY) > 5) {
            isDragging = true;
        }

        let newTop = (elmnt.offsetTop - pos2);
        let newLeft = (elmnt.offsetLeft - pos1);
        
        // Giới hạn màn hình
        const maxTop = window.innerHeight - elmnt.offsetHeight;
        const maxLeft = window.innerWidth - elmnt.offsetWidth;
        
        if(newTop < 0) newTop = 0;
        if(newTop > maxTop) newTop = maxTop;
        if(newLeft < 0) newLeft = 0;
        if(newLeft > maxLeft) newLeft = maxLeft;

        elmnt.style.bottom = 'auto';
        elmnt.style.right = 'auto';
        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";
    }

    function touchEnd(e) {
        if (!isDragging && onClickCallback) {
            // e.preventDefault();
            onClickCallback();
        }
    }
};
