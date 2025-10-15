'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Camera, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AvatarUploadProps {
  currentImageUrl?: string | null
  onUpload: (file: File) => Promise<void>
  onCancel: () => void
}

export function AvatarUpload({ currentImageUrl, onUpload, onCancel }: AvatarUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    setError(null)
    setSelectedFile(file)

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      setError(null)
      await onUpload(selectedFile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    onCancel()
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user'
        }
      })
      
      setStream(mediaStream)
      setShowCamera(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.')
      console.error('Camera access error:', err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0)

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return

      // Create file from blob
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setSelectedFile(file)
      
      // Stop camera
      stopCamera()
    }, 'image/jpeg', 0.8)
  }, [stopCamera])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [stream, previewUrl])

  return (
    <div className="space-y-4">
      {/* Camera View */}
      {showCamera && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]" // Mirror effect
              />
            </div>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="outlined"
              size="default"
              onClick={stopCamera}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              variant="primary"
              size="default"
              onClick={capturePhoto}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </Button>
          </div>
        </div>
      )}

      {/* Current/Preview Image */}
      {!showCamera && (
        <>
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt="Current avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ 
                    backgroundColor: '#D8F7D7',
                    color: '#119C21'
                  }}
                >
                  <Camera className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* Upload from Files */}
            <div
              onClick={triggerFileSelect}
              className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
              <p className="text-body-small font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Upload Photo
              </p>
              <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                From files
              </p>
            </div>

            {/* Take Photo */}
            <div
              onClick={startCamera}
              className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <Camera className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
              <p className="text-body-small font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Take Photo
              </p>
              <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                Use camera
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-body-small text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outlined"
              size="default"
              onClick={handleCancel}
              className="flex-1"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="default"
              onClick={handleUpload}
              className="flex-1"
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}