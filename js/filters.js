// ==========================================
// คลังแสงสูตรฟิลเตอร์ภาพ (Filters Logic)
// ==========================================
export let canvas, ctx, originalImage;

// ฟังก์ชันสำหรับรับค่าจาก core.js เพื่อซิงค์ Canvas ให้ตรงกันเสมอ
export function syncState(c, cx, img) {
    canvas = c;
    ctx = cx;
    originalImage = img;
}

// ตัวแปรสีสำหรับ Halftone (ค่าเริ่มต้น)
export let halftoneColor = '#00f0ff';
export function setHalftoneColor(color) { halftoneColor = color; }

// --- ฟังก์ชันผู้ช่วยสร้างกิมมิค ---
function applyVignette(intensity = 0.5) {
    let gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.4,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
}

function applyLightLeak() {
    let gradient = ctx.createLinearGradient(0, 0, canvas.width * 0.4, canvas.height * 0.3);
    gradient.addColorStop(0, 'rgba(255, 60, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
}

function applyDateStamp() {
    ctx.fillStyle = '#ff5722';
    let fontSize = Math.max(20, canvas.width * 0.03); 
    ctx.font = `bold ${fontSize}px "Courier New", monospace`;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 8;
    ctx.fillText("'98 10 23", canvas.width - (fontSize * 6.5), canvas.height - (fontSize * 1.5));
    ctx.shadowBlur = 0; 
}

// --- ฟิลเตอร์หลัก ---
export function applyNormal() {
    if (!originalImage) return;
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
}

export function applyBW400() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        let factor = (259 * (30 + 255)) / (255 * (259 - 30));
        gray = factor * (gray - 128) + 128;
        gray += (Math.random() - 0.5) * 40; 
        data[i] = data[i+1] = data[i+2] = gray; 
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyVintage() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (10 + 255)) / (255 * (259 - 10));
    for (let i = 0; i < data.length; i += 4) {
        let r = (data[i] * 1.1) + 20, g = (data[i+1] * 1.05) + 10, b = (data[i+2] * 0.8) - 10;  
        r += (255 - r) * 0.08; g += (255 - g) * 0.08; b += (255 - b) * 0.08;
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyCinematic() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (25 + 255)) / (255 * (259 - 25));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);
        if (lum < 128) { r *= 0.9; g *= 1.05; b *= 1.2; } else { r *= 1.2; g *= 1.1; b *= 0.9; }
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyRetro() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (30 + 255)) / (255 * (259 - 30));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i] * 1.2 + 10, g = data[i+1] * 0.9, b = data[i+2] * 1.1 + 20;
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyDigicam() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] * 1.15 + 35));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] * 0.95 + 25));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] * 1.1 + 35));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyBlur() {
    applyNormal();
    ctx.filter = 'blur(6px)'; 
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none'; 
}

export function applyVogue() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (40 + 255)) / (255 * (259 - 40));
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        let r = (data[i] * 0.4) + (gray * 0.6), g = (data[i+1] * 0.4) + (gray * 0.6), b = (data[i+2] * 0.4) + (gray * 0.6);
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 135)); 
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px "Times New Roman", serif'; 
    ctx.fillText('VOGUE', canvas.width / 2 - 250, canvas.height / 2 + 30);
}

export function applyCoverArt() {
    applyNormal(); 
    ctx.filter = 'saturate(1.2) contrast(1.1) brightness(1.05) blur(1px)';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    ctx.fillStyle = 'white';
    ctx.font = 'bold italic 60px "Helvetica Neue", Arial, sans-serif'; 
    ctx.fillText('teen', canvas.width / 2 - 220, 100);
    ctx.font = 'bold 120px "Times New Roman", Times, serif'; 
    ctx.fillText('VOGUE', canvas.width / 2 - 80, 100);
    ctx.font = 'bold 70px "Brush Script MT", "Great Vibes", cursive'; 
    ctx.fillText('Alyssa Liv', 40, canvas.height - 60); 
}

