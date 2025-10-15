import { supabase } from './supabase'

export type StorageBucket = 'avatars' | 'item-images' | 'chat-files'

export interface UploadOptions {
  bucket: StorageBucket
  file: File
  path?: string
  upsert?: boolean
}

export interface UploadResult {
  data: {
    path: string
    fullPath: string
    publicUrl: string
  } | null
  error: Error | null
}

// Upload file to storage
export const uploadFile = async ({
  bucket,
  file,
  path,
  upsert = false
}: UploadOptions): Promise<UploadResult> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      return { data: null, error: userError }
    }
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') }
    }

    // Generate file path if not provided
    const fileName = path || `${user.id}/${Date.now()}-${file.name}`
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert,
        contentType: file.type
      })

    if (error) {
      return { data: null, error }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl
      },
      error: null
    }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Upload failed') 
    }
  }
}

// Delete file from storage
export const deleteFile = async (bucket: StorageBucket, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    return { error }
  } catch (error) {
    return { 
      error: error instanceof Error ? error : new Error('Delete failed') 
    }
  }
}

// Get public URL for file
export const getPublicUrl = (bucket: StorageBucket, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Upload avatar image
export const uploadAvatar = async (file: File): Promise<UploadResult> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: new Error('User not authenticated') }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/avatar.${fileExt}`

  return uploadFile({
    bucket: 'avatars',
    file,
    path: fileName,
    upsert: true // Replace existing avatar
  })
}

// Upload item images (multiple)
export const uploadItemImages = async (files: File[]): Promise<{
  results: UploadResult[]
  successCount: number
  errorCount: number
}> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      results: [],
      successCount: 0,
      errorCount: files.length
    }
  }

  const uploadPromises = files.map((file, index) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${index}.${fileExt}`
    
    return uploadFile({
      bucket: 'item-images',
      file,
      path: fileName
    })
  })

  const results = await Promise.all(uploadPromises)
  const successCount = results.filter(r => r.data !== null).length
  const errorCount = results.filter(r => r.error !== null).length

  return {
    results,
    successCount,
    errorCount
  }
}

// Upload chat file
export const uploadChatFile = async (file: File, chatId: string): Promise<UploadResult> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: new Error('User not authenticated') }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${chatId}/${Date.now()}-${file.name}`

  return uploadFile({
    bucket: 'chat-files',
    file,
    path: fileName
  })
}

// Validate file type and size
export const validateFile = (
  file: File, 
  bucket: StorageBucket
): { valid: boolean; error?: string } => {
  const maxSizes = {
    'avatars': 5 * 1024 * 1024, // 5MB
    'item-images': 10 * 1024 * 1024, // 10MB
    'chat-files': 20 * 1024 * 1024 // 20MB
  }

  const allowedTypes = {
    'avatars': ['image/jpeg', 'image/png', 'image/webp'],
    'item-images': ['image/jpeg', 'image/png', 'image/webp'],
    'chat-files': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
  }

  // Check file size
  if (file.size > maxSizes[bucket]) {
    const maxSizeMB = maxSizes[bucket] / (1024 * 1024)
    return { 
      valid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    }
  }

  // Check file type
  if (!allowedTypes[bucket].includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} is not allowed for ${bucket}` 
    }
  }

  return { valid: true }
}

// Helper to compress image before upload (optional)
export const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file) // Fallback to original
          }
        },
        file.type,
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}