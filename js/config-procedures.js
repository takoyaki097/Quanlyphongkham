/**
 * FILE: js/config-procedures.js
 * CHỨC NĂNG: Quản lý Cấu hình Thủ thuật (Dịch vụ) và Tứ chẩn (Vọng/Văn/Vấn/Thiết).
 * PHỤ THUỘC: window.config (từ config-core.js)
 */

// ============================================================
// 1. QUẢN LÝ THỦ THUẬT (PROCEDURES)
// ============================================================

window.renderProcSettings = function() { 
    const l = document.getElementById('procList'); 
    if(!l) return; 
    
    if(!window.config.procs || window.config.procs.length === 0) {
        l.innerHTML = '<div class="text-center text-gray-400 text-xs italic py-2">Chưa có thủ thuật nào</div>';
        return;
    }

    l.innerHTML = window.config.procs.map((p,i)=>`
        <div class="flex justify-between items-center p-3 border rounded bg-white mb-1 shadow-sm">
            <div class="text-sm font-bold text-[#5d4037]">${p.name} 
                <span class="font-normal text-gray-400 ml-1">(${(p.price||0).toLocaleString()}đ)</span>
            </div>
            <button onclick="window.deleteProc(${i})" class="text-xs px-2 py-1 bg-red-50 rounded text-red-600 hover:bg-red-100 font-bold">Xóa</button>
        </div>`).join(''); 
};

window.addProc = async function() { 
    const n = document.getElementById('newProcName').value.trim(); 
    const p = parseInt(document.getElementById('newProcPrice').value); 
    
    if(n && !isNaN(p)) { 
        // Thêm vào mảng
        window.config.procs.push({name: n, price: p}); 
        
        // Reset input
        document.getElementById('newProcName').value = ''; 
        document.getElementById('newProcPrice').value = ''; 
        
        // Render lại và Lưu
        window.renderProcSettings(); 
        if(window.saveConfig) await window.saveConfig(); 
    } else {
        alert("Vui lòng nhập tên và giá thủ thuật hợp lệ.");
    }
};

window.deleteProc = async function(i) { 
    if(confirm('Bạn có chắc muốn xóa thủ thuật này?')) { 
        window.config.procs.splice(i,1); 
        window.renderProcSettings(); 
        if(window.saveConfig) await window.saveConfig(); 
    } 
};

// ============================================================
// 2. QUẢN LÝ TỨ CHẨN (FOUR EXAMINATIONS CONFIG)
// ============================================================

window.renderTuChanConfig = function() { 
    // Các key tương ứng với cấu trúc dữ liệu trong window.config.tuChan
    const keys = ['vong', 'van', 'vanhoi', 'thiet', 'thietchan', 'machchan'];
    
    keys.forEach(k => { 
        const c = document.getElementById('setting_list_'+k); 
        if(!c) return; 
        
        const items = window.config.tuChan[k] || [];
        
        if(items.length === 0) {
            c.innerHTML = '<div class="text-xs text-gray-400 italic">Chưa có dữ liệu</div>';
        } else {
            c.innerHTML = items.map((v,i)=>`
                <div class="flex justify-between items-center bg-gray-50 p-2 mb-1 rounded border border-gray-100 group hover:bg-white hover:border-[#d7ccc8] transition-colors">
                    <span class="text-sm text-gray-700">${v}</span>
                    <button onclick="window.deleteTuChanItem('${k}',${i})" class="text-xs text-gray-400 hover:text-red-500 font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>`).join(''); 
        }
    }); 
};

window.addTuChanItem = async function(k) { 
    const i = document.getElementById('setting_new_'+k); 
    const v = i.value.trim(); 
    
    if(!v) return; 
    
    // Đảm bảo mảng tồn tại
    if(!window.config.tuChan[k]) window.config.tuChan[k] = []; 
    
    // Thêm và Lưu
    window.config.tuChan[k].push(v); 
    if(window.saveConfig) await window.saveConfig(); 
    
    // Reset input & Render
    i.value = ''; 
    window.renderTuChanConfig(); 
};

window.deleteTuChanItem = async function(k,i) { 
    if(confirm('Xóa mục này?')){ 
        window.config.tuChan[k].splice(i,1); 
        if(window.saveConfig) await window.saveConfig(); 
        window.renderTuChanConfig(); 
    } 
};