export function applyTeenVogueCover() {
    applyNormal(); 
    const dotCount = Math.floor(canvas.width / 40);
    for(let i = 0; i < dotCount; i++) {
        const x = Math.random() * (canvas.width - 100) + 50; 
        const y = Math.random() * (canvas.height / 2.5) + 10;
        const radius = Math.random() * 20 + 5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = ['#ff5722', '#ffeb3b', '#2196f3', '#e91e63'][Math.floor(Math.random() * 4)];
        ctx.fill();
    }
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px "Helvetica Neue", Arial, sans-serif'; 
    ctx.fillText('teen', canvas.width / 2 - 140, 80);
    ctx.font = 'bold 70px "Times New Roman", Times, serif'; 
    ctx.fillText('VOGUE', canvas.width / 2 - 70, 80);
    ctx.font = 'bold 50px "Brush Script MT", "Great Vibes", cursive'; 
    ctx.fillText('Alyssa Liv', 40, canvas.height - 50); 
}

export function applyBazaar() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (50 + 255)) / (255 * (259 - 50));
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        data[i] = data[i+1] = data[i+2] = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 100px "Didot", "Playfair Display", serif'; 
    ctx.fillText('BAZAAR', canvas.width / 2 - 220, 120);
}

export function applyElle() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] * 1.1 + 20));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] * 1.05 + 10));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] * 1.1 + 15));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 130px "Helvetica Neue", Arial, sans-serif'; 
    ctx.fillText('ELLE', canvas.width / 2 - 160, 140);
}

export function applyGq() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (20 + 255)) / (255 * (259 - 20));
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        let r = (data[i] * 0.6) + (gray * 0.4) - 10, g = (data[i+1] * 0.6) + (gray * 0.4) - 10, b = (data[i+2] * 0.6) + (gray * 0.4) + 10; 
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = '#ff3333'; 
    ctx.font = 'bold 150px "Arial Black", sans-serif'; 
    ctx.fillText('GQ', 50, 150);
}

export function applyDazed() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (40 + 255)) / (255 * (259 - 40));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i] * 1.2, g = data[i+1] * 0.8, b = data[i+2] * 1.2; 
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 110px "Impact", sans-serif'; 
    ctx.fillText('DAZED', canvas.width / 2 - 180, 130);
}

export function applyNylon() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] * 1.2 + 10));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] * 1.1 + 10));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] * 1.3 + 20));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = '#ff007f'; 
    ctx.font = 'bold 120px "Arial Rounded MT Bold", sans-serif'; 
    ctx.fillText('NYLON', canvas.width / 2 - 200, 130);
}

