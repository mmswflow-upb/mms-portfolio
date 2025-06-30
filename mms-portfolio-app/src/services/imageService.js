import { storage } from "./firebase";
import { ref, getDownloadURL } from "firebase/storage";

// Default fallback images for different sections
const DEFAULT_IMAGES = {
  project: "/src/assets/info/code.png",
  education: "/src/assets/info/education.png",
  organization: "/src/assets/info/organization.png",
  experience: "/src/assets/info/briefcase.png",
  certificate: "/src/assets/info/certificate.png",
  general: "/src/assets/info/information.png",
};

/**
 * Load an image with fallback handling
 * @param {string} imageUrl - The URL of the image to load
 * @param {string} fallbackType - The type of fallback image to use
 * @param {string} customFallback - Custom fallback URL (optional)
 * @returns {Promise<string>} - The resolved image URL
 */
export async function loadImage(
  imageUrl,
  fallbackType = "general",
  customFallback = null
) {
  if (!imageUrl) {
    return (
      customFallback || DEFAULT_IMAGES[fallbackType] || DEFAULT_IMAGES.general
    );
  }

  try {
    // If it's a Firebase storage URL, try to get the download URL
    if (imageUrl.includes("firebase")) {
      const imageRef = ref(storage, imageUrl);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    }

    // For regular URLs, test if the image loads
    const response = await fetch(imageUrl, { method: "HEAD" });
    if (response.ok) {
      return imageUrl;
    }

    throw new Error("Image not found");
  } catch (error) {
    console.warn(`Failed to load image: ${imageUrl}`, error);
    return (
      customFallback || DEFAULT_IMAGES[fallbackType] || DEFAULT_IMAGES.general
    );
  }
}

/**
 * Preload an image to check if it's valid
 * @param {string} imageUrl - The URL of the image to preload
 * @returns {Promise<boolean>} - Whether the image loaded successfully
 */
export function preloadImage(imageUrl) {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}

/**
 * Get the appropriate fallback image for a section
 * @param {string} sectionType - The type of section
 * @returns {string} - The fallback image URL
 */
export function getFallbackImage(sectionType) {
  return DEFAULT_IMAGES[sectionType] || DEFAULT_IMAGES.general;
}

/**
 * Handle image error and set fallback
 * @param {Event} event - The error event
 * @param {string} fallbackType - The type of fallback image to use
 * @param {string} customFallback - Custom fallback URL (optional)
 */
export function handleImageError(
  event,
  fallbackType = "general",
  customFallback = null
) {
  const fallbackUrl =
    customFallback || DEFAULT_IMAGES[fallbackType] || DEFAULT_IMAGES.general;
  event.target.src = fallbackUrl;
  event.target.onerror = null; // Prevent infinite loop
}
