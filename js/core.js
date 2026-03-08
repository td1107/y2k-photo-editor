// ==========================================
// ระบบสมองกลหลัก (Core System)
// ==========================================
import * as Filters from './filters.js';

const uploadInput = document.getElementById('imageUpload');
const displayCanvas = document.getElementById('photoCanvas');
const displayCtx = displayCanvas.getContext('2d', { willReadFrequently: true });
const placeholder = document.getElementById('placeholder');
export const downloadBtn = document.getElementById('downloadBtn');
export const btnCompare = document.getElementById('btnCompare');

export const brightnessSlider = document.getElementById('brightnessSlider');
export const blurSlider = document.getElementById('blurSlider');
export const grainSlider = document.getElementById('grainSlider');
export const textureSlider = document.getElementById('textureSlider');
const brightnessValue = document.getElementById('brightnessValue');
const blurValue = document.getElementById('blurValue');
const grainValue = document.getElementById('grainValue');
const textureValue = document.getElementById('textureValue');

let canvas = displayCanvas;
let ctx = displayCtx;
export let originalImage = null;
const MAX_PREVIEW_SIZE = 1080;

let currentFilterName = 'applyNormal';
let isRendering = false;
let tempCanvas = document.createElement('canvas');
let tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

// นำเข้าข้อมูลการอัปโหลดไฟล์
export function initUpload() {
    uploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                originalImage = img; 
                let scale = 1;
                if (img.width > MAX_PREVIEW_SIZE || img.height > MAX_PREVIEW_SIZE) {
                    scale = Math.min(MAX_PREVIEW_SIZE / img.width, MAX_PREVIEW_SIZE / img.height);
                }
                displayCanvas.width = img.width * scale;
                displayCanvas.height = img.height * scale;
                
                if (placeholder) placeholder.style.display = 'none';
                displayCanvas.style.display = 'block';
                if (downloadBtn) downloadBtn.disabled = false;
                if (btnCompare) btnCompare.disabled = false; 
                
                resetSliders();
                setCurrentFilter('applyNormal');
                renderFilter();
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    });
}

function resetSliders() {
    if(brightnessSlider) { brightnessSlider.value = 0; brightnessValue.innerText = "0"; }
    if(blurSlider) { blurSlider.value = 0; blurValue.innerText = "0"; }
    if(grainSlider) { grainSlider.value = 0; grainValue.innerText = "0"; }
    if(textureSlider) { textureSlider.value = 0; textureValue.innerText = "0"; }
}

export function setCurrentFilter(name) {
    currentFilterName = name;
}

// ระบบเลื่อน Slider
export function initSliders() {
    const triggerRender = () => { if (!isRendering) renderFilter(); };
    if (brightnessSlider) brightnessSlider.addEventListener('input', triggerRender);
    if (blurSlider) blurSlider.addEventListener('input', triggerRender);
    if (grainSlider) grainSlider.addEventListener('input', triggerRender);
    if (textureSlider) textureSlider.addEventListener('input', triggerRender);
    
    const halftoneColorPicker = document.getElementById('halftoneColorPicker');
    if (halftoneColorPicker) {
        halftoneColorPicker.addEventListener('input', () => {
            Filters.setHalftoneColor(halftoneColorPicker.value);
            if (currentFilterName === 'applyHalftoneColor') triggerRender();
        });
    }
}