export function applyDreamy90s() {
    applyNormal();
    ctx.filter = 'blur(1.5px) brightness(1.15) contrast(0.95)';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let noise = (Math.random() - 0.5) * 30;
        data[i] = Math.min(255, Math.max(0, data[i] + 15 + noise));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + 5 + noise));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + 10 + noise));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyMotionEditorial() {
    applyNormal();
    ctx.globalAlpha = 0.35; 
    ctx.drawImage(originalImage, 15, 0, canvas.width, canvas.height);  
    ctx.drawImage(originalImage, -15, 0, canvas.width, canvas.height); 
    ctx.globalAlpha = 1.0;  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (45 + 255)) / (255 * (259 - 45));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (data[i+1] - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (data[i+2] - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyVividStreetwear() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (35 + 255)) / (255 * (259 - 35));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i] * 1.15, g = data[i+1] * 1.1, b = data[i+2] * 1.35; 
        if (r > 150 || g > 150 || b > 150) { r += 15; g += 15; b += 10; }
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyCyberNeon() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (40 + 255)) / (255 * (259 - 40));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11); 
        if (lum < 90) { r *= 0.6; g *= 0.4; b *= 1.1; } else { r = r * 1.5 + 40; g *= 0.7; b = b * 1.4 + 40; }
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyAvantGarde() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (65 + 255)) / (255 * (259 - 65));
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        gray = factor * (gray - 128) + 128; 
        if (gray < 60) gray *= 0.7; if (gray > 200) gray *= 1.1;
        data[i] = data[i+1] = data[i+2] = Math.min(255, Math.max(0, gray));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyAvantBlue() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (60 + 255)) / (255 * (259 - 60));
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        gray = factor * (gray - 128) + 128; 
        if (gray < 60) gray *= 0.7; if (gray > 200) gray *= 1.1;
        data[i] = Math.min(255, Math.max(0, gray * 0.75));      
        data[i+1] = Math.min(255, Math.max(0, gray * 0.95));    
        data[i+2] = Math.min(255, Math.max(0, gray * 1.35));    
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyStreetNature() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (30 + 255)) / (255 * (259 - 30));
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        let r = (data[i] * 0.7) + (gray * 0.3), g = (data[i+1] * 0.7) + (gray * 0.3), b = (data[i+2] * 0.7) + (gray * 0.3);
        r = r * 1.05 + 5; g = g * 1.02 + 5; b = b * 0.95;
        if (r > 150 || g > 150) { r += 10; g += 10; }
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applySnowMotion() {
    applyNormal();
    ctx.globalAlpha = 0.2;
    ctx.drawImage(originalImage, 10, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, -10, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (40 + 255)) / (255 * (259 - 40));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (data[i+1] - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (data[i+2] - 128) + 128)) + 15; 
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyGlacierTone() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        let r = (data[i] * 0.3) + (gray * 0.7), g = (data[i+1] * 0.3) + (gray * 0.7), b = (data[i+2] * 0.3) + (gray * 0.7);
        data[i] = Math.min(255, Math.max(0, r * 0.85 + 10));
        data[i+1] = Math.min(255, Math.max(0, g * 1.05 + 10));
        data[i+2] = Math.min(255, Math.max(0, b * 1.25 + 10));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyOlympicDramatic() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (50 + 255)) / (255 * (259 - 50));
    for (let i = 0; i < data.length; i += 4) {
        let r = factor * (data[i] - 128) + 128, g = factor * (data[i+1] - 128) + 128, b = factor * (data[i+2] - 128) + 128;
        if (r < 80) r *= 0.75; if (g < 80) g *= 0.75; if (b < 80) b *= 0.75;
        if (r > 170) r *= 1.15; if (g > 170) g *= 1.15; if (b > 170) b *= 1.15;
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        data[i] = Math.min(255, Math.max(0, (r * 0.85) + (gray * 0.15)));
        data[i+1] = Math.min(255, Math.max(0, (g * 0.85) + (gray * 0.15)));
        data[i+2] = Math.min(255, Math.max(0, (b * 0.85) + (gray * 0.15)));
    }
    ctx.putImageData(imageData, 0, 0);
}

export function applyColorPlus() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (15 + 255)) / (255 * (259 - 15));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);
        if (lum < 128) { r += (128 - lum) * 0.15; g += (128 - lum) * 0.05; }
        r = r * 1.05 + 10; g = g * 1.02 + 5; b = b * 0.95 - 5; 
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    applyDateStamp();
}

export function applyUltramax() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (25 + 255)) / (255 * (259 - 25));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);
        if (lum > 200) { r += (lum - 200) * 1.2; }
        let noise = (Math.random() - 0.5) * 15;
        data[i] = Math.min(255, Math.max(0, factor * (r * 1.15 - 128) + 128 + noise));
        data[i+1] = Math.min(255, Math.max(0, factor * (g * 1.1 - 128) + 128 + noise));
        data[i+2] = Math.min(255, Math.max(0, factor * (b * 1.15 - 128) + 128 + noise));
    }
    ctx.putImageData(imageData, 0, 0);
    applyVignette(0.35);
}

