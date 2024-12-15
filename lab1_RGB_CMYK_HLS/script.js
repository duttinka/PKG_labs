
// Функции для конвертации между моделями

function rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    c = ((c - k) / (1 - k)) || 0;
    m = ((m - k) / (1 - k)) || 0;
    y = ((y - k) / (1 - k)) || 0;

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

function cmykToRgb(c, m, y, k) {
    let r = 255 * (1 - c / 100) * (1 - k / 100);
    let g = 255 * (1 - m / 100) * (1 - k / 100);
    let b = 255 * (1 - y / 100) * (1 - k / 100);

    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    };
}

function rgbToHls(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

        if (max === r) {
            h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        } else if (max === g) {
            h = ((b - r) / delta + 2) * 60;
        } else {
            h = ((r - g) / delta + 4) * 60;
        }
    }

    return {
        h: Math.round(h),
        l: Math.round(l * 100) / 100,
        s: Math.round(s * 100) / 100
    };
}

function hlsToRgb(h, l, s) {
    h /= 360;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// Обновление цветного квадрата
function updateColorPreview(r, g, b) {
    document.getElementById('color-preview').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// Функции обновления моделей
function updateFromRgb() {
    const r = +document.getElementById('r').value;
    const g = +document.getElementById('g').value;
    const b = +document.getElementById('b').value;

    const cmyk = rgbToCmyk(r, g, b);
    const hls = rgbToHls(r, g, b);

    // Обновление CMYK
    document.getElementById('c').value = cmyk.c;
    document.getElementById('c-slider').value = cmyk.c;

    document.getElementById('m').value = cmyk.m;
    document.getElementById('m-slider').value = cmyk.m;

    document.getElementById('y').value = cmyk.y;
    document.getElementById('y-slider').value = cmyk.y;

    document.getElementById('k').value = cmyk.k;
    document.getElementById('k-slider').value = cmyk.k;

    // Обновление HLS
    document.getElementById('h').value = hls.h;
    document.getElementById('h-slider').value = hls.h;

    document.getElementById('l').value = hls.l;
    document.getElementById('l-slider').value = hls.l;

    document.getElementById('s').value = hls.s;
    document.getElementById('s-slider').value = hls.s;

    updateColorPreview(r, g, b);
}

function updateFromCmyk() {
    const c = +document.getElementById('c').value;
    const m = +document.getElementById('m').value;
    const y = +document.getElementById('y').value;
    const k = +document.getElementById('k').value;

    const { r, g, b } = cmykToRgb(c, m, y, k);

    document.getElementById('r').value = r;
    document.getElementById('r-slider').value = r;

    document.getElementById('g').value = g;
    document.getElementById('g-slider').value = g;

    document.getElementById('b').value = b;
    document.getElementById('b-slider').value = b;

    const hls = rgbToHls(r, g, b);

    document.getElementById('h').value = hls.h;
    document.getElementById('h-slider').value = hls.h;

    document.getElementById('l').value = hls.l;
    document.getElementById('l-slider').value = hls.l;

    document.getElementById('s').value = hls.s;
    document.getElementById('s-slider').value = hls.s;

    updateColorPreview(r, g, b);
}

function updateFromHls() {
    const h = +document.getElementById('h').value;
    const l = +document.getElementById('l').value;
    const s = +document.getElementById('s').value;

    const { r, g, b } = hlsToRgb(h, l, s);

    document.getElementById('r').value = r;
    document.getElementById('r-slider').value = r;

    document.getElementById('g').value = g;
    document.getElementById('g-slider').value = g;

    document.getElementById('b').value = b;
    document.getElementById('b-slider').value = b;

    const cmyk = rgbToCmyk(r, g, b);

    document.getElementById('c').value = cmyk.c;
    document.getElementById('c-slider').value = cmyk.c;

    document.getElementById('m').value = cmyk.m;
    document.getElementById('m-slider').value = cmyk.m;

    document.getElementById('y').value = cmyk.y;
    document.getElementById('y-slider').value = cmyk.y;

    document.getElementById('k').value = cmyk.k;
    document.getElementById('k-slider').value = cmyk.k;

    updateColorPreview(r, g, b);
}

// Связывание ползунков и полей ввода
function syncSlidersAndInputs(sliderId, inputId, callback) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);

    slider.addEventListener('input', () => {
        input.value = slider.value;
        callback();
    });

    input.addEventListener('input', () => {
        slider.value = input.value;
        callback();
    });
}

// Инициализация
function initializeSync() {
    // RGB
    syncSlidersAndInputs('r-slider', 'r', updateFromRgb);
    syncSlidersAndInputs('g-slider', 'g', updateFromRgb);
    syncSlidersAndInputs('b-slider', 'b', updateFromRgb);

    // CMYK
    syncSlidersAndInputs('c-slider', 'c', updateFromCmyk);
    syncSlidersAndInputs('m-slider', 'm', updateFromCmyk);
    syncSlidersAndInputs('y-slider', 'y', updateFromCmyk);
    syncSlidersAndInputs('k-slider', 'k', updateFromCmyk);

    // HLS
    syncSlidersAndInputs('h-slider', 'h', updateFromHls);
    syncSlidersAndInputs('l-slider', 'l', updateFromHls);
    syncSlidersAndInputs('s-slider', 's', updateFromHls);
}

initializeSync();
const colorPicker = document.getElementById('color-picker');

// Обработчик события изменения цвета через палитру
colorPicker.addEventListener('input', () => {
    // Получить выбранный цвет в формате HEX
    const hex = colorPicker.value;

    // Преобразовать HEX в RGB
    const { r, g, b } = hexToRgb(hex);

    // Обновить значения RGB
    document.getElementById('r').value = r;
    document.getElementById('r-slider').value = r;
    document.getElementById('g').value = g;
    document.getElementById('g-slider').value = g;
    document.getElementById('b').value = b;
    document.getElementById('b-slider').value = b;

    // Вызывать обновление RGB -> CMYK и HLS
    updateFromRgb();
});

// Функция преобразования HEX в RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}