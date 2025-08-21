// Utility functions for photobooth image processing

export const createPhotoboothResult = async (photos, frameType = '2x1') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Standard photobooth dimensions (3x6 inches at 300 DPI)
  const outputWidth = 900;
  const outputHeight = 1800;

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  // High quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outputWidth, outputHeight);

  // Load frame SVG (will be used both for mask detection and final overlay)
  const frameSrc = `/images/frames/${frameType}-Snaplove.svg`;
  const frameImg = await loadImage(frameSrc);

  // 1) Detect photo slot rectangles from the frame transparency
  const slotRects = await detectPhotoSlotsFromFrame(frameImg, outputWidth, outputHeight);

  // 2) Draw photos into detected slots (cover-fit, 4:3)
  if (Array.isArray(slotRects) && slotRects.length >= 2) {
    await drawPhotosIntoSlots(ctx, photos, slotRects.slice(0, 2));
  } else {
    // Fallback: use legacy fixed positions if detection fails
    await drawPhotosFor2x1Frame(ctx, photos, outputWidth, outputHeight);
  }

  // 3) Draw frame ON TOP to ensure correct layering
  ctx.drawImage(frameImg, 0, 0, outputWidth, outputHeight);

  // Export
  return await canvasToBlobURL(canvas, 'image/jpeg', 0.95);
};

// Load an image
const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

// Convert canvas to Blob URL with Promise
const canvasToBlobURL = (canvas, type = 'image/png', quality) => new Promise((resolve, reject) => {
  try {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas toBlob returned null'));
      resolve(URL.createObjectURL(blob));
    }, type, quality);
  } catch (e) {
    reject(e);
  }
});

// Detect transparent slot rectangles from the frame image (rendered at output size)
const detectPhotoSlotsFromFrame = async (frameImg, width, height) => {
  // Draw the frame to an offscreen canvas
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const octx = off.getContext('2d');
  octx.drawImage(frameImg, 0, 0, width, height);

  const { data } = octx.getImageData(0, 0, width, height);

  // For each row, count transparent pixels (alpha < 20)
  const rowTransCounts = new Array(height).fill(0);
  const alphaThreshold = 20; // allow near-transparent
  for (let y = 0; y < height; y++) {
    let cnt = 0;
    const rowIdx = y * width * 4;
    for (let x = 0; x < width; x++) {
      const a = data[rowIdx + x * 4 + 3];
      if (a < alphaThreshold) cnt++;
    }
    rowTransCounts[y] = cnt;
  }

  // Identify bands where transparency count exceeds threshold
  const bands = [];
  const minRowTransparent = Math.floor(width * 0.4); // at least 40% transparent across the row
  let inBand = false;
  let bandStart = 0;
  for (let y = 0; y < height; y++) {
    const isTransRow = rowTransCounts[y] >= minRowTransparent;
    if (!inBand && isTransRow) {
      inBand = true;
      bandStart = y;
    } else if (inBand && !isTransRow) {
      const bandEnd = y - 1;
      if (bandEnd - bandStart > 10) bands.push([bandStart, bandEnd]);
      inBand = false;
    }
  }
  if (inBand) bands.push([bandStart, height - 1]);

  // Merge short gaps between bands
  const merged = [];
  const maxGap = 15;
  for (const b of bands) {
    if (merged.length === 0) merged.push(b);
    else {
      const last = merged[merged.length - 1];
      if (b[0] - last[1] <= maxGap) last[1] = b[1];
      else merged.push(b);
    }
  }

  // We expect two prominent bands (top/bottom slots). Pick the two with largest height
  merged.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
  const topTwo = merged.slice(0, 2).sort((a, b) => a[0] - b[0]);

  // For each band, find left and right bounds by scanning middle row
  const rects = [];
  for (const [y0, y1] of topTwo) {
    const midY = Math.floor((y0 + y1) / 2);
    const rowIdx = midY * width * 4;
    let left = 0;
    let right = width - 1;
    // find first transparent from left
    for (let x = 0; x < width; x++) {
      const a = data[rowIdx + x * 4 + 3];
      if (a < alphaThreshold) { left = x; break; }
    }
    // find first transparent from right
    for (let x = width - 1; x >= 0; x--) {
      const a = data[rowIdx + x * 4 + 3];
      if (a < alphaThreshold) { right = x; break; }
    }

    // Initial rect
    let rw = Math.max(10, right - left + 1);
    let rh = Math.max(10, y1 - y0 + 1);
    let rx = left;
    let ry = y0;

    // Adjust to strict 4:3 inside the detected transparent region (cover-fit maintaining center)
    const frameAspect = 4 / 3; // width/height
    const bandCx = rx + rw / 2;
    const bandCy = ry + rh / 2;

    // Fit as large 4:3 rect inside the transparent band
    let targetW = rw;
    let targetH = Math.floor(targetW / frameAspect);
    if (targetH > rh) {
      targetH = rh;
      targetW = Math.floor(targetH * frameAspect);
    }
    rx = Math.floor(bandCx - targetW / 2);
    ry = Math.floor(bandCy - targetH / 2);
    rw = targetW;
    rh = targetH;

  // Expand slightly so the photo fills the window tightly (about +2%)
  const expand = Math.floor(Math.min(rw, rh) * 0.02);
  rx -= expand; ry -= expand; rw += expand * 2; rh += expand * 2;
  // Clamp to canvas
  if (rx < 0) { rw += rx; rx = 0; }
  if (ry < 0) { rh += ry; ry = 0; }
  if (rx + rw > width) rw = Math.max(1, width - rx);
  if (ry + rh > height) rh = Math.max(1, height - ry);

    rects.push({ x: rx, y: ry, w: rw, h: rh });
  }

  return rects;
};

