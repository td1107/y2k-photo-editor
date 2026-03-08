const uploadInput = document.getElementById('imageUpload');
const canvas = document.getElementById('photoCanvas');
const ctx = canvas.getContext('2d');
const placeholder = document.getElementById('placeholder');
const downloadBtn = document.getElementById('downloadBtn');

let originalImage = null; 

uploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            
            if (placeholder) placeholder.style.display = 'none';
            canvas.style.display = 'block';
            if (downloadBtn) downloadBtn.disabled = false;
            
            originalImage = img; 
            
            // รีเซ็ต Slider ทุกครั้งที่อัปโหลดรูปใหม่
            if(brightnessSlider) brightnessSlider.value = 0;
            if(brightnessValue) brightnessValue.innerText = "0";
            
            ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
            currentFilterFunc = applyNormal; 
            setActiveButton(document.getElementById('btnNormal'));
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
});

// ==========================================
// ส่วนฟังก์ชันทำฟิลเตอร์ (Filters Logic)
// ==========================================

function applyNormal() {
    if (!originalImage) return;
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
}

function applyBW400() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        let contrast = 30; 
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        gray = factor * (gray - 128) + 128;
        let noise = (Math.random() - 0.5) * 40; 
        gray += noise;
        data[i] = gray; data[i + 1] = gray; data[i + 2] = gray; 
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyVintage() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        r = (r * 1.1) + 20; g = (g * 1.05) + 10; b = (b * 0.8) - 10;  
        let fadeLevel = 0.08; 
        r += (255 - r) * fadeLevel; g += (255 - g) * fadeLevel; b += (255 - b) * fadeLevel;
        let contrast = 10;
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        r = factor * (r - 128) + 128; g = factor * (g - 128) + 128; b = factor * (b - 128) + 128;
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyCinematic() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);
        if (lum < 128) { r = r * 0.9; g = g * 1.05; b = b * 1.2; } 
        else { r = r * 1.2; g = g * 1.1; b = b * 0.9; }
        let contrast = 25;
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        r = factor * (r - 128) + 128; g = factor * (g - 128) + 128; b = factor * (b - 128) + 128;
        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyRetro() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i]; let g = data[i + 1]; let b = data[i + 2];
        r = r * 1.2 + 10; g = g * 0.9; b = b * 1.1 + 20;
        let contrast = 30;
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyDigicam() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i]; let g = data[i + 1]; let b = data[i + 2];
        r = r * 1.15 + 15; g = g * 0.95 + 5; b = b * 1.1 + 15; 
        let brightness = 20;
        data[i] = Math.min(255, Math.max(0, r + brightness));
        data[i + 1] = Math.min(255, Math.max(0, g + brightness));
        data[i + 2] = Math.min(255, Math.max(0, b + brightness));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyBlur() {
    if (!originalImage) return;
    applyNormal();
    ctx.filter = 'blur(6px)'; 
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none'; 
}

function applyVogue() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i]; let g = data[i + 1]; let b = data[i + 2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        r = (r * 0.4) + (gray * 0.6); g = (g * 0.4) + (gray * 0.6); b = (b * 0.4) + (gray * 0.6);
        let contrast = 40; 
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (b - 128) + 135)); 
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px "Times New Roman", serif'; 
    ctx.fillText('VOGUE', canvas.width / 2 - 250, canvas.height / 2 + 30);
}

function applyCoverArt() {
    if (!originalImage) return;
    applyNormal(); 

    ctx.filter = 'saturate(1.2) contrast(1.1) brightness(1.05) blur(1px)';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    ctx.fillStyle = 'white';
    ctx.font = 'bold italic 60px "Helvetica Neue", Arial, sans-serif'; 
    ctx.fillText('teen', canvas.width / 2 - 220, 100);
    ctx.font = 'bold 120px "Times New Roman", Times, serif'; 
    ctx.fillText('VOGUE', canvas.width / 2 - 80, 100);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 70px "Brush Script MT", "Great Vibes", cursive'; 
    ctx.fillText('Alyssa Liv', 40, canvas.height - 60); // อัปเดตให้ตรงกับรูปภาพเป๊ะๆ แล้วครับ
}

