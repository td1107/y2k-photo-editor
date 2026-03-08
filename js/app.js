// ==========================================
// ส่วนเชื่อมต่อ UI และปุ่มทั้งหมด (App Initialization)
// ==========================================
import { 
    initUpload, initSliders, initDownload, 
    setCurrentFilter, renderFilter, 
    btnCompare, originalImage, downloadBtn 
} from './core.js';

// เปิดใช้งานระบบหลัก
initUpload();
initSliders();
initDownload();

// ระบบปุ่ม Compare (ดู Before/After)
if (btnCompare) {
    const displayCanvas = document.getElementById('photoCanvas');
    const ctx = displayCanvas.getContext('2d');
    
    const showOriginal = (e) => {
        e.preventDefault(); 
        if (!originalImage) return;
        ctx.drawImage(originalImage, 0, 0, displayCanvas.width, displayCanvas.height);
    };
    const hideOriginal = (e) => { e.preventDefault(); renderFilter(); };

    btnCompare.addEventListener('mousedown', showOriginal);
    btnCompare.addEventListener('mouseup', hideOriginal);
    btnCompare.addEventListener('mouseleave', hideOriginal);
    btnCompare.addEventListener('touchstart', showOriginal);
    btnCompare.addEventListener('touchend', hideOriginal);
}

// ระบบจับคู่ปุ่มฟิลเตอร์
const buttons = document.querySelectorAll('.filter-btn');

function setActiveButton(clickedBtn) {
    if(!buttons) return;
    buttons.forEach(btn => btn.classList.remove('active'));
    if(clickedBtn) clickedBtn.classList.add('active');
}

function bindFilter(btnId, filterName) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', () => {
            setCurrentFilter(filterName); 
            renderFilter();                 
            setActiveButton(btn);           
        });
    }
}

// จับคู่ปุ่มทั้งหมด (ชื่อปุ่ม HTML -> ชื่อฟังก์ชันใน filters.js)
bindFilter('btnNormal', 'applyNormal');
bindFilter('btnHalftoneBW', 'applyHalftoneBW');
bindFilter('btnHalftoneColor', 'applyHalftoneColor');

// Magazine Covers
bindFilter('btnCoverArt', 'applyCoverArt');
bindFilter('btnTeenVogue', 'applyTeenVogueCover');
bindFilter('btnBazaar', 'applyBazaar');
bindFilter('btnElle', 'applyElle');
bindFilter('btnGq', 'applyGq');
bindFilter('btnDazed', 'applyDazed');
bindFilter('btnNylon', 'applyNylon');
bindFilter('btnVogue', 'applyVogue');

// Y2K & Experimental
bindFilter('btnCyber', 'applyCyberNeon');
bindFilter('btnVivid', 'applyVividStreetwear');
bindFilter('btnMotion', 'applyMotionEditorial');
bindFilter('btnAvantGarde', 'applyAvantGarde');
bindFilter('btnDigicam', 'applyDigicam');
bindFilter('btnAvantBlue', 'applyAvantBlue');
bindFilter('btnStreetNature', 'applyStreetNature');

// Classic Film
bindFilter('btnDreamy90s', 'applyDreamy90s');
bindFilter('btnBW', 'applyBW400');
bindFilter('btnVintage', 'applyVintage');
bindFilter('btnCinematic', 'applyCinematic');
bindFilter('btnRetro', 'applyRetro');
bindFilter('btnBlur', 'applyBlur');

// Sports
bindFilter('btnSnowMotion', 'applySnowMotion');
bindFilter('btnGlacier', 'applyGlacierTone');
bindFilter('btnOlympic', 'applyOlympicDramatic');

// Real Film Stocks
bindFilter('btnColorPlus', 'applyColorPlus');
bindFilter('btnUltramax', 'applyUltramax');
bindFilter('btnFujiC200', 'applyFujiC200');
bindFilter('btnPortra', 'applyPortra');
bindFilter('btnLomo800', 'applyLomo800');
bindFilter('btnIlford', 'applyIlfordPan');

// รีเซ็ตปุ่ม ORIGINAL ให้ Active เป็นค่าเริ่มต้นเมื่อโหลดเว็บ
const btnNormal = document.getElementById('btnNormal');
if (btnNormal) setActiveButton(btnNormal);