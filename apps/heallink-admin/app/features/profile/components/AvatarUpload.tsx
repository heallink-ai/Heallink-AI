'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, User, Check } from 'lucide-react';
import { useUploadAvatar, useAvatarUrl } from '../hooks/useProfile';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName: string;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userName,
  onAvatarUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadAvatarMutation = useUploadAvatar();
  const { data: signedAvatarUrl } = useAvatarUrl(currentAvatarUrl);

  const displayAvatarUrl = previewUrl || signedAvatarUrl || currentAvatarUrl;

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      uploadAvatarMutation.mutate(file, {
        onSuccess: (newAvatarUrl) => {
          setPreviewUrl(null);
          onAvatarUpdate?.(newAvatarUrl);
        },
        onError: () => {
          setPreviewUrl(null);
        },
      });
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {/* Avatar Container */}
        <div
          className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
            dragOver
              ? 'border-[color:var(--primary)] border-dashed bg-[color:var(--primary)]/5'
              : 'border-[color:var(--border)] hover:border-[color:var(--primary)]/50'
          } ${
            uploadAvatarMutation.isPending ? 'opacity-70' : ''
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {displayAvatarUrl ? (
            <img
              src={displayAvatarUrl}
              alt={userName}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5 flex items-center justify-center">
              <User className="w-8 h-8 text-[color:var(--primary)]" />
            </div>
          )}

          {/* Upload Loading Overlay */}
          {uploadAvatarMutation.isPending && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Success Overlay */}
          {uploadAvatarMutation.isSuccess && !uploadAvatarMutation.isPending && (
            <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center animate-in fade-in duration-300">
              <Check className="w-6 h-6 text-white" />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleClick}
          disabled={uploadAvatarMutation.isPending}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          title="Change profile picture"
        >
          {uploadAvatarMutation.isPending ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera size={14} />
          )}
        </button>
      </div>

      {/* Upload Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-[color:var(--foreground)] mb-1">
          {userName}
        </p>
        <p className="text-xs text-[color:var(--muted-foreground)]">
          Click or drag to upload
        </p>
      </div>

      {/* Drag & Drop Area */}
      {dragOver && (
        <div className="fixed inset-0 bg-[color:var(--primary)]/10 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[color:var(--card)] border-2 border-dashed border-[color:var(--primary)] rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center">
              <Upload className="w-12 h-12 text-[color:var(--primary)] mx-auto mb-4" />
              <p className="text-lg font-medium text-[color:var(--foreground)] mb-2">
                Drop your image here
              </p>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                JPG, PNG or GIF up to 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;