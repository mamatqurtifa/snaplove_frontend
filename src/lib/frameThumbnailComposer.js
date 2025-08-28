// Utility to generate a composite PNG thumbnail by combining an uploaded frame SVG
// with user-provided photo thumbnails (2/3/4) according to the selected layout.
// Layout specifics (300px per inch @ 300 DPI reference):
//  - 2x1: 3x6 in  => 900 x 1800 px (baseline)
//  - 3x1: 2x6 in  => 600 x 1800 px (narrower, same height)
//  - 4x1: 1.5x6 in => 450 x 1800 px (narrowest)
// Height stays 1800 for all layouts; width shrinks with more vertical slots.
// Detection: Same vertical band detection scaled to normalized target size for each layout.

const loadImageFromFile = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
  img.src = url;
});

const loadImageFromUrl = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = url;
});

const detectTransparentBands = (frameImg, expectedSlots, layoutType, targetW, targetH) => {
  // Draw normalized size regardless of intrinsic SVG size
  const width = targetW;
  const height = targetH;
  const off = document.createElement('canvas');
  off.width = width; off.height = height;
  const ctx = off.getContext('2d');
  ctx.drawImage(frameImg, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  const rowTransCounts = new Array(height).fill(0);
  const alphaThreshold = 22; // near transparent
  for (let y = 0; y < height; y++) {
    let cnt = 0; const base = y * width * 4;
    for (let x = 0; x < width; x++) {
      const a = data[base + x * 4 + 3];
      if (a < alphaThreshold) cnt++;
    }
    rowTransCounts[y] = cnt;
  }

  // Threshold percentage differs a bit for multi-slot layouts (allow smaller transparency bands)
  const minTransparentPerRow = Math.floor(width * (layoutType === '2x1' ? 0.40 : 0.28));
  const bands = [];
  let inBand = false; let bandStart = 0;
  for (let y = 0; y < height; y++) {
    const isTrans = rowTransCounts[y] >= minTransparentPerRow;
    if (!inBand && isTrans) { inBand = true; bandStart = y; }
    else if (inBand && !isTrans) { const end = y - 1; if (end - bandStart > 12) bands.push([bandStart, end]); inBand = false; }
  }
  if (inBand) bands.push([bandStart, height - 1]);

  // Merge small gaps
  const merged = [];
  const maxGap = 20;
  for (const b of bands) {
    if (!merged.length) { merged.push(b); continue; }
    const last = merged[merged.length - 1];
    if (b[0] - last[1] <= maxGap) last[1] = b[1]; else merged.push(b);
  }

  // Sort by vertical size and then take top expected slots sorted by Y
  merged.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
  const selected = merged.slice(0, expectedSlots).sort((a, b) => a[0] - b[0]);

  const rects = [];
  for (const [y0, y1] of selected) {
    const midY = Math.floor((y0 + y1) / 2);
    const rowIdx = midY * width * 4;
    let left = 0; let right = width - 1;
    for (let x = 0; x < width; x++) { if (data[rowIdx + x * 4 + 3] < alphaThreshold) { left = x; break; } }
    for (let x = width - 1; x >= 0; x--) { if (data[rowIdx + x * 4 + 3] < alphaThreshold) { right = x; break; } }
    let rw = Math.max(10, right - left + 1);
    let rh = Math.max(10, y1 - y0 + 1);
    let rx = left; let ry = y0;
    const aspect = 4 / 3;
    const bandCx = rx + rw / 2; const bandCy = ry + rh / 2;
    let targetW = rw; let targetH = Math.floor(targetW / aspect);
    if (targetH > rh) { targetH = rh; targetW = Math.floor(targetH * aspect); }
    rx = Math.floor(bandCx - targetW / 2);
    ry = Math.floor(bandCy - targetH / 2);
    rw = targetW; rh = targetH;
    const expand = Math.floor(Math.min(rw, rh) * 0.02);
    rx -= expand; ry -= expand; rw += expand * 2; rh += expand * 2;
    if (rx < 0) { rw += rx; rx = 0; }
    if (ry < 0) { rh += ry; ry = 0; }
    if (rx + rw > width) rw = Math.max(1, width - rx);
    if (ry + rh > height) rh = Math.max(1, height - ry);
    rects.push({ x: rx, y: ry, w: rw, h: rh });
  }
  return rects;
};

const fallbackRects = (width, height, expectedSlots) => {
  // Evenly distribute vertically with small gaps
  const gapRatio = 0.03; // 3% gap
  const totalGap = (expectedSlots + 1) * gapRatio * height;
  const available = height - totalGap;
  const slotHeight = available / expectedSlots;
  const rects = [];
  const slotWidth = Math.min(Math.floor(slotHeight * (4 / 3)), width * 0.9);
  const x = Math.floor((width - slotWidth) / 2);
  for (let i = 0; i < expectedSlots; i++) {
    const y = Math.floor((gapRatio * height) + i * (slotHeight + gapRatio * height));
    rects.push({ x, y, w: Math.floor(slotWidth), h: Math.floor(slotWidth / (4 / 3)) });
  }
  return rects;
};

const drawPhotoCover = (ctx, img, rect) => {
  const srcAspect = img.width / img.height;
  const dstAspect = rect.w / rect.h;
  let drawW = rect.w; let drawH = rect.h;
  if (srcAspect > dstAspect) { // wider than slot
    drawH = rect.h; drawW = Math.ceil(drawH * srcAspect);
  } else { // taller
    drawW = rect.w; drawH = Math.ceil(drawW / srcAspect);
  }
  const dx = Math.round(rect.x + (rect.w - drawW) / 2);
  const dy = Math.round(rect.y + (rect.h - drawH) / 2);
  ctx.drawImage(img, dx, dy, drawW, drawH);
};

export async function generateCompositeThumbnail(frameFile, photoFiles, layoutType) {
  if (!frameFile) throw new Error('Frame SVG file required');
  if (!Array.isArray(photoFiles) || photoFiles.length === 0) throw new Error('Photo thumbnails required');
  const expected = layoutType === '4x1' ? 4 : layoutType === '3x1' ? 3 : 2;
  if (photoFiles.length !== expected) throw new Error(`Layout ${layoutType} requires exactly ${expected} photo thumbnail(s)`);

  // Load frame
  const frameImg = await loadImageFromFile(frameFile);
  // Determine output dimensions per physical spec
  const height = 1800; // always 6 inches
  const width = layoutType === '4x1' ? 450 : layoutType === '3x1' ? 600 : 900;

  let slots = detectTransparentBands(frameImg, expected, layoutType, width, height);
  if (!slots || slots.length !== expected) {
    slots = fallbackRects(width, height, expected);
  }

  // Ensure we have expected count
  if (slots.length > expected) slots = slots.slice(0, expected);

  // Prepare canvas
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load photos sequentially to control memory
  for (let i = 0; i < expected; i++) {
    const img = await loadImageFromFile(photoFiles[i]);
    const rect = slots[i];
    // Rounded clipping for polish
    ctx.save();
    const r = Math.min(rect.w, rect.h) * 0.06; // 6% radius
    ctx.beginPath();
    ctx.moveTo(rect.x + r, rect.y);
    ctx.lineTo(rect.x + rect.w - r, rect.y);
    ctx.quadraticCurveTo(rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + r);
    ctx.lineTo(rect.x + rect.w, rect.y + rect.h - r);
    ctx.quadraticCurveTo(rect.x + rect.w, rect.y + rect.h, rect.x + rect.w - r, rect.y + rect.h);
    ctx.lineTo(rect.x + r, rect.y + rect.h);
    ctx.quadraticCurveTo(rect.x, rect.y + rect.h, rect.x, rect.y + rect.h - r);
    ctx.lineTo(rect.x, rect.y + r);
    ctx.quadraticCurveTo(rect.x, rect.y, rect.x + r, rect.y);
    ctx.closePath();
    ctx.clip();
    drawPhotoCover(ctx, img, rect);
    ctx.restore();
  }

  // Draw frame over
  ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
  if (!blob) throw new Error('Failed generating composite thumbnail');
  const file = new File([blob], 'thumbnail.png', { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return { file, url, slots, width, height };
}

export default generateCompositeThumbnail;
