import api from './api';

// Helper to safely extract thumbnail url from various possible backend field names
const extractThumbnailUrl = (frame) => {
  if (!frame || typeof frame !== 'object') return null;
  return (
    frame.thumbnail_url ||
    frame.thumbnail ||
    frame.thumbnailPath ||
    frame.thumbnail_path ||
    frame.thumbnailUri ||
    (Array.isArray(frame.images) ? frame.images.find(i => /thumb/i.test(i)) : null) ||
    null
  );
};

export const frameService = {
  // Get public frames with optional filters
  getPublicFrames: async (params = {}) => {
  const { data } = await api.get('frame/public', { params });
    return data;
  },
  // Get specific public frame (accessible even if shadow-banned via direct link)
  getPublicFrameById: async (id) => {
  const { data } = await api.get(`frame/public/${id}`);
    return data;
  },
  // Like/unlike frame (auth required)
  likePublicFrame: async (id) => {
  const { data } = await api.post(`frame/public/${id}/like`);
    return data;
  },
  // Upload new frame (auth required)
  uploadFrame: async ({ title, desc, layout_type, visibility = 'public', tags = [], frameFiles = [], thumbnailBlob }) => {
    // Validation
    if (!frameFiles || frameFiles.length === 0) {
      const err = new Error('At least one SVG frame is required');
      err.displayMessage = err.message;
      throw err;
    }
    if (!title) {
      const err = new Error('Title is required');
      err.displayMessage = err.message;
      throw err;
    }
    if (!layout_type || !['2x1', '3x1', '4x1'].includes(layout_type)) {
      const err = new Error('Valid layout_type (2x1, 3x1, 4x1) is required');
      err.displayMessage = err.message;
      throw err;
    }

    // Build FormData exactly matching backend multer.fields expectation
    const formData = new FormData();
    
    // Text fields (order matters for some backends)
    formData.append('title', title.trim());
    formData.append('layout_type', layout_type);
    formData.append('visibility', visibility);
    if (desc && desc.trim()) {
      formData.append('desc', desc.trim());
    }
    
    // Handle tags - based on edit route validation, backend expects array
    if (Array.isArray(tags) && tags.length > 0) {
      const cleanTags = tags.filter(t => t && t.trim()).map(t => t.trim());
      // Backend validator uses body('tag_label').isArray() so send repeated 'tag_label'
      cleanTags.forEach(tag => formData.append('tag_label', tag));
    }

    // Files - multer limited to 1 frame file (LocalImageHandler limits.files = 1)
    // Backend fileFilter currently allows 'image/svg' NOT the standard 'image/svg+xml'.
    // We'll normalize mimetype so it passes backend filter.
    const normalizedFiles = [];
    for (const original of frameFiles) {
      if (!original) continue;
      if (original.type === 'image/svg+xml') {
        try {
          const text = await original.text();
          const fileName = original.name?.toLowerCase().endsWith('.svg') ? original.name : (original.name || 'frame') + '.svg';
          const normalized = new File([text], fileName, { type: 'image/svg' });
          normalizedFiles.push(normalized);
        } catch (e) {
          // Fallback to original if read fails
          normalizedFiles.push(original);
        }
      } else {
        normalizedFiles.push(original);
      }
    }
    if (normalizedFiles.length > 0) {
      const primary = normalizedFiles[0];
      const filename = primary.name || `frame-${Date.now()}.svg`;
      formData.append('images', primary, filename);
    }

    // Thumbnail is required for public frames
    if (thumbnailBlob) {
      const thumbFile = thumbnailBlob instanceof File 
        ? thumbnailBlob 
        : new File([thumbnailBlob], 'thumbnail.jpg', { type: 'image/jpeg' });
      formData.append('thumbnail', thumbFile, thumbFile.name);
    }

    // Log what we're sending
    console.log('[uploadFrame] Sending FormData:');
    const formEntries = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        formEntries.push(`${key}: File("${value.name}", ${value.size}B, ${value.type})`);
      } else {
        formEntries.push(`${key}: "${value}"`);
      }
    }
    console.log(formEntries.join('\n  '));

    try {
      // Use a more conservative timeout and better error handling
  const endpoint = visibility === 'private' ? 'frame/public' : 'frame/public'; // same endpoint, but we can suggest testing private first
  const { data } = await api.post(endpoint, formData, {
        timeout: 90000, // 90 seconds - enough for processing but not infinite
        // Remove all custom headers - let browser set multipart boundary
        headers: {},
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`[uploadFrame] Progress: ${progress}% (${progressEvent.loaded}/${progressEvent.total})`);
          }
        },
      });

      console.log('[uploadFrame] Success:', data);
      return data;
      
    } catch (err) {
      console.error('[uploadFrame] Error details:', {
        message: err.message,
        code: err.code,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });

      // Better error messages based on common issues
      if (err.response?.status === 400) {
        const serverMsg = err.response?.data?.message || err.response?.data?.error;
        err.displayMessage = serverMsg || 'Invalid request. Check file format and required fields.';
        if (serverMsg && /too many files/i.test(serverMsg)) {
          err.isTooManyFiles = true;
        }
      } else if (err.response?.status === 401) {
        err.displayMessage = 'Authentication required. Please login and try again.';
      } else if (err.response?.status === 413) {
        err.displayMessage = 'File too large. Please use smaller files.';
      } else if (err.response?.status === 422) {
        err.displayMessage = 'Invalid file format. Only SVG files are allowed for frames.';
      } else if (err.code === 'ECONNABORTED') {
        err.displayMessage = 'Upload timeout. The server may be processing large files slowly.';
      } else if (!err.response || err.response?.status === 0) {
        err.displayMessage = 'Network error. Check your connection and try again.';
      } else {
        err.displayMessage = err.response?.data?.message || `Upload failed: ${err.message}`;
      }
      
      // If timeout and we used original svg+xml (i.e., normalization maybe failed earlier), attempt one retry with forced mimetype
      if (err.code === 'ECONNABORTED' && frameFiles?.[0]?.type === 'image/svg+xml' && !formData.get('retry')) {
        console.warn('[uploadFrame] Timeout – retrying once with forced simplified SVG payload');
        const retryFd = new FormData();
        retryFd.append('title', title.trim());
        retryFd.append('layout_type', layout_type);
        retryFd.append('visibility', visibility);
        if (desc && desc.trim()) retryFd.append('desc', desc.trim());
        if (Array.isArray(tags) && tags.length > 0) {
          tags.filter(t => t && t.trim()).forEach(tag => retryFd.append('tag_label', tag.trim()));
        }
        retryFd.append('retry', '1');
        try {
          const svgText = await frameFiles[0].text();
          const forced = new File([svgText], (frameFiles[0].name || 'frame') + (frameFiles[0].name?.endsWith('.svg') ? '' : '.svg'), { type: 'image/svg' });
          retryFd.append('images', forced, forced.name);
        } catch {}
        if (thumbnailBlob) {
          const thumbFile = thumbnailBlob instanceof File ? thumbnailBlob : new File([thumbnailBlob], 'thumbnail.jpg', { type: 'image/jpeg' });
          retryFd.append('thumbnail', thumbFile, thumbFile.name);
        }
        try {
          const { data: retryData } = await api.post(endpoint, retryFd, { timeout: 90000 });
          console.log('[uploadFrame] Success after retry');
          return retryData;
        } catch (retryErr) {
          retryErr.displayMessage = retryErr.displayMessage || 'Retry failed: ' + retryErr.message;
          throw retryErr;
        }
      }
      // Fallback: backend currently limits total files=1 (images OR thumbnail). If we hit 'Too many files', retry without thumbnail as private.
      if (err.isTooManyFiles && !formData.get('fallback_no_thumbnail')) {
        console.warn('[uploadFrame] Backend limit hit (Too many files). Retrying upload as private WITHOUT thumbnail.');
        const fallbackFd = new FormData();
        fallbackFd.append('title', title.trim());
        fallbackFd.append('layout_type', layout_type);
        fallbackFd.append('visibility', 'private');
        if (desc && desc.trim()) fallbackFd.append('desc', desc.trim());
        if (Array.isArray(tags) && tags.length > 0) {
          tags.filter(t => t && t.trim()).forEach(tag => fallbackFd.append('tag_label', tag.trim()));
        }
        fallbackFd.append('fallback_no_thumbnail', '1');
        if (frameFiles?.[0]) fallbackFd.append('images', frameFiles[0], frameFiles[0].name || 'frame.svg');
        try {
          const { data: fbData } = await api.post('frame/public', fallbackFd, { timeout: 60000 });
          fbData._notice = 'Uploaded as PRIVATE without thumbnail due to server file limit. Please update visibility later after backend fix.';
          return fbData;
        } catch (fbErr) {
          fbErr.displayMessage = fbErr.displayMessage || 'Fallback upload failed: ' + fbErr.message;
          throw fbErr;
        }
      }
      throw err;
    }
  },
  // Utility to build a composite thumbnail (optional external usage)
  extractThumbnailUrl,
};
