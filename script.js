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
// คอลเลกชันจำลองฟิล์มของจริง (Real Film Stocks)
// ==========================================

// 1. Kodak ColorPlus 200 (สีโทนอุ่น คลาสสิก ติดเหลือง/แดง)
function applyColorPlus() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 15; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        r = r * 1.1 + 15; // ดันแดงและเหลืองให้ดูอุ่น
        g = g * 1.05 + 10;
        b = b * 0.9 - 10; // ลดน้ำเงินลง
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

// 2. Kodak Ultramax 400 (สีสดใส คอนทราสต์ดี ถ่ายได้ทุกสถานการณ์)
function applyUltramax() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 25; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        r = r * 1.15; // เร่งความสดใสของสี
        g = g * 1.1;
        b = b * 1.15; // ให้ท้องฟ้าสีฟ้าชัดเจน
        
        let noise = (Math.random() - 0.5) * 15; // เกรนบางๆ ISO 400
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128 + noise));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128 + noise));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128 + noise));
    }
    ctx.putImageData(imageData, 0, 0);
}

// 3. Fujifilm Fujicolor C200 (สีสด เขียวสวย อมฟ้านิดๆ สไตล์ฟูจิ)
function applyFujiC200() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 20; 
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        r = r * 0.95; // ดรอปแดงลงนิดหน่อย
        g = g * 1.15 + 10; // ดันสีเขียวให้เด่น (เอกลักษณ์ของฟูจิ)
        b = b * 1.05;
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

// 4. Kodak Portra 400 (นุ่มนวล คอนทราสต์ต่ำ สีผิว Portrait สวย)
function applyPortra() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 5; // คอนทราสต์ต่ำ ให้ภาพดูละมุน ไม่แข็ง
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        r = r * 1.05 + 5; // อมชมพู/ส้ม สุขภาพดี
        g = g * 1.02;
        b = b * 0.95;
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }
    ctx.putImageData(imageData, 0, 0);
}

// 5. Lomography 800 (จัดจ้าน โทนภาพยนตร์ เกรนชัด)
function applyLomo800() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 35; // คอนทราสต์ดุเดือดสไตล์ Cinematic
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        r = r * 1.15;
        g = g * 1.05;
        b = b * 1.1; // ดันน้ำเงิน/แดง ให้มีกลิ่นอาย Magenta นิดๆ
        
        let noise = (Math.random() - 0.5) * 25; // เกรนเม็ดใหญ่ ISO 800
        data[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128 + noise));
        data[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128 + noise));
        data[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128 + noise));
    }
    ctx.putImageData(imageData, 0, 0);
}

// 6. Ilford Pan 400 (ขาวดำยอดนิยม คอนทราสต์จัด เกรนสวย)
function applyIlfordPan() {
    if (!originalImage) return;
    applyNormal();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let contrast = 45; // คอนทราสต์หนักๆ ขาวเป็นขาว ดำเป็นดำ
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let gray = (r * 0.3) + (g * 0.59) + (b * 0.11);
        gray = factor * (gray - 128) + 128;
        
        let noise = (Math.random() - 0.5) * 20; // เกรนขาวดำ ISO 400
        gray += noise;
        
        data[i] = data[i+1] = data[i+2] = Math.min(255, Math.max(0, gray));
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