function applyTeenVogueCover() {
    if (!originalImage) return;
    applyNormal(); 

    for(let i = 0; i < 15; i++) {
        const x = Math.random() * (canvas.width - 100) + 50; 
        const y = Math.random() * (canvas.height / 2.5) + 10;
        const radius = Math.random() * 20 + 5;
        const color = ['#ff5722', '#ffeb3b', '#2196f3', '#e91e63'][Math.floor(Math.random() * 4)];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px "Helvetica Neue", Arial, sans-serif'; 
    ctx.fillText('teen', canvas.width / 2 - 140, 80);
    ctx.font = 'bold 70px "Times New Roman", Times, serif'; 
    ctx.fillText('VOGUE', canvas.width / 2 - 70, 80);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 50px "Brush Script MT", "Great Vibes", cursive'; 
    ctx.fillText('Alyssa Liv', 40, canvas.height - 50); // อัปเดตลายเซ็นต์ให้ด้วยครับ
}

function applyBazaar() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let gray = (data[i] * 0.3) + (data[i+1] * 0.59) + (data[i+2] * 0.11);
        let contrast = 50; 
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        gray = factor * (gray - 128) + 128;
        data[i] = data[i+1] = data[i+2] = Math.min(255, Math.max(0, gray));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 100px "Didot", "Playfair Display", serif'; 
    ctx.fillText('BAZAAR', canvas.width / 2 - 220, 120);
}

function applyElle() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        r = r * 1.1 + 20; g = g * 1.05 + 10; b = b * 1.1 + 15; 
        data[i] = Math.min(255, Math.max(0, r));
        data[i+1] = Math.min(255, Math.max(0, g));
        data[i+2] = Math.min(255, Math.max(0, b));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 130px "Helvetica Neue", Arial, sans-serif'; 
    ctx.fillText('ELLE', canvas.width / 2 - 160, 140);
}

function applyGq() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        r = (r * 0.6) + (gray * 0.4) - 10;
        g = (g * 0.6) + (gray * 0.4) - 10;
        b = (b * 0.6) + (gray * 0.4) + 10; 
        let contrast = 20; 
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = '#ff3333'; 
    ctx.font = 'bold 150px "Arial Black", sans-serif'; 
    ctx.fillText('GQ', 50, 150);
}

function applyDazed() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        r = r * 1.2; g = g * 0.8; b = b * 1.2; 
        let contrast = 40; 
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 110px "Impact", sans-serif'; 
    ctx.fillText('DAZED', canvas.width / 2 - 180, 130);
}

function applyNylon() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        r = r * 1.2 + 10; g = g * 1.1 + 10; b = b * 1.3 + 20; 
        data[i] = Math.min(255, Math.max(0, r));
        data[i+1] = Math.min(255, Math.max(0, g));
        data[i+2] = Math.min(255, Math.max(0, b));
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fillStyle = '#ff007f'; 
    ctx.font = 'bold 120px "Arial Rounded MT Bold", sans-serif'; 
    ctx.fillText('NYLON', canvas.width / 2 - 200, 130);
}

