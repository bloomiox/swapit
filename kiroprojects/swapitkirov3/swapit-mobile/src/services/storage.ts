import { supabase } from './supabase';
import { logError, log } from '../config/environment';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  quality?: number; // 0-1 for image compression
  maxWidth?: number;
  maxHeight?: number;
}

// Storage service for handling file uploads and management
export class StorageService {
  private readonly AVATAR_BUCKET = 'avatars';
  private readonly ITEM_IMAGES_BUCKET = 'item-images';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Upload avatar image
  async uploadAvatar(
    file: File | Blob, 
    userId: string, 
    options?: UploadOptions
  ): Promise<string> {
    try {
      // Validate file size
      if (file.size > this.MAX_FILE_SIZE) {
        throw new Error('File size too large. Maximum size is 10MB.');
      }

      // Process image if needed
      const processedFile = await this.processImage(file, {
        maxWidth: options?.maxWidth || 400,
        maxHeight: options?.maxHeight || 400,
        quality: options?.quality || 0.8
      });

      const fileExt = this.getFileExtension(file);
      const fileName = `avatar.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload with progress tracking
      const { error: uploadError } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .upload(filePath, processedFile, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from(this.AVATAR_BUCKET)
        .getPublicUrl(filePath);

      log('Avatar uploaded successfully:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      logError('Avatar upload failed:', error);
      throw this.handleStorageError(error);
    }
  }

  // Upload item images
  async uploadItemImages(
    files: (File | Blob)[], 
    itemId: string, 
    options?: UploadOptions
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file size
        if (file.size > this.MAX_FILE_SIZE) {
          throw new Error(`File ${index + 1} size too large. Maximum size is 10MB.`);
        }

        // Process image
        const processedFile = await this.processImage(file, {
          maxWidth: options?.maxWidth || 1200,
          maxHeight: options?.maxHeight || 1200,
          quality: options?.quality || 0.85
        });

        const fileExt = this.getFileExtension(file);
        const fileName = `image_${index + 1}.${fileExt}`;
        const filePath = `${itemId}/${fileName}`;

        // Upload file
        const { error: uploadError } = await supabase.storage
          .from(this.ITEM_IMAGES_BUCKET)
          .upload(filePath, processedFile, { 
            upsert: true,
            contentType: file.type
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data } = supabase.storage
          .from(this.ITEM_IMAGES_BUCKET)
          .getPublicUrl(filePath);

        // Report progress
        if (options?.onProgress) {
          options.onProgress({
            loaded: index + 1,
            total: files.length,
            percentage: ((index + 1) / files.length) * 100
          });
        }

        return data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      log('Item images uploaded successfully:', urls);
      return urls;
    } catch (error) {
      logError('Item images upload failed:', error);
      throw this.handleStorageError(error);
    }
  }

  // Delete avatar
  async deleteAvatar(userId: string): Promise<void> {
    try {
      // List all files in user's avatar directory
      const { data: files, error: listError } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .list(userId);

      if (listError) {
        throw listError;
      }

      if (files && files.length > 0) {
        const filePaths = files.map(file => `${userId}/${file.name}`);
        
        const { error: deleteError } = await supabase.storage
          .from(this.AVATAR_BUCKET)
          .remove(filePaths);

        if (deleteError) {
          throw deleteError;
        }
      }

      log('Avatar deleted successfully');
    } catch (error) {
      logError('Avatar deletion failed:', error);
      throw this.handleStorageError(error);
    }
  }

  // Delete item images
  async deleteItemImages(itemId: string): Promise<void> {
    try {
      // List all files in item's directory
      const { data: files, error: listError } = await supabase.storage
        .from(this.ITEM_IMAGES_BUCKET)
        .list(itemId);

      if (listError) {
        throw listError;
      }

      if (files && files.length > 0) {
        const filePaths = files.map(file => `${itemId}/${file.name}`);
        
        const { error: deleteError } = await supabase.storage
          .from(this.ITEM_IMAGES_BUCKET)
          .remove(filePaths);

        if (deleteError) {
          throw deleteError;
        }
      }

      log('Item images deleted successfully');
    } catch (error) {
      logError('Item images deletion failed:', error);
      throw this.handleStorageError(error);
    }
  }

  // Get optimized image URL with transformations
  getOptimizedImageUrl(
    originalUrl: string, 
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    }
  ): string {
    try {
      const url = new URL(originalUrl);
      const params = new URLSearchParams();

      if (options?.width) {
        params.append('width', options.width.toString());
      }
      if (options?.height) {
        params.append('height', options.height.toString());
      }
      if (options?.quality) {
        params.append('quality', Math.round(options.quality * 100).toString());
      }
      if (options?.format) {
        params.append('format', options.format);
      }

      if (params.toString()) {
        url.search = params.toString();
      }

      return url.toString();
    } catch (error) {
      logError('Failed to generate optimized URL:', error);
      return originalUrl;
    }
  }

  // Process image (resize, compress)
  private async processImage(
    file: File | Blob, 
    options: {
      maxWidth: number;
      maxHeight: number;
      quality: number;
    }
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        // For now, return the original file
        // In a real implementation, you would use a library like react-native-image-resizer
        // or implement canvas-based resizing for web
        resolve(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get file extension from file or blob
  private getFileExtension(file: File | Blob): string {
    if (file instanceof File && file.name) {
      return file.name.split('.').pop()?.toLowerCase() || 'jpg';
    }
    
    // Determine extension from MIME type
    const mimeType = file.type;
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/gif':
        return 'gif';
      default:
        return 'jpg';
    }
  }

  // Handle storage-specific errors
  private handleStorageError(error: any): Error {
    if (error.message?.includes('size')) {
      return new Error('File size too large. Please choose a smaller file.');
    }
    
    if (error.message?.includes('type') || error.message?.includes('format')) {
      return new Error('Invalid file type. Please choose a valid image file.');
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return new Error('Network error. Please check your connection and try again.');
    }
    
    if (error.message?.includes('permission') || error.message?.includes('auth')) {
      return new Error('Permission denied. Please sign in and try again.');
    }
    
    return error instanceof Error ? error : new Error('Upload failed. Please try again.');
  }
}

// Create service instance
export const storageService = new StorageService();