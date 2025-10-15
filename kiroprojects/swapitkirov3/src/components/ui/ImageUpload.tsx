'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadFile, validateFile, compressImage, type StorageBucket } from '@/lib/storage'

interface ImageUploadProps {
  bucket: StorageBucket
  onUpload: (urls: string[]) => void
  onError?: (error: string) => void
  multiple?: boolean
  maxFiles?: number
  compress?: boolean
  className?: string
  accept?: string
}

export function ImageUpload({
  bucket,
  onUpload,
  onError,
  multiple = false,
  maxFiles = 5,
  compress = true,
  className = '',
  accept = 'image/jpeg,image/png,image/webp'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Validate files
    const validFiles: File[] = []
    for (const file of files) {
      const validation = validateFile(file, bucket)
      if (!validation.valid) {
        onError?.(validation.error || 'Invalid file')
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    // Limit number of files
    const filesToUpload = validFiles.slice(0, maxFiles)

    setUploading(true)

    try {
      // Create previews
      const previewUrls = filesToUpload.map(file => URL.createObjectURL(file))
      setPreviews(previewUrls)

      // Process and upload files
      const uploadPromises = filesToUpload.map(async (file) => {
        let processedFile = file

        // Compress image if enabled
        if (compress && file.type.startsWith('image/')) {
          processedFile = await compressImage(file)
        }

        const result = await uploadFile({
          bucket,
          file: processedFile
        })

        if (result.error) {
          throw result.error
        }

        return result.data!.publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      
      // Clean up previews
      previewUrls.forEach(url => URL.revokeObjectURL(url))
      setPreviews([])

      onUpload(uploadedUrls)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed')
      // Clean up previews on error
      previews.forEach(url => URL.revokeObjectURL(url))
      setPreviews([])
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removePreview = (index: number) => {
    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="w-full p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          borderColor: uploading ? 'var(--primary)' : 'var(--border-color)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          ) : (
            <Upload className="w-8 h-8" style={{ color: 'var(--text-secondary)' }} />
          )}
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {multiple ? `Up to ${maxFiles} files` : '1 file'} • PNG, JPG, WebP
            </p>
          </div>
        </div>
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview Images */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removePreview(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Simple avatar upload component
export function AvatarUpload({
  currentAvatar,
  onUpload,
  onError,
  size = 'large'
}: {
  currentAvatar?: string
  onUpload: (url: string) => void
  onError?: (error: string) => void
  size?: 'small' | 'medium' | 'large'
}) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateFile(file, 'avatars')
    if (!validation.valid) {
      onError?.(validation.error || 'Invalid file')
      return
    }

    setUploading(true)

    try {
      const compressedFile = await compressImage(file, 400, 0.8)
      const result = await uploadFile({
        bucket: 'avatars',
        file: compressedFile
      })

      if (result.error) {
        throw result.error
      }

      onUpload(result.data!.publicUrl)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={`${sizeClasses[size]} rounded-full border-2 border-dashed border-gray-300 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
      >
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}