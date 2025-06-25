import { db, storage } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const DOC_REF = doc(db, "portfolio", "about-me");

export async function getAboutMe() {
  const snap = await getDoc(DOC_REF);
  return snap.exists() ? snap.data() : null;
}

export async function updateAboutMe(data) {
  await updateDoc(DOC_REF, data);
}

export async function uploadAboutMePhoto(file, oldPhotoFileName = null) {
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `about-me/profile-photo_${timestamp}.${fileExtension}`;
  const storageRef = ref(storage, fileName);

  try {
    // Upload new file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Delete old file if it exists and is different from the new one
    if (oldPhotoFileName && oldPhotoFileName !== fileName) {
      try {
        const oldStorageRef = ref(storage, oldPhotoFileName);
        await deleteObject(oldStorageRef);
        console.log("Old photo deleted:", oldPhotoFileName);
      } catch (deleteError) {
        console.warn("Could not delete old photo:", deleteError);
        // Don't throw error if deletion fails, as the upload was successful
      }
    }

    return { downloadURL, fileName };
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
}

export async function deleteAboutMePhoto(photoFileName) {
  if (!photoFileName) return;

  try {
    const storageRef = ref(storage, photoFileName);
    await deleteObject(storageRef);
    console.log("Photo deleted:", photoFileName);
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
}