export function applyFujiC200() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (20 + 255)) / (255 * (259 - 20));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);
        if (lum < 128) { g += (128 - lum) * 0.2; b += (128 - lum) * 0.15; }
        data[i] = Math.min(255, Math.max(0, factor * (r * 0.95 - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g * 1.10 + 5 - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b * 1.05 - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    applyLightLeak();
    applyVignette(0.4);
}

export function applyPortra() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (5 + 255)) / (255 * (259 - 5));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);
        if (lum > 210) { r += (lum - 210) * 0.8; g += (lum - 210) * 0.3; }
        if (lum < 100) { r += 10; g += 10; b += 10; }
        data[i] = Math.min(255, Math.max(0, factor * (r * 1.05 + 5 - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g * 1.02 - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b * 0.95 - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    applyVignette(0.2);
}

export function applyLomo800() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (35 + 255)) / (255 * (259 - 35));
    for (let i = 0; i < data.length; i += 4) {
        let noise = (Math.random() - 0.5) * 30; 
        data[i] = Math.min(255, Math.max(0, factor * (data[i] * 1.15 - 128) + 128 + noise));
        data[i+1] = Math.min(255, Math.max(0, factor * (data[i+1] * 0.95 - 128) + 128 + noise));
        data[i+2] = Math.min(255, Math.max(0, factor * (data[i+2] * 1.1 - 128) + 128 + noise));
    }
    ctx.putImageData(imageData, 0, 0);
    applyLightLeak();
    applyVignette(0.65);
}

export function applyIlfordPan() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (45 + 255)) / (255 * (259 - 45));
    for (let i = 0; i < data.length; i += 4) {
        let gray = factor * (((data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11)) - 128) + 128;
        let noise = (Math.random() - 0.5) * 20; 
        let tintR = gray, tintB = gray;
        if (gray < 120) { tintR += 5; tintB -= 5; }
        data[i] = Math.min(255, Math.max(0, tintR + noise));
        data[i+1] = Math.min(255, Math.max(0, gray + noise));
        data[i+2] = Math.min(255, Math.max(0, tintB + noise));
    }
    ctx.putImageData(imageData, 0, 0);
    applyVignette(0.7);
}

