import { db, storage } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const COLLECTION_REF = collection(db, "certificates");

export async function getCertificates() {
  const snap = await getDocs(COLLECTION_REF);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addCertificate(data) {
  return addDoc(COLLECTION_REF, data);
}

export async function updateCertificate(id, data) {
  const docRef = doc(db, "certificates", id);
  return updateDoc(docRef, data);
}

export async function deleteCertificate(id) {
  const docRef = doc(db, "certificates", id);
  return deleteDoc(docRef);
}

export async function uploadCertificateImage(file, oldImageFileName = null) {
  // Delete old image if provided
  if (oldImageFileName) {
    try {
      const oldImageRef = ref(storage, oldImageFileName);
      await deleteObject(oldImageRef);
      console.log("Old certificate image deleted:", oldImageFileName);
    } catch (error) {
      console.error("Error deleting old image:", error);
      // Don't block upload if delete fails
    }
  }

  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `certificates/certificate-image_${timestamp}.${fileExtension}`;
  const storageRef = ref(storage, fileName);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { downloadURL, fileName };
  } catch (error) {
    console.error("Error uploading certificate image:", error);
    throw error;
  }
}

export async function deleteCertificateImage(imageFileName) {
  if (!imageFileName) return;

  try {
    const imageRef = ref(storage, imageFileName);
    await deleteObject(imageRef);
    console.log("Certificate image deleted from storage:", imageFileName);
  } catch (error) {
    console.error("Error deleting certificate image from storage:", error);
    throw error;
  }
}
