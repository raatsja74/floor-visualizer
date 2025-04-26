const photoInput   = document.getElementById('photoInput');
const previewWrap  = document.getElementById('previewWrap');
const styleButtons = document.getElementById('styleButtons');
const downloadBtn  = document.getElementById('downloadBtn');

const STYLES = [
  { name: "Obsidian",  file: "obsidian.png" },
  { name: "Graphite",  file: "graphite.png" },
  { name: "Marble",    file: "marble.png"   },
  { name: "Sandstone", file: "sandstone.png"},
];

let baseImg, overlayCanvas;

photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  baseImg = new Image();
  baseImg.onload = () => {
    previewWrap.innerHTML = '';
    previewWrap.appendChild(baseImg);
    overlayCanvas = document.createElement('canvas');
    overlayCanvas.width  = baseImg.width;
    overlayCanvas.height = baseImg.height;
    overlayCanvas.className = 'absolute inset-0';
    previewWrap.appendChild(overlayCanvas);
    buildStyleButtons();
  };
  baseImg.src = URL.createObjectURL(file);
});

function buildStyleButtons() {
  styleButtons.innerHTML = '';
  STYLES.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = s.name;
    btn.className = 'px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm';
    btn.onclick = () => applyStyle(s.file);
    styleButtons.appendChild(btn);
  });
}

function applyStyle(fileName) {
  const ctx = overlayCanvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(img, 0, 0, overlayCanvas.width, overlayCanvas.height);
    ctx.globalCompositeOperation = 'source-over';
    downloadBtn.classList.remove('hidden');
  };
  img.src = 'textures/' + fileName;
}

downloadBtn.addEventListener('click', () => {
  const merged = document.createElement('canvas');
  merged.width  = overlayCanvas.width;
  merged.height = overlayCanvas.height;
  const mCtx = merged.getContext('2d');
  mCtx.drawImage(baseImg, 0, 0);
  mCtx.drawImage(overlayCanvas, 0, 0);
  const link = document.createElement('a');
  link.download = 'visualized-floor.jpg';
  link.href = merged.toDataURL('image/jpeg', 0.9);
  link.click();
});
