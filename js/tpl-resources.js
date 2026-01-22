/**
 * FILE: js/tpl-resources.js
 * CHỨC NĂNG: Chứa mã HTML của các công cụ tra cứu, báo cáo và đồng hồ sinh học.
 * CẬP NHẬT: Chèn cứng 3 kim ảnh vào Template Đồng hồ (Fix lỗi không hiện kim).
 */

window.TPL_RESOURCES = `
<div id="analyticsModal" class="modal">
    <div class="modal-box w-full max-w-4xl h-[90vh] flex flex-col">
        <div class="modal-header">
            <h2 class="font-bold text-xl uppercase">Báo Cáo</h2>
            <button onclick="window.closeModals()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        <div class="modal-body flex-1 overflow-y-auto p-4">
            <div class="flex flex-wrap gap-2 mb-4">
                <select id="anaTimeFilter" onchange="window.renderAnalytics()" class="song-input w-32">
                    <option value="today">Hôm nay</option>
                    <option value="month" selected>Tháng này</option>
                    <option value="all">Tất cả</option>
                </select>
                <select id="anaSortBy" onchange="window.renderAnalytics()" class="song-input w-40">
                    <option value="date_desc">📅 Mới nhất</option>
                    <option value="total_desc">💰 Doanh thu</option>
                </select>
                <button onclick="window.exportToExcel()" class="btn-glass text-green-700 px-4">Excel</button>
            </div>
            <div class="h-64 mb-4 border rounded-xl p-2 bg-white">
                <canvas id="analyticsChart"></canvas>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 text-left text-xs uppercase text-gray-500">
                            <th class="p-2">Ngày</th>
                            <th class="p-2">Tên</th>
                            <th class="p-2">Tuổi</th>
                            <th class="p-2">Bệnh</th>
                            <th class="p-2 text-center">TT</th>
                            <th class="p-2 text-right">Tổng</th>
                            <th class="p-2 text-right">Lãi</th>
                        </tr>
                    </thead>
                    <tbody id="anaTableBody"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div id="acupointModal" class="modal">
    <div class="modal-box w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden bg-[#fdfbf7]">
        <div class="modal-header bg-[#efebe9] border-b border-[#d7ccc8]">
            <div class="flex items-center gap-2">
                <span class="text-2xl">📍</span>
                <div>
                    <h2 class="font-bold text-lg text-[#3e2723] uppercase">Tra Cứu & Chọn Huyệt</h2>
                    <p class="text-[10px] text-[#5d4037] italic" id="acuHeaderSubtitle">AI hỗ trợ tìm kiếm • <span id="acuTimeSuggestion" class="text-red-600 font-bold"></span></p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="window.refreshAiSuggestion()" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-bold border border-yellow-200 shadow-sm hover:bg-yellow-200 flex items-center gap-1">✨ AI Phân Tích Lại</button>
                <button onclick="document.getElementById('acupointModal').classList.remove('active')" class="text-2xl text-gray-500 hover:text-red-500">&times;</button>
            </div>
        </div>
        
        <div class="flex-1 flex overflow-hidden">
            <div class="w-1/3 md:w-1/4 bg-[#faf8f5] border-r border-[#eee] flex flex-col">
                <div class="p-2 border-b border-[#eee]">
                    <input type="text" id="acuSearchInput" onkeyup="window.filterAcupoints()" placeholder="🔍 Tìm tên huyệt..." class="w-full px-3 py-2 rounded-lg border border-[#d7ccc8] text-sm bg-white focus:outline-none focus:border-[#8d6e63]">
                </div>
                <div class="overflow-y-auto flex-1 p-2 space-y-1" id="acuSidebar"></div>
            </div>

            <div class="flex-1 bg-white p-4 overflow-y-auto relative">
                <h3 id="acuCurrentCategory" class="font-bold text-[#3e2723] border-b border-dashed border-[#d7ccc8] pb-2 mb-4 sticky top-0 bg-white z-10">Tất cả huyệt</h3>
                <div id="acuContent" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-10"></div>
            </div>
        </div>
        
        <div class="modal-footer bg-white border-t border-[#eee] justify-end">
            <button onclick="document.getElementById('acupointModal').classList.remove('active')" class="btn-primary px-8 py-2">Đóng & Chọn Xong</button>
        </div>
    </div>
</div>

<div id="herbModal" class="modal">
    <div class="modal-box w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden bg-[#fdfbf7]">
        <div class="modal-header bg-[#fff8e1] border-b border-[#ffe082]">
            <div class="flex items-center gap-2">
                <span class="text-2xl">🌿</span>
                <div>
                    <h2 class="font-bold text-lg text-[#f57f17] uppercase">Kho Dược Liệu</h2>
                    <p class="text-[10px] text-[#f9a825] italic">AI gợi ý gia giảm theo chứng</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="window.refreshAiSuggestion()" class="px-3 py-1 bg-white text-[#f57f17] rounded-lg text-xs font-bold border border-[#ffe082] shadow-sm hover:bg-[#fffde7] flex items-center gap-1">✨ AI Phân Tích</button>
                <button onclick="document.getElementById('herbModal').classList.remove('active')" class="text-2xl text-gray-500 hover:text-red-500">&times;</button>
            </div>
        </div>
        
        <div class="flex-1 flex overflow-hidden">
            <div class="w-1/3 md:w-1/4 bg-[#fffde7] border-r border-[#ffe082] flex flex-col">
                <div class="p-2 border-b border-[#ffe082]">
                    <input type="text" id="herbSearchInput" onkeyup="window.filterHerbs()" placeholder="🔍 Tìm vị thuốc..." class="w-full px-3 py-2 rounded-lg border border-[#ffe082] text-sm bg-white focus:outline-none focus:border-[#f57f17]">
                </div>
                <div class="overflow-y-auto flex-1 p-2 space-y-1" id="herbSidebar"></div>
            </div>

            <div class="flex-1 bg-white p-4 overflow-y-auto relative">
                <h3 id="herbCurrentCategory" class="font-bold text-[#f57f17] border-b border-dashed border-[#ffe082] pb-2 mb-4 sticky top-0 bg-white z-10">Tất cả vị thuốc</h3>
                <div id="herbContent" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-10"></div>
            </div>
        </div>
        
        <div class="modal-footer bg-white border-t border-[#eee] justify-end">
            <button onclick="document.getElementById('herbModal').classList.remove('active')" class="btn-primary px-8 py-2">Đóng</button>
        </div>
    </div>
</div>

<div id="bioClockModal" class="modal bio-modal-backdrop">
    <div class="bio-modal-container">
        <button onclick="window.closeModals()" class="bio-close-btn">&times;</button>
        
        <div class="bio-clock-wrapper">
            <div class="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]">
                <img src="images/clock_bg.png" class="absolute top-0 left-0 w-full h-full object-cover rounded-full" style="z-index: 1;">
                
                <svg class="absolute top-0 left-0 w-full h-full pointer-events-none" style="z-index: 2;" viewBox="0 0 500 500">
                    <g id="clockOverlayGroup" transform="translate(250,250)"></g>
                </svg>

                <img id="handHour" src="images/hand_hour.png" class="clock-hand" alt="H">
                <img id="handMinute" src="images/hand_minute.png" class="clock-hand" alt="M">
                <img id="handSecond" src="images/hand_second.png" class="clock-hand" alt="S">
                <div class="clock-center-dot"></div>
            </div>
        </div>

        <div class="bio-info-card">
            <h2 class="text-xl md:text-2xl font-bold text-[#ffecb3] uppercase mb-1 font-serif text-center tracking-widest">Dưỡng Sinh Theo Giờ</h2>
            <div class="w-16 h-0.5 bg-[#ffecb3] mx-auto mb-3 opacity-50"></div>
            
            <div class="text-center space-y-1">
                <span class="text-3xl font-black text-white block mb-1" id="clockCurrentTime">--:--</span>
                <span class="text-lg text-[#ffcc80] font-bold block" id="clockZoneName">Đang tải...</span>
                <p class="text-sm md:text-base text-gray-200 italic leading-relaxed px-4" id="clockAdvice">...</p>
            </div>
        </div>
    </div>
</div>
`;
