/**
 * FILE: js/tpl-visit.js
 * CHỨC NĂNG: Chứa mã HTML của giao diện Khám bệnh (vModal)
 */

window.TPL_VISIT = `
<div id="vModal" class="modal">
    <div class="modal-box w-full max-w-lg h-[90vh] flex flex-col">
        <div class="modal-header">
            <h2 class="font-bold text-lg text-[#3e2723] truncate serif">Khám: <span id="vPatientName"></span></h2>
            <button onclick="window.closeModals()" class="text-2xl text-gray-400 hover:text-red-500 cursor-pointer">&times;</button>
        </div>
        
        <div class="tabs">
            <button class="tab-btn active" id="tab1" onclick="window.goToStep(1)">1. Chẩn đoán</button>
            <button class="tab-btn" id="tab2" onclick="window.goToStep(2)">2. Tứ chẩn</button>
            <button class="tab-btn" id="tab3" onclick="window.goToStep(3)">3. Điều trị</button>
            <button class="tab-btn" id="tab4" onclick="window.goToStep(4)">4. Kết thúc</button>
        </div>
        
        <div class="modal-body overflow-y-auto p-5 flex-1" id="stepContainer">
            <input type="hidden" id="vPid"><input type="hidden" id="vVisitId">
            
            <div id="step1" class="step-content active space-y-5">
                <div>
                    <label class="song-label">Ngày khám</label>
                    <input type="date" id="vDate" class="song-input ipad-input-fix">
                </div>
                <div>
                    <label class="song-label">Chẩn đoán</label>
                    <select id="vDiseaseSelect" onchange="window.loadDiseaseSuggestions()" class="song-input mb-2 font-bold text-[#3e2723]">
                        <option value="">-- Chọn bệnh mẫu --</option>
                    </select>
                    <input type="text" id="vDiseaseInput" placeholder="Chẩn đoán cụ thể..." class="song-input ipad-input-fix">
                </div>
                <div id="suggestedSymptomsBox" class="hidden p-3 bg-[#f1f8e9] border border-[#c5e1a5] rounded-lg">
                    <label class="song-label text-[#33691e]">Gợi ý</label>
                    <div id="symptomButtons" class="flex flex-wrap gap-1 mt-1"></div>
                </div>
                <div>
                    <label class="song-label">Triệu chứng & Ghi chú</label>
                    <textarea id="vSpecial" rows="3" class="song-input ipad-input-fix"></textarea>
                </div>
                <div class="vital-grid">
                    <div class="vital-item">
                        <label class="song-label">Huyết áp</label>
                        <div class="flex items-center gap-1 w-full">
                            <input type="text" id="vBpSys" class="med-input-large" placeholder="120" readonly onclick="window.openNumberPad && window.openNumberPad('vBpSys', 'HA Tâm thu', '50-250', 120)">
                            <span class="text-gray-400">/</span>
                            <input type="text" id="vBpDia" class="med-input-large" placeholder="80" readonly onclick="window.openNumberPad && window.openNumberPad('vBpDia', 'HA Tâm trương', '30-150', 80)">
                        </div>
                    </div>
                    <div class="vital-item">
                        <label class="song-label">Mạch (l/p)</label>
                        <input type="text" id="vPulse" class="med-input-large" placeholder="80" readonly onclick="window.openNumberPad && window.openNumberPad('vPulse', 'Mạch', '40-180', 80)">
                    </div>
                    <div class="vital-item">
                        <label class="song-label">Chiều cao (cm)</label>
                        <input type="text" id="vHeight" class="med-input-large" placeholder="165" readonly onclick="window.openNumberPad && window.openNumberPad('vHeight', 'Chiều cao', '100-220', 165)">
                    </div>
                    <div class="vital-item">
                        <label class="song-label">Cân nặng (kg)</label>
                        <input type="text" id="vWeight" class="med-input-large" placeholder="60" readonly onclick="window.openNumberPad && window.openNumberPad('vWeight', 'Cân nặng', '30-150', 60)">
                    </div>
                </div>
                <div class="flex justify-between text-xs font-bold text-[#8d6e63] px-2">
                    <span id="displayHeightWeight">165cm - 60kg</span>
                    <span id="displayBP">120/80</span>
                    <span id="displayBMI">BMI: 22.0</span>
                </div>
            </div>

            <div id="step2" class="step-content hidden space-y-4">
                <div class="bg-white p-3 border border-dashed border-[#d7ccc8] rounded-xl">
                    <label class="song-label">1. VỌNG (Nhìn)</label>
                    <div id="tuchanVongButtons" class="chip-container"></div>
                    <input type="text" id="vVongExtra" class="song-input border-0 border-b rounded-none px-0 ipad-input-fix" placeholder="Ghi chú...">
                </div>
                <div class="bg-white p-3 border border-dashed border-[#d7ccc8] rounded-xl">
                    <label class="song-label">2. VĂN (Nghe/Ngửi)</label>
                    <div id="tuchanVanButtons" class="chip-container"></div>
                    <input type="text" id="vVanExtra" class="song-input border-0 border-b rounded-none px-0 ipad-input-fix" placeholder="Ghi chú...">
                </div>
                <div class="bg-white p-3 border border-dashed border-[#d7ccc8] rounded-xl">
                    <label class="song-label">3. VẤN (Hỏi)</label>
                    <div id="tuchanVanhoiButtons" class="chip-container"></div>
                    <input type="text" id="vVanHoiExtra" class="song-input border-0 border-b rounded-none px-0 ipad-input-fix" placeholder="Ghi chú...">
                </div>
                <div class="bg-white p-3 border border-dashed border-[#d7ccc8] rounded-xl">
                    <label class="song-label">4. THIẾT (Sờ nắn)</label>
                    <div id="tuchanThietButtons" class="chip-container"></div>
                    <input type="text" id="vThietExtra" class="song-input border-0 border-b rounded-none px-0 ipad-input-fix" placeholder="Ghi chú...">
                </div>
                <div class="bg-white p-3 border border-dashed border-[#d7ccc8] rounded-xl">
                    <label class="song-label">5. THIỆT (Lưỡi)</label>
                    <div id="tuchanThietchanButtons" class="chip-container"></div>
                    <input type="text" id="vThietChanExtra" class="song-input border-0 border-b rounded-none px-0 ipad-input-fix" placeholder="Ghi chú...">
                </div>
                <div class="bg-red-50 p-3 border border-red-100 rounded-xl">
                    <label class="song-label text-red-800">6. MẠCH CHẨN</label>
                    <div id="tuchanMachchanButtons" class="chip-container"></div>
                    <input type="text" id="vMachChanExtra" class="song-input bg-transparent border-0 border-b border-red-200 rounded-none px-0 ipad-input-fix" placeholder="Mô tả mạch...">
                </div>
            </div>

            <div id="step3" class="step-content hidden space-y-6">
                <div class="bg-white p-4 border border-[#d7ccc8] rounded-2xl shadow-sm">
                    <label class="font-bold text-[#5d4037] serif text-lg block mb-2 border-b pb-2">Thủ thuật & Phương Huyệt</label>
                    
                    <button onclick="window.openAcupointModal()" class="w-full py-3 mb-3 bg-[#e0f2f1] text-[#00695c] text-xs font-bold rounded-xl border border-[#b2dfdb] hover:bg-[#b2dfdb] transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <span>📍 Tra cứu Huyệt & AI Gợi ý</span>
                    </button>

                    <div id="aiSuggestionBox" class="hidden mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                        <span class="text-lg">💡</span>
                        <div class="text-xs text-yellow-800 italic leading-relaxed" id="aiSuggestionText"></div>
                    </div>

                    <div id="vAcupointList" class="flex flex-wrap gap-2 mb-4 empty:hidden"></div>

                    <div class="bg-[#fdfbf7] p-3 rounded-xl border border-dashed border-[#d7ccc8] mb-3">
                        <div id="vProcOptionsArea" class="flex flex-wrap gap-2"></div>
                    </div>
                    <div id="vProcList" class="space-y-3"></div>
                </div>
                
                <div class="bg-white p-4 border border-[#d7ccc8] rounded-2xl shadow-sm">
                    <div class="flex justify-between items-center mb-3 pb-2 border-b border-[#eee]">
                        <label class="font-bold text-[#5d4037] serif text-lg">Đông Y (Gam)</label>
                        <div class="flex items-center gap-2">
                            <label class="text-[10px] font-bold text-[#8d6e63] uppercase">Thang</label>
                            <input type="number" id="vEastDays" class="med-input-large" style="width: 60px; height: 36px;" value="1" onclick="window.openNumberPad && window.openNumberPad('vEastDays', 'Số thang', '1-100', 1)" readonly>
                        </div>
                    </div>
                    <div class="rx-header-controls"><div></div></div>
                    
                    <button onclick="window.openHerbModal()" class="w-full py-3 mb-3 bg-[#fff8e1] text-[#f57f17] text-xs font-bold rounded-xl border border-[#ffe082] hover:bg-[#ffecb3] transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <span>🌿 Tra cứu Dược liệu & AI</span>
                    </button>

                    <button onclick="window.addMedRow('east')" class="w-full py-2 mb-3 bg-[#efebe9] text-[#5d4037] text-xs font-bold rounded-lg border border-[#d7ccc8]">+ Thêm vị thuốc</button>
                    <div id="eastPresetsArea" class="mb-3 hidden p-2 bg-[#fdfbf7] rounded border border-dashed border-[#d7ccc8] overflow-x-auto">
                        <div id="eastPresetButtons" class="flex gap-2"></div>
                    </div>
                    <div id="vMedListEast" class="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
                    
                    <div class="mt-4 pt-4 border-t border-dashed border-[#d7ccc8]">
                        <label class="song-label">Ghi chú / Cách dùng</label>
                        <textarea id="vEastNote" rows="1" class="song-input ipad-input-fix mb-2" placeholder="Sắc uống..."></textarea>
                        <div class="med-usage-row mb-4">
                            <button class="time-btn-large" onclick="window.toggleGlobalEastUsage('Sáng')">Sáng</button>
                            <button class="time-btn-large" onclick="window.toggleGlobalEastUsage('Trưa')">Trưa</button>
                            <button class="time-btn-large" onclick="window.toggleGlobalEastUsage('Chiều')">Chiều</button>
                            <button class="time-btn-large" onclick="window.toggleGlobalEastUsage('Tối')">Tối</button>
                        </div>
                        <label class="song-label">Giá trọn gói (Nếu muốn)</label>
                        <input type="number" id="vEastManualPrice" class="song-input ipad-input-fix" placeholder="Nhập giá trọn gói để đè giá lẻ..." onchange="window.calcTotal()">
                    </div>
                </div>
                
                <div class="bg-white p-4 border border-blue-100 rounded-2xl shadow-sm border-blue-200">
                    <div class="flex justify-between items-center mb-3 pb-2 border-b border-blue-50">
                        <label class="font-bold text-blue-800 serif text-lg">Tây Y (Viên)</label>
                        <div class="flex items-center gap-2">
                            <label class="text-[10px] font-bold text-blue-800 uppercase">Ngày</label>
                            <input type="number" id="vWestDays" class="med-input-large border-blue-200 text-blue-800" style="width: 60px; height: 36px;" value="1" onclick="window.openNumberPad && window.openNumberPad('vWestDays', 'Số ngày', '1-100', 1)" readonly>
                        </div>
                    </div>
                    <div class="rx-header-controls"><div></div></div>
                    <button onclick="window.addMedRow('west')" class="w-full py-2 mb-3 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">+ Thêm thuốc</button>
                    <div id="vMedListWest" class="space-y-2"></div>
                    <div class="mt-4 pt-4 border-t border-dashed border-blue-100">
                        <label class="song-label">Lời dặn</label>
                        <textarea id="vWestNote" rows="1" class="song-input border-blue-200 text-blue-800 ipad-input-fix mb-2" placeholder="Uống sau ăn..."></textarea>
                        <label class="song-label">Giá trọn gói</label>
                        <input type="number" id="vWestManualPrice" class="song-input border-blue-200 text-blue-800 ipad-input-fix" placeholder="Nhập giá trọn gói..." onchange="window.calcTotal()">
                    </div>
                </div>
                
                <div class="bg-[#efebe9] p-5 rounded-2xl border border-[#d7ccc8]">
                    <div class="flex justify-between text-sm mb-1 text-gray-600"><span>Đông Y:</span><span id="displayMedTotalEast" class="font-bold">0đ</span></div>
                    <div class="flex justify-between text-sm mb-1 text-gray-600"><span>Tây Y:</span><span id="displayMedTotalWest" class="font-bold">0đ</span></div>
                    <div class="flex justify-between text-sm mb-1 text-gray-600"><span>Thủ thuật:</span><span id="displayProcTotal" class="font-bold">0đ</span></div>
                    <div class="flex justify-between text-xl font-black mt-3 pt-3 border-t border-[#a1887f] text-[#3e2723]"><span>TỔNG:</span><span id="displayGrandTotal">0đ</span></div>
                    <div class="mt-3 flex items-center gap-2"><label class="text-[10px] font-bold uppercase text-gray-500">Vốn:</label><input type="number" id="vCost" class="song-input py-1 px-2 h-8 w-32 ipad-input-fix" placeholder="0"></div>
                </div>
            </div>
            
            <div id="step4" class="step-content hidden space-y-6 text-center">
                <div class="bg-[#fffcf7] p-8 rounded-3xl shadow-inner border border-[#d7ccc8] relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-[#5d4037]"></div>
                    <h3 class="font-black text-4xl text-[#3e2723] mb-1 mt-4" id="finalTotal">0đ</h3>
                    <p class="text-xs uppercase text-[#8d6e63] font-bold tracking-widest">THANH TOÁN CUỐI</p>
                    <div class="mt-6 flex flex-col items-center gap-2">
                        <label class="song-label">Chiết khấu</label>
                        <button onclick="window.openNumberPad && window.openNumberPad('vDiscountPercent', 'Chiết khấu (%)', '0-100', 0)" class="text-xl font-bold text-[#e65100] bg-[#fff3e0] px-4 py-2 rounded-xl border border-dashed border-[#ffb74d]" id="discountBtn">0% ▼</button>
                        <input type="hidden" id="vDiscountPercent" value="0">
                    </div>
                </div>
                <div id="qrPaymentSection" class="hidden flex flex-col items-center p-4 border border-[#eee] rounded-xl bg-white">
                    <p class="text-xs font-bold uppercase text-[#5d4037] mb-2">Quét mã thanh toán</p>
                    <img id="displayQrPayment" src="" class="w-48 h-48 object-contain border rounded-lg">
                </div>
                <div class="flex items-center justify-center gap-3 p-4 bg-white border rounded-xl shadow-sm">
                    <input type="checkbox" id="vPaid" class="w-6 h-6 accent-[#5d4037]" checked>
                    <label for="vPaid" class="font-bold text-[#3e2723] text-lg select-none cursor-pointer">Đã thu tiền</label>
                </div>
                
                <div class="bg-white p-4 border rounded-xl">
                    <p class="text-xs font-bold uppercase text-[#5d4037] mb-2">Đầu ra (Output)</p>
                    <button onclick="window.copyToZalo()" class="w-full py-3 mb-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        <span class="text-xl">💬</span> COPY ĐƠN THUỐC ZALO
                    </button>

                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="window.preparePrint('east')" class="btn-glass py-3">🌿 In Đơn Đông Y</button>
                        <button onclick="window.preparePrint('west')" class="btn-glass py-3">💊 In Đơn Tây Y</button>
                        <button onclick="window.preparePrint('both')" class="btn-glass py-3">📋 In Cả hai</button>
                        <button onclick="window.preparePrint('invoice')" class="btn-glass py-3">🧾 In Hóa đơn</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal-footer">
            <button onclick="window.prevStep()" id="btnBack" class="btn-glass hidden">Quay lại</button>
            <button onclick="window.nextStep()" id="btnNext" class="btn-primary">Tiếp tục</button>
            <button onclick="window.saveOnly()" id="btnSaveOnly" class="btn-glass hidden">CHỈ LƯU</button>
            <button onclick="window.saveAndPrint()" id="btnPrint" class="btn-primary hidden">LƯU & IN</button>
        </div>
    </div>
</div>
`;
