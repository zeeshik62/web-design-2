import React, { useRef } from 'react';
import { X, ImagePlus } from 'lucide-react';

/**
 * ImageUploader — drag-friendly multi-image picker with local previews.
 * 
 * Props:
 *   files       : File[]         — controlled list of selected File objects
 *   onChange    : (File[]) => void
 *   maxImages   : number         — default 5
 *   label       : string         — section label
 */
const ImageUploader = ({ files = [], onChange, maxImages = 5, label = 'Images' }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const merged = [...files, ...selected].slice(0, maxImages);
    onChange(merged);
    // Reset so same file can be re-picked after removal
    e.target.value = '';
  };

  const removeFile = (idx) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '18px', marginTop: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontSize: '14px', margin: 0 }}>🖼️ {label} <span style={{ fontWeight: '400', color: 'var(--text-light)', fontSize: '12px' }}>(max {maxImages})</span></h4>
        {files.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.25)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', color: 'var(--text-color)', fontSize: '13px' }}
          >
            <ImagePlus size={15} /> Add Image
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {files.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '10px', padding: '28px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-light)', fontSize: '13px', transition: 'border-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
        >
          <ImagePlus size={28} style={{ marginBottom: '8px', opacity: 0.5 }} />
          <p style={{ margin: 0 }}>Click to upload images</p>
          <p style={{ margin: '4px 0 0', fontSize: '11px' }}>JPG, PNG, WEBP · max 5MB each</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
          {files.map((file, idx) => (
            <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', background: '#111' }}>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {files.length < maxImages && (
            <div
              onClick={() => inputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '2px dashed rgba(255,255,255,0.2)', aspectRatio: '1', cursor: 'pointer', color: 'var(--text-light)' }}
            >
              <ImagePlus size={20} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
