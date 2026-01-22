/**
 * FILE: js/tpl-settings.js
 * CHỨC NĂNG: Chứa mã HTML của giao diện Cài đặt (sModal), Sao lưu (backupModal) và Chi tiết bệnh (diseaseModal)
 * CẬP NHẬT: 
 * - Fix triệt để UI Thêm thủ thuật: Dùng container để ép ô Tên dài, ô Giá ngắn.
 * - Đảm bảo đầy đủ Modal chi tiết bệnh để hiển thị bảng triệu chứng/đơn thuốc.
 */

window.TPL_SETTINGS = `
<div id="sModal" class="modal" style="z-index: 2000;">
    <div class="modal-box w-full max-w-lg h-[90vh] flex flex-col">
        <div class="modal-header">
            <h2 class="font-bold text-xl text-[#3e2723]">Cài đặt</h2>
            <button onclick="window.closeModals()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        
        <div class="tabs">
            <button class="tab-btn active" onclick="window.switchSettingsTab('tabUI', this)">Giao diện</button>
            <button class="tab-btn" onclick="window.switchSettingsTab('tabMed', this)">Chuyên môn</button>
            <button class="tab-btn" onclick="window.switchSettingsTab('tabBackup', this)">Khác</button>
        </div>
        
        <div class="modal-body flex-1 overflow-y-auto p-5">
            <div id="tabUI" class="settings-panel active space-y-4">
                <section>
                    <label class="song-label">Tên phòng khám</label>
                    <input type="text" id="confTitle" class="song-input ipad-input-fix">
                </section>
                <section>
                    <label class="song-label">Bác sĩ</label>
                    <input type="text" id="confDoctor" class="song-input ipad-input-fix">
                </section>
                
                <div class="p-4 border border-[#d7ccc8] rounded-xl bg-[#fffcf7] space-y-4">
                    <h3 class="font-bold text-[#5d4037] border-b border-dashed border-[#d7ccc8] pb-2 mb-2 text-sm uppercase">Mỹ Học Nhà Tống</h3>
                    <div>
                        <label class="song-label">Màu Chữ (Số tiền)</label>
                        <div class="flex gap-2 mb-2">
                            <input type="color" id="profitTextColorInput" class="h-10 w-14 rounded cursor-pointer border border-gray-300">
                            <div class="flex-1 text-xs text-gray-500 flex items-center">Chọn màu thủ công hoặc chọn từ bảng bên dưới</div>
                        </div>
                        <div id="paletteTextContainer" class="color-swatch-grid"></div>
                    </div>
                    <div>
                        <label class="song-label">Màu Nền Hộp Doanh Thu</label>
                        <div class="flex gap-2 mb-2">
                            <input type="color" id="profitBgColorInput" class="h-10 w-14 rounded cursor-pointer border border-gray-300">
                            <div class="flex-1 text-xs text-gray-500 flex items-center">Nên chọn màu nhạt để chữ nổi bật</div>
                        </div>
                        <div id="paletteBgContainer" class="color-swatch-grid"></div>
                    </div>
                </div>

                <div class="p-4 border border-[#d7ccc8] rounded-xl bg-gray-50 space-y-4">
                    <h3 class="font-bold text-[#5d4037] border-b pb-2 mb-2 text-sm uppercase">Ảnh nền & QR</h3>
                    <div>
                        <label class="song-label">Ảnh nền Header</label>
                        <input type="file" id="headerBgInput" accept="image/*" class="text-sm w-full mb-2" onchange="window.handleImageUpload(this, 'headerBgImage', null, true)">
                        <div class="flex justify-between items-center">
                            <label class="text-xs font-bold text-gray-500">Độ tối nền</label>
                            <span id="overlayValueDisplay" class="text-xs font-bold">0%</span>
                        </div>
                        <input type="range" id="headerOverlayInput" min="0" max="95" value="0" class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#5d4037]" oninput="window.updateHeaderOverlay(this.value)">
                        <button onclick="window.clearHeaderImage()" class="text-xs text-red-600 underline mt-1">Xóa nền</button>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-dashed border-gray-300">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-bold text-gray-500">Độ mờ Khung Chính</label>
                                <span id="blurHeaderVal" class="text-[10px] font-bold">0px</span>
                            </div>
                            <input type="range" id="confBlurHeader" min="0" max="10" step="0.1" value="0" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5d4037]" oninput="document.getElementById('blurHeaderVal').innerText = this.value + 'px'">
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-bold text-gray-500">Độ mờ Ô Thông Tin</label>
                                <span id="blurInfoVal" class="text-[10px] font-bold">0px</span>
                            </div>
                            <input type="range" id="confBlurInfo" min="0" max="10" step="0.1" value="0" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5d4037]" oninput="document.getElementById('blurInfoVal').innerText = this.value + 'px'">
                        </div>
                    </div>

                    <div>
                        <label class="song-label">Mã QR</label>
                        <div class="flex gap-4">
                            <div class="flex-1">
                                <input type="file" id="qrInput" accept="image/*" class="text-sm w-full" onchange="window.handleImageUpload(this, 'qrCodeImage', 'previewQrSettings')">
                                <button onclick="window.clearQrImage()" class="text-xs text-red-600 underline mt-2">Xóa QR</button>
                            </div>
                            <div class="w-16 h-16 border bg-white flex items-center justify-center rounded overflow-hidden">
                                <img id="previewQrSettings" src="" class="w-full h-full object-contain">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="tabMed" class="settings-panel hidden space-y-6">
                <div>
                    <h3 class="font-bold text-[#3e2723] mb-2 uppercase border-b pb-1 text-sm">Danh sách Bệnh</h3>
                    <div id="diseaseList" class="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1"></div>
                    
                    <div class="flex gap-2 mt-2">
                        <input type="text" id="newDiseaseName" placeholder="Tên bệnh mới..." class="song-input flex-1 ipad-input-fix text-sm">
                        <button onclick="window.addNewDiseaseInline()" class="btn-primary px-4 py-2 text-sm font-bold whitespace-nowrap">Thêm</button>
                    </div>
                </div>

                <div>
                    <h3 class="font-bold text-[#3e2723] mb-2 uppercase border-b pb-1 text-sm">Thủ thuật</h3>
                    <div id="procList" class="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1"></div>
                    
                    <div class="flex gap-2 mt-2 w-full items-center">
                        <div style="flex: 7; min-width: 0;">
                            <input type="text" id="newProcName" placeholder="Tên thủ thuật..." 
                                   class="song-input ipad-input-fix text-sm" 
                                   style="width: 100% !important;">
                        </div>
                        
                        <div style="flex: 3; min-width: 80px; max-width: 100px;">
                            <input type="number" id="newProcPrice" placeholder="Giá" 
                                   class="song-input ipad-input-fix text-sm text-center" 
                                   style="width: 100% !important;">
                        </div>
                        
                        <button onclick="window.addProc()" class="btn-primary px-4 py-2 text-sm font-bold whitespace-nowrap">Thêm</button>
                    </div>
                </div>

                <div>
                    <h3 class="font-bold text-[#3e2723] mb-2 uppercase border-b pb-1 text-sm">Cấu hình Tứ chẩn</h3>
                    <div class="space-y-3">
                        <div class="bg-gray-50 p-3 rounded border border-gray-200">
                            <label class="song-label mb-1">1. Vọng Chẩn</label>
                            <div id="setting_list_vong" class="mb-2"></div>
                            <div class="flex gap-2">
                                <input id="setting_new_vong" class="song-input py-1 text-sm" placeholder="Thêm...">
                                <button onclick="window.addTuChanItem('vong')" class="btn-primary py-1 px-3 text-xs">+</button>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-3 rounded border border-gray-200">
                            <label class="song-label mb-1">2. Văn Chẩn</label>
                            <div id="setting_list_van" class="mb-2"></div>
                            <div class="flex gap-2">
                                <input id="setting_new_van" class="song-input py-1 text-sm" placeholder="Thêm...">
                                <button onclick="window.addTuChanItem('van')" class="btn-primary py-1 px-3 text-xs">+</button>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-3 rounded border border-gray-200">
                            <label class="song-label mb-1">3. Vấn (Câu hỏi)</label>
                            <div id="setting_list_vanhoi" class="mb-2"></div>
                            <div class="flex gap-2">
                                <input id="setting_new_vanhoi" class="song-input py-1 text-sm" placeholder="Thêm...">
                                <button onclick="window.addTuChanItem('vanhoi')" class="btn-primary py-1 px-3 text-xs">+</button>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-3 rounded border border-gray-200">
                            <label class="song-label mb-1">4. Thiết (Sờ nắn)</label>
                            <div id="setting_list_thiet" class="mb-2"></div>
                            <div class="flex gap-2">
                                <input id="setting_new_thiet" class="song-input py-1 text-sm" placeholder="Thêm...">
                                <button onclick="window.addTuChanItem('thiet')" class="btn-primary py-1 px-3 text-xs">+</button>
                            </div>
                        </div>
                        <div class="bg-gray-50 p-3 rounded border border-gray-200">
                            <label class="song-label mb-1">5. Thiệt Chẩn (Lưỡi)</label>
                            <div id="setting_list_thietchan" class="mb-2"></div>
                            <div class="flex gap-2">
                                <input id="setting_new_thietchan" class="song-input py-1 text-sm" placeholder="Thêm...">
                                <button onclick="window.addTuChanItem('thietchan')" class="btn-primary py-1 px-3 text-xs">+</button>
                            </div>
                        </div>
                        <div class="bg-red-50 p-3 rounded border border-red-100">
                            <label class="song-label mb-1 text-red-800">6. Mạch Chẩn</label>
                            <div id="setting_list_machchan" class="mb-2"></div>
                            <div class="flex gap-2">
                                <input id="setting_new_machchan" class="song-input py-1 text-sm" placeholder="Thêm...">
                                <button onclick="window.addTuChanItem('machchan')" class="btn-primary py-1 px-3 text-xs">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="tabBackup" class="settings-panel hidden space-y-4">
                <section>
                    <label class="song-label">Mật khẩu Admin</label>
                    <div class="flex gap-2">
                        <input type="password" id="confPass" readonly class="song-input w-32 bg-[#f5f5f5] text-center">
                        <button onclick="window.openNativePasswordInput((p) => { document.getElementById('confPass').value = p; window.config.password = p; window.saveConfig(); alert('Đã đổi mật khẩu!'); })" class="btn-primary px-4 text-xs">Đổi pass</button>
                    </div>
                </section>
                <button onclick="window.openBackupModalDirect()" class="btn-glass w-full py-4 text-[#5d4037] font-bold">📂 Công cụ Sao lưu & Khôi phục</button>
            </div>
        </div>
        
        <div class="modal-footer">
            <button onclick="window.saveSettings()" class="flex-1 py-3 btn-primary">Lưu Cài Đặt</button>
        </div>
    </div>
</div>

<div id="backupModal" class="modal" style="z-index: 2100;">
    <div class="modal-box w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div class="modal-header bg-[#f2ebe0] p-4 border-b border-[#d7ccc8] flex justify-between items-center">
            <h2 class="font-bold text-xl text-[#3e2723] uppercase">Sao lưu & Khôi phục</h2>
            <button onclick="window.closeModals()" class="text-2xl text-gray-500 hover:text-red-600">&times;</button>
        </div>
        <div class="modal-body p-6 grid grid-cols-2 gap-4">
            <div onclick="window.exportToExcel()" class="p-4 border border-[#d7ccc8] rounded-xl text-center cursor-pointer hover:bg-[#efebe9] transition-colors bg-white shadow-sm flex flex-col items-center justify-center gap-2 h-32">
                <span class="text-4xl">📊</span>
                <span class="font-bold text-[#5d4037] text-sm uppercase">Xuất Excel<br>(DS Bệnh nhân)</span>
            </div>
            <div onclick="window.exportFullDataExcel()" class="p-4 border border-[#d7ccc8] rounded-xl text-center cursor-pointer hover:bg-[#efebe9] transition-colors bg-white shadow-sm flex flex-col items-center justify-center gap-2 h-32">
                <span class="text-4xl">📑</span>
                <span class="font-bold text-[#5d4037] text-sm uppercase">Xuất Excel<br>(Chi tiết khám)</span>
            </div>
            <div onclick="window.exportToJSON()" class="p-4 border border-blue-200 rounded-xl text-center cursor-pointer hover:bg-blue-50 transition-colors bg-white shadow-sm flex flex-col items-center justify-center gap-2 h-32">
                <span class="text-4xl">💾</span>
                <span class="font-bold text-blue-800 text-sm uppercase">Sao lưu dữ liệu<br>(File .JSON)</span>
            </div>
            <div onclick="window.importFromJSON()" class="p-4 border border-green-200 rounded-xl text-center cursor-pointer hover:bg-green-50 transition-colors bg-white shadow-sm flex flex-col items-center justify-center gap-2 h-32">
                <span class="text-4xl">🔄</span>
                <span class="font-bold text-green-800 text-sm uppercase">Khôi phục dữ liệu<br>(Từ file)</span>
            </div>
        </div>
        <div class="modal-footer p-4 bg-[#f2ebe0] border-t border-[#d7ccc8] text-center">
            <button onclick="window.closeModals()" class="btn-glass w-full">Đóng</button>
        </div>
    </div>
</div>

<div id="diseaseModal" class="modal" style="z-index: 2200;">
    <div class="modal-box w-full max-w-2xl h-[95vh] flex flex-col bg-[#fffcf7]">
        <div class="modal-header bg-[#f2ebe0] border-b border-[#d7ccc8]">
            <h2 id="diseaseModalTitle" class="font-bold text-xl text-[#3e2723]">Thêm bệnh mới</h2>
            <button onclick="window.closeDiseaseModal()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        
        <div class="modal-body flex-1 overflow-y-auto p-5 space-y-5">
            <input type="hidden" id="diseaseEditIndex">
            
            <div class="space-y-3">
                <div>
                    <label class="song-label">Tên bệnh</label>
                    <input type="text" id="diseaseName" class="song-input ipad-input-fix font-bold text-[#5d4037]" placeholder="Nhập tên bệnh...">
                </div>
                <div>
                    <label class="song-label">Triệu chứng & Ghi chú</label>
                    <textarea id="diseaseSymptoms" class="song-input h-24 ipad-input-fix" placeholder="Mô tả triệu chứng thường gặp..."></textarea>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-3 rounded-xl border border-[#d7ccc8] shadow-sm flex flex-col h-full">
                    <h3 class="font-bold text-[#3e2723] mb-2 uppercase text-sm border-b pb-1">Đông Y (Thang)</h3>
                    
                    <div class="mb-2">
                        <input type="text" id="diseaseEastName" class="song-input text-sm mb-2 font-bold text-center" placeholder="Tên bài thuốc (Vd: Bài 1)">
                    </div>

                    <div id="eastIngredientsContainer" class="flex-1 space-y-1 overflow-y-auto max-h-60 p-1 bg-gray-50 rounded mb-2"></div>
                    
                    <button onclick="window.addEastIngredient()" class="btn-glass w-full py-2 text-sm text-[#5d4037]">+ Thêm vị thuốc</button>
                </div>

                <div class="bg-white p-3 rounded-xl border border-blue-200 shadow-sm flex flex-col h-full">
                    <h3 class="font-bold text-blue-900 mb-2 uppercase text-sm border-b border-blue-100 pb-1">Tây Y / Thành phẩm</h3>
                    
                    <div id="westMedicinesContainer" class="flex-1 space-y-1 overflow-y-auto max-h-60 p-1 bg-blue-50 rounded mb-2"></div>
                    
                    <button onclick="window.addWestMedicine()" class="btn-glass w-full py-2 text-sm text-blue-800">+ Thêm thuốc</button>
                </div>
            </div>
        </div>
        
        <div class="modal-footer border-t border-[#d7ccc8] p-3 flex justify-end gap-2 bg-[#f2ebe0]">
            <button onclick="window.closeDiseaseModal()" class="px-4 py-2 bg-gray-200 rounded text-gray-700 font-bold">Hủy</button>
            <button onclick="window.saveDisease()" class="px-6 py-2 btn-primary">Lưu Thay Đổi</button>
        </div>
    </div>
</div>
`;