// Draw two photos into detected slot rects using cover-fit (preserve 4:3)
const drawPhotosIntoSlots = async (ctx, photos, rects) => {
  for (let i = 0; i < 2; i++) {
    const img = await loadImage(photos[i]);
    const rect = rects[i];

    // Maintain photo aspect 4:3 and cover the slot
    const srcAspect = img.width / img.height;
    const dstAspect = rect.w / rect.h;

    let drawW = rect.w;
    let drawH = rect.h;
    if (srcAspect > dstAspect) {
      // wider than slot: scale height to fit, crop sides
      drawH = rect.h;
      drawW = Math.ceil(drawH * srcAspect);
    } else {
      // taller than slot: scale width to fit, crop top/bottom
      drawW = rect.w;
      drawH = Math.ceil(drawW / srcAspect);
    }
    const dx = Math.round(rect.x + (rect.w - drawW) / 2);
    const dy = Math.round(rect.y + (rect.h - drawH) / 2);

    // Clip to rounded corners to match frame aesthetics
    ctx.save();
    roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 12);
    ctx.clip();
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
  }
};

const drawPhotosFor2x1Frame = async (ctx, photos, canvasWidth, canvasHeight) => {
  // Photo dimensions and positions for 2x1 frame
  // Optimized for the SnapLove 2x1 frame design
  // Fallback fixed positions (centered) — used only if auto-detection fails
  const photoWidth = 560; // slightly larger to better fill frame
  const photoHeight = 420; // maintain 4:3
  const photoX = (canvasWidth - photoWidth) / 2;
  // Estimated vertical positions; adjust if needed
  const photo1Y = Math.round(canvasHeight * 0.22);
  const photo2Y = Math.round(canvasHeight * 0.62);

  for (let i = 0; i < Math.min(photos.length, 2); i++) {
    const photoImg = new Image();
    
    await new Promise((resolve, reject) => {
      photoImg.onload = resolve;
      photoImg.onerror = reject;
      photoImg.src = photos[i];
    });

    const yPosition = i === 0 ? photo1Y : photo2Y;
    
    // Create rounded rectangle path
    ctx.save();
    roundedRect(ctx, photoX, yPosition, photoWidth, photoHeight, 12);
    ctx.clip();
    
    // Draw photo maintaining aspect ratio
    const imgAspect = photoImg.width / photoImg.height;
    const frameAspect = photoWidth / photoHeight;
    
    let drawWidth = photoWidth;
    let drawHeight = photoHeight;
    let drawX = photoX;
    let drawY = yPosition;
    
    if (imgAspect > frameAspect) {
      // Image is wider than frame
      drawWidth = photoHeight * imgAspect;
      drawX = photoX - (drawWidth - photoWidth) / 2;
    } else {
      // Image is taller than frame
      drawHeight = photoWidth / imgAspect;
      drawY = yPosition - (drawHeight - photoHeight) / 2;
    }
    
    ctx.drawImage(photoImg, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
    
    // Add subtle border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    roundedRect(ctx, photoX, yPosition, photoWidth, photoHeight, 12);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
};

const roundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const captureVideoFrame = (videoElement, width = 800, height = 600) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw video frame maintaining aspect ratio
    ctx.drawImage(videoElement, 0, 0, width, height);
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve(url);
    }, 'image/jpeg', 0.8);
  });
};

export const downloadImage = (imageUrl, filename = 'snaplove-photobooth.jpg') => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const shareImage = async (imageUrl, title = 'My SnapLove Photobooth') => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'snaplove-photobooth.jpg', { type: 'image/jpeg' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: title,
        text: 'Check out my photobooth session from SnapLove!',
        files: [file]
      });
      return true;
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      return false; // Indicates fallback was used
    }
  } catch (error) {
    console.error('Share failed:', error);
    throw error;
  }
};
