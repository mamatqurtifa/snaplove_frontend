"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { frameService } from '@/services/frame';
import { useAuth } from '@/context/AuthContext';
import { FiUploadCloud, FiImage, FiX, FiInfo, FiCheckCircle } from 'react-icons/fi';

const LAYOUT_OPTIONS = [
  { value: '2x1', label: '2x1 Layout (2 Photos)' },
  { value: '3x1', label: '3x1 Layout (3 Photos)' },
  { value: '4x1', label: '4x1 Layout (4 Photos)' },
];

export default function UploadFramePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [layoutType, setLayoutType] = useState('2x1');
  const [visibility, setVisibility] = useState('public');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState([]); // SVG frames (can support multiple)
  const [photoThumbs, setPhotoThumbs] = useState([]); // individual photo thumbnails matching layout slots
  const [compositeThumbFile, setCompositeThumbFile] = useState(null);
  const [compositePreview, setCompositePreview] = useState(null);
  const [generatingComposite, setGeneratingComposite] = useState(false);
  const [compositeMeta, setCompositeMeta] = useState(null); // {width,height,slots}
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const photoThumbInputRef = useRef(null);
  // NOTE: No early returns before hooks to keep consistent hook order.

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList || []);
    const svgs = arr.filter(f => f.type === 'image/svg+xml');
    if (svgs.length !== arr.length) {
      setError('All frame files must be SVG.');
    } else {
      setError(null);
    }
    setFiles(svgs);
  };

  const handlePhotoThumbs = (fileList) => {
    const arr = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
    setPhotoThumbs(arr);
  };

  const expectedThumbnailPhotos = layoutType === '4x1' ? 4 : layoutType === '3x1' ? 3 : 2;

  // Auto-generate composite thumbnail when prerequisites are met
  useEffect(() => {
    if (!isAuthenticated) return; // skip generation while unauthenticated
    let cancelled = false;
    const generate = async () => {
      if (!files.length || !photoThumbs.length) return;
      if (photoThumbs.length !== expectedThumbnailPhotos) return; // wait until exact count
      setGeneratingComposite(true);
      try {
        const { generateCompositeThumbnail } = await import('@/lib/frameThumbnailComposer');
  const { file, url, width, height, slots } = await generateCompositeThumbnail(files[0], photoThumbs, layoutType);
        if (cancelled) return;
        setCompositeThumbFile(file);
        // Revoke old preview
        if (compositePreview) URL.revokeObjectURL(compositePreview);
        setCompositePreview(url);
  setCompositeMeta({ width, height, slots });
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError(e.message || 'Failed generating composite thumbnail');
          setCompositeThumbFile(null);
          setCompositePreview(null);
        }
      } finally {
        if (!cancelled) setGeneratingComposite(false);
      }
    };
    generate();
    return () => { cancelled = true; };
  }, [files, photoThumbs, layoutType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!files.length) {
      setError('Please upload at least one frame SVG.');
      return;
    }
    if (visibility === 'public' && !compositeThumbFile) {
      setError('Public frames require complete photo thumbnails (auto-generated).');
      return;
    }
    if (photoThumbs.length && photoThumbs.length !== expectedThumbnailPhotos) {
      setError(`Please provide exactly ${expectedThumbnailPhotos} photo thumbnail(s) for layout ${layoutType}.`);
      return;
    }
    setIsSubmitting(true);
    try {
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await frameService.uploadFrame({
        title,
        desc,
        layout_type: layoutType,
        visibility,
        tags: tagArr,
        frameFiles: files,
  thumbnailBlob: compositeThumbFile
      });
      setSuccess('Frame uploaded successfully! Pending approval if public.');
      setTitle('');
      setDesc('');
      setTags('');
      setFiles([]);
  setPhotoThumbs([]);
  setCompositeThumbFile(null);
  if (compositePreview) { URL.revokeObjectURL(compositePreview); setCompositePreview(null); }
  setCompositeMeta(null);
      // Optionally redirect after short delay
      setTimeout(() => router.push('/discover'), 1200);
    } catch (err) {
      console.error(err);
      setError(err?.displayMessage || err?.message || err?.response?.data?.message || 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {!isAuthenticated ? (
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Sign In Required</h1>
          <p className="text-sm text-gray-600 mb-6">You need to be logged in to upload a frame.</p>
          <button onClick={() => router.push('/auth/login')} className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium shadow">
            Go to Login
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Upload Frame</h1>
            <p className="text-sm text-gray-600 mt-2">SVG only. Public frames require admin approval before appearing in Discover.</p>
          </div>

          {error && <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2"><FiX className="w-4 h-4 mt-0.5" /> <span>{error}</span></div>}
          {success && <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-start gap-2"><FiCheckCircle className="w-4 h-4 mt-0.5" /> <span>{success}</span></div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} required maxLength={80} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="e.g. Sakura Spring Theme" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none" placeholder="Optional description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Layout *</label>
                  <select value={layoutType} onChange={e => setLayoutType(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500">
                    {LAYOUT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Visibility *</label>
                  <select value={visibility} onChange={e => setVisibility(e.target.value)} className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500">
                    <option value="public">Public (needs approval)</option>
                    <option value="private">Private (only you)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                  <input value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. spring,flowers,pink" className="w-full text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                  <p className="mt-1 text-[11px] text-gray-500">Used for filtering & search in Discover.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Frame SVG File(s) *</label>
                  <div onClick={() => fileInputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-pink-400 transition bg-white">
                    <input ref={fileInputRef} type="file" accept="image/svg+xml" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
                    <FiUploadCloud className="w-8 h-8 mx-auto text-pink-500 mb-3" />
                    <p className="text-sm font-medium">Click or drag & drop SVG files</p>
                    <p className="text-xs text-gray-500 mt-1">Only .svg files allowed</p>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-1 bg-pink-50/50 rounded-md p-3 max-h-32 overflow-y-auto text-xs">
                      {files.map(f => <li key={f.name} className="truncate">{f.name}</li>)}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">Photo Thumbnails ({expectedThumbnailPhotos} required)</label>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <div className="w-40 aspect-[3/4] rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300 relative">
                        {compositePreview ? (
                          <img src={compositePreview} className="object-cover w-full h-full" alt="Composite preview" />
                        ) : generatingComposite ? (
                          <span className="text-[11px] text-gray-500">Generating...</span>
                        ) : (
                          <FiImage className="w-10 h-10 text-gray-400" />
                        )}
                        {visibility === 'public' && <span className="absolute top-1 right-1 bg-pink-600 text-white rounded px-2 py-0.5 text-[10px]">Auto</span>}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input ref={photoThumbInputRef} type="file" accept="image/*" multiple hidden onChange={e => handlePhotoThumbs(e.target.files)} />
                        <button type="button" onClick={() => photoThumbInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                          Select {expectedThumbnailPhotos} Photo Thumbnail{expectedThumbnailPhotos>1?'s':''}
                        </button>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          Provide {expectedThumbnailPhotos} sample photo{expectedThumbnailPhotos>1?'s':''} that match the layout. We automatically composite them with your SVG to create the Discover thumbnail.
                        </p>
                        {photoThumbs.length > 0 && (
                          <ul className="text-[11px] grid grid-cols-2 gap-1 max-w-xs">
                            {photoThumbs.map(f => <li key={f.name} className="truncate bg-gray-50 border border-gray-200 px-2 py-1 rounded">{f.name}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                    {visibility === 'public' && !compositeThumbFile && photoThumbs.length === expectedThumbnailPhotos && !generatingComposite && (
                      <p className="text-[11px] text-red-500">Composite not generated yet. Adjust files or retry.</p>
                    )}
                  </div>
                </div>
                {compositePreview && compositeMeta && (
                  <div className="mt-4">
                    <p className="text-xs font-medium mb-1">Full Composite Preview</p>
                    <div className="w-full max-w-md border rounded-lg overflow-hidden bg-gray-50 relative">
                      <div
                        className="w-full"
                        style={{
                          aspectRatio: `${compositeMeta.width}/${compositeMeta.height}`,
                          backgroundImage: `url(${compositePreview})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-gray-500">Size: {compositeMeta.width}x{compositeMeta.height}px • Slots: {compositeMeta.slots.length}</p>
                  </div>
                )}

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-[11px] text-blue-700 flex gap-2">
                  <FiInfo className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Frame SVG Requirements</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>Use transparent rectangles for photo slots</li>
                      <li>Export exactly sized design matching ratios</li>
                      <li>Keep texts converted to outlines</li>
                      <li>No embedded raster images for best quality</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between gap-4">
              <p className="text-xs text-gray-500">After upload, public frames need admin approval (shadow-banned until approved).</p>
              <button disabled={isSubmitting} type="submit" className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium shadow disabled:opacity-60">
                {isSubmitting ? 'Uploading...' : 'Upload Frame'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
