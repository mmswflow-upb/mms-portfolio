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

const COLLECTION_REF = collection(db, "projects");

export async function getProjects() {
  const snap = await getDocs(COLLECTION_REF);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addProject(data) {
  return addDoc(COLLECTION_REF, data);
}

export async function updateProject(id, data) {
  const docRef = doc(db, "projects", id);
  return updateDoc(docRef, data);
}

export async function deleteProject(id) {
  const docRef = doc(db, "projects", id);
  return deleteDoc(docRef);
}

export async function uploadProjectImage(file, oldImageFileName = null) {
  // Delete old image if provided
  if (oldImageFileName) {
    try {
      const oldImageRef = ref(storage, oldImageFileName);
      await deleteObject(oldImageRef);
      console.log("Old project image deleted:", oldImageFileName);
    } catch (error) {
      console.error("Error deleting old image:", error);
      // Don't block upload if delete fails
    }
  }

  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `projects/project-image_${timestamp}.${fileExtension}`;
  const storageRef = ref(storage, fileName);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { downloadURL, fileName };
  } catch (error) {
    console.error("Error uploading project image:", error);
    throw error;
  }
}

export async function deleteProjectImage(imageFileName) {
  if (!imageFileName) return;

  try {
    const imageRef = ref(storage, imageFileName);
    await deleteObject(imageRef);
    console.log("Project image deleted from storage:", imageFileName);
  } catch (error) {
    console.error("Error deleting project image from storage:", error);
    throw error;
  }
}
