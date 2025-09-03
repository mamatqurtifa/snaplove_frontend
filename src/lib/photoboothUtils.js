// Utility functions for photobooth image processing

export const createPhotoboothResult = async (photos, frameType = '2x1', frameUrl = null) => {
  try {
    // Import frameThumbnailComposer dynamically
    const { generateCompositeThumbnail } = await import('./frameThumbnailComposer');

    if (frameUrl) {
      try {
        // Convert photos to File objects for frameThumbnailComposer
        const photoFiles = await Promise.all(
          photos.map(async (photoUrl, index) => {
            try {
              const response = await fetch(photoUrl);
              const blob = await response.blob();
              return new File([blob], `photo-${index + 1}.jpg`, { type: 'image/jpeg' });
            } catch (error) {
              console.error(`Failed to convert photo ${index + 1} to file:`, error);
              throw new Error(`Failed to process photo ${index + 1}`);
            }
          })
        );

        // Fetch frame image and convert to File
        const frameResponse = await fetch(frameUrl);
        const frameBlob = await frameResponse.blob();
        const frameFile = new File([frameBlob], 'frame.svg', { type: 'image/svg+xml' });

        // Use frameThumbnailComposer to generate result
        const result = await generateCompositeThumbnail(frameFile, photoFiles, frameType);
        return result.url;
      } catch (frameError) {
        console.warn('Frame processing failed, falling back to default:', frameError);
        // Fall back to default processing
        return await createDefaultPhotoboothResult(photos, frameType);
      }
    } else {
      // Use default frame processing
      return await createDefaultPhotoboothResult(photos, frameType);
    }
  } catch (error) {
    console.error('Error in createPhotoboothResult:', error);
    // Final fallback - create a simple collage without frame
    return await createSimpleCollage(photos, frameType);
  }
};

// Fallback function for default frame processing
const createDefaultPhotoboothResult = async (photos, frameType = '2x1') => {
  try {
    // Use same dimensions as frameThumbnailComposer
    const height = 1800; // always 6 inches at 300 DPI
    const width = frameType === '4x1' ? 450 : frameType === '3x1' ? 600 : 900;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // High quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Try to load default frame SVG, but don't fail if it doesn't exist
    let frameImg = null;
    try {
      const frameSrc = `/images/frames/${frameType}-Snaplove.svg`;
      frameImg = await loadImage(frameSrc);
    } catch (frameError) {
      console.warn('Default frame not found, proceeding without frame:', frameError);
    }

    // Use frame detection if frame is available, otherwise use calculated positions
    let photoSlots = null;
    if (frameImg) {
      photoSlots = await detectPhotoSlotsFromFrame(frameImg, width, height, frameType);
    }

    if (photoSlots && photoSlots.length > 0) {
      // Draw photos into detected slots
      await drawPhotosIntoSlots(ctx, photos, photoSlots);
    } else {
      // Use calculated positions matching frameThumbnailComposer
      await drawPhotosForCalculatedLayout(ctx, photos, width, height, frameType);
    }

    // Draw frame on top if available
    if (frameImg) {
      ctx.drawImage(frameImg, 0, 0, width, height);
    }

    return await canvasToBlobURL(canvas, 'image/jpeg', 0.95);
  } catch (error) {
    console.error('Error in createDefaultPhotoboothResult:', error);
    // If all else fails, create a simple collage
    return await createSimpleCollage(photos, frameType);
  }
};

// Load an image with better error handling
const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  // Only set crossOrigin for external URLs
  if (src.startsWith('http') || src.startsWith('//')) {
    img.crossOrigin = 'anonymous';
  }

  img.onload = () => resolve(img);
  img.onerror = (error) => {
    console.error(`Failed to load image: ${src}`, error);
    reject(new Error(`Failed to load image: ${src}`));
  };
  img.src = src;
});