function applyDreamy90s() {
    if (!originalImage) return;
    applyNormal();
    ctx.filter = 'blur(1.5px) brightness(1.15) contrast(0.95)';
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + 15);     
        data[i+1] = Math.min(255, data[i+1] + 5);  
        data[i+2] = Math.min(255, data[i+2] + 10); 
        let noise = (Math.random() - 0.5) * 30;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyMotionEditorial() {
    if (!originalImage) return;
    applyNormal();
    ctx.globalAlpha = 0.35; 
    ctx.drawImage(originalImage, 15, 0, canvas.width, canvas.height);  
    ctx.drawImage(originalImage, -15, 0, canvas.width, canvas.height); 
    ctx.globalAlpha = 1.0;  

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 45; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (data[i+1] - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (data[i+2] - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyVividStreetwear() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 35; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        r = r * 1.15; g = g * 1.1; b = b * 1.35; 
        if (r > 150 || g > 150 || b > 150) {
            r += 15; g += 15; b += 10;
        }
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyCyberNeon() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 40; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11); 
        if (lum < 90) {
            r = r * 0.6; g = g * 0.4; b = b * 1.1;
        } else {
            r = r * 1.5 + 40; g = g * 0.7; b = b * 1.4 + 40;
        }
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyAvantGarde() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 65; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        gray = factor * (gray - 128) + 128; 
        if (gray < 60) gray *= 0.7;
        if (gray > 200) gray *= 1.1;
        data[i] = data[i+1] = data[i+2] = Math.min(255, Math.max(0, gray));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyAvantBlue() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 60; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        gray = factor * (gray - 128) + 128; 
        if (gray < 60) gray *= 0.7;
        if (gray > 200) gray *= 1.1;
        data[i] = Math.min(255, Math.max(0, gray * 0.75));      
        data[i+1] = Math.min(255, Math.max(0, gray * 0.95));    
        data[i+2] = Math.min(255, Math.max(0, gray * 1.35));    
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyStreetNature() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 30; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        r = (r * 0.7) + (gray * 0.3);
        g = (g * 0.7) + (gray * 0.3);
        b = (b * 0.7) + (gray * 0.3);
        r = r * 1.05 + 5;
        g = g * 1.02 + 5;
        b = b * 0.95;
        if (r > 150 || g > 150) { r += 10; g += 10; }
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applySnowMotion() {
    if (!originalImage) return;
    applyNormal();
    ctx.globalAlpha = 0.2;
    ctx.drawImage(originalImage, 10, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, -10, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 40; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128)) + 15; 
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyGlacierTone() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        r = (r * 0.3) + (gray * 0.7);
        g = (g * 0.3) + (gray * 0.7);
        b = (b * 0.3) + (gray * 0.7);
        r = r * 0.85;       
        g = g * 1.05;       
        b = b * 1.25;       
        data[i] = Math.min(255, Math.max(0, r + 10));
        data[i+1] = Math.min(255, Math.max(0, g + 10));
        data[i+2] = Math.min(255, Math.max(0, b + 10));
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyOlympicDramatic() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 50; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;
        if (r < 80) r *= 0.75;
        if (g < 80) g *= 0.75;
        if (b < 80) b *= 0.75;
        if (r > 170) r *= 1.15;
        if (g > 170) g *= 1.15;
        if (b > 170) b *= 1.15;
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        r = (r * 0.85) + (gray * 0.15);
        g = (g * 0.85) + (gray * 0.15);
        b = (b * 0.85) + (gray * 0.15);
        data[i] = Math.min(255, Math.max(0, r));
        data[i+1] = Math.min(255, Math.max(0, g));
        data[i+2] = Math.min(255, Math.max(0, b));
    }
    ctx.putImageData(imageData, 0, 0);
}



// ==========================================
// ระบบ Slider ปรับความสว่าง (รวมการทำงานทับกับฟิลเตอร์)
// ==========================================
let currentFilterFunc = applyNormal; 

const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');

function renderFilter() {
    if (!originalImage) return;

    // รันฟิลเตอร์ที่เลือกไว้ก่อน เพื่อให้ภาพเซ็ตกลับเป็นตั้งต้นของโทนนั้นๆ
    currentFilterFunc();

    // ดึงค่าสว่างจาก Slider (ถ้าไม่มีใน HTML ให้ข้ามไป)
    if (!brightnessSlider || !brightnessValue) return;
    
    let bValue = parseInt(brightnessSlider.value);
    brightnessValue.innerText = bValue > 0 ? "+" + bValue : bValue;

    if (bValue === 0) return; 

    // ปรับความสว่างทับลงไป
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + bValue));     
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + bValue)); 
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + bValue)); 
    }
    ctx.putImageData(imageData, 0, 0);
}

if (brightnessSlider) {
    brightnessSlider.addEventListener('input', renderFilter);
}

// ==========================================
// ส่วนผูกปุ่มทั้งหมด (รวบยอดให้สั้นลงและฉลาดขึ้น)
// ==========================================
const buttons = document.querySelectorAll('.filter-btn');

function setActiveButton(clickedBtn) {
    if(!buttons) return;
    buttons.forEach(btn => btn.classList.remove('active'));
    if(clickedBtn) clickedBtn.classList.add('active');
}

// ฟังก์ชันสำหรับผูกปุ่มเข้ากับฟิลเตอร์
function bindFilter(btnId, filterFunc) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', () => {
            currentFilterFunc = filterFunc; 
            if (brightnessSlider) brightnessSlider.value = 0;     
            renderFilter();                 
            setActiveButton(btn);           
        });
    }
}

// ==========================================
// ฟังก์ชันผู้ช่วย: สร้างกิมมิคกล้องฟิล์ม (Film Imperfections)
// ==========================================