// ประมวลผล Brightness, Blur, Grain และ Dust & Scratches
function applyAdjustments() {
    let bValue = brightnessSlider ? parseInt(brightnessSlider.value) : 0;
    let blurVal = blurSlider ? parseInt(blurSlider.value) : 0;
    let gValue = grainSlider ? parseInt(grainSlider.value) : 0;
    let tValue = textureSlider ? parseInt(textureSlider.value) : 0; // รับค่า Texture

    // อัปเดตตัวเลข UI ทันที
    if(brightnessValue) brightnessValue.innerText = bValue > 0 ? "+" + bValue : bValue;
    if(blurValue) blurValue.innerText = blurVal;
    if(grainValue) grainValue.innerText = gValue;
    if(textureValue) textureValue.innerText = tValue;

    if (bValue !== 0 || gValue > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i] + bValue, g = data[i+1] + bValue, b = data[i+2] + bValue;
            if (gValue > 0) {
                let noise = (Math.random() - 0.5) * (gValue * 1.5);
                r += noise; g += noise; b += noise;
            }
            data[i] = Math.min(255, Math.max(0, r));
            data[i+1] = Math.min(255, Math.max(0, g));
            data[i+2] = Math.min(255, Math.max(0, b));
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // วาดรอยฝุ่นและรอยขีดข่วน (Procedural Dust & Scratches)
    if (tValue > 0) {
        // ใช้โหมด Screen เพื่อให้ฝุ่นสีขาวลอยสว่างทับภาพ
        ctx.globalCompositeOperation = 'screen';
        
        // คำนวณจำนวนรอยขีดข่วนตามขนาดภาพและความเข้มข้นของ Slider
        const area = canvas.width * canvas.height;
        const scratchCount = Math.floor((area / 50000) * (tValue / 10));
        const dustCount = scratchCount * 5;

        // วาดรอยขีดข่วนยาวๆ แรนดอม
        for(let i = 0; i < scratchCount; i++) {
            ctx.beginPath();
            let startX = Math.random() * canvas.width;
            let startY = Math.random() * canvas.height;
            ctx.moveTo(startX, startY);
            // ให้รอยขีดข่วนยาวและเบี้ยวเล็กน้อย
            ctx.lineTo(startX + (Math.random() - 0.5) * 200, startY + (Math.random() - 0.5) * 200);
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.4 * (tValue/100)})`;
            ctx.lineWidth = Math.random() * 1.5;
            ctx.stroke();
        }

        // วาดเม็ดฝุ่นเล็ก/ใหญ่ แรนดอม
        for(let i = 0; i < dustCount; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 * (tValue/100)})`;
            ctx.fill();
        }
        
        ctx.globalCompositeOperation = 'source-over'; // คืนค่าโหมดวาดรูปปกติ
    }

    if (blurVal > 0) {
        if (tempCanvas.width !== canvas.width || tempCanvas.height !== canvas.height) {
            tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
        }
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);
        ctx.filter = `blur(${blurVal}px)`;
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.filter = 'none'; 
    }
}

export function renderFilter() {
    if (!originalImage) return;
    isRendering = true;
    requestAnimationFrame(() => {
        // ส่งข้อมูล Canvas ล่าสุดไปให้ไฟล์ Filters ประมวลผล
        Filters.syncState(canvas, ctx, originalImage);
        
        // รันฟิลเตอร์ที่เลือกไว้
        if(typeof Filters[currentFilterName] === 'function') {
            Filters[currentFilterName]();
        }
        
        applyAdjustments();
        
        
        isRendering = false; 
    });
}

// ระบบดาวน์โหลดไฟล์แบบคมชัด (HQ PNG Export)
export function initDownload() {
    if(!downloadBtn) return;
    downloadBtn.addEventListener('click', function() {
        if (!originalImage) return; 
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = "PROCESSING HQ...";
        downloadBtn.disabled = true;

        setTimeout(() => {
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = originalImage.width; exportCanvas.height = originalImage.height;
            const exportCtx = exportCanvas.getContext('2d');

            // สลับไปวาดลงผ้าใบใหญ่ชั่วคราว
            canvas = exportCanvas; ctx = exportCtx;
            Filters.syncState(canvas, ctx, originalImage);
            if(typeof Filters[currentFilterName] === 'function') Filters[currentFilterName]();
            applyAdjustments(); 

            const link = document.createElement('a');
            link.download = 'cyber-vogue-hq.png'; 
            link.href = canvas.toDataURL('image/png'); 
            link.click();

            // คืนค่ากลับมาเป็นจอพรีวิว
            canvas = displayCanvas; ctx = displayCtx;
            downloadBtn.innerText = originalText; downloadBtn.disabled = false;
        }, 100);
    });
}