// Final fallback - create a simple collage without any frame
const createSimpleCollage = async (photos, frameType = '2x1') => {
  try {
    // Use same dimensions as frameThumbnailComposer
    const height = 1800; // always 6 inches at 300 DPI
    const width = frameType === '4x1' ? 450 : frameType === '3x1' ? 600 : 900;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    // High quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw photos in a simple layout
    const expectedSlots = frameType === '4x1' ? 4 : frameType === '3x1' ? 3 : 2;
    const gapRatio = 0.05; // 5% gap
    const totalGap = (expectedSlots + 1) * gapRatio * height;
    const available = height - totalGap;
    const slotHeight = available / expectedSlots;
    const slotWidth = Math.min(Math.floor(slotHeight * (4 / 3)), width * 0.9);
    const x = Math.floor((width - slotWidth) / 2);

    for (let i = 0; i < Math.min(photos.length, expectedSlots); i++) {
      try {
        const img = await loadImage(photos[i]);
        const y = Math.floor((gapRatio * height) + i * (slotHeight + gapRatio * height));

        // Draw photo with cover-fit
        const srcAspect = img.width / img.height;
        const dstAspect = slotWidth / slotHeight;

        let drawW = slotWidth;
        let drawH = slotHeight;
        if (srcAspect > dstAspect) {
          drawH = slotHeight;
          drawW = Math.ceil(drawH * srcAspect);
        } else {
          drawW = slotWidth;
          drawH = Math.ceil(drawW / srcAspect);
        }
        const dx = Math.round(x + (slotWidth - drawW) / 2);
        const dy = Math.round(y + (slotHeight - drawH) / 2);

        // Clip to rounded corners
        ctx.save();
        roundedRect(ctx, x, y, slotWidth, slotHeight, 12);
        ctx.clip();
        ctx.drawImage(img, dx, dy, drawW, drawH);
        ctx.restore();
      } catch (photoError) {
        console.error(`Failed to load photo ${i + 1}:`, photoError);
        // Skip this photo and continue with others
      }
    }

    return await canvasToBlobURL(canvas, 'image/jpeg', 0.95);
  } catch (error) {
    console.error('Error in createSimpleCollage:', error);
    throw new Error('Failed to create photobooth result');
  }
};

// Detect transparent slot rectangles from the frame image (matching frameThumbnailComposer)
const detectPhotoSlotsFromFrame = async (frameImg, width, height, frameType) => {
  try {
    const expectedSlots = frameType === '4x1' ? 4 : frameType === '3x1' ? 3 : 2;

    // Draw normalized size regardless of intrinsic SVG size
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const ctx = off.getContext('2d');
    ctx.drawImage(frameImg, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);

    const rowTransCounts = new Array(height).fill(0);
    const alphaThreshold = 22; // near transparent
    for (let y = 0; y < height; y++) {
      let cnt = 0;
      const base = y * width * 4;
      for (let x = 0; x < width; x++) {
        const a = data[base + x * 4 + 3];
        if (a < alphaThreshold) cnt++;
      }
      rowTransCounts[y] = cnt;
    }

    // Threshold percentage differs for multi-slot layouts (matching frameThumbnailComposer)
    const minTransparentPerRow = Math.floor(width * (frameType === '2x1' ? 0.40 : 0.28));
    const bands = [];
    let inBand = false;
    let bandStart = 0;
    for (let y = 0; y < height; y++) {
      const isTrans = rowTransCounts[y] >= minTransparentPerRow;
      if (!inBand && isTrans) {
        inBand = true;
        bandStart = y;
      } else if (inBand && !isTrans) {
        const end = y - 1;
        if (end - bandStart > 12) bands.push([bandStart, end]);
        inBand = false;
      }
    }
    if (inBand) bands.push([bandStart, height - 1]);

    // Merge small gaps (matching frameThumbnailComposer)
    const merged = [];
    const maxGap = 20;
    for (const b of bands) {
      if (!merged.length) {
        merged.push(b);
        continue;
      }
      const last = merged[merged.length - 1];
      if (b[0] - last[1] <= maxGap) last[1] = b[1];
      else merged.push(b);
    }

    // Sort by vertical size and take top expected slots sorted by Y
    merged.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
    const selected = merged.slice(0, expectedSlots).sort((a, b) => a[0] - b[0]);

    const rects = [];
    for (const [y0, y1] of selected) {
      const midY = Math.floor((y0 + y1) / 2);
      const rowIdx = midY * width * 4;
      let left = 0;
      let right = width - 1;
      for (let x = 0; x < width; x++) {
        if (data[rowIdx + x * 4 + 3] < alphaThreshold) {
          left = x;
          break;
        }
      }
      for (let x = width - 1; x >= 0; x--) {
        if (data[rowIdx + x * 4 + 3] < alphaThreshold) {
          right = x;
          break;
        }
      }
      let rw = Math.max(10, right - left + 1);
      let rh = Math.max(10, y1 - y0 + 1);
      let rx = left;
      let ry = y0;
      const aspect = 4 / 3;
      const bandCx = rx + rw / 2;
      const bandCy = ry + rh / 2;
      let targetW = rw;
      let targetH = Math.floor(targetW / aspect);
      if (targetH > rh) {
        targetH = rh;
        targetW = Math.floor(targetH * aspect);
      }
      rx = Math.floor(bandCx - targetW / 2);
      ry = Math.floor(bandCy - targetH / 2);
      rw = targetW;
      rh = targetH;
      const expand = Math.floor(Math.min(rw, rh) * 0.02);
      rx -= expand;
      ry -= expand;
      rw += expand * 2;
      rh += expand * 2;
      if (rx < 0) {
        rw += rx;
        rx = 0;
      }
      if (ry < 0) {
        rh += ry;
        ry = 0;
      }
      if (rx + rw > width) rw = Math.max(1, width - rx);
      if (ry + rh > height) rh = Math.max(1, height - ry);
      rects.push({ x: rx, y: ry, w: rw, h: rh });
    }

    return rects;
  } catch (error) {
    console.error('Error in detectPhotoSlotsFromFrame:', error);
    return null; // Return null to trigger fallback
  }
};

