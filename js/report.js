/**
 * FILE: report.js
 * CHỨC NĂNG: Thống kê, Báo cáo, Vẽ biểu đồ, Xuất/Nhập dữ liệu (Excel/JSON).
 * CẬP NHẬT: Tích hợp bộ lọc và sắp xếp đa chiều.
 */

// --- 1. BIẾN TOÀN CỤC CHO CHART ---
let myChart = null;

// --- 2. HÀM RENDER CHÍNH ---
window.openStats = function() {
    document.getElementById('analyticsModal').classList.add('active');
    window.renderAnalytics();
};

window.renderAnalytics = function() {
    if (!window.db) return;

    const filterType = document.getElementById('anaTimeFilter').value; // 'today', 'month', 'all'
    const sortType = document.getElementById('anaSortBy').value;       
    
    // BƯỚC 1: TÍNH TOÁN CHỈ SỐ BỆNH NHÂN (Để sort theo VIP hoặc Số lần khám)
    // Tạo map lưu thông tin tổng hợp của từng bệnh nhân
    const patientStats = {};
    window.db.forEach(p => {
        const visits = p.visits || [];
        const totalSpent = visits.reduce((sum, v) => sum + (v.total || 0), 0);
        patientStats[p.id] = {
            visitCount: visits.length,
            totalLifeTimeSpent: totalSpent
        };
    });

    // BƯỚC 2: GOM DỮ LIỆU CHUYẾN KHÁM (FLATTEN DATA)
    let allVisits = [];
    window.db.forEach(p => {
        if (p.visits && p.visits.length > 0) {
            p.visits.forEach(v => {
                allVisits.push({
                    ...v,
                    patientName: p.name,
                    patientYear: parseInt(p.year) || 0,
                    timestamp: new Date(v.date).getTime(),
                    // Gắn thêm thông tin thống kê của bệnh nhân vào từng chuyến khám để sort
                    pVisitCount: patientStats[p.id].visitCount,
                    pTotalSpent: patientStats[p.id].totalLifeTimeSpent
                });
            });
        }
    });

    // BƯỚC 3: LỌC DỮ LIỆU (FILTER THỜI GIAN)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStr = window.getLocalDate();

    let filteredVisits = allVisits.filter(v => {
        if (!v.date) return false;
        const vDate = new Date(v.date);
        
        if (filterType === 'today') {
            return v.date === todayStr;
        } else if (filterType === 'month') {
            return vDate.getMonth() === currentMonth && vDate.getFullYear() === currentYear;
        } else {
            return true; // 'all'
        }
    });

    // BƯỚC 4: SẮP XẾP DỮ LIỆU (SORTING LOGIC)
    filteredVisits.sort((a, b) => {
        switch (sortType) {
            case 'date_desc': 
                return b.timestamp - a.timestamp;
            case 'date_asc': 
                return a.timestamp - b.timestamp;
            
            case 'total_desc': 
                return b.total - a.total; // Doanh thu chuyến khám này
            case 'total_asc': 
                return a.total - b.total;

            case 'name_asc': 
                return a.patientName.localeCompare(b.patientName);
            case 'name_desc': 
                return b.patientName.localeCompare(a.patientName);

            case 'age_desc': 
                // Năm sinh nhỏ hơn = Tuổi cao hơn (Ưu tiên người già)
                // Xử lý trường hợp không có năm sinh (0) thì đẩy xuống cuối
                if (a.patientYear === 0) return 1;
                if (b.patientYear === 0) return -1;
                return a.patientYear - b.patientYear;
            
            case 'age_asc': 
                // Năm sinh lớn hơn = Tuổi nhỏ hơn (Ưu tiên người trẻ)
                return b.patientYear - a.patientYear;

            case 'visit_count_desc':
                // Ưu tiên người khám nhiều lần nhất lên đầu
                return b.pVisitCount - a.pVisitCount;

            case 'patient_total_desc':
                // Ưu tiên khách VIP (Tổng chi tiêu trọn đời cao nhất)
                return b.pTotalSpent - a.pTotalSpent;

            default: 
                return b.timestamp - a.timestamp;
        }
    });

    // BƯỚC 5: HIỂN THỊ
    window.renderAnalyticsTable(filteredVisits);
    window.renderAnalyticsChart(filteredVisits, filterType);
};

