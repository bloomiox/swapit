import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { logError, log } from '../config/environment';

export interface CameraOptions {
  quality?: number; // 0-1
  allowsEditing?: boolean;
  aspect?: [number, number];
  base64?: boolean;
  exif?: boolean;
}

export interface ImagePickerOptions extends CameraOptions {
  allowsMultipleSelection?: boolean;
  mediaTypes?: 'images' | 'videos' | 'all';
  videoMaxDuration?: number;
}

export interface ImageEditOptions {
  resize?: {
    width?: number;
    height?: number;
  };
  crop?: {
    originX: number;
    originY: number;
    width: number;
    height: number;
  };
  rotate?: number; // degrees
  flip?: {
    vertical?: boolean;
    horizontal?: boolean;
  };
  format?: 'jpeg' | 'png' | 'webp';
  compress?: number; // 0-1
}

export interface CameraResult {
  uri: string;
  width: number;
  height: number;
  type?: 'image' | 'video';
  base64?: string;
  exif?: any;
  fileSize?: number;
}

// Camera service for handling image capture and editing
export class CameraService {
  // Request camera permissions
  async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        log('Camera permission not granted');
        return false;
      }

      return true;
    } catch (error) {
      logError('Failed to request camera permissions:', error);
      return false;
    }
  }

  // Request media library permissions
  async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        log('Media library permission not granted');
        return false;
      }

      return true;
    } catch (error) {
      logError('Failed to request media library permissions:', error);
      return false;
    }
  }

  // Take photo with camera
  async takePhoto(options?: CameraOptions): Promise<CameraResult | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        throw new Error('Camera permission required');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: options?.quality || 0.8,
        allowsEditing: options?.allowsEditing || false,
        aspect: options?.aspect,
        base64: options?.base64 || false,
        exif: options?.exif || false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      log('Photo taken:', asset.uri);

      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: 'image',
        base64: asset.base64,
        exif: asset.exif,
        fileSize: asset.fileSize,
      };
    } catch (error) {
      logError('Failed to take photo:', error);
      throw error;
    }
  }

  // Pick image from gallery
  async pickImage(options?: ImagePickerOptions): Promise<CameraResult | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission required');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: this.getMediaTypes(options?.mediaTypes),
        quality: options?.quality || 0.8,
        allowsEditing: options?.allowsEditing || false,
        allowsMultipleSelection: options?.allowsMultipleSelection || false,
        aspect: options?.aspect,
        base64: options?.base64 || false,
        exif: options?.exif || false,
        videoMaxDuration: options?.videoMaxDuration,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      log('Image picked:', asset.uri);

      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type === 'video' ? 'video' : 'image',
        base64: asset.base64,
        exif: asset.exif,
        fileSize: asset.fileSize,
      };
    } catch (error) {
      logError('Failed to pick image:', error);
      throw error;
    }
  }

  // Pick multiple images from gallery
  async pickMultipleImages(options?: ImagePickerOptions): Promise<CameraResult[]> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission required');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: options?.quality || 0.8,
        allowsEditing: false, // Disable editing for multiple selection
        allowsMultipleSelection: true,
        base64: options?.base64 || false,
        exif: options?.exif || false,
      });

      if (result.canceled || !result.assets) {
        return [];
      }

      const results = result.assets.map(asset => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: 'image' as const,
        base64: asset.base64,
        exif: asset.exif,
        fileSize: asset.fileSize,
      }));

      log('Multiple images picked:', results.length);
      return results;
    } catch (error) {
      logError('Failed to pick multiple images:', error);
      throw error;
    }
  }

  // Edit image
  async editImage(uri: string, options: ImageEditOptions): Promise<CameraResult> {
    try {
      const actions: ImageManipulator.Action[] = [];

      // Add resize action
      if (options.resize) {
        actions.push({
          resize: options.resize,
        });
      }

      // Add crop action
      if (options.crop) {
        actions.push({
          crop: options.crop,
        });
      }

      // Add rotate action
      if (options.rotate) {
        actions.push({
          rotate: options.rotate,
        });
      }

      // Add flip action
      if (options.flip) {
        actions.push({
          flip: options.flip,
        });
      }

      const result = await ImageManipulator.manipulateAsync(
        uri,
        actions,
        {
          format: this.getImageFormat(options.format),
          compress: options.compress || 0.8,
          base64: false,
        }
      );

      log('Image edited:', result.uri);

      return {
        uri: result.uri,
        width: result.width,
        height: result.height,
        type: 'image',
      };
    } catch (error) {
      logError('Failed to edit image:', error);
      throw error;
    }
  }

  // Compress image
  async compressImage(
    uri: string, 
    quality: number = 0.7,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<CameraResult> {
    try {
      const actions: ImageManipulator.Action[] = [];

      // Add resize if dimensions specified
      if (maxWidth || maxHeight) {
        actions.push({
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        });
      }

      const result = await ImageManipulator.manipulateAsync(
        uri,
        actions,
        {
          format: ImageManipulator.SaveFormat.JPEG,
          compress: quality,
        }
      );

      log('Image compressed:', result.uri);

      return {
        uri: result.uri,
        width: result.width,
        height: result.height,
        type: 'image',
      };
    } catch (error) {
      logError('Failed to compress image:', error);
      throw error;
    }
  }

  // Get image info
  async getImageInfo(uri: string): Promise<{
    width: number;
    height: number;
    orientation?: number;
  } | null> {
    try {
      // Note: This would require expo-image-picker or expo-media-library
      // For now, return null as a placeholder
      log('Getting image info for:', uri);
      return null;
    } catch (error) {
      logError('Failed to get image info:', error);
      return null;
    }
  }

  // Convert media types option
  private getMediaTypes(mediaTypes?: 'images' | 'videos' | 'all'): ImagePicker.MediaTypeOptions {
    switch (mediaTypes) {
      case 'images':
        return ImagePicker.MediaTypeOptions.Images;
      case 'videos':
        return ImagePicker.MediaTypeOptions.Videos;
      case 'all':
        return ImagePicker.MediaTypeOptions.All;
      default:
        return ImagePicker.MediaTypeOptions.Images;
    }
  }

  // Convert image format option
  private getImageFormat(format?: 'jpeg' | 'png' | 'webp'): ImageManipulator.SaveFormat {
    switch (format) {
      case 'jpeg':
        return ImageManipulator.SaveFormat.JPEG;
      case 'png':
        return ImageManipulator.SaveFormat.PNG;
      case 'webp':
        return ImageManipulator.SaveFormat.WEBP;
      default:
        return ImageManipulator.SaveFormat.JPEG;
    }
  }

  // Show image picker action sheet
  async showImagePickerActionSheet(): Promise<CameraResult | null> {
    try {
      // This would typically show a native action sheet
      // For now, we'll just use the image picker directly
      return await this.pickImage();
    } catch (error) {
      logError('Failed to show image picker action sheet:', error);
      return null;
    }
  }

  // Validate image file
  validateImage(result: CameraResult): {
    isValid: boolean;
    error?: string;
  } {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (result.fileSize && result.fileSize > maxSize) {
      return {
        isValid: false,
        error: 'Image file size too large. Maximum size is 10MB.',
      };
    }

    // Check dimensions (min 100x100, max 4000x4000)
    if (result.width < 100 || result.height < 100) {
      return {
        isValid: false,
        error: 'Image dimensions too small. Minimum size is 100x100 pixels.',
      };
    }

    if (result.width > 4000 || result.height > 4000) {
      return {
        isValid: false,
        error: 'Image dimensions too large. Maximum size is 4000x4000 pixels.',
      };
    }

    return { isValid: true };
  }
}

// Create service instance
export const cameraService = new CameraService();