// Draw photos into detected slot rects using cover-fit (matching frameThumbnailComposer)
const drawPhotosIntoSlots = async (ctx, photos, rects) => {
  const expectedSlots = rects.length;

  for (let i = 0; i < Math.min(photos.length, expectedSlots); i++) {
    try {
      const img = await loadImage(photos[i]);
      const rect = rects[i];

      // Use same photo drawing logic as frameThumbnailComposer
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

      // Rounded clipping for polish (matching frameThumbnailComposer)
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
      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();
    } catch (error) {
      console.error(`Failed to draw photo ${i + 1} into slot:`, error);
      // Continue with other photos
    }
  }
};

// Draw photos in calculated layout positions (matching frameThumbnailComposer fallbackRects)
const drawPhotosForCalculatedLayout = async (ctx, photos, width, height, frameType) => {
  const expectedSlots = frameType === '4x1' ? 4 : frameType === '3x1' ? 3 : 2;

  // Evenly distribute vertically with small gaps (matching frameThumbnailComposer)
  const gapRatio = 0.03; // 3% gap
  const totalGap = (expectedSlots + 1) * gapRatio * height;
  const available = height - totalGap;
  const slotHeight = available / expectedSlots;
  const rects = [];
  const slotWidth = Math.min(Math.floor(slotHeight * (4 / 3)), width * 0.9);
  const x = Math.floor((width - slotWidth) / 2);

  for (let i = 0; i < expectedSlots; i++) {
    const y = Math.floor((gapRatio * height) + i * (slotHeight + gapRatio * height));
    rects.push({
      x,
      y,
      w: Math.floor(slotWidth),
      h: Math.floor(slotWidth / (4 / 3))
    });
  }

  // Draw photos using the same logic
  await drawPhotosIntoSlots(ctx, photos, rects);
};

const drawPhotosForDefaultFrame = async (ctx, photos, canvasWidth, canvasHeight, frameType) => {
  // This function is deprecated - use drawPhotosForCalculatedLayout instead
  return await drawPhotosForCalculatedLayout(ctx, photos, canvasWidth, canvasHeight, frameType);
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

// Utility function to clear timers (used in photobooth page)
export const clearTimers = (countdownIntervalRef, countdownTimeoutRef) => {
  if (countdownIntervalRef?.current) {
    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = null;
  }
  if (countdownTimeoutRef?.current) {
    clearTimeout(countdownTimeoutRef.current);
    countdownTimeoutRef.current = null;
  }
};
