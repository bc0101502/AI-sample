// ImageEase 画像処理ツール
let originalImage = null;
let currentImage = null;
const imageUpload = document.getElementById('image-upload');
const canvas = document.getElementById('image-canvas');
const ctx = canvas.getContext('2d');
const controlsSection = document.getElementById('controls-section');
const resizeWidth = document.getElementById('resize-width');
const resizeHeight = document.getElementById('resize-height');

function showControls(show) {
  controlsSection.style.display = show ? '' : 'none';
}

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImage = getImageData();
      currentImage = getImageData();
      resizeWidth.value = img.width;
      resizeHeight.value = img.height;
      showControls(true);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

function getImageData() {
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function setImageData(imgData) {
  ctx.putImageData(imgData, 0, 0);
  currentImage = getImageData();
}

// リサイズ
const resizeBtn = document.getElementById('resize-btn');
resizeBtn.addEventListener('click', () => {
  const w = parseInt(resizeWidth.value);
  const h = parseInt(resizeHeight.value);
  if (!w || !h || w < 1 || h < 1) {
    alert('正しい幅と高さを入力してください');
    return;
  }
  const tmp = document.createElement('canvas');
  tmp.width = w;
  tmp.height = h;
  tmp.getContext('2d').drawImage(canvas, 0, 0, w, h);
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(tmp, 0, 0);
  currentImage = getImageData();
});

// グレースケール
const grayscaleBtn = document.getElementById('grayscale-btn');
grayscaleBtn.addEventListener('click', () => {
  const imgData = getImageData();
  for (let i = 0; i < imgData.data.length; i += 4) {
    const avg = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3;
    imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = avg;
  }
  setImageData(imgData);
});

// ネガポジ反転
const invertBtn = document.getElementById('invert-btn');
invertBtn.addEventListener('click', () => {
  const imgData = getImageData();
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i];
    imgData.data[i+1] = 255 - imgData.data[i+1];
    imgData.data[i+2] = 255 - imgData.data[i+2];
  }
  setImageData(imgData);
});

// ぼかし
const blurBtn = document.getElementById('blur-btn');
blurBtn.addEventListener('click', () => {
  applyConvolution([
    1/9, 1/9, 1/9,
    1/9, 1/9, 1/9,
    1/9, 1/9, 1/9
  ]);
});

// シャープ
const sharpenBtn = document.getElementById('sharpen-btn');
sharpenBtn.addEventListener('click', () => {
  applyConvolution([
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ]);
});

function applyConvolution(kernel) {
  const w = canvas.width;
  const h = canvas.height;
  const src = getImageData();
  const dst = ctx.createImageData(w, h);
  for (let y = 1; y < h-1; y++) {
    for (let x = 1; x < w-1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let idx = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = ((y+ky)*w + (x+kx)) * 4 + c;
            sum += src.data[px] * kernel[idx++];
          }
        }
        dst.data[(y*w + x)*4 + c] = Math.min(255, Math.max(0, sum));
      }
      dst.data[(y*w + x)*4 + 3] = src.data[(y*w + x)*4 + 3];
    }
  }
  setImageData(dst);
}

// リセット
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => {
  if (originalImage) {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.putImageData(originalImage, 0, 0);
    currentImage = getImageData();
    resizeWidth.value = originalImage.width;
    resizeHeight.value = originalImage.height;
  }
});

// ダウンロード
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'imageease_result.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}); 