function renderHalftone(dotColor) {
    applyNormal(); 
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    ctx.fillStyle = '#ffffff'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = dotColor;
    const gridSize = Math.max(4, Math.floor(canvas.width / 150)); 
    const maxRadius = gridSize * 0.7; 

    for (let y = 0; y < canvas.height; y += gridSize) {
        for (let x = 0; x < canvas.width; x += gridSize) {
            let i = (y * canvas.width + x) * 4;
            let lum = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
            let radius = (1 - (lum / 255)) * maxRadius; 
            if (radius > 0.5) {
                ctx.beginPath();
                ctx.arc(x + gridSize/2, y + gridSize/2, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

export function applyHalftoneBW() { renderHalftone('#000000'); }

export function applyHalftoneColor() { renderHalftone(halftoneColor); }

// ==========================================
// คอลเลกชันใหม่: GLITCH & LOW_RES
// ==========================================

// 1. Low Quality (เว็บแคมยุค 2000s / กล้องมือถือฝาพับ แบบสมจริง)
export function applyLowQuality() {
    applyNormal();
    const w = canvas.width;
    const h = canvas.height;
    
    // สเตป 1: จำลองเลนส์พลาสติกราคาถูก (ภาพจะมัวและซอฟต์ลง แต่ไม่แตกเป็นบล็อก)
    // ใช้วิธีย่อขนาดภาพลงแล้วขยายกลับ โดยเปิด Smoothing ให้มันเบลอฟุ้งๆ
    const scale = 0.35; 
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w * scale;
    tempCanvas.height = h * scale;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(originalImage, 0, 0, tempCanvas.width, tempCanvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'low';
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, w, h);

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    // สเตป 2: ลดคอนทราสต์ให้ภาพแบนๆ และใส่ Color Noise (นอยส์สี)
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];

        // ลดคอนทราสต์ให้ภาพดูจืดและหมองลง
        r = (r - 128) * 0.85 + 128 + 15;
        g = (g - 128) * 0.85 + 128 + 10;
        b = (b - 128) * 0.85 + 128 + 5;

        // Chroma Noise: สุ่มจุดสีเพี้ยน (แดง เขียว น้ำเงิน) แบบกล้องคุณภาพต่ำ
        let noiseR = (Math.random() - 0.5) * 35;
        let noiseG = (Math.random() - 0.5) * 35;
        let noiseB = (Math.random() - 0.5) * 35;

        data[i] = Math.min(255, Math.max(0, r + noiseR));
        data[i+1] = Math.min(255, Math.max(0, g + noiseG));
        data[i+2] = Math.min(255, Math.max(0, b + noiseB));
    }
    ctx.putImageData(imageData, 0, 0);

    // สเตป 3: Vertical Sensor Banding (วาดเส้นริ้วแนวตั้งจางๆ ซ้อนทับ)
    // เลียนแบบข้อผิดพลาดของเซ็นเซอร์กล้องดิจิทัลยุคเก่า
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // เส้นริ้วสีดำจางๆ
    for (let x = 0; x < w; x += 2) {
        if (Math.random() > 0.4) {
            ctx.fillRect(x, 0, 1, h);
        }
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'; // เส้นริ้วสีขาวจางๆ
    for (let x = 1; x < w; x += 3) {
        if (Math.random() > 0.6) {
            ctx.fillRect(x, 0, 1, h);
        }
    }
}

// 2. Aerochrome (ฟิล์มอินฟราเรด เปลี่ยนสีเขียวเป็นสีชมพู/แดง)
export function applyAerochrome() {
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        
        // สมการสลับสี: เอาสีเขียวมาดันให้กลายเป็นสีแดง/ชมพู
        let newR = (g * 1.5) + (r * 0.2); 
        let newG = (r * 0.5) + (g * 0.2);
        let newB = b * 0.9;
        
        data[i] = Math.min(255, newR);
        data[i+1] = Math.min(255, newG);
        data[i+2] = Math.min(255, newB);
    }
    ctx.putImageData(imageData, 0, 0);
}

// 3. CRT Glitch (สีเหลื่อม + จอทีวีแก้ว)
export function applyCRT() {
    applyNormal();
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const outputData = ctx.createImageData(w, h);
    const out = outputData.data;

    // คำนวณระยะการเหลื่อมของสี (Chromatic Aberration)
    const offset = Math.floor(w * 0.006) * 4; 

    for (let i = 0; i < data.length; i += 4) {
        // ดึงสีแดงจากพิกเซลทางซ้าย
        out[i] = data[i - offset] !== undefined ? data[i - offset] : data[i];
        // สีเขียวอยู่ที่เดิม
        out[i+1] = data[i+1];
        // ดึงสีน้ำเงินจากพิกเซลทางขวา
        out[i+2] = data[i + offset] !== undefined ? data[i + offset] : data[i+2];
        out[i+3] = 255;
    }
    ctx.putImageData(outputData, 0, 0);

    // วาดเส้นสแกนไลน์ (Scanlines) แนวนอน
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
    }
}

// 4. Dreamcore (ออร่าฟุ้ง แสงสว่างจ้า)
export function applyDreamcore() {
    applyNormal();
    
    // สเตป 1: ดึงคอนทราสต์และสีให้ฉ่ำ
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (20 + 255)) / (255 * (259 - 20));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i] * 1.1, g = data[i+1] * 1.05, b = data[i+2] * 1.15;
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);

    // สเตป 2: ก๊อปปี้ภาพเดิมมาทำเบลอหนักๆ แล้วซ้อนทับด้วยโหมด Screen (เกิดแสงเรืองรอง Bloom)
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = 'blur(15px) opacity(0.7)';
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    
    // เคลียร์ค่ากลับเป็นปกติ
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';
}
