import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';
import * as ImageManipulator from 'expo-image-manipulator';
import { IMAGE_CONFIG } from '../constants';

/**
 * Compress and resize image before upload
 */
const prepareImage = async (uri: string): Promise<string> => {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: IMAGE_CONFIG.MAX_WIDTH,
            height: IMAGE_CONFIG.MAX_HEIGHT,
          },
        },
      ],
      {
        compress: IMAGE_CONFIG.QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error('Error preparing image:', error);
    return uri; // Return original if compression fails
  }
};

/**
 * Convert URI to Blob for upload
 */
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

/**
 * Upload receipt image to Firebase Storage
 * @param imageUri Local image URI
 * @param userId User ID for organizing storage
 * @returns Download URL of uploaded image
 */
export const uploadReceiptImage = async (
  imageUri: string,
  userId: string
): Promise<string> => {
  try {
    // Prepare (compress) image
    const preparedUri = await prepareImage(imageUri);

    // Convert to blob
    const blob = await uriToBlob(preparedUri);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `receipts/${userId}/${timestamp}.jpg`;

    // Create storage reference
    const storageRef = ref(storage, filename);

    // Upload file
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Validate image file
 */
export const validateImage = (uri: string, size?: number): boolean => {
  if (!uri) {
    return false;
  }

  if (size && size > IMAGE_CONFIG.MAX_SIZE) {
    throw new Error('Image size exceeds 5MB limit');
  }

  return true;
};

