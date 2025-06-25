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

const COLLECTION_REF = collection(db, "experience");

export async function getJobs() {
  const snap = await getDocs(COLLECTION_REF);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addJob(data) {
  return addDoc(COLLECTION_REF, data);
}

export async function updateJob(id, data) {
  const docRef = doc(db, "experience", id);
  return updateDoc(docRef, data);
}

export async function deleteJob(id) {
  const docRef = doc(db, "experience", id);
  return deleteDoc(docRef);
}

export async function uploadJobImage(file, oldImageFileName = null) {
  // Delete old image if provided
  if (oldImageFileName) {
    try {
      const oldImageRef = ref(storage, oldImageFileName);
      await deleteObject(oldImageRef);
      console.log("Old job image deleted:", oldImageFileName);
    } catch (error) {
      console.error("Error deleting old image:", error);
      // Don't block upload if delete fails
    }
  }

  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `jobs/job-image_${timestamp}.${fileExtension}`;
  const storageRef = ref(storage, fileName);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { downloadURL, fileName };
  } catch (error) {
    console.error("Error uploading job image:", error);
    throw error;
  }
}

export async function deleteJobImage(imageFileName) {
  if (!imageFileName) return;

  try {
    const imageRef = ref(storage, imageFileName);
    await deleteObject(imageRef);
    console.log("Job image deleted from storage:", imageFileName);
  } catch (error) {
    console.error("Error deleting job image from storage:", error);
    throw error;
  }
}