// 1. ขอบมืดของเลนส์ (Organic Vignette)
// ให้อารมณ์เหมือนเลนส์มือหมุนคลาสสิกตอนเปิดรูรับแสงกว้างสุด
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
    ctx.globalCompositeOperation = 'source-over'; // คืนค่าเดิม
}

// 2. แสงรั่วสีส้มแดง (Light Leaks)
// เหมือนฝาหลังกล้องปิดไม่สนิท แสงเลยแอบเลียแผ่นฟิล์ม
function applyLightLeak() {
    let gradient = ctx.createLinearGradient(0, 0, canvas.width * 0.4, canvas.height * 0.3);
    gradient.addColorStop(0, 'rgba(255, 60, 0, 0.4)'); // สีส้มแดงจัดๆ
    gradient.addColorStop(1, 'rgba(255, 60, 0, 0)');   // จางหายไป
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
}

// 3. วันที่มุมภาพ (Retro Date Stamp)
// ฟอนต์ดิจิทัลสีส้มเจาะรู เอกลักษณ์กล้องคอมแพคยุค 90s
function applyDateStamp() {
    ctx.fillStyle = '#ff5722'; // สีส้มเรืองแสง
    // ปรับขนาดฟอนต์ตามขนาดรูปภาพ
    let fontSize = Math.max(20, canvas.width * 0.03); 
    ctx.font = `bold ${fontSize}px "Courier New", monospace`;
    
    // ใส่เงาฟุ้งเรืองแสงให้ตัวหนังสือ
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 8;
    
    // พิมพ์วันที่สไตล์ยุค 90s (ปี เดือน วัน)
    ctx.fillText("'98 10 23", canvas.width - (fontSize * 6.5), canvas.height - (fontSize * 1.5));
    ctx.shadowBlur = 0; // ล้างค่าเงาออก
}


// ==========================================
// คอลเลกชันจำลองฟิล์มของจริง (อัปเกรด 4 เทคนิคพิเศษ)
// ==========================================

// 1. Kodak ColorPlus 200 (+ Split Toning โทนอุ่น และวันที่)
function applyColorPlus() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (15 + 255)) / (255 * (259 - 15));

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);

        // Split Toning: ส่วนเงามืดจะดันสีส้ม/แดงเข้าไป
        if (lum < 128) {
            r += (128 - lum) * 0.15;
            g += (128 - lum) * 0.05;
        }

        r = r * 1.05 + 10; 
        g = g * 1.02 + 5;
        b = b * 0.95 - 5; 
        
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    
    // เพิ่มวันที่ที่มุมล่างขวา
    applyDateStamp();
}

// 2. Kodak Ultramax 400 (+ Halation แสงส้มฟุ้ง และ ขอบมืด)
function applyUltramax() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (25 + 255)) / (255 * (259 - 25));

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);

        // Halation Effect: แสงสว่างจ้าๆ จะมีสีแดงส้มบวมออกมา
        if (lum > 200) {
            r += (lum - 200) * 1.2; 
        }

        r *= 1.15; g *= 1.1; b *= 1.15; 
        let noise = (Math.random() - 0.5) * 15;
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128 + noise));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128 + noise));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128 + noise));
    }
    ctx.putImageData(imageData, 0, 0);
    
    // ใส่ขอบมืดเบาๆ
    applyVignette(0.35);
}

// 3. Fujifilm Fujicolor C200 (+ Split Toning เงาอมเขียวไซอัน และ แสงรั่ว)
function applyFujiC200() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (20 + 255)) / (255 * (259 - 20));

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);

        // Split Toning: เอกลักษณ์ฟูจิ เงาต้องอมเขียวอมฟ้า (Cyan/Green)
        if (lum < 128) {
            g += (128 - lum) * 0.2;
            b += (128 - lum) * 0.15;
        }

        r = r * 0.95; 
        g = g * 1.10 + 5; 
        b = b * 1.05;
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    
    // เพิ่มแสงรั่วสีส้มที่มุมซ้ายบน และขอบมืด
    applyLightLeak();
    applyVignette(0.4);
}