// --- 3. RENDER BẢNG DỮ LIỆU ---
window.renderAnalyticsTable = function(visits) {
    const tbody = document.getElementById('anaTableBody');
    if (!tbody) return;

    let totalRevenue = 0;
    let totalProfit = 0;

    const html = visits.map(v => {
        const profit = (v.total || 0) - (v.cost || 0);
        totalRevenue += (v.total || 0);
        totalProfit += profit;

        // Logic hiển thị Badge VIP/Thân thiết
        let badge = '';
        if (v.pTotalSpent > 5000000) badge = '<span class="text-[9px] bg-yellow-100 text-yellow-700 px-1 rounded ml-1 border border-yellow-200">VIP</span>';
        else if (v.pVisitCount > 5) badge = '<span class="text-[9px] bg-blue-100 text-blue-700 px-1 rounded ml-1 border border-blue-200">Thân thiết</span>';

        return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="p-2 whitespace-nowrap text-gray-600 text-xs">${v.date}</td>
                <td class="p-2 font-bold text-[#3e2723]">
                    ${v.patientName} ${badge}
                </td>
                <td class="p-2 text-center text-gray-500">${v.patientYear || '-'}</td>
                <td class="p-2 text-gray-600 max-w-[150px] truncate text-xs" title="${v.disease}">${v.disease || ''}</td>
                <td class="p-2 text-center">
                    ${v.paid ? '<span class="text-green-600 font-bold">✓</span>' : '<span class="text-red-500 font-bold">✗</span>'}
                </td>
                <td class="p-2 text-right font-mono font-bold text-[#3e2723]">${(v.total || 0).toLocaleString()}</td>
                <td class="p-2 text-right font-mono text-green-700">${profit.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    // Hàng tổng cộng
    const footerRow = `
        <tr class="bg-[#f2ebe0] font-bold text-[#5d4037] border-t-2 border-[#d7ccc8]">
            <td class="p-2" colspan="5">TỔNG CỘNG (${visits.length} lượt)</td>
            <td class="p-2 text-right">${totalRevenue.toLocaleString()}</td>
            <td class="p-2 text-right">${totalProfit.toLocaleString()}</td>
        </tr>
    `;

    tbody.innerHTML = html + footerRow;
};

// --- 4. VẼ BIỂU ĐỒ (CHART.JS) ---
window.renderAnalyticsChart = function(visits, filterType) {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;

    // Chuẩn bị dữ liệu nhóm
    let labels = [];
    let dataRevenue = [];
    let dataProfit = [];
    let groupingMap = {};

    // Logic nhóm dữ liệu
    if (filterType === 'today') {
        // Hôm nay: Hiển thị Top các ca khám (để biểu đồ không bị rối nếu quá nhiều)
        // Chúng ta lấy tối đa 15 ca gần nhất (hoặc theo sort hiện tại)
        const chartData = visits.slice(0, 15); 
        chartData.forEach((v) => {
            labels.push(v.patientName);
            dataRevenue.push(v.total || 0);
            dataProfit.push((v.total || 0) - (v.cost || 0));
        });

    } else if (filterType === 'month') {
        // Theo Tháng: Nhóm theo Ngày (1-31)
        visits.forEach(v => {
            const day = parseInt(v.date.split('-')[2]); 
            if (!groupingMap[day]) groupingMap[day] = { rev: 0, prof: 0 };
            groupingMap[day].rev += (v.total || 0);
            groupingMap[day].prof += ((v.total || 0) - (v.cost || 0));
        });

        // Sort theo ngày tăng dần để biểu đồ hiển thị đúng trình tự thời gian
        Object.keys(groupingMap).sort((a,b) => a-b).forEach(day => {
            labels.push(`Ngày ${day}`);
            dataRevenue.push(groupingMap[day].rev);
            dataProfit.push(groupingMap[day].prof);
        });

    } else {
        // Tất cả: Nhóm theo Tháng (MM/YYYY)
        visits.forEach(v => {
            const dateParts = v.date.split('-');
            // Key format: YYYY-MM để sort cho dễ, lúc hiển thị thì đổi lại
            const key = `${dateParts[0]}-${dateParts[1]}`; 
            if (!groupingMap[key]) groupingMap[key] = { rev: 0, prof: 0 };
            groupingMap[key].rev += (v.total || 0);
            groupingMap[key].prof += ((v.total || 0) - (v.cost || 0));
        });

        // Sort theo key (YYYY-MM) tăng dần
        Object.keys(groupingMap).sort().forEach(key => {
            const [year, month] = key.split('-');
            labels.push(`T${month}/${year}`);
            dataRevenue.push(groupingMap[key].rev);
            dataProfit.push(groupingMap[key].prof);
        });
    }

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    data: dataRevenue,
                    backgroundColor: 'rgba(93, 64, 55, 0.7)',
                    borderColor: 'rgba(93, 64, 55, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Lợi nhuận',
                    data: dataProfit,
                    backgroundColor: 'rgba(121, 142, 135, 0.7)',
                    borderColor: 'rgba(121, 142, 135, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    hidden: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { family: "'Noto Sans', sans-serif" }, usePointStyle: true } },
                title: {
                    display: true,
                    text: filterType === 'today' ? 'Doanh thu Hôm nay (Top hiển thị)' : 
                          (filterType === 'month' ? 'Biểu đồ Doanh thu theo Ngày' : 'Biểu đồ Doanh thu theo Tháng'),
                    font: { family: "'Noto Serif', serif", size: 14 },
                    color: '#3e2723'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { callback: function(value) { return value.toLocaleString(); } }
                },
                x: { grid: { display: false } }
            }
        }
    });
};

