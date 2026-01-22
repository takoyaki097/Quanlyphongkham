/**
 * FILE: js/tpl-patient.js
 * CHỨC NĂNG: Chứa mã HTML của giao diện Hồ sơ (pModal) và Lịch sử (hModal)
 */

window.TPL_PATIENT = `
<div id="pModal" class="modal">
    <div class="modal-box w-full max-w-md">
        <div class="modal-header">
            <h2 class="font-bold text-xl text-[#3e2723]">Hồ Sơ</h2>
            <button onclick="window.closeModals()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        <div class="modal-body space-y-4">
            <input type="hidden" id="pEditId">
            <div>
                <label class="song-label">Họ Tên *</label>
                <input type="text" id="pName" class="song-input ipad-input-fix" placeholder="Nhập họ tên">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="song-label">Năm sinh</label>
                    <input type="text" id="pYear" class="med-input-large" readonly onclick="window.openNumberPad && window.openNumberPad('pYear', 'Năm sinh', '1900-2024', 1990)">
                </div>
                <div>
                    <label class="song-label">SĐT</label>
                    <input type="text" id="pPhone" class="med-input-large" readonly onclick="window.openPhonePad && window.openPhonePad()">
                </div>
            </div>
            <div>
                <label class="song-label">Địa chỉ</label>
                <input type="text" id="pAddress" class="song-input ipad-input-fix" placeholder="Địa chỉ">
            </div>
        </div>
        <div class="modal-footer">
            <button onclick="window.closeModals()" class="btn-glass">Hủy</button>
            <button onclick="window.savePatient()" class="btn-primary">Lưu</button>
        </div>
    </div>
</div>

<div id="hModal" class="modal">
    <div class="modal-box max-w-lg h-[80vh] flex flex-col">
        <div class="modal-header">
            <h2 class="font-bold text-xl serif">Lịch sử: <span id="hName"></span></h2>
            <button onclick="window.closeModals()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        <div id="hContent" class="modal-body flex-1 overflow-y-auto space-y-3 p-4">
            </div>
    </div>
</div>
`;