// 4. Kodak Portra 400 (+ Halation นุ่มๆ และผิวสุขภาพดี)
function applyPortra() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (5 + 255)) / (255 * (259 - 5));

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let lum = (r * 0.3) + (g * 0.59) + (b * 0.11);

        // Halation แบบละมุนๆ สำหรับพอร์เทรต
        if (lum > 210) {
            r += (lum - 210) * 0.8;
            g += (lum - 210) * 0.3; // อมส้มนิดๆ
        }

        // ดันความสว่างในส่วนมืด (Lifted Shadows) ให้ภาพซอฟต์
        if (lum < 100) {
            r += 10; g += 10; b += 10;
        }

        r = r * 1.05 + 5; g = g * 1.02; b = b * 0.95;
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
    applyVignette(0.2); // ขอบมืดบางมากๆ
}

// 5. Lomography 800 (จัดเต็ม! แสงรั่วหนัก + ขอบมืดชัด + สีเพี้ยน)
function applyLomo800() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (35 + 255)) / (255 * (259 - 35));

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        
        // Color Shift (สีเพี้ยนแนว Magenta/Yellow)
        r = r * 1.15;
        g = g * 0.95; // ดรอปเขียวลง
        b = b * 1.1; 
        
        let noise = (Math.random() - 0.5) * 30; // เกรนหยาบๆ
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128 + noise));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128 + noise));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128 + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    // ใส่ให้ครบสูตรความฮิปสเตอร์
    applyLightLeak();
    applyVignette(0.65);
}

// 6. Ilford Pan 400 (+ ขาวดำ Split Tone อุ่นๆ และขอบมืดดุๆ)
function applyIlfordPan() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let factor = (259 * (45 + 255)) / (255 * (259 - 45));

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        gray = factor * (gray - 128) + 128;
        
        let noise = (Math.random() - 0.5) * 20; 
        
        // Split Tone ขาวดำ: ให้เงามืดอมน้ำตาลอุ่นๆ (Sepia/Selenium) นิดๆ
        let tintR = gray, tintG = gray, tintB = gray;
        if (gray < 120) {
            tintR += 5; // เติมแดง
            tintB -= 5; // ลดน้ำเงิน
        }
        
        data[i] = Math.min(255, Math.max(0, tintR + noise));
        data[i+1] = Math.min(255, Math.max(0, tintG + noise));
        data[i+2] = Math.min(255, Math.max(0, tintB + noise));
    }
    ctx.putImageData(imageData, 0, 0);
    
    // ขอบมืดขับให้ภาพขาวดำดูขลังขึ้น
    applyVignette(0.7);
}

// ผูกปุ่มทั้งหมดที่เพิ่มมาตั้งแต่ต้นจนถึงล่าสุด
bindFilter('btnNormal', applyNormal);
bindFilter('btnCoverArt', applyCoverArt);
bindFilter('btnTeenVogue', applyTeenVogueCover);
bindFilter('btnBazaar', applyBazaar);
bindFilter('btnElle', applyElle);
bindFilter('btnGq', applyGq);
bindFilter('btnDazed', applyDazed);
bindFilter('btnNylon', applyNylon);
bindFilter('btnVogue', applyVogue);
bindFilter('btnCyber', applyCyberNeon);
bindFilter('btnVivid', applyVividStreetwear);
bindFilter('btnMotion', applyMotionEditorial);
bindFilter('btnAvantGarde', applyAvantGarde);
bindFilter('btnDigicam', applyDigicam);
bindFilter('btnAvantBlue', applyAvantBlue);
bindFilter('btnStreetNature', applyStreetNature);
bindFilter('btnDreamy90s', applyDreamy90s);
bindFilter('btnBW', applyBW400);
bindFilter('btnVintage', applyVintage);
bindFilter('btnCinematic', applyCinematic);
bindFilter('btnRetro', applyRetro);
bindFilter('btnBlur', applyBlur);
bindFilter('btnSnowMotion', applySnowMotion);
bindFilter('btnGlacier', applyGlacierTone);
bindFilter('btnOlympic', applyOlympicDramatic);
bindFilter('btnColorPlus', applyColorPlus);
bindFilter('btnUltramax', applyUltramax);
bindFilter('btnFujiC200', applyFujiC200);
bindFilter('btnPortra', applyPortra);
bindFilter('btnLomo800', applyLomo800);
bindFilter('btnIlford', applyIlfordPan);
// ระบบดาวน์โหลด
if(downloadBtn) {
    downloadBtn.addEventListener('click', function() {
        if (!originalImage) return; 
        const link = document.createElement('a');
        link.download = 'cyber-vogue-photo.jpg'; 
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    });

}




