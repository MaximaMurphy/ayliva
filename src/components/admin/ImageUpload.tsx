import React, { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  required?: boolean;
}

const MAX_MB = 10;

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = 'uploads',
  label = 'Görsel',
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen bir görsel dosyası seçin.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Görsel boyutu ${MAX_MB}MB'den küçük olmalı.`);
      return;
    }

    setUploading(true);
    try {
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const rand = Math.random().toString(36).slice(2, 10);
      const path = `${folder}/${Date.now()}-${rand}.${ext}`;

      const { error } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });

      if (error) throw error;

      const { data } = supabase.storage.from('media').getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success('Görsel yüklendi.');
    } catch (err) {
      console.error('Upload error:', err);
      const message = err instanceof Error ? err.message : 'bilinmeyen hata';
      toast.error('Görsel yüklenemedi: ' + message);
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {value ? (
        <div className="relative group w-full">
          <img
            src={value}
            alt="Önizleme"
            className="w-full h-44 object-cover rounded-sm border border-gray-200 bg-gray-50"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
          />
          <div className="absolute inset-0 rounded-sm flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white/90 text-gray-800 text-sm px-3 py-1.5 rounded-sm hover:bg-white"
            >
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-sm hover:bg-red-700 flex items-center gap-1"
            >
              <X size={14} /> Kaldır
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-sm">
              <Loader2 className="animate-spin text-red-600" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          disabled={uploading}
          className="w-full h-44 border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-red-400 hover:text-red-500 transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" />
              <span className="text-sm">Yükleniyor...</span>
            </>
          ) : (
            <>
              <Upload size={28} />
              <span className="text-sm">Görsel seçmek için tıklayın veya sürükleyip bırakın</span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP — en fazla {MAX_MB}MB</span>
            </>
          )}
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />

      <input
        type="url"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder="veya görsel URL'si yapıştırın"
        className="w-full mt-2 p-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
      />
    </div>
  );
};
