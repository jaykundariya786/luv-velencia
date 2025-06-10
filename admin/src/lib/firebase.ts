
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, writeBatch } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKGxqxK4c8HJc9xGcX7rY8sQ2m6vP1nE4",
  authDomain: "brand-f7182.firebaseapp.com",
  projectId: "brand-f7182",
  storageBucket: "brand-f7182.firebasestorage.app",
  messagingSenderId: "965093408272",
  appId: "1:965093408272:web:3a60ebfd5e33f7aeb7d495",
  measurementId: "G-PD6CWX49KS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth functions
export const loginWithEmailPassword = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmailPassword = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const createDocument = (collectionName: string, data: any) => {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const setDocument = (collectionName: string, docId: string, data: any) => {
  return setDoc(doc(db, collectionName, docId), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getDocument = (collectionName: string, docId: string) => {
  return getDoc(doc(db, collectionName, docId));
};

export const updateDocument = (collectionName: string, docId: string, data: any) => {
  return updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: new Date()
  });
};

export const deleteDocument = (collectionName: string, docId: string) => {
  return deleteDoc(doc(db, collectionName, docId));
};

export const getDocuments = (collectionName: string) => {
  return getDocs(collection(db, collectionName));
};

export const queryDocuments = (collectionName: string, field: string, operator: any, value: any) => {
  return getDocs(query(collection(db, collectionName), where(field, operator, value)));
};

export const getOrderedDocuments = (collectionName: string, orderField: string, direction: 'asc' | 'desc' = 'desc', limitCount?: number) => {
  let q = query(collection(db, collectionName), orderBy(orderField, direction));
  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  return getDocs(q);
};

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Batch operations
export const batchWrite = () => {
  return writeBatch(db);
};

export default app;