// --- 5. CÔNG CỤ SAO LƯU & XUẤT FILE ---

window.exportToExcel = function() {
    if(!window.db) return;
    
    const filterType = document.getElementById('anaTimeFilter').value;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStr = window.getLocalDate();

    let data = [];
    
    window.db.forEach(p => {
        if(p.visits) {
            p.visits.forEach(v => {
                let include = false;
                const vDate = new Date(v.date);
                if (filterType === 'today' && v.date === todayStr) include = true;
                else if (filterType === 'month' && vDate.getMonth() === currentMonth && vDate.getFullYear() === currentYear) include = true;
                else if (filterType === 'all') include = true;

                if(include) {
                    data.push({
                        'Ngày': v.date,
                        'Họ Tên': p.name,
                        'Năm Sinh': p.year,
                        'SĐT': p.phone,
                        'Chẩn Đoán': v.disease,
                        'Tổng Tiền': v.total,
                        'Vốn': v.cost || 0,
                        'Lợi Nhuận': (v.total || 0) - (v.cost || 0),
                        'Trạng Thái': v.paid ? 'Đã thu' : 'Chưa thu'
                    });
                }
            });
        }
    });

    if(data.length === 0) { alert("Không có dữ liệu để xuất!"); return; }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BaoCao");
    XLSX.writeFile(wb, `BaoCao_YHCT_${window.getLocalDate()}.xlsx`);
};

window.exportFullDataExcel = function() {
    if(!window.db) return;
    let data = [];
    window.db.forEach(p => {
        const pInfo = { 'ID': p.id, 'Ten': p.name, 'NamSinh': p.year, 'SDT': p.phone, 'DiaChi': p.address };
        if(!p.visits || p.visits.length === 0) {
            data.push(pInfo);
        } else {
            p.visits.forEach(v => {
                data.push({
                    ...pInfo,
                    'NgayKham': v.date,
                    'ChanDoan': v.disease,
                    'TrieuChung': v.symptoms,
                    'TongTien': v.total,
                    'ThuocDongY': v.rxEast?.map(m=>`${m.name}(${m.qty}g)`).join(', '),
                    'ThuocTayY': v.rxWest?.map(m=>`${m.name}(${m.qty})`).join(', '),
                    'ThuThuat': v.procs?.map(k=>k.name).join(', ')
                });
            });
        }
    });
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data_Full");
    XLSX.writeFile(wb, `Data_Full_${window.getLocalDate()}.xlsx`);
};

window.exportToJSON = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ db: window.db, config: window.config }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "YHCT_Backup_" + window.getLocalDate() + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

window.openBackupModalDirect = function() {
    document.getElementById('backupModal').classList.add('active');
};

window.importFromJSON = function() {
    document.getElementById('jsonFileInput').click();
};

window.handleJSONFileSelect = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.db && Array.isArray(data.db)) {
                window.db = data.db;
                await localforage.setItem('patients', window.db);
            }
            if (data.config) {
                window.config = { ...window.config, ...data.config };
                await localforage.setItem('appConfig', window.config);
            }
            alert("Khôi phục dữ liệu thành công! Ứng dụng sẽ tải lại.");
            location.reload();
        } catch (err) {
            alert("Lỗi đọc file: " + err.message);
        }
    };
    reader.readAsText(file);